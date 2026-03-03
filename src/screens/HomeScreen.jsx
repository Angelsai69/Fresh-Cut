import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import { tokens, mintGradient } from '../tokens'
import { TOP_10, STORES } from '../data'
import { ProductTile } from '../components/ProductTile'
import { StoreCard } from '../components/StoreCard'
import { SavingsBanner } from '../components/SavingsBanner'

// ── BONUS DATA ────────────────────────────────────────────────
const BONUSES = [
  { emoji: '🏆', title: 'Weekly Saver',   desc: 'Save 20%+ three weeks in a row', progress: 66,  reward: '$10 credit' },
  { emoji: '⭐', title: 'First Compare',  desc: 'Compare your first store basket', progress: 100, reward: 'Complete!'  },
  { emoji: '🎯', title: 'List Pro',       desc: 'Add 10+ items to your list',      progress: 60,  reward: '$5 credit'  },
  { emoji: '💎', title: 'Loyalty Streak', desc: 'Use Fresh~CUT 7 days in a row',   progress: 43,  reward: '$15 credit' },
]

// ── BONUS FLOATING CARD ───────────────────────────────────────
function BonusModal({ open, onClose, t }) {
  // Close on backdrop click
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={tokens.motion.standard}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(15,43,70,0.55)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              zIndex: 300,
            }}
          />

          {/* Floating card — slides up from bottom */}
          <motion.div
            key="bonusCard"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              left: 0, right: 0, bottom: 0,
              zIndex: 400,
              background: t.card,
              borderRadius: '28px 28px 0 0',
              boxShadow: '0 -8px 48px rgba(15,43,70,0.22)',
              maxHeight: '85vh',
              overflowY: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            {/* Drag handle */}
            <div style={{
              width: 36, height: 4, borderRadius: tokens.radius.full,
              background: t.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(15,43,70,0.12)',
              margin: '12px auto 0',
            }} />

            <div style={{ padding: '20px 24px 40px' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: tokens.font.h2.size, fontWeight: 700, color: t.text, margin: 0, letterSpacing: '-0.2px' }}>
                    Bonus Rewards
                  </h2>
                  <p style={{ fontSize: tokens.font.small.size, fontWeight: 450, color: t.textSub, margin: '4px 0 0' }}>
                    Complete challenges, earn credits
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={onClose}
                  style={{
                    width: 36, height: 36, borderRadius: tokens.radius.full,
                    background: t.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,43,70,0.07)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: t.textSub, flexShrink: 0,
                  }}
                >
                  <X size={16} strokeWidth={2.5} />
                </motion.button>
              </div>

              {/* Credit balance */}
              <div style={{
                background: `linear-gradient(135deg, ${tokens.colors.coral}, #FF4757)`,
                borderRadius: tokens.radius.hero, padding: '20px 24px', marginBottom: 20,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    Credit Balance
                  </p>
                  <p style={{ fontSize: '32px', fontWeight: 700, color: 'white', margin: 0, letterSpacing: '-0.5px' }}>
                    $15.00
                  </p>
                </div>
                <motion.button whileTap={{ scale: 0.94 }} style={{
                  padding: '9px 20px', borderRadius: tokens.radius.full,
                  background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
                  cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: 'white',
                }}>Redeem</motion.button>
              </div>

              {/* Challenge cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {BONUSES.map((b, idx) => (
                  <motion.div
                    key={b.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06, ...tokens.motion.standard }}
                    style={{
                      background: t.isDark ? 'rgba(255,255,255,0.05)' : tokens.colors.bgLight,
                      borderRadius: tokens.radius.cardLg, padding: '16px 18px',
                      border: `1px solid ${t.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,43,70,0.06)'}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: tokens.radius.card, fontSize: 20,
                        background: `linear-gradient(135deg, ${tokens.colors.mintStart}18, ${tokens.colors.mintEnd}18)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>{b.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: t.text, margin: 0 }}>{b.title}</p>
                        <p style={{ fontSize: '12px', fontWeight: 450, color: t.textSub, margin: '2px 0 0' }}>{b.desc}</p>
                      </div>
                      <span style={{
                        fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap',
                        color: b.progress === 100 ? tokens.colors.savingsGreen : tokens.colors.mintEnd,
                        background: b.progress === 100 ? `${tokens.colors.savingsGreen}15` : `${tokens.colors.mintEnd}15`,
                        padding: '3px 10px', borderRadius: tokens.radius.full,
                      }}>{b.reward}</span>
                    </div>
                    <div style={{ height: 5, borderRadius: tokens.radius.full, background: `${tokens.colors.mintStart}22`, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${b.progress}%` }}
                        transition={{ delay: 0.2 + idx * 0.06, duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                        style={{
                          height: '100%', borderRadius: tokens.radius.full,
                          background: b.progress === 100
                            ? `linear-gradient(90deg, ${tokens.colors.savingsGreen}, #16A34A)`
                            : `linear-gradient(90deg, ${tokens.colors.mintStart}, ${tokens.colors.mintEnd})`,
                        }}
                      />
                    </div>
                    <p style={{ fontSize: '11px', fontWeight: 450, color: t.textSub, margin: '5px 0 0', textAlign: 'right' }}>
                      {b.progress}%
                    </p>
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

// ── ZIP INPUT with mint focus glow ───────────────────────────
function ZipInput({ t }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '13px 18px',
      borderRadius: tokens.radius.card,
      background: t.card,
      boxShadow: focused
        ? `0 0 0 2px ${tokens.colors.mintStart}, 0 0 16px ${tokens.colors.mintStart}40`
        : t.shadow1,
      border: `1.5px solid ${focused ? tokens.colors.mintStart : t.border}`,
      transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
      minWidth: 200,
    }}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>📍</span>
      <input
        placeholder="Enter ZIP Code"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1, border: 'none', outline: 'none',
          background: 'transparent',
          fontSize: '15px', fontWeight: 450,
          color: t.text, fontFamily: 'inherit',
        }}
      />
    </div>
  )
}

// ── PARALLAX HERO — mobile-optimised ─────────────────────────
// Uses RAF + passive scroll listener instead of framer useScroll+useTransform
// to avoid layout thrashing on iOS Safari. will-change: transform isolates
// the composited layer so GPU handles it without main-thread involvement.
function ParallaxHero({ t, onBonusOpen }) {
  const titleRef    = useRef(null)
  const subtitleRef = useRef(null)
  const ticking     = useRef(false)

  const onScroll = useCallback(() => {
    if (ticking.current) return
    ticking.current = true
    requestAnimationFrame(() => {
      const y = window.scrollY
      if (titleRef.current) {
        titleRef.current.style.transform = `translateY(${-y * 0.10}px)`
      }
      if (subtitleRef.current) {
        subtitleRef.current.style.transform = `translateY(${-y * 0.05}px)`
      }
      ticking.current = false
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  return (
    <section style={{
      padding: '40px 24px 40px',
      maxWidth: 640,
      margin: '0 auto',
      textAlign: 'center',
      position: 'relative',
    }}>
      {/* Trust badges — above headline */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, ...tokens.motion.standard }}
        style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}
      >
        {[
          { dot: tokens.colors.mintEnd,  label: '3 stores compared' },
          { dot: tokens.colors.lemon,    label: '27% avg savings'   },
          { dot: tokens.colors.coral,    label: 'Real-time prices'  },
        ].map(({ dot, label }) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: '12px', color: t.textSub, fontWeight: 450, letterSpacing: '0.1px',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, display: 'inline-block', flexShrink: 0 }} />
            {label}
          </div>
        ))}
      </motion.div>

      {/* Headline — will-change isolates GPU layer, no Framer motion values */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, ...tokens.motion.slow }}
      >
        <h1
          ref={titleRef}
          style={{
            fontSize: 'clamp(44px, 10vw, 64px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: t.text,
            margin: 0,
            willChange: 'transform',  // compositor hint
          }}
        >
          Spend Smarter.{' '}
          <span style={{ display: 'inline-block', position: 'relative', whiteSpace: 'nowrap' }}>
            Live Fresher.
            {/* Underline reveal */}
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute', left: 0, bottom: -6,
                height: 3, width: '100%',
                background: mintGradient,
                borderRadius: tokens.radius.full,
                transformOrigin: 'left',
                display: 'block',
              }}
            />
            {/* Glow sweep */}
            <motion.span
              initial={{ x: '-120%' }}
              animate={{ x: '120%' }}
              transition={{ delay: 1.4, duration: 4, ease: 'linear', repeat: Infinity, repeatDelay: 3 }}
              style={{
                position: 'absolute', bottom: -6, left: 0,
                height: 3, width: '33%',
                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.85), transparent)',
                filter: 'blur(2px)', display: 'block',
              }}
            />
          </span>
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        ref={subtitleRef}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, ...tokens.motion.slow }}
        style={{
          marginTop: 20,
          fontSize: '18px', lineHeight: 1.6,
          color: t.textSub, fontWeight: 450,
          maxWidth: 420, marginLeft: 'auto', marginRight: 'auto',
          willChange: 'transform',
        }}
      >
        Compare nearby stores. Discover the Big 3 deals. Shop with confidence.
      </motion.p>

      {/* ZIP + CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, ...tokens.motion.slow }}
        style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 28, flexWrap: 'wrap' }}
      >
        <ZipInput t={t} />
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={tokens.motion.fast}
          style={{
            padding: '13px 28px', borderRadius: tokens.radius.card,
            border: 'none', background: mintGradient, cursor: 'pointer',
            fontSize: '15px', fontWeight: 700,
            color: tokens.colors.navy, letterSpacing: '-0.1px',
          }}
        >
          Compare Prices
        </motion.button>
      </motion.div>

      {/* Bonus teaser pill — tappable */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.65, ...tokens.motion.slow }}
        style={{ marginTop: 20 }}
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          transition={tokens.motion.fast}
          onClick={onBonusOpen}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '9px 18px', borderRadius: tokens.radius.full,
            background: `linear-gradient(135deg, ${tokens.colors.coral}18, ${tokens.colors.lemon}14)`,
            border: `1px solid ${tokens.colors.coral}30`,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          <span style={{ fontSize: 14 }}>🎁</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: tokens.colors.coral }}>
            $15 in rewards waiting
          </span>
          <span style={{ fontSize: '12px', fontWeight: 450, color: t.textSub }}>→ View</span>
        </motion.button>
      </motion.div>
    </section>
  )
}

