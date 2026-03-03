import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Sun, Moon, MapPin, Plus, X, Star, Eye, EyeOff, Wifi, Copy, Check } from 'lucide-react'
import { tokens, mintGradient } from '../tokens'

const STATS_LABELS = ['Trips', 'Items', 'Saved']

const BONUSES = [
  { emoji:'🏆', title:'Weekly Saver',   desc:'Save on 3 consecutive searches',   progress:66,  reward:'10 credits' },
  { emoji:'⭐', title:'First Compare',  desc:'Compare your first store basket',   progress:100, reward:'Complete!'   },
  { emoji:'🎯', title:'List Pro',       desc:'Add 10+ items to your list',        progress:60,  reward:'5 credits'  },
  { emoji:'💎', title:'Loyalty Streak', desc:'Use Fresh~CUT 7 days in a row',     progress:43,  reward:'15 credits' },
]

const DIET_OPTIONS = ['None','Vegan','Vegetarian','Keto','Gluten-Free','Halal','Kosher','Dairy-Free','Nut-Free']
const MENU_ITEMS = ['Notifications','Preferred Stores','Price Alerts']
const DEFAULT_LOCATIONS = [
  { id:1, name:'Home',  address:'142 Elm St, Gaithersburg MD', emoji:'🏠', primary:true  },
  { id:2, name:'Work',  address:'1200 K St NW, Washington DC', emoji:'🏢', primary:false },
  { id:3, name:"Mom's", address:'88 Maple Ave, Rockville MD',  emoji:'👵', primary:false },
]

const fieldStyle = (t) => ({
  flex:1, width:'100%', padding:'9px 12px', borderRadius:tokens.radius.sm,
  border:`1px solid ${t.border}`, background:t.isDark?'rgba(255,255,255,0.06)':tokens.colors.bgLight,
  color:t.text, fontSize:'13px', fontWeight:450, fontFamily:'inherit', outline:'none', boxSizing:'border-box',
})

