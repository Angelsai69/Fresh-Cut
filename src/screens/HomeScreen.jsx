import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Loader2, AlertCircle } from 'lucide-react'
import { tokens, mintGradient } from '../tokens'
import { StoreCard } from '../components/StoreCard'
import { SavingsBanner } from '../components/ItemCard'

const TOP_ESSENTIALS = [
  { name:'Milk',    emoji:'🥛' }, { name:'Eggs',    emoji:'🥚' },
  { name:'Bread',   emoji:'🍞' }, { name:'Chicken', emoji:'🍗' },
  { name:'Bananas', emoji:'🍌' }, { name:'Beef',    emoji:'🥩' },
  { name:'Rice',    emoji:'🍚' }, { name:'Apples',  emoji:'🍎' },
  { name:'Potatoes',emoji:'🥔' }, { name:'Butter',  emoji:'🧈' },
]

const BONUSES = [
  { emoji:'🏆', title:'Weekly Saver',   desc:'Save on 3 consecutive searches',   progress:66,  reward:'10 credits' },
  { emoji:'⭐', title:'First Compare',  desc:'Compare your first store basket',   progress:100, reward:'Complete!'   },
  { emoji:'🎯', title:'List Pro',       desc:'Add 10+ items to your list',        progress:60,  reward:'5 credits'  },
  { emoji:'💎', title:'Loyalty Streak', desc:'Use Fresh~CUT 7 days in a row',     progress:43,  reward:'15 credits' },
]

