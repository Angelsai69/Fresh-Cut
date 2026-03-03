import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ChevronDown, Sparkles, Zap, Star } from 'lucide-react'
import { tokens, mintGradient } from '../tokens'

export function StoreCard({ store, t }) {
  const [expanded, setExpanded] = useState(false)

  // Light mode: soft aqua wash. Dark mode: original card colour (t.card = #132C3A)
  const cardBg    = t.isDark
    ? t.card
    : 'rgba(123,232,200,0.13)'
  const cardBorder = t.isDark
    ? t.border
    : 'rgba(123,232,200,0.25)'

  return (
    <motion.div
      layout
      transition={tokens.motion.standard}
      style={{
        background: cardBg,
        borderRadius: tokens.radius.hero,
        boxShadow: t.shadow1,
        overflow: 'hidden',
        border: `1px solid ${cardBorder}`,
      }}
    >
      <div style={{ padding: '20px 24px' }}>
        {/* Header row: badge + distance */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 12px',
              borderRadius: tokens.radius.full,
              background: `${store.badgeColor}18`,
              border: `1px solid ${store.badgeColor}30`,
            }}
          >
            <Star size={10} fill={store.badgeColor} color={store.badgeColor} />
            <span
              style={{
                fontSize: tokens.font.micro.size,
                fontWeight: 600,
                color: store.badgeColor,
              }}
            >
              {store.badge}
            </span>
          </div>
          <span style={{ fontSize: tokens.font.micro.size, color: t.textSub, fontWeight: 450 }}>
            {store.distance} away
          </span>
        </div>

        {/* Logo + name + total */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: tokens.radius.card,
              flexShrink: 0,
              background: `linear-gradient(135deg, ${tokens.colors.mintStart}15, ${tokens.colors.mintEnd}15)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
            }}
          >
            {store.logo}
          </div>

          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: tokens.font.section.size,
                fontWeight: 600,
                color: t.text,
                margin: 0,
              }}
            >
              {store.name}
            </p>
            <p
              style={{
                fontSize: tokens.font.micro.size,
                color: t.textSub,
                margin: '3px 0 0',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <MapPin size={10} />
              {store.address}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <p
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: t.text,
                margin: 0,
                letterSpacing: '-0.3px',
              }}
            >
              {store.total}
            </p>
            <p
              style={{
                fontSize: tokens.font.micro.size,
                color: tokens.colors.savingsGreen,
                margin: '2px 0 0',
                fontWeight: 600,
              }}
            >
              Save {store.savings}
            </p>
          </div>
        </div>

        {/* Expand toggle */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setExpanded(!expanded)}
          style={{
            width: '100%',
            marginTop: 16,
            padding: '10px 0',
            borderRadius: tokens.radius.sm,
            background: `linear-gradient(135deg, ${tokens.colors.mintStart}12, ${tokens.colors.mintEnd}12)`,
            border: `1px solid ${tokens.colors.mintStart}25`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: tokens.colors.mintEnd,
            fontSize: tokens.font.small.size,
            fontWeight: 500,
          }}
        >
          <Sparkles size={13} />
          View Deals & AI Tip
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={tokens.motion.fast}
            style={{ display: 'flex' }}
          >
            <ChevronDown size={14} />
          </motion.span>
        </motion.button>
      </div>

      {/* ── Expandable: Mint Deals + AI Tip ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={tokens.motion.standard}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '0 24px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {/* Mint Deals Card */}
              <div
                style={{
                  background: mintGradient,
                  borderRadius: tokens.radius.cardLg,
                  padding: '20px 24px',
                }}
              >
                <p
                  style={{
                    fontSize: tokens.font.micro.size,
                    fontWeight: 700,
                    color: tokens.colors.navy,
                    opacity: 0.7,
                    margin: '0 0 12px',
                    letterSpacing: '0.8px',
                    textTransform: 'uppercase',
                  }}
                >
                  Top 3 Deals Today
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {store.deals.map((deal, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: tokens.radius.full,
                          background: 'rgba(15,43,70,0.14)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 700,
                          color: tokens.colors.navy,
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </div>
                      <span
                        style={{
                          fontSize: tokens.font.small.size,
                          color: 'white',
                          fontWeight: 450,
                        }}
                      >
                        {deal}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Tip Card — dark navy background */}
              <div
                style={{
                  borderRadius: tokens.radius.cardLg,
                  padding: '20px 24px',
                  background: tokens.colors.navy,   // deep navy as requested
                  border: 'none',
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                  boxShadow: '0 4px 20px rgba(15,43,70,0.3)',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: tokens.radius.full,
                    flexShrink: 0,
                    background: mintGradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Zap size={16} color="white" />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: tokens.font.micro.size,
                      fontWeight: 700,
                      color: tokens.colors.mintStart,
                      margin: '0 0 4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    AI Pro Tip
                  </p>
                  <p
                    style={{
                      fontSize: tokens.font.small.size,
                      color: 'rgba(255,255,255,0.82)',
                      margin: 0,
                      lineHeight: 1.55,
                    }}
                  >
                    {store.tip}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
