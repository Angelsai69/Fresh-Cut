/**
 * usePriceData — PriceScout brain transplanted into Fresh~CUT shell
 * Handles Gemini AI, Kroger Live, and Community/Instacart hybrid data
 */

import { useState, useCallback, useEffect } from 'react'
import { GoogleGenAI } from '@google/genai'

const BACKEND = import.meta.env.VITE_API_URL || ''

const DEFAULT_ITEMS = [
  'Milk (1 gallon)',
  'Eggs (1 dozen)',
  'Bread (1 loaf)',
  'Chicken Breast (1 lb)',
  'Bananas (1 lb)',
  'Ground Beef (1 lb)',
  'White Rice (5 lb bag)',
  'Apples (1 lb)',
  'Potatoes (5 lb bag)',
  'Butter (1 lb)',
]

const TARGET_STORES = [
  'Walmart','Target','Aldi','Whole Foods','Costco','Safeway',
  'Giant Food','Food Lion','Meijer','Publix',"Trader Joe's",'HEB',
]

// ─── AI cache ──────────────────────────────────────────────────
const CACHE_TTL = 4 * 60 * 60 * 1000
const cacheKey = (zip, items) => `fc_ai_${zip}_${[...items].sort().join(',')}`
const getCache = (key) => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(key); return null }
    return data
  } catch { return null }
}
const setCache = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })) } catch {}
}

