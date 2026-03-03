import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ChevronDown, Sparkles, Zap, Star, Wifi, Users, Bot, Leaf } from 'lucide-react'
import { tokens, mintGradient } from '../tokens'

const SOURCE_CONFIG = {
  kroger:    { icon: Wifi,   label: '🟢 LIVE',       color: '#22C55E', bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.25)'  },
  community: { icon: Users,  label: '👥 Community',   color: '#7BE8C8', bg: 'rgba(123,232,200,0.12)', border: 'rgba(123,232,200,0.25)' },
  instacart: { icon: Leaf,   label: '🥦 Instacart',  color: '#4ade80', bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.25)'  },
  ai:        { icon: Bot,    label: '✨ AI Est.',     color: '#F4D35E', bg: 'rgba(244,211,94,0.12)', border: 'rgba(244,211,94,0.25)'  },
}

export function StoreCard({ store, t }) {
  const [expanded, setExpanded] = useState(false)
  const src = SOURCE_CONFIG[store.dataSource] || SOURCE_CONFIG.ai

  const cardBg    = t.isDark ? t.card : 'rgba(123,232,200,0.08)'
  const cardBorder = t.isDark ? t.border : 'rgba(123,232,200,0.20)'

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
        {/* Header: source badge + savings */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:5,
            padding:'4px 12px', borderRadius:tokens.radius.full,
            background: src.bg, border: `1px solid ${src.border}`,
          }}>
            <Star size={10} fill={src.color} color={src.color} />
            <span style={{ fontSize:tokens.font.micro.size, fontWeight:600, color:src.color }}>
              {src.label}
            </span>
          </div>
          {store.savings && (
            <span style={{ fontSize:tokens.font.micro.size, color:tokens.colors.savingsGreen, fontWeight:700 }}>
              Save {store.savings}
            </span>
          )}
        </div>

        {/* Logo + name + total */}
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{
            width:52, height:52, borderRadius:tokens.radius.card, flexShrink:0,
            background:`linear-gradient(135deg, ${tokens.colors.mintStart}15, ${tokens.colors.mintEnd}15)`,
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:26,
          }}>
            {store.logo}
          </div>

          <div style={{ flex:1 }}>
            <p style={{ fontSize:tokens.font.section.size, fontWeight:600, color:t.text, margin:0 }}>
              {store.name}
            </p>
            {store.address && (
              <p style={{ fontSize:tokens.font.micro.size, color:t.textSub, margin:'3px 0 0', display:'flex', alignItems:'center', gap:4 }}>
                <MapPin size={10} />{store.address.length > 40 ? store.address.slice(0,40)+'…' : store.address}
              </p>
            )}
          </div>

          {store.total && (
            <div style={{ textAlign:'right' }}>
              <p style={{ fontSize:'22px', fontWeight:700, color:t.text, margin:0, letterSpacing:'-0.3px' }}>
                {store.total}
              </p>
              <p style={{ fontSize:tokens.font.micro.size, color:t.textSub, margin:'2px 0 0', fontWeight:450 }}>
                basket total
              </p>
            </div>
          )}
        </div>

        {/* Expand toggle */}
        <motion.button
          whileTap={{ scale:0.97 }}
          onClick={() => setExpanded(!expanded)}
          style={{
            width:'100%', marginTop:16, padding:'10px 0',
            borderRadius:tokens.radius.sm,
            background:`linear-gradient(135deg, ${tokens.colors.mintStart}12, ${tokens.colors.mintEnd}12)`,
            border:`1px solid ${tokens.colors.mintStart}25`,
            cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            gap:8, color:tokens.colors.mintEnd, fontSize:tokens.font.small.size, fontWeight:500,
          }}
        >
          <Sparkles size={13} />
          View Prices & AI Tip
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={tokens.motion.fast} style={{ display:'flex' }}>
            <ChevronDown size={14} />
          </motion.span>
        </motion.button>
      </div>

      {/* Expandable: price list + AI tip */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height:0, opacity:0 }}
            animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }}
            transition={tokens.motion.standard}
            style={{ overflow:'hidden' }}
          >
            <div style={{ padding:'0 24px 24px', display:'flex', flexDirection:'column', gap:12 }}>

              {/* Price list card */}
              {store.priceData?.length > 0 && (
                <div style={{ background: mintGradient, borderRadius:tokens.radius.cardLg, padding:'20px 24px' }}>
                  <p style={{
                    fontSize:tokens.font.micro.size, fontWeight:700, color:tokens.colors.navy,
                    opacity:0.7, margin:'0 0 12px', letterSpacing:'0.8px', textTransform:'uppercase',
                  }}>
                    {store.dataSource === 'kroger' ? 'Live Prices' : store.dataSource === 'community' ? 'Community Prices' : store.dataSource === 'instacart' ? 'Instacart Prices' : 'AI Price Estimates'}
                  </p>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {store.priceData.slice(0, 6).map((p, i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{
                            width:22, height:22, borderRadius:tokens.radius.full,
                            background:'rgba(15,43,70,0.14)', display:'flex', alignItems:'center',
                            justifyContent:'center', fontSize:10, fontWeight:700, color:tokens.colors.navy, flexShrink:0,
                          }}>{i+1}</div>
                          <span style={{ fontSize:tokens.font.small.size, color:'white', fontWeight:450 }}>
                            {p.item?.length > 28 ? p.item.slice(0,28)+'…' : p.item}
                          </span>
                        </div>
                        <div style={{ textAlign:'right', flexShrink:0 }}>
                          {p.promoPrice ? (
                            <span>
                              <span style={{ fontSize:'13px', fontWeight:700, color:'white' }}>{p.promoPrice}</span>
                              <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.6)', marginLeft:4, textDecoration:'line-through' }}>{p.price}</span>
                            </span>
                          ) : (
                            <span style={{ fontSize:'13px', fontWeight:700, color:'white' }}>{p.price || 'N/A'}</span>
                          )}
                        </div>
                      </div>
                    ))}
                    {store.priceData.length > 6 && (
                      <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.6)', margin:'4px 0 0', textAlign:'center' }}>
                        +{store.priceData.length - 6} more items
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* AI Tip */}
              {store.tip && (
                <div style={{
                  borderRadius:tokens.radius.cardLg, padding:'20px 24px',
                  background:tokens.colors.navy, display:'flex', gap:14, alignItems:'flex-start',
                  boxShadow:'0 4px 20px rgba(15,43,70,0.3)',
                }}>
                  <div style={{
                    width:36, height:36, borderRadius:tokens.radius.full, flexShrink:0,
                    background:mintGradient, display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <Zap size={16} color="white" />
                  </div>
                  <div>
                    <p style={{ fontSize:tokens.font.micro.size, fontWeight:700, color:tokens.colors.mintStart, margin:'0 0 4px', textTransform:'uppercase', letterSpacing:'0.5px' }}>
                      {store.dataSource === 'ai' ? 'AI Pro Tip' : 'About This Data'}
                    </p>
                    <p style={{ fontSize:tokens.font.small.size, color:'rgba(255,255,255,0.82)', margin:0, lineHeight:1.55 }}>
                      {store.tip}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