function InfoField({ label, icon, children, last }) {
  return (
    <div style={{ paddingTop:12, paddingBottom:last?0:12, borderBottom:last?'none':'1px solid rgba(15,43,70,0.06)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
        <span style={{ fontSize:13 }}>{icon}</span>
        <span style={{ fontSize:'11px', fontWeight:600, color:'inherit', opacity:0.55, letterSpacing:'0.5px', textTransform:'uppercase' }}>{label}</span>
      </div>
      {children}
    </div>
  )
}

function Accordion({ open, onToggle, header, children }) {
  return (
    <div style={{ marginBottom:16 }}>
      <motion.button whileTap={{ scale:0.985 }} transition={tokens.motion.fast} onClick={onToggle}
        style={{ width:'100%', border:'none', background:'transparent', cursor:'pointer', fontFamily:'inherit', padding:0, marginBottom:open?12:0 }}>
        {header(open)}
      </motion.button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body" initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
            transition={{ duration:0.28, ease:[0.4,0,0.2,1] }} style={{ overflow:'hidden' }}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AccordionHeader({ t, label, meta, open }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:t.card, borderRadius:open?`${tokens.radius.card} ${tokens.radius.card} 0 0`:tokens.radius.card, padding:'14px 18px', boxShadow:t.shadow1, transition:'border-radius 0.2s ease' }}>
      <div style={{ textAlign:'left' }}>
        <p style={{ fontSize:tokens.font.section.size, fontWeight:600, color:t.text, margin:0 }}>{label}</p>
        <p style={{ fontSize:tokens.font.micro.size, fontWeight:450, color:t.textSub, margin:'2px 0 0' }}>{meta}</p>
      </div>
      <motion.div animate={{ rotate:open?180:0 }} transition={tokens.motion.fast} style={{ color:t.textSub, display:'flex' }}>
        <ChevronDown size={18} strokeWidth={2} />
      </motion.div>
    </div>
  )
}

// ── Price Sharing Panel ──────────────────────────────────────────────────────
function PriceSharingPanel({ t, shareEnabled, toggleShareEnabled, contributionCount, backendURL }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(backendURL || 'http://localhost:3001').catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ paddingTop:12, borderTop:`1px solid rgba(15,43,70,0.06)`, marginTop:4 }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:12 }}>
        <span style={{ fontSize:13 }}>📡</span>
        <span style={{ fontSize:'11px', fontWeight:600, opacity:0.55, letterSpacing:'0.5px', textTransform:'uppercase', color:t.text }}>Price Sharing</span>
      </div>

      {/* Toggle row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <div>
          <p style={{ fontSize:'13px', fontWeight:600, color:t.text, margin:0 }}>Share prices via Chrome extension</p>
          <p style={{ fontSize:'11px', color:t.textSub, margin:'2px 0 0' }}>
            {shareEnabled ? 'Extension will send prices to the community database' : 'Extension is in read-only mode'}
          </p>
        </div>
        <motion.button
          whileTap={{ scale:0.92 }} onClick={() => toggleShareEnabled(!shareEnabled)}
          style={{ width:48, height:26, borderRadius:tokens.radius.full, background:shareEnabled?mintGradient:'rgba(15,43,70,0.12)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', padding:'0 3px', justifyContent:shareEnabled?'flex-end':'flex-start', transition:'background 0.3s ease', flexShrink:0 }}>
          <motion.div layout transition={tokens.motion.standard}
            style={{ width:20, height:20, borderRadius:tokens.radius.full, background:'white', boxShadow:'0 1px 4px rgba(0,0,0,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Wifi size={10} color={shareEnabled ? tokens.colors.mintEnd : tokens.colors.textSecondary} strokeWidth={2} />
          </motion.div>
        </motion.button>
      </div>

      {/* Contribution count */}
      {contributionCount > 0 && (
        <div style={{ padding:'8px 12px', borderRadius:tokens.radius.sm, background:`${tokens.colors.mintStart}12`, border:`1px solid ${tokens.colors.mintStart}25`, marginBottom:10 }}>
          <p style={{ fontSize:'12px', fontWeight:600, color:tokens.colors.mintEnd, margin:0 }}>
            🎉 You've shared {contributionCount} prices — thank you!
          </p>
        </div>
      )}

      {/* Backend URL for extension */}
      <AnimatePresence>
        {shareEnabled && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
            transition={{ duration:0.22, ease:[0.4,0,0.2,1] }} style={{ overflow:'hidden' }}>
            <div style={{ background:t.isDark?'rgba(255,255,255,0.04)':tokens.colors.bgLight, borderRadius:tokens.radius.sm, padding:'10px 12px', border:`1px solid ${t.border}`, marginTop:4 }}>
              <p style={{ fontSize:'11px', fontWeight:600, color:t.textSub, margin:'0 0 6px', textTransform:'uppercase', letterSpacing:'0.4px' }}>
                Extension Backend URL
              </p>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <code style={{ flex:1, fontSize:'11px', color:tokens.colors.mintEnd, background:'transparent', border:'none', padding:0, fontFamily:'monospace', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {backendURL || 'http://localhost:3001'}
                </code>
                <motion.button whileTap={{ scale:0.88 }} onClick={handleCopy}
                  style={{ padding:'4px 10px', borderRadius:tokens.radius.sm, background:copied?`${tokens.colors.savingsGreen}20`:`${tokens.colors.mintStart}20`, border:`1px solid ${copied?tokens.colors.savingsGreen:tokens.colors.mintStart}40`, cursor:'pointer', display:'flex', alignItems:'center', gap:4, color:copied?tokens.colors.savingsGreen:tokens.colors.mintEnd, flexShrink:0, fontSize:'11px', fontWeight:600, fontFamily:'inherit' }}>
                  {copied ? <><Check size={11} />Copied!</> : <><Copy size={11} />Copy</>}
                </motion.button>
              </div>
              <p style={{ fontSize:'10px', color:t.textSub, margin:'6px 0 0', lineHeight:1.5 }}>
                Paste this URL in the extension settings to connect it to your backend.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ProfileScreen({ t, dark, setDark, userProfile, saveProfile, shareEnabled, toggleShareEnabled, contributionCount, backendAvailable, BACKEND }) {
  const [locOpen,   setLocOpen]   = useState(false)
  const [bonusOpen, setBonusOpen] = useState(false)
  const [infoOpen,  setInfoOpen]  = useState(false)
  const [userInfo,  setUserInfo]  = useState({
    email: userProfile.contact || 'you@example.com',
    phone: '',
    username: `@${(userProfile.name || 'user').toLowerCase().replace(/\s+/g,'')}`,
    diet: 'None',
    showPass: false,
  })
  const setField = (key, val) => setUserInfo(u => ({ ...u, [key]:val }))
  const [locations, setLocations] = useState(DEFAULT_LOCATIONS)
  const [addingNew, setAddingNew] = useState(false)
  const [newLabel,  setNewLabel]  = useState('')
  const [newAddr,   setNewAddr]   = useState('')

  const setPrimary = (id) => setLocations(l => l.map(x => ({ ...x, primary:x.id===id })))
  const removeLocation = (id) => setLocations(l => l.filter(x => x.id!==id))
  const addLocation = () => {
    if (!newLabel.trim()) return
    setLocations(l => [...l, { id:Date.now(), name:newLabel, address:newAddr||'Address not set', emoji:'📍', primary:false }])
    setNewLabel(''); setNewAddr(''); setAddingNew(false)
  }

  const primaryLoc = locations.find(l => l.primary)
  const completedBonus = BONUSES.filter(b => b.progress===100).length

  const STATS = [
    { label:'Trips',  value:'12' },
    { label:'Items',  value:'87' },
    { label:'Saved',  value:'$214' },
  ]

  const handleSaveInfo = () => {
    saveProfile({ ...userProfile, name: userInfo.username.replace('@',''), contact: userInfo.email })
  }

  return (
    <motion.div key="profile" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }}
      transition={tokens.motion.standard} style={{ padding:'32px 24px 0', color:t.text }}>

      {/* Profile Banner */}
      <div style={{ background:mintGradient, borderRadius:tokens.radius.hero, padding:'28px 24px', marginBottom:24, display:'flex', alignItems:'center', gap:20 }}>
        <div style={{ width:64, height:64, borderRadius:tokens.radius.full, background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>👤</div>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:tokens.font.h2.size, fontWeight:600, color:'white', margin:0, letterSpacing:'-0.2px' }}>{userProfile.name || 'Alex'}</p>
          <p style={{ fontSize:tokens.font.small.size, fontWeight:450, color:'rgba(255,255,255,0.75)', margin:'4px 0 0' }}>Saved $214 this month</p>
        </div>
        {/* Backend status dot */}
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:backendAvailable?tokens.colors.savingsGreen:tokens.colors.coral, boxShadow:backendAvailable?`0 0 6px ${tokens.colors.savingsGreen}`:`0 0 6px ${tokens.colors.coral}` }} />
          <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.7)' }}>{backendAvailable?'Live':'Offline'}</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:24 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background:t.card, borderRadius:tokens.radius.card, padding:16, textAlign:'center', boxShadow:t.shadow1 }}>
            <p style={{ fontSize:'22px', fontWeight:700, color:t.text, margin:0, letterSpacing:'-0.3px' }}>{s.value}</p>
            <p style={{ fontSize:tokens.font.micro.size, fontWeight:450, color:t.textSub, margin:'4px 0 0' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Account Info accordion — now includes Price Sharing */}
      <Accordion open={infoOpen} onToggle={() => setInfoOpen(o => !o)}
        header={(open) => <AccordionHeader t={t} label="Account Info" meta={`${userInfo.username} · ${userInfo.diet !== 'None' ? userInfo.diet : 'No diet set'}`} open={open} />}>
        <div style={{ background:t.card, borderRadius:`0 0 ${tokens.radius.card} ${tokens.radius.card}`, padding:'4px 16px 16px', boxShadow:t.shadow1 }}>
          <InfoField label="Email" icon="✉️">
            <input value={userInfo.email} onChange={e => setField('email', e.target.value)} style={fieldStyle(t)} />
          </InfoField>
          <InfoField label="Cell Number" icon="📱">
            <input value={userInfo.phone} onChange={e => setField('phone', e.target.value)} style={fieldStyle(t)} placeholder="+1 (555) 000-0000" />
          </InfoField>
          <InfoField label="Username" icon="👤">
            <input value={userInfo.username} onChange={e => setField('username', e.target.value)} style={fieldStyle(t)} />
          </InfoField>
          <InfoField label="Password" icon="🔒">
            <div style={{ position:'relative', flex:1 }}>
              <input type={userInfo.showPass?'text':'password'} defaultValue="supersecret123" style={{ ...fieldStyle(t), paddingRight:36 }} />
              <button onClick={() => setField('showPass', !userInfo.showPass)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:t.textSub, display:'flex', padding:0 }}>
                {userInfo.showPass ? <EyeOff size={14} strokeWidth={2} /> : <Eye size={14} strokeWidth={2} />}
              </button>
            </div>
          </InfoField>
          <InfoField label="Special Diet" icon="🥗">
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, paddingTop:4 }}>
              {DIET_OPTIONS.map(opt => {
                const active = userInfo.diet === opt
                return (
                  <motion.button key={opt} whileTap={{ scale:0.92 }} onClick={() => setField('diet', opt)}
                    style={{ padding:'5px 13px', borderRadius:tokens.radius.full, border:`1.5px solid ${active?tokens.colors.mintStart:t.border}`, background:active?`linear-gradient(135deg, ${tokens.colors.mintStart}22, ${tokens.colors.mintEnd}18)`:'transparent', cursor:'pointer', fontSize:'12px', fontWeight:active?700:450, color:active?tokens.colors.mintEnd:t.textSub, fontFamily:'inherit', transition:'all 0.15s ease' }}>
                    {opt}
                  </motion.button>
                )
              })}
            </div>
          </InfoField>

          {/* ── Price Sharing — NEW ── */}
          <PriceSharingPanel
            t={t}
            shareEnabled={shareEnabled}
            toggleShareEnabled={toggleShareEnabled}
            contributionCount={contributionCount}
            backendURL={BACKEND || 'http://localhost:3001'}
          />

          <motion.button whileTap={{ scale:0.97 }} onClick={handleSaveInfo}
            style={{ width:'100%', marginTop:14, padding:'11px', borderRadius:tokens.radius.card, background:mintGradient, border:'none', cursor:'pointer', fontSize:'14px', fontWeight:700, color:tokens.colors.navy }}>
            Save Changes
          </motion.button>
        </div>
      </Accordion>

      {/* Saved Locations accordion */}
      <Accordion open={locOpen} onToggle={() => { setLocOpen(o => !o); setAddingNew(false) }}
        header={(open) => <AccordionHeader t={t} label="Saved Locations" meta={primaryLoc?`${primaryLoc.emoji} ${primaryLoc.name} is primary · ${locations.length} saved`:`${locations.length} saved`} open={open} />}>
        <div style={{ background:t.card, borderRadius:`0 0 ${tokens.radius.card} ${tokens.radius.card}`, padding:'0 16px 16px', boxShadow:t.shadow1 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:8, paddingTop:4 }}>
            <AnimatePresence>
              {locations.map(loc => (
                <motion.div key={loc.id} layout initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20, scale:0.96 }} transition={tokens.motion.standard}
                  style={{ background:loc.primary?tokens.colors.navy:(t.isDark?'rgba(255,255,255,0.05)':tokens.colors.bgLight), borderRadius:tokens.radius.card, padding:'12px 14px', display:'flex', alignItems:'center', gap:12, border:loc.primary?'none':`1px solid ${t.border}` }}>
                  <div style={{ width:38, height:38, borderRadius:tokens.radius.sm, background:loc.primary?'rgba(123,232,200,0.2)':`${tokens.colors.mintStart}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{loc.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <p style={{ fontSize:'14px', fontWeight:600, margin:0, color:loc.primary?'white':t.text }}>{loc.name}</p>
                      {loc.primary && <span style={{ fontSize:'9px', fontWeight:700, background:mintGradient, color:tokens.colors.navy, padding:'2px 7px', borderRadius:tokens.radius.full, letterSpacing:'0.4px' }}>PRIMARY</span>}
                    </div>
                    <p style={{ fontSize:'11px', margin:'2px 0 0', color:loc.primary?'rgba(255,255,255,0.58)':t.textSub, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      <MapPin size={9} style={{ display:'inline', marginRight:2 }} />{loc.address}
                    </p>
                  </div>
                  {!loc.primary && (
                    <div style={{ display:'flex', gap:5, flexShrink:0 }}>
                      <motion.button whileTap={{ scale:0.84 }} onClick={() => setPrimary(loc.id)}
                        style={{ width:26, height:26, borderRadius:tokens.radius.full, background:`${tokens.colors.mintStart}20`, border:`1px solid ${tokens.colors.mintStart}40`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:tokens.colors.mintEnd }}>
                        <Star size={12} strokeWidth={2} />
                      </motion.button>
                      <motion.button whileTap={{ scale:0.84 }} onClick={() => removeLocation(loc.id)}
                        style={{ width:26, height:26, borderRadius:tokens.radius.full, background:`${tokens.colors.coral}14`, border:`1px solid ${tokens.colors.coral}28`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:tokens.colors.coral }}>
                        <X size={12} strokeWidth={2.5} />
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {!addingNew && (
            <motion.button whileTap={{ scale:0.96 }} onClick={() => setAddingNew(true)}
              style={{ width:'100%', marginTop:10, padding:'10px', borderRadius:tokens.radius.card, border:`1.5px dashed ${tokens.colors.mintStart}50`, background:'transparent', cursor:'pointer', fontSize:'13px', fontWeight:600, color:tokens.colors.mintEnd, fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              <Plus size={14} strokeWidth={2.5} /> Add Location
            </motion.button>
          )}
          <AnimatePresence>
            {addingNew && (
              <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} transition={{ duration:0.22 }} style={{ overflow:'hidden', marginTop:10 }}>
                <div style={{ background:t.isDark?'rgba(255,255,255,0.05)':tokens.colors.bgLight, borderRadius:tokens.radius.card, padding:'14px', border:`1px solid ${tokens.colors.mintStart}30` }}>
                  <p style={{ fontSize:'12px', fontWeight:600, color:t.text, margin:'0 0 10px' }}>New Location</p>
                  {['Label (e.g. Gym)','Address or ZIP'].map((ph, i) => (
                    <input key={ph} placeholder={ph} value={i===0?newLabel:newAddr} onChange={e => i===0?setNewLabel(e.target.value):setNewAddr(e.target.value)}
                      style={{ width:'100%', padding:'9px 12px', borderRadius:tokens.radius.sm, border:`1px solid ${t.border}`, background:t.card, color:t.text, fontSize:'13px', fontWeight:450, fontFamily:'inherit', outline:'none', marginBottom:i===0?7:10, boxSizing:'border-box' }} />
                  ))}
                  <div style={{ display:'flex', gap:7 }}>
                    <motion.button whileTap={{ scale:0.95 }} onClick={addLocation} style={{ flex:1, padding:'9px', borderRadius:tokens.radius.sm, background:mintGradient, border:'none', cursor:'pointer', fontSize:'13px', fontWeight:700, color:tokens.colors.navy }}>Save</motion.button>
                    <motion.button whileTap={{ scale:0.95 }} onClick={() => setAddingNew(false)} style={{ padding:'9px 14px', borderRadius:tokens.radius.sm, background:'transparent', border:`1px solid ${t.border}`, cursor:'pointer', fontSize:'13px', fontWeight:450, color:t.textSub }}>Cancel</motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Accordion>

      {/* Bonus Rewards accordion */}
      <Accordion open={bonusOpen} onToggle={() => setBonusOpen(o => !o)}
        header={(open) => <AccordionHeader t={t} label="Bonus Rewards" meta={`15 credits balance · ${completedBonus}/${BONUSES.length} complete`} open={open} />}>
        <div style={{ background:t.card, borderRadius:`0 0 ${tokens.radius.card} ${tokens.radius.card}`, padding:'0 16px 16px', boxShadow:t.shadow1 }}>
          <div style={{ background:`linear-gradient(135deg, ${tokens.colors.coral}, #FF4757)`, borderRadius:tokens.radius.card, padding:'16px 18px', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12, marginTop:4 }}>
            <div>
              <p style={{ fontSize:'10px', fontWeight:700, color:'rgba(255,255,255,0.7)', margin:'0 0 3px', textTransform:'uppercase', letterSpacing:'0.8px' }}>Credit Balance</p>
              <p style={{ fontSize:'26px', fontWeight:700, color:'white', margin:0, letterSpacing:'-0.4px' }}>15 credits</p>
            </div>
            <motion.button
              style={{ padding:'8px 16px', borderRadius:tokens.radius.full, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', cursor:'not-allowed', fontSize:'12px', fontWeight:700, color:'rgba(255,255,255,0.4)' }}>
              Redeem
            </motion.button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {BONUSES.map((b, idx) => (
              <motion.div key={b.title} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:idx*0.05, ...tokens.motion.standard }}
                style={{ background:t.isDark?'rgba(255,255,255,0.05)':tokens.colors.bgLight, borderRadius:tokens.radius.card, padding:'14px 16px', border:`1px solid ${t.isDark?'rgba(255,255,255,0.07)':'rgba(15,43,70,0.06)'}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <div style={{ width:36, height:36, borderRadius:tokens.radius.sm, fontSize:18, background:`${tokens.colors.mintStart}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{b.emoji}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:'13px', fontWeight:600, color:t.text, margin:0 }}>{b.title}</p>
                    <p style={{ fontSize:'11px', fontWeight:450, color:t.textSub, margin:'2px 0 0' }}>{b.desc}</p>
                  </div>
                  <span style={{ fontSize:'10px', fontWeight:700, whiteSpace:'nowrap', color:b.progress===100?tokens.colors.savingsGreen:tokens.colors.mintEnd, background:b.progress===100?`${tokens.colors.savingsGreen}15`:`${tokens.colors.mintEnd}15`, padding:'3px 9px', borderRadius:tokens.radius.full }}>{b.reward}</span>
                </div>
                <div style={{ height:4, borderRadius:tokens.radius.full, background:`${tokens.colors.mintStart}22`, overflow:'hidden' }}>
                  <motion.div initial={{ width:0 }} animate={{ width:`${b.progress}%` }} transition={{ delay:0.15+idx*0.05, duration:0.5, ease:[0.4,0,0.2,1] }}
                    style={{ height:'100%', borderRadius:tokens.radius.full, background:b.progress===100?`linear-gradient(90deg, ${tokens.colors.savingsGreen}, #16A34A)`:`linear-gradient(90deg, ${tokens.colors.mintStart}, ${tokens.colors.mintEnd})` }} />
                </div>
                <p style={{ fontSize:'10px', fontWeight:450, color:t.textSub, margin:'4px 0 0', textAlign:'right' }}>{b.progress}%</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Accordion>

      {/* Appearance */}
      <div style={{ background:t.card, borderRadius:tokens.radius.card, padding:'16px 20px', marginBottom:8, boxShadow:t.shadow1, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <p style={{ fontSize:tokens.font.body.size, fontWeight:500, color:t.text, margin:0 }}>Appearance</p>
          <p style={{ fontSize:tokens.font.micro.size, fontWeight:450, color:t.textSub, margin:'2px 0 0' }}>{dark?'Dark mode':'Light mode'}</p>
        </div>
        <motion.button whileTap={{ scale:0.92 }} onClick={() => setDark(!dark)}
          style={{ width:56, height:30, borderRadius:tokens.radius.full, background:dark?mintGradient:'rgba(15,43,70,0.12)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', padding:'0 3px', justifyContent:dark?'flex-end':'flex-start', transition:'background 0.3s ease' }}>
          <motion.div layout transition={tokens.motion.standard} style={{ width:24, height:24, borderRadius:tokens.radius.full, background:'white', boxShadow:'0 1px 4px rgba(0,0,0,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {dark ? <Moon size={12} color={tokens.colors.mintEnd} strokeWidth={2} /> : <Sun size={12} color={tokens.colors.textSecondary} strokeWidth={2} />}
          </motion.div>
        </motion.button>
      </div>

      {/* Menu items */}
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {MENU_ITEMS.map(item => (
          <motion.div key={item} whileTap={{ scale:0.985 }} transition={tokens.motion.fast}
            style={{ background:t.card, borderRadius:tokens.radius.card, padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:t.shadow1, cursor:'pointer' }}>
            <span style={{ fontSize:tokens.font.body.size, fontWeight:450, color:t.text }}>{item}</span>
            <ChevronDown size={16} color={t.textSub} style={{ transform:'rotate(-90deg)' }} />
          </motion.div>
        ))}
      </div>

      <motion.button whileTap={{ scale:0.97 }} transition={tokens.motion.fast}
        style={{ width:'100%', marginTop:16, padding:'14px', borderRadius:tokens.radius.card, border:`1.5px solid ${tokens.colors.coral}40`, background:`${tokens.colors.coral}08`, cursor:'pointer', fontSize:tokens.font.body.size, fontWeight:600, color:tokens.colors.coral }}>
        Sign Out
      </motion.button>
    </motion.div>
  )
}