// ─── AI parser ─────────────────────────────────────────────────
export const parseAIResults = (text, items) => {
  const priceTable = {}
  const stores = []
  const promotions = []
  const tips = []
  const addresses = []

  const tableRegex = /\|(.+)\|[\r\n]+\|[-| :]+\|[\r\n]+((?:\|.+\|[\r\n]*)+)/g
  let m; let tc = 0
  while ((m = tableRegex.exec(text)) !== null) {
    tc++
    const headers = m[1].split('|').map(h => h.trim()).filter(Boolean)
    const rows = m[2].trim().split('\n')
    if (tc === 1) {
      const sh = headers.slice(1)
      sh.forEach(s => { if (s && s !== 'N/A') { stores.push(s); priceTable[s] = {} } })
      rows.forEach(row => {
        const cells = row.split('|').map(c => c.trim()).filter(Boolean)
        if (cells.length < 2) return
        const item = cells[0]
        sh.forEach((store, idx) => {
          if (store && cells[idx + 1]) { priceTable[store] = priceTable[store] || {}; priceTable[store][item] = cells[idx + 1] }
        })
      })
    } else if (tc === 2) {
      rows.forEach(row => {
        const cells = row.split('|').map(c => c.trim()).filter(Boolean)
        if (cells.length >= 3) promotions.push({ store: cells[0], promo1: cells[1], promo2: cells[2] || '—', promo3: cells[3] || '—' })
      })
    }
  }

  const tm = text.match(/AI Pro Shopping Tips[\s\S]*?(?=\n##|\n\*\*Store Locations|$)/i)
  if (tm) {
    tm[0].split('\n').filter(l => /^[\d\-\*•]/.test(l.trim())).forEach(l => {
      const c = l.replace(/^[\d\.\-\*•]+\s*/, '').replace(/\*\*/g, '').trim()
      if (c.length > 10) tips.push(c)
    })
  }

  const am = text.match(/Store Locations[\s\S]*$/i)
  if (am) {
    am[0].split('\n').filter(l => l.trim().length > 5 && !l.includes('Store Locations')).forEach(line => {
      const clean = line.replace(/^[\-\*\d\.]+\s*/, '').replace(/\*\*/g, '').trim()
      const ci = clean.indexOf(':')
      if (ci > 0 && ci < 30) addresses.push({ store: clean.slice(0, ci).trim(), address: clean.slice(ci + 1).trim() })
      else if (clean.includes(',')) addresses.push({ store: clean.split(',')[0].trim(), address: clean })
    })
  }

  const cheapestPerItem = {}
  ;[...new Set(stores.flatMap(s => Object.keys(priceTable[s] || [])))].forEach(item => {
    let best = Infinity; let bestStore = ''
    stores.forEach(store => {
      const match = (priceTable[store]?.[item] || '').match(/\$?([\d.]+)/)
      if (match && parseFloat(match[1]) < best) { best = parseFloat(match[1]); bestStore = store }
    })
    if (bestStore) cheapestPerItem[item] = bestStore
  })

  return { priceTable, stores, promotions, tips, addresses, cheapestPerItem }
}

// ─── Build StoreCard data from all sources ──────────────────────
export const buildStoreCards = (aiResults, kroger, hybrid) => {
  const cards = []

  // Kroger live stores
  if (kroger.prices.length > 0 && kroger.selectedLocation) {
    let total = 0; let count = 0
    kroger.prices.forEach(p => {
      const v = p.promoPrice || p.price
      if (v) { total += parseFloat(v.replace('$', '')); count++ }
    })
    cards.push({
      id: 'kroger-live',
      name: kroger.selectedLocation.name,
      logo: '🏪',
      total: count ? `$${total.toFixed(2)}` : null,
      savings: null,
      distance: '~' + (kroger.selectedLocation.address?.split(',')[1]?.trim() || ''),
      address: kroger.selectedLocation.address || '',
      badge: 'Live Prices',
      badgeColor: '#22C55E',
      dataSource: 'kroger',
      deals: kroger.prices.filter(p => p.promoPrice).slice(0, 3).map(p => `${p.item}: ${p.promoPrice} (was ${p.price})`),
      tip: `Live prices from ${kroger.selectedLocation.name}. Promo prices shown where available.`,
      priceData: kroger.prices,
    })
  }

  // Community/Instacart hybrid stores
  const hybridStores = Object.keys(hybrid.results)
  hybridStores.forEach(storeName => {
    const storeItems = hybrid.results[storeName]
    let total = 0; let count = 0; let communityCount = 0; let instacartCount = 0
    Object.values(storeItems).forEach(p => {
      const v = parseFloat((p.promoPrice || p.price || '').replace('$', ''))
      if (!isNaN(v)) { total += v; count++ }
      if (p.source === 'community') communityCount++
      else instacartCount++
    })
    const source = communityCount >= instacartCount ? 'community' : 'instacart'
    cards.push({
      id: `hybrid-${storeName}`,
      name: storeName,
      logo: '🛒',
      total: count ? `$${total.toFixed(2)}` : null,
      savings: null,
      distance: '',
      address: '',
      badge: source === 'community' ? 'Community' : 'Instacart',
      badgeColor: source === 'community' ? '#7BE8C8' : '#22C55E',
      dataSource: source,
      deals: Object.entries(storeItems).slice(0, 3).map(([item, p]) => `${item}: ${p.promoPrice || p.price}`),
      tip: source === 'community'
        ? `Prices contributed by shoppers near your zip code.`
        : `Prices sourced from Instacart availability.`,
      priceData: Object.entries(storeItems).map(([item, p]) => ({ item, price: p.price, promoPrice: p.promoPrice, source: p.source, ageHours: p.ageHours })),
    })
  })

  // AI estimate stores (fill in gaps)
  if (aiResults) {
    const existingNames = cards.map(c => c.name.toLowerCase())
    aiResults.stores.forEach(storeName => {
      if (existingNames.some(n => storeName.toLowerCase().includes(n) || n.includes(storeName.toLowerCase()))) return
      let total = 0; let count = 0
      Object.values(aiResults.priceTable[storeName] || {}).forEach(p => {
        const m = p.match(/\$?([\d.]+)/); if (m) { total += parseFloat(m[1]); count++ }
      })
      const promos = aiResults.promotions.find(p => p.store === storeName)
      const tip = aiResults.tips.find(t => t.toLowerCase().includes(storeName.toLowerCase().split(' ')[0]))
      cards.push({
        id: `ai-${storeName}`,
        name: storeName,
        logo: '🏬',
        total: count ? `$${total.toFixed(2)}` : null,
        savings: null,
        distance: '',
        address: aiResults.addresses.find(a => a.store === storeName)?.address || '',
        badge: 'AI Estimate',
        badgeColor: '#F4D35E',
        dataSource: 'ai',
        deals: promos ? [promos.promo1, promos.promo2, promos.promo3].filter(p => p && p !== '—') : [],
        tip: tip || `AI price estimates for ${storeName} near your zip.`,
        priceData: Object.entries(aiResults.priceTable[storeName] || {}).map(([item, price]) => ({ item, price, promoPrice: null, source: 'ai' })),
      })
    })

    // Add savings vs most expensive
    const totals = cards.filter(c => c.total).map(c => parseFloat(c.total.replace('$', '')))
    const maxTotal = Math.max(...totals)
    cards.forEach(c => {
      if (c.total) {
        const diff = maxTotal - parseFloat(c.total.replace('$', ''))
        if (diff > 0) c.savings = `$${diff.toFixed(2)}`
      }
    })
  }

  return cards.sort((a, b) => {
    const order = { kroger: 0, community: 1, instacart: 2, ai: 3 }
    return (order[a.dataSource] ?? 4) - (order[b.dataSource] ?? 4)
  })
}

// ─── Hook ──────────────────────────────────────────────────────
export function usePriceData() {
  const [zipCode, setZipCode] = useState('')
  const [items, setItems] = useState(() => {
    try { const s = localStorage.getItem('fc_items'); return s ? JSON.parse(s) : DEFAULT_ITEMS } catch { return DEFAULT_ITEMS }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [aiResults, setAiResults] = useState(null)
  const [aiCached, setAiCached] = useState(false)
  const [storeCards, setStoreCards] = useState([])
  const [backendAvailable, setBackendAvailable] = useState(null)
  const [shareEnabled, setShareEnabled] = useState(() => {
    try { return localStorage.getItem('fc_share_enabled') === 'true' } catch { return false }
  })
  const [contributionCount, setContributionCount] = useState(() => {
    try { return parseInt(localStorage.getItem('fc_contribution_count') || '0') } catch { return 0 }
  })

  const [kroger, setKroger] = useState({
    locations: [], selectedLocation: null, prices: [], loading: false, error: null,
  })
  const [hybrid, setHybrid] = useState({
    results: {}, stats: { communityPrices: 0, communityStores: 0, instacartPrices: 0, instacartStores: 0 },
    storesBeingScraping: [], loading: false, error: null,
  })
  const [userProfile, setUserProfile] = useState(() => {
    try { const p = localStorage.getItem('fc_profile'); return p ? JSON.parse(p) : { name: 'Alex', contact: '', favoriteStores: ['', '', ''], travelDistance: 30 } } catch {
      return { name: 'Alex', contact: '', favoriteStores: ['', '', ''], travelDistance: 30 }
    }
  })

  useEffect(() => {
    fetch(`${BACKEND}/api/health`, { signal: AbortSignal.timeout(2000) })
      .then(r => setBackendAvailable(r.ok))
      .catch(() => setBackendAvailable(false))
  }, [])

  // Rebuild store cards whenever any data source changes
  useEffect(() => {
    setStoreCards(buildStoreCards(aiResults, kroger, hybrid))
  }, [aiResults, kroger, hybrid])

  const saveProfile = useCallback((p) => {
    setUserProfile(p)
    localStorage.setItem('fc_profile', JSON.stringify(p))
  }, [])

  const saveItems = useCallback((newItems) => {
    setItems(newItems)
    localStorage.setItem('fc_items', JSON.stringify(newItems))
  }, [])

  const addItem = useCallback((name) => {
    const t = name.trim()
    if (t && !items.includes(t)) saveItems([...items, t])
  }, [items, saveItems])

  const removeItem = useCallback((name) => {
    saveItems(items.filter(i => i !== name))
  }, [items, saveItems])

  const resetItems = useCallback(() => saveItems(DEFAULT_ITEMS), [saveItems])

  const toggleShareEnabled = useCallback((val) => {
    setShareEnabled(val)
    localStorage.setItem('fc_share_enabled', val ? 'true' : 'false')
  }, [])

  const fetchKrogerData = useCallback(async (zip) => {
    if (!backendAvailable) return
    setKroger(prev => ({ ...prev, loading: true, error: null, locations: [], selectedLocation: null, prices: [] }))
    try {
      const locRes = await fetch(`${BACKEND}/api/kroger/locations?zipCode=${zip}&radius=${userProfile.travelDistance}`)
      if (!locRes.ok) throw new Error(`Location lookup failed`)
      const locData = await locRes.json()
      if (!locData.locations?.length) {
        setKroger(prev => ({ ...prev, loading: false, error: 'No Kroger-family stores found nearby.' }))
        return
      }
      const best = locData.locations[0]
      setKroger(prev => ({ ...prev, locations: locData.locations, selectedLocation: best }))
      const priceRes = await fetch(`${BACKEND}/api/kroger/prices`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationId: best.locationId, items }),
      })
      const priceData = await priceRes.json()
      setKroger(prev => ({ ...prev, loading: false, prices: priceData.prices }))
    } catch (err) {
      setKroger(prev => ({ ...prev, loading: false, error: err.message }))
    }
  }, [backendAvailable, items, userProfile.travelDistance])

  const fetchHybridData = useCallback(async (zip) => {
    if (!backendAvailable) return
    setHybrid(prev => ({ ...prev, loading: true, error: null }))
    try {
      const res = await fetch(`${BACKEND}/api/prices/lookup`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zipCode: zip, items, stores: TARGET_STORES, triggerScrape: true }),
      })
      if (!res.ok) throw new Error('Hybrid lookup failed')
      const data = await res.json()
      setHybrid(prev => ({ ...prev, loading: false, results: data.results, stats: data.stats, storesBeingScraping: data.storesBeingScraping }))
      if (data.storesBeingScraping?.length > 0) {
        setTimeout(async () => {
          try {
            const r2 = await fetch(`${BACKEND}/api/prices/lookup`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ zipCode: zip, items, stores: TARGET_STORES, triggerScrape: false }),
            })
            if (r2.ok) { const d2 = await r2.json(); setHybrid(prev => ({ ...prev, results: d2.results, stats: d2.stats, storesBeingScraping: [] })) }
          } catch {}
        }, 35_000)
      }
    } catch (err) {
      setHybrid(prev => ({ ...prev, loading: false, error: err.message }))
    }
  }, [backendAvailable, items])

  const fetchPrices = useCallback(async () => {
    if (!zipCode || zipCode.length !== 5) { setError('Enter a valid 5-digit zip code.'); return }
    if (!items.length) { setError('Add at least one item to your list.'); return }
    setLoading(true); setError(null); setAiResults(null); setAiCached(false)

    const [,, aiResult] = await Promise.allSettled([
      fetchKrogerData(zipCode),
      fetchHybridData(zipCode),
      (async () => {
        const key = cacheKey(zipCode, items)
        const cached = getCache(key)
        if (cached) { setAiResults(cached); setAiCached(true); return }
        const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' })
        const favStores = userProfile.favoriteStores.filter(s => s.trim()).join(', ')
        const itemsList = items.map((item, i) => `${i + 1}. ${item}`).join('\n')
        const prompt = `Search for current grocery prices near zip code ${zipCode} within ${userProfile.travelDistance} miles.
STORES: Group 1: Aldi, Walmart, Target, Whole Foods, Costco. Group 2 (favorites): ${favStores || 'None'}. Group 3: 3 local chains (NOT Kroger-family).
ITEMS:\n${itemsList}
Return EXACTLY:
## Price Comparison Table
Markdown table. Col 1: Item. Remaining: one store per col. Cells: "$2.99" or "N/A".
## Big 3 Price Cut Promotions
Markdown table: Store | Promotion 1 | Promotion 2 | Promotion 3. Max 10 words each.
## AI Pro Shopping Tips
3-5 numbered specific actionable tips.
## Store Locations & Full Addresses
Format: **Store Name**: Full address, City, State ZIP`
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash', contents: prompt,
          config: { tools: [{ googleSearch: {} }] },
        })
        if (response.text) {
          const parsed = parseAIResults(response.text, items)
          setAiResults(parsed); setCache(key, parsed)
        }
      })(),
    ])

    if (aiResult.status === 'rejected') setError('AI estimates unavailable. Check your Gemini API key.')
    setLoading(false)
  }, [zipCode, items, userProfile, fetchKrogerData, fetchHybridData])

  return {
    // State
    zipCode, setZipCode,
    items, addItem, removeItem, resetItems,
    loading, error,
    storeCards,
    aiResults, aiCached,
    kroger, hybrid,
    userProfile, saveProfile,
    backendAvailable,
    shareEnabled, toggleShareEnabled,
    contributionCount, setContributionCount,
    BACKEND,
  }
}

export { DEFAULT_ITEMS, TARGET_STORES }
