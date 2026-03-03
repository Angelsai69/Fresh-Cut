import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, ShoppingCart, User, Sparkles, Share2, Instagram, Twitter, Facebook } from 'lucide-react'
import { tokens, getTheme } from './tokens'
import { HomeScreen } from './screens/HomeScreen'
import { ListScreen } from './screens/ListScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { usePriceData } from './hooks/usePriceData'

const TABS = [
  { id:'home',    icon:Home,         label:'Home'    },
  { id:'list',    icon:ShoppingCart, label:'My List' },
  { id:'share',   icon:Share2,       label:'Share'   },
  { id:'profile', icon:User,         label:'Profile' },
]

const getTabColors = (dark) => ({
  home:    dark ? { active:'#A0ADB8', indicator:'linear-gradient(90deg, #8A96A3, #A0ADB8)' }
               : { active:tokens.colors.navy, indicator:`linear-gradient(90deg, ${tokens.colors.navy}, #1A3D5C)` },
  list:    { active:tokens.colors.mintEnd,   indicator:`linear-gradient(90deg, ${tokens.colors.mintStart}, ${tokens.colors.mintEnd})` },
  share:   { active:tokens.colors.lemon,     indicator:`linear-gradient(90deg, ${tokens.colors.lemon}, #F0B429)` },
  profile: { active:tokens.colors.mintStart, indicator:`linear-gradient(90deg, rgba(123,232,200,0.6), ${tokens.colors.mintStart})` },
})

const SOCIAL = [
  { icon:Instagram, label:'Instagram' },
  { icon:Twitter,   label:'X / Twitter' },
  { icon:Facebook,  label:'Facebook' },
]