function BonusModal({ open, onClose, t }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={tokens.motion.standard}
            onClick={onClose}
            style={{ position:'fixed', inset:0, background:'rgba(15,43,70,0.55)', backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)', zIndex:300 }}
          />
          <motion.div
            key="bonusCard"
            initial={{ y:'100%', opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:'100%', opacity:0 }}
            transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
            style={{ position:'fixed', left:0, right:0, bottom:0, zIndex:400, background:t.card, borderRadius:'28px 28px 0 0', boxShadow:'0 -8px 48px rgba(15,43,70,0.22)', maxHeight:'85vh', overflowY:'auto', scrollbarWidth:'none' }}
          >
            <div style={{ width:36, height:4, borderRadius:tokens.radius.full, background:t.isDark?'rgba(255,255,255,0.15)':'rgba(15,43,70,0.12)', margin:'12px auto 0' }} />
            <div style={{ padding:'20px 24px 40px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
                <div>
                  <h2 style={{ fontSize:tokens.font.h2.size, fontWeight:700, color:t.text, margin:0, letterSpacing:'-0.2px' }}>Bonus Rewards</h2>
                  <p style={{ fontSize:tokens.font.small.size, fontWeight:450, color:t.textSub, margin:'4px 0 0' }}>Complete challenges, earn credits</p>
                </div>
                <motion.button whileTap={{ scale:0.88 }} onClick={onClose}
                  style={{ width:36, height:36, borderRadius:tokens.radius.full, background:t.isDark?'rgba(255,255,255,0.08)':'rgba(15,43,70,0.07)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:t.textSub, flexShrink:0 }}>
                  <X size={16} strokeWidth={2.5} />
                </motion.button>
              </div>
              {/* Credit balance — no $ sign, Redeem disabled */}
              <div style={{ background:`linear-gradient(135deg, ${tokens.colors.coral}, #FF4757)`, borderRadius:tokens.radius.hero, padding:'20px 24px', marginBottom:20, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <p style={{ fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,0.7)', margin:'0 0 4px', textTransform:'uppercase', letterSpacing:'0.8px' }}>Credit Balance</p>
                  <p style={{ fontSize:'32px', fontWeight:700, color:'white', margin:0, letterSpacing:'-0.5px' }}>15 credits</p>
                </div>
                <motion.button
                  style={{ padding:'9px 20px', borderRadius:tokens.radius.full, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', cursor:'not-allowed', fontSize:'13px', fontWeight:700, color:'rgba(255,255,255,0.4)' }}
                >Redeem</motion.button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {BONUSES.map((b, idx) => (
                  <motion.div key={b.title} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:idx*0.06, ...tokens.motion.standard }}
                    style={{ background:t.isDark?'rgba(255,255,255,0.05)':tokens.colors.bgLight, borderRadius:tokens.radius.cardLg, padding:'16px 18px', border:`1px solid ${t.isDark?'rgba(255,255,255,0.07)':'rgba(15,43,70,0.06)'}` }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                      <div style={{ width:40, height:40, borderRadius:tokens.radius.card, fontSize:20, background:`linear-gradient(135deg, ${tokens.colors.mintStart}18, ${tokens.colors.mintEnd}18)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{b.emoji}</div>
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:'14px', fontWeight:600, color:t.text, margin:0 }}>{b.title}</p>
                        <p style={{ fontSize:'12px', fontWeight:450, color:t.textSub, margin:'2px 0 0' }}>{b.desc}</p>
                      </div>
                      <span style={{ fontSize:'11px', fontWeight:700, whiteSpace:'nowrap', color:b.progress===100?tokens.colors.savingsGreen:tokens.colors.mintEnd, background:b.progress===100?`${tokens.colors.savingsGreen}15`:`${tokens.colors.mintEnd}15`, padding:'3px 10px', borderRadius:tokens.radius.full }}>{b.reward}</span>
                    </div>
                    <div style={{ height:5, borderRadius:tokens.radius.full, background:`${tokens.colors.mintStart}22`, overflow:'hidden' }}>
                      <motion.div initial={{ width:0 }} animate={{ width:`${b.progress}%` }} transition={{ delay:0.2+idx*0.06, duration:0.55, ease:[0.4,0,0.2,1] }}
                        style={{ height:'100%', borderRadius:tokens.radius.full, background:b.progress===100?`linear-gradient(90deg, ${tokens.colors.savingsGreen}, #16A34A)`:`linear-gradient(90deg, ${tokens.colors.mintStart}, ${tokens.colors.mintEnd})` }} />
                    </div>
                    <p style={{ fontSize:'11px', fontWeight:450, color:t.textSub, margin:'5px 0 0', textAlign:'right' }}>{b.progress}%</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function ZipInput({ t, value, onChange, onSearch, loading }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'13px 18px', borderRadius:tokens.radius.card, background:t.card, boxShadow:focused?`0 0 0 2px ${tokens.colors.mintStart}, 0 0 16px ${tokens.colors.mintStart}40`:t.shadow1, border:`1.5px solid ${focused?tokens.colors.mintStart:t.border}`, transition:'box-shadow 0.2s ease, border-color 0.2s ease', minWidth:200 }}>
      <span style={{ fontSize:16, flexShrink:0 }}>📍</span>
      <input
        placeholder="Enter ZIP Code"
        value={value}
        maxLength={5}
        onChange={e => onChange(e.target.value.replace(/\D/g,''))}
        onKeyDown={e => e.key === 'Enter' && onSearch()}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ flex:1, border:'none', outline:'none', background:'transparent', fontSize:'15px', fontWeight:450, color:t.text, fontFamily:'inherit' }}
      />
    </div>
  )
}

function ParallaxHero({ t, onBonusOpen, zipCode, setZipCode, onSearch, loading }) {
  const titleRef   = useRef(null)
  const subtitleRef = useRef(null)
  const ticking    = useRef(false)
  const scrollTimer = useRef(null)

  const onScroll = useCallback(() => {
    document.body.classList.add('is-scrolling')
    clearTimeout(scrollTimer.current)
    scrollTimer.current = setTimeout(() => document.body.classList.remove('is-scrolling'), 150)
    if (ticking.current) return
    ticking.current = true
    requestAnimationFrame(() => {
      const y = window.scrollY
      if (titleRef.current) titleRef.current.style.transform = `translateY(${-y*0.10}px)`
      if (subtitleRef.current) subtitleRef.current.style.transform = `translateY(${-y*0.05}px)`
      ticking.current = false
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive:true })
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(scrollTimer.current); document.body.classList.remove('is-scrolling') }
  }, [onScroll])

  return (
    <section style={{ padding:'40px 0', width:'100%', position:'relative', overflow:'hidden', textAlign:'center' }}>
      {/* Animated orbs */}
      <div aria-hidden="true" style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
        <motion.div animate={{ x:['-8%','6%','-8%'], y:['-10%','8%','-10%'] }} transition={{ duration:14, ease:'easeInOut', repeat:Infinity }}
          style={{ position:'absolute', top:'-20%', left:'-15%', width:'70%', height:'70%', borderRadius:'50%', background:t.isDark?`radial-gradient(circle, ${tokens.colors.mintStart}22 0%, transparent 70%)`:`radial-gradient(circle, ${tokens.colors.mintStart}30 0%, transparent 70%)`, filter:'blur(48px)', willChange:'transform' }} />
        <motion.div animate={{ x:['10%','-6%','10%'], y:['12%','-8%','12%'] }} transition={{ duration:18, ease:'easeInOut', repeat:Infinity, delay:2 }}
          style={{ position:'absolute', bottom:'-25%', right:'-10%', width:'60%', height:'60%', borderRadius:'50%', background:t.isDark?`radial-gradient(circle, ${tokens.colors.lemon}18 0%, transparent 70%)`:`radial-gradient(circle, ${tokens.colors.lemon}25 0%, transparent 70%)`, filter:'blur(56px)', willChange:'transform' }} />
        <motion.div animate={{ x:['-5%','10%','3%','-8%','-5%'], y:['5%','-8%','12%','-3%','5%'], scaleX:[1,1.28,0.82,1.15,1], scaleY:[1,0.88,1.24,0.92,1], opacity:[0.5,0.85,0.58,0.72,0.5] }} transition={{ duration:15, ease:'easeInOut', repeat:Infinity, delay:3.5 }}
          style={{ position:'absolute', top:'28%', left:'32%', width:'44%', height:'44%', borderRadius:'50%', background:t.isDark?`radial-gradient(circle, ${tokens.colors.coral}14 0%, transparent 68%)`:`radial-gradient(circle, ${tokens.colors.coral}18 0%, transparent 68%)`, filter:'blur(38px)', willChange:'transform, opacity' }} />
      </div>

      <div style={{ position:'relative', zIndex:1, padding:'0 clamp(20px, 5vw, 48px)', width:'100%', boxSizing:'border-box' }}>
        {/* Trust badges */}
        <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15, ...tokens.motion.standard }}
          style={{ display:'flex', justifyContent:'center', gap:20, marginBottom:20, flexWrap:'wrap' }}>
          {[{ dot:tokens.colors.mintEnd, label:'Live Kroger prices' }, { dot:tokens.colors.lemon, label:'AI price estimates' }, { dot:tokens.colors.coral, label:'Community data' }].map(({ dot, label }) => (
            <div key={label} style={{ display:'flex', alignItems:'center', gap:6, fontSize:'12px', color:t.textSub, fontWeight:450 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:dot, display:'inline-block', flexShrink:0 }} />{label}
            </div>
          ))}
        </motion.div>

        {/* Headline */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1, ...tokens.motion.slow }}>
          <h1 ref={titleRef} style={{ fontSize:'clamp(44px, 10vw, 64px)', fontWeight:700, letterSpacing:'-0.03em', lineHeight:1.05, color:t.text, margin:0, willChange:'transform' }}>
            Spend Smarter.{' '}
            <span style={{ display:'inline-block', position:'relative', whiteSpace:'nowrap' }}>
              Live Fresher.
              <motion.span initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:0.6, duration:0.9, ease:[0.22,1,0.36,1] }}
                style={{ position:'absolute', left:0, bottom:-6, height:3, width:'100%', background:mintGradient, borderRadius:tokens.radius.full, transformOrigin:'left', display:'block' }} />
              <motion.span initial={{ x:'-120%' }} animate={{ x:'120%' }} transition={{ delay:1.4, duration:4, ease:'linear', repeat:Infinity, repeatDelay:3 }}
                style={{ position:'absolute', bottom:-6, left:0, height:3, width:'33%', background:'linear-gradient(to right, transparent, rgba(255,255,255,0.85), transparent)', filter:'blur(2px)', display:'block' }} />
            </span>
          </h1>
        </motion.div>

        <motion.p ref={subtitleRef} className="parallax-subtitle" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25, ...tokens.motion.slow }}
          style={{ marginTop:20, fontSize:'18px', lineHeight:1.6, color:t.textSub, fontWeight:450, maxWidth:420, marginLeft:'auto', marginRight:'auto' }}>
          Compare nearby stores. Live Kroger prices. AI-powered estimates. Community data.
        </motion.p>

        {/* ZIP + CTA */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4, ...tokens.motion.slow }}
          style={{ display:'flex', justifyContent:'center', gap:10, marginTop:28, flexWrap:'wrap' }}>
          <ZipInput t={t} value={zipCode} onChange={setZipCode} onSearch={onSearch} loading={loading} />
          <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} transition={tokens.motion.fast} onClick={onSearch} disabled={loading}
            style={{ padding:'13px 28px', borderRadius:tokens.radius.card, border:'none', background:loading?'rgba(123,232,200,0.4)':mintGradient, cursor:loading?'not-allowed':'pointer', fontSize:'15px', fontWeight:700, color:tokens.colors.navy, letterSpacing:'-0.1px', display:'flex', alignItems:'center', gap:8 }}>
            {loading ? <><Loader2 size={16} style={{ animation:'spin 1s linear infinite' }} />Searching…</> : 'Compare Prices'}
          </motion.button>
        </motion.div>

        {/* Bonus teaser */}
        <motion.div initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.65, ...tokens.motion.slow }} style={{ marginTop:20 }}>
          <motion.button whileTap={{ scale:0.95 }} whileHover={{ scale:1.03 }} transition={tokens.motion.fast} onClick={onBonusOpen}
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'9px 18px', borderRadius:tokens.radius.full, background:`linear-gradient(135deg, ${tokens.colors.coral}18, ${tokens.colors.lemon}14)`, border:`1px solid ${tokens.colors.coral}30`, cursor:'pointer', fontFamily:'inherit' }}>
            <span style={{ fontSize:14 }}>🎁</span>
            <span style={{ fontSize:'13px', fontWeight:600, color:tokens.colors.coral }}>15 credits waiting</span>
            <span style={{ fontSize:'12px', fontWeight:450, color:t.textSub }}>→ View</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export function HomeScreen({ t, zipCode, setZipCode, onSearch, loading, error, storeCards, aiResults, kroger, hybrid, items }) {
  const [selected, setSelected]   = useState(null)
  const [bonusOpen, setBonusOpen] = useState(false)

  return (
    <>
      <motion.div key="home" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }} transition={tokens.motion.standard}>
        <ParallaxHero t={t} onBonusOpen={() => setBonusOpen(true)} zipCode={zipCode} setZipCode={setZipCode} onSearch={onSearch} loading={loading} />

        {/* Error */}
        {error && (
          <div style={{ margin:'0 24px 16px', padding:'12px 16px', borderRadius:tokens.radius.card, background:`${tokens.colors.coral}12`, border:`1px solid ${tokens.colors.coral}30`, display:'flex', alignItems:'center', gap:10 }}>
            <AlertCircle size={16} color={tokens.colors.coral} />
            <span style={{ fontSize:'14px', color:tokens.colors.coral }}>{error}</span>
          </div>
        )}

        {/* Top Essentials */}
        <section style={{ padding:'8px 0 0' }}>
          <div style={{ padding:'0 24px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <h2 style={{ fontSize:tokens.font.section.size, fontWeight:600, margin:0, color:t.text }}>Top Essentials</h2>
            <span style={{ fontSize:tokens.font.micro.size, color:tokens.colors.mintEnd, fontWeight:600 }}>Quick add</span>
          </div>
          <div style={{ display:'flex', gap:12, overflowX:'auto', padding:'4px 24px 8px', scrollbarWidth:'none', msOverflowStyle:'none', WebkitOverflowScrolling:'touch' }}>
            {TOP_ESSENTIALS.map(item => (
              <div key={item.name} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, minWidth:72, cursor:'pointer' }} onClick={() => setSelected(selected === item.name ? null : item.name)}>
                <div style={{ width:64, height:64, borderRadius:tokens.radius.card, background:selected===item.name?`linear-gradient(135deg, ${tokens.colors.mintStart}22, ${tokens.colors.mintEnd}22)`:t.card, border:`2px solid ${selected===item.name?tokens.colors.mintStart:'transparent'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, boxShadow:selected===item.name?`0 0 0 4px ${tokens.colors.mintStart}22`:t.shadow1, transition:'all 0.2s ease' }}>
                  {item.emoji}
                </div>
                <span style={{ fontSize:tokens.font.micro.size, color:selected===item.name?tokens.colors.mintEnd:t.textSub, transition:'color 0.2s' }}>{item.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Savings Banner — only when we have results */}
        {storeCards.length > 0 && (
          <section style={{ padding:'24px 24px 0' }}>
            <SavingsBanner storeCards={storeCards} itemCount={items.length} />
          </section>
        )}

        {/* Loading state */}
        {loading && (
          <section style={{ padding:'32px 24px 0', textAlign:'center' }}>
            <motion.div animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:1.5, repeat:Infinity }}>
              <Loader2 size={32} color={tokens.colors.mintEnd} style={{ animation:'spin 1s linear infinite', marginBottom:12 }} />
              <p style={{ color:t.textSub, fontSize:'14px' }}>Searching live prices, community data, and AI estimates…</p>
            </motion.div>
          </section>
        )}

        {/* Backend offline notice */}
        {!loading && storeCards.some(c => c.dataSource === 'ai') && !storeCards.some(c => c.dataSource === 'kroger' || c.dataSource === 'community') && (
          <div style={{ margin:'24px 24px 0', padding:'10px 16px', borderRadius:tokens.radius.card, background:`${tokens.colors.lemon}12`, border:`1px solid ${tokens.colors.lemon}30`, fontSize:'12px', color:t.textSub }}>
            ✨ Showing AI estimates · Start the backend for live Kroger + community prices
          </div>
        )}

        {/* Hybrid data scraping notice */}
        {hybrid.storesBeingScraping?.length > 0 && (
          <div style={{ margin:'8px 24px 0', padding:'10px 16px', borderRadius:tokens.radius.card, background:`rgba(123,232,200,0.08)`, border:`1px solid rgba(123,232,200,0.2)`, fontSize:'12px', color:tokens.colors.mintEnd, display:'flex', alignItems:'center', gap:8 }}>
            <Loader2 size={13} style={{ animation:'spin 1s linear infinite' }} />
            Fetching community prices for {hybrid.storesBeingScraping.join(', ')}…
          </div>
        )}

        {/* Store Cards */}
        {storeCards.length > 0 && (
          <section style={{ padding:'32px 24px 0' }}>
            <h2 style={{ fontSize:tokens.font.section.size, fontWeight:600, margin:'0 0 16px', color:t.text }}>Stores Nearby</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {storeCards.map(store => <StoreCard key={store.id} store={store} t={t} />)}
            </div>
          </section>
        )}

        {/* Empty state — no search yet */}
        {!loading && storeCards.length === 0 && !error && (
          <section style={{ padding:'48px 24px', textAlign:'center' }}>
            <div style={{ fontSize:56, marginBottom:16 }}>🛒</div>
            <p style={{ fontSize:tokens.font.body.size, color:t.text, fontWeight:500, margin:'0 0 8px' }}>Enter your ZIP code above</p>
            <p style={{ fontSize:tokens.font.small.size, color:t.textSub }}>We'll compare prices from Kroger, community data, and AI estimates</p>
          </section>
        )}
      </motion.div>

      <BonusModal open={bonusOpen} onClose={() => setBonusOpen(false)} t={t} />
    </>
  )
}