// ── HOME SCREEN ────────────────────────────────────────────────
export function HomeScreen({ t }) {
  const [selected, setSelected]   = useState(null)
  const [bonusOpen, setBonusOpen] = useState(false)

  return (
    <>
      <motion.div
        key="home"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={tokens.motion.standard}
      >
        {/* HERO */}
        <ParallaxHero t={t} onBonusOpen={() => setBonusOpen(true)} />

        {/* Top 10 Essentials */}
        <section style={{ padding: '8px 0 0' }}>
          <div style={{
            padding: '0 24px 12px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <h2 style={{ fontSize: tokens.font.section.size, fontWeight: 600, margin: 0, color: t.text }}>
              Top Essentials
            </h2>
            <span style={{ fontSize: tokens.font.micro.size, color: tokens.colors.mintEnd, fontWeight: 600, cursor: 'pointer' }}>
              See all
            </span>
          </div>
          <div style={{
            display: 'flex', gap: 12, overflowX: 'auto',
            padding: '4px 24px 8px',
            scrollbarWidth: 'none', msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}>
            {TOP_10.map((item) => (
              <ProductTile
                key={item.name} item={item} t={t}
                active={selected === item.name}
                onTap={() => setSelected(selected === item.name ? null : item.name)}
              />
            ))}
          </div>
        </section>

        {/* Savings Banner */}
        <section style={{ padding: '24px 24px 0' }}>
          <SavingsBanner />
        </section>

        {/* Store Comparisons */}
        <section style={{ padding: '32px 24px 0' }}>
          <h2 style={{ fontSize: tokens.font.section.size, fontWeight: 600, margin: '0 0 16px', color: t.text }}>
            Stores Nearby
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {STORES.map((store) => (
              <StoreCard key={store.name} store={store} t={t} />
            ))}
          </div>
        </section>
      </motion.div>

      {/* Bonus floating modal — rendered outside the scrollable div */}
      <BonusModal open={bonusOpen} onClose={() => setBonusOpen(false)} t={t} />
    </>
  )
}