export default function App() {
  const [dark, setDark]           = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [headerVisible, setHeaderVisible] = useState(true)
  const lastScrollY = useRef(0)
  const hideTimer   = useRef(null)
  const t = getTheme(dark)

  // All PriceScout data + logic
  const priceData = usePriceData()

  // Auto-hide header after 15s idle, show on scroll-up
  useEffect(() => {
    const startHideTimer = () => {
      clearTimeout(hideTimer.current)
      hideTimer.current = setTimeout(() => setHeaderVisible(false), 15000)
    }
    const handleScroll = () => {
      const currentY = window.scrollY
      if (currentY < lastScrollY.current - 4) { setHeaderVisible(true); startHideTimer() }
      lastScrollY.current = currentY
    }
    startHideTimer()
    window.addEventListener('scroll', handleScroll, { passive:true })
    return () => { window.removeEventListener('scroll', handleScroll); clearTimeout(hideTimer.current) }
  }, [])

  useEffect(() => {
    setHeaderVisible(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setHeaderVisible(false), 15000)
  }, [activeTab])

  return (
    <div style={{
      minHeight:'100vh', background:t.bg,
      fontFamily:"-apple-system, 'SF Pro Display', 'SF Pro Text', 'Inter', sans-serif",
      color:t.text, transition:'background 0.35s ease, color 0.35s ease',
      position:'relative', overflowX:'hidden', display:'flex', flexDirection:'column',
    }}>
      {/* CSS for spin animation & parallax class */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .is-scrolling .parallax-subtitle { will-change: transform; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Top bar */}
      <AnimatePresence>
        {headerVisible && (
          <motion.header key="topbar" initial={{ y:-72, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:-72, opacity:0 }} transition={tokens.motion.standard}
            style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, background:t.glass, backdropFilter:'blur(32px)', WebkitBackdropFilter:'blur(32px)', borderBottom:`1px solid ${t.border}`, padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
            {/* Brand */}
            <div style={{ flexShrink:0 }}>
              <div style={{ fontSize:'20px', fontWeight:800, letterSpacing:'-0.5px', lineHeight:1.1, background:`linear-gradient(135deg, ${tokens.colors.mintStart}, ${tokens.colors.mintEnd})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Fresh~CUT
              </div>
              <div style={{ fontSize:'11px', color:t.textSub, fontWeight:500, marginTop:1 }}>
                {priceData.zipCode ? `ZIP ${priceData.zipCode}` : 'Grocery Price Compare'}
              </div>
            </div>

            {/* Auth placeholder buttons */}
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <motion.button whileTap={{ scale:0.94 }} transition={tokens.motion.fast}
                style={{ padding:'7px 15px', borderRadius:tokens.radius.full, border:`1.5px solid ${t.border}`, background:'transparent', cursor:'pointer', fontSize:'13px', fontWeight:600, color:t.text }}>
                Sign In
              </motion.button>
              <motion.button whileTap={{ scale:0.94 }} transition={tokens.motion.fast}
                style={{ padding:'7px 15px', borderRadius:tokens.radius.full, border:'none', background:`linear-gradient(135deg, ${tokens.colors.mintStart}, ${tokens.colors.mintEnd})`, cursor:'pointer', fontSize:'13px', fontWeight:700, color:tokens.colors.navy }}>
                Join Free
              </motion.button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Scrollable content */}
      <main style={{ flex:1, paddingTop:headerVisible?76:16, paddingBottom:130, transition:'padding-top 0.25s ease' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <HomeScreen
              key="home" t={t}
              zipCode={priceData.zipCode}
              setZipCode={priceData.setZipCode}
              onSearch={priceData.fetchPrices}
              loading={priceData.loading}
              error={priceData.error}
              storeCards={priceData.storeCards}
              aiResults={priceData.aiResults}
              kroger={priceData.kroger}
              hybrid={priceData.hybrid}
              items={priceData.items}
            />
          )}
          {activeTab === 'list' && (
            <ListScreen
              key="list" t={t}
              items={priceData.items}
              addItem={priceData.addItem}
              removeItem={priceData.removeItem}
              resetItems={priceData.resetItems}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileScreen
              key="profile" t={t} dark={dark} setDark={setDark}
              userProfile={priceData.userProfile}
              saveProfile={priceData.saveProfile}
              shareEnabled={priceData.shareEnabled}
              toggleShareEnabled={priceData.toggleShareEnabled}
              contributionCount={priceData.contributionCount}
              backendAvailable={priceData.backendAvailable}
              BACKEND={priceData.BACKEND}
            />
          )}
          {activeTab === 'share' && <ShareScreen key="share" t={t} />}
        </AnimatePresence>

        {/* Footer */}
        <footer style={{ padding:'40px 24px 24px', borderTop:`1px solid ${t.border}`, marginTop:48 }}>
          <div style={{ fontSize:'18px', fontWeight:800, letterSpacing:'-0.5px', marginBottom:4, background:`linear-gradient(135deg, ${tokens.colors.mintStart}, ${tokens.colors.mintEnd})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', display:'inline-block' }}>
            Fresh~CUT
          </div>
          <p style={{ fontSize:'13px', color:t.textSub, lineHeight:1.6, margin:'8px 0 20px', maxWidth:320 }}>
            AI-powered grocery price comparison. Save smarter, live fresher.
          </p>
          <div style={{ display:'flex', gap:12, marginBottom:24 }}>
            {SOCIAL.map(({ icon:Icon, label }) => (
              <a key={label} href="#" aria-label={label} style={{ width:36, height:36, borderRadius:tokens.radius.full, border:`1.5px solid ${t.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:t.textSub, textDecoration:'none' }}>
                <Icon size={16} strokeWidth={1.8} />
              </a>
            ))}
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'8px 20px', marginBottom:16 }}>
            {['Privacy Policy','Terms of Service','Cookie Policy','Accessibility','Contact Us'].map(link => (
              <a key={link} href="#" style={{ fontSize:'12px', color:t.textSub, textDecoration:'none', fontWeight:500 }}>{link}</a>
            ))}
          </div>
          <p style={{ fontSize:'11px', color:t.textSub, opacity:0.55, lineHeight:1.6 }}>
            © {new Date().getFullYear()} Fresh~CUT Inc. All rights reserved.<br />
            Prices and availability subject to change. Not affiliated with any grocery retailer.
          </p>
        </footer>
      </main>

      {/* Bottom nav */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, background:t.glass, backdropFilter:'blur(32px)', WebkitBackdropFilter:'blur(32px)', borderTop:`1px solid ${t.border}`, zIndex:100, paddingBottom:'env(safe-area-inset-bottom)' }}>
        <div style={{ display:'flex', justifyContent:'space-around', padding:'10px 0 14px' }}>
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            const tabColor = getTabColors(dark)[tab.id]
            return (
              <motion.button key={tab.id} whileTap={{ scale:0.82 }} transition={tokens.motion.fast} onClick={() => setActiveTab(tab.id)}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'4px 12px', border:'none', background:'transparent', cursor:'pointer', position:'relative', color:isActive?tabColor.active:t.textSub, transition:'color 0.2s', minWidth:52 }}>
                {isActive && (
                  <motion.div layoutId="navIndicator"
                    style={{ position:'absolute', top:-1, width:20, height:3, borderRadius:tokens.radius.full, background:tabColor.indicator }}
                    transition={tokens.motion.standard} />
                )}
                <Icon size={21} strokeWidth={isActive?2.5:1.8} />
                <span style={{ fontSize:'9px', fontWeight:isActive?700:400, letterSpacing:'0.1px' }}>{tab.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Floating AI button */}
      <motion.div style={{ position:'fixed', bottom:100, right:20, width:56, height:56, zIndex:200 }}>
        <motion.div animate={{ scale:[1,1.55,1], opacity:[0.55,0,0.55] }} transition={{ duration:3.2, ease:'easeInOut', repeat:Infinity, repeatDelay:0.8 }}
          style={{ position:'absolute', inset:0, borderRadius:tokens.radius.full, background:'radial-gradient(circle, rgba(255,107,107,0.55) 0%, transparent 70%)', pointerEvents:'none' }} />
        <motion.button initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }} whileHover={{ scale:1.10 }} whileTap={{ scale:0.90 }}
          transition={{ ...tokens.motion.slow, delay:0.4 }}
          onClick={() => setActiveTab('home')}
          style={{ position:'relative', width:'100%', height:'100%', borderRadius:tokens.radius.full, background:'linear-gradient(135deg, #FF6B6B, #FF4757)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 24px rgba(255,71,87,0.45)' }}>
          <Sparkles size={22} color="white" strokeWidth={2} />
        </motion.button>
      </motion.div>
    </div>
  )
}

// ── Share Screen ──────────────────────────────────────────────────────────────
function ShareScreen({ t }) {
  return (
    <motion.div key="share" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }} transition={tokens.motion.standard} style={{ padding:'32px 24px 0' }}>
      <h1 style={{ fontSize:tokens.font.h1.size, fontWeight:600, letterSpacing:'-0.3px', margin:'0 0 8px', color:t.text }}>Share Fresh~CUT</h1>
      <p style={{ fontSize:tokens.font.body.size, color:t.textSub, margin:'0 0 28px' }}>Invite friends and earn 5 credits for every signup.</p>
      <div style={{ background:`linear-gradient(135deg, ${tokens.colors.mintStart}, ${tokens.colors.mintEnd})`, borderRadius:tokens.radius.hero, padding:'28px 24px', marginBottom:24 }}>
        <p style={{ fontSize:'13px', fontWeight:700, color:tokens.colors.navy, opacity:0.7, margin:'0 0 8px', textTransform:'uppercase', letterSpacing:'0.8px' }}>Your Referral Link</p>
        <p style={{ fontSize:'16px', fontWeight:700, color:'white', margin:'0 0 16px', letterSpacing:'-0.2px' }}>freshcut.app/ref/you</p>
        <motion.button whileTap={{ scale:0.96 }} style={{ padding:'10px 24px', borderRadius:tokens.radius.full, background:'rgba(15,43,70,0.2)', border:'1px solid rgba(255,255,255,0.3)', cursor:'pointer', fontSize:'14px', fontWeight:700, color:'white' }}>
          Copy Link
        </motion.button>
      </div>
      {[{ icon:'📱', label:'Share via Messages' }, { icon:'✉️', label:'Share via Email' }, { icon:'📋', label:'Copy Referral Code' }].map(item => (
        <motion.div key={item.label} whileTap={{ scale:0.985 }}
          style={{ background:t.card, borderRadius:tokens.radius.card, padding:'16px 20px', marginBottom:10, display:'flex', alignItems:'center', gap:16, boxShadow:t.shadow1, cursor:'pointer' }}>
          <span style={{ fontSize:22 }}>{item.icon}</span>
          <span style={{ fontSize:tokens.font.body.size, color:t.text, fontWeight:500 }}>{item.label}</span>
        </motion.div>
      ))}
    </motion.div>
  )
}
