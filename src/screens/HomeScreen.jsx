import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { tokens, mintGradient } from '../tokens'
import { TOP_10, STORES } from '../data'
import { ProductTile } from '../components/ProductTile'
import { StoreCard } from '../components/StoreCard'
import { SavingsBanner } from '../components/SavingsBanner'

// ── PARALLAX HERO ──────────────────────────────────────────────
function ParallaxHero({ t }) {
  const ref = useRef(null)
  const { scrollY } = useScroll()
  const titleY    = useTransform(scrollY, [0, 400], [0, -40])
  const subtitleY = useTransform(scrollY, [0, 400], [0, -20])

  return (
    <section
      ref={ref}
      style={{
        padding: '48px 24px 40px',
        maxWidth: 640,
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      {/* Main headline */}
      <motion.h1
        style={{
          y: titleY,
          fontSize: 'clamp(44px, 10vw, 64px)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          color: t.text,
          margin: 0,
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
              position: 'absolute',
              left: 0,
              bottom: -6,
              height: 3,
              width: '100%',
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
            transition={{
              delay: 1.4,
              duration: 4,
              ease: 'linear',
              repeat: Infinity,
              repeatDelay: 3,
            }}
            style={{
              position: 'absolute',
              bottom: -6,
              left: 0,
              height: 3,
              width: '33%',
              background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.85), transparent)',
              filter: 'blur(2px)',
              display: 'block',
            }}
          />
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        style={{
          y: subtitleY,
          marginTop: 28,
          fontSize: '18px',
          lineHeight: 1.6,
          color: t.textSub,
          fontWeight: 400,
          maxWidth: 420,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        Compare nearby stores. Discover the Big 3 deals. Shop with confidence.
      </motion.p>

      {/* ZIP + CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, ...tokens.motion.slow }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 10,
          marginTop: 32,
          flexWrap: 'wrap',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '13px 18px',
          borderRadius: tokens.radius.card,
          background: t.card,
          boxShadow: t.shadow1,
          border: `1px solid ${t.border}`,
          minWidth: 200,
        }}>
          <span style={{ fontSize: 16 }}>📍</span>
          <input
            placeholder="Enter ZIP Code"
            style={{
              flex: 1, border: 'none', outline: 'none',
              background: 'transparent',
              fontSize: '15px', color: t.text,
              fontFamily: 'inherit',
            }}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={tokens.motion.fast}
          style={{
            padding: '13px 28px',
            borderRadius: tokens.radius.card,
            border: 'none',
            background: mintGradient,
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: 700,
            color: tokens.colors.navy,
            letterSpacing: '-0.1px',
          }}
        >
          Compare Prices
        </motion.button>
      </motion.div>

      {/* Trust badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, ...tokens.motion.slow }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
          marginTop: 24,
          flexWrap: 'wrap',
        }}
      >
        {['3 stores compared', '27% avg savings', 'Real-time prices'].map((badge) => (
          <div key={badge} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: '12px', color: t.textSub, fontWeight: 500,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: tokens.colors.mintEnd, display: 'inline-block',
            }} />
            {badge}
          </div>
        ))}
      </motion.div>
    </section>
  )
}

// ── HOME SCREEN ────────────────────────────────────────────────
export function HomeScreen({ t }) {
  const [selected, setSelected] = useState(null)

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={tokens.motion.standard}
    >
      {/* HERO */}
      <ParallaxHero t={t} />

      {/* Top 10 Essentials */}
      <section style={{ padding: '8px 0 0' }}>
        <div style={{
          padding: '0 24px 12px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <h2 style={{ fontSize: tokens.font.section.size, fontWeight: 500, margin: 0, color: t.text }}>
            Top Essentials
          </h2>
          <span style={{ fontSize: tokens.font.micro.size, color: tokens.colors.mintEnd, fontWeight: 600, cursor: 'pointer' }}>
            See all
          </span>
        </div>
        <div style={{
          display: 'flex', gap: 12, overflowX: 'auto',
          padding: '4px 24px 8px',
          scrollbarWidth: 'none',     // Firefox
          msOverflowStyle: 'none',    // IE/Edge
          WebkitOverflowScrolling: 'touch', // iOS momentum
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
        <h2 style={{ fontSize: tokens.font.section.size, fontWeight: 500, margin: '0 0 16px', color: t.text }}>
          Stores Nearby
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {STORES.map((store) => (
            <StoreCard key={store.name} store={store} t={t} />
          ))}
        </div>
      </section>
    </motion.div>
  )
}
