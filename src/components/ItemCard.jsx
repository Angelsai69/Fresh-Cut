import { motion } from 'framer-motion'
import { X, TrendingDown } from 'lucide-react'
import { tokens, mintGradient } from '../tokens'

export function ItemCard({ item, t, onRemove }) {
  // Map item name to emoji
  const EMOJI_MAP = {
    milk:'🥛', eggs:'🥚', bread:'🍞', chicken:'🍗', banana:'🍌',
    beef:'🥩', rice:'🍚', apple:'🍎', potato:'🥔', butter:'🧈',
    salmon:'🐟', avocado:'🥑', yogurt:'🫙', spinach:'🥬', blueberr:'🫐',
    cheese:'🧀', tomato:'🍅', pasta:'🍝', carrot:'🥕', onion:'🧅',
  }
  const emoji = Object.entries(EMOJI_MAP).find(([k]) => item.name.toLowerCase().includes(k))?.[1] || '🛒'

  return (
    <motion.div
      layout
      initial={{ opacity:0, x:-12 }}
      animate={{ opacity:1, x:0 }}
      exit={{ opacity:0, x:32, scale:0.95 }}
      transition={tokens.motion.standard}
      style={{
        background:t.card, borderRadius:tokens.radius.cardLg,
        boxShadow:t.shadow1, display:'flex', alignItems:'center',
        padding:'16px', gap:16,
      }}
    >
      <div style={{
        width:56, height:56, borderRadius:tokens.radius.card, flexShrink:0,
        background:`linear-gradient(135deg, ${tokens.colors.mintStart}18, ${tokens.colors.mintEnd}18)`,
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:26,
      }}>
        {emoji}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:tokens.font.body.size, fontWeight:450, color:t.text, margin:0, lineHeight:1.3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
          {item.name}
        </p>
        {item.detail && (
          <p style={{ fontSize:tokens.font.small.size, color:t.textSub, margin:'2px 0 0' }}>{item.detail}</p>
        )}
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
        {item.price && (
          <span style={{ fontSize:tokens.font.body.size, fontWeight:600, color:t.text }}>{item.price}</span>
        )}
        <motion.button
          whileTap={{ scale:0.86 }} onClick={onRemove}
          style={{
            width:24, height:24, borderRadius:tokens.radius.full,
            background:`${tokens.colors.coral}18`, border:'none', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', color:tokens.colors.coral,
          }}
        >
          <X size={12} strokeWidth={2.5} />
        </motion.button>
      </div>
    </motion.div>
  )
}

export function ProductTile({ item, active, onTap, t }) {
  return (
    <motion.button
      whileTap={{ scale:0.93 }} transition={tokens.motion.fast} onClick={onTap}
      style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, minWidth:72, border:'none', background:'transparent', cursor:'pointer', padding:0 }}
    >
      <div style={{
        width:64, height:64, borderRadius:tokens.radius.card,
        background: active ? `linear-gradient(135deg, ${tokens.colors.mintStart}22, ${tokens.colors.mintEnd}22)` : t.card,
        border:`2px solid ${active ? tokens.colors.mintStart : 'transparent'}`,
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:28,
        boxShadow: active ? `0 0 0 4px ${tokens.colors.mintStart}22` : t.shadow1,
        transition:'all 0.2s ease',
      }}>
        {item.emoji}
      </div>
      <span style={{
        fontSize:tokens.font.micro.size, fontWeight:tokens.font.micro.weight,
        color: active ? tokens.colors.mintEnd : t.textSub,
        lineHeight:tokens.font.micro.lineHeight, transition:'color 0.2s',
      }}>
        {item.name.split(' ')[0]}
      </span>
    </motion.button>
  )
}

export function SavingsBanner({ storeCards, itemCount }) {
  const bestCard = storeCards.find(c => c.total) || null
  const worstCard = storeCards.filter(c => c.total).slice(-1)[0] || null
  const savings = bestCard && worstCard && bestCard.id !== worstCard.id
    ? (parseFloat(worstCard.total.replace('$','')) - parseFloat(bestCard.total.replace('$',''))).toFixed(2)
    : null

  return (
    <div style={{ background:mintGradient, borderRadius:tokens.radius.hero, padding:'28px 24px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <p style={{ fontSize:tokens.font.micro.size, fontWeight:700, color:tokens.colors.navy, opacity:0.65, margin:'0 0 8px', letterSpacing:'0.8px', textTransform:'uppercase' }}>
            Smart Basket · {itemCount} Items
          </p>
          <p style={{ fontSize:'36px', fontWeight:700, color:'white', margin:0, letterSpacing:'-0.5px' }}>
            {bestCard?.total || '—'}
          </p>
          <p style={{ fontSize:tokens.font.small.size, color:'rgba(255,255,255,0.75)', margin:'6px 0 0', fontWeight:450 }}>
            {bestCard ? `at ${bestCard.name} · Best price today` : 'Compare prices to find best deal'}
          </p>
        </div>
        {savings && (
          <div style={{ background:tokens.colors.navy, borderRadius:tokens.radius.card, padding:'12px 16px', textAlign:'center', boxShadow:'0 4px 16px rgba(15,43,70,0.25)' }}>
            <p style={{ fontSize:tokens.font.micro.size, fontWeight:700, color:'rgba(255,255,255,0.6)', margin:'0 0 4px', textTransform:'uppercase', letterSpacing:'0.5px' }}>You Save</p>
            <p style={{ fontSize:'24px', fontWeight:700, color:tokens.colors.mintStart, margin:0, letterSpacing:'-0.3px' }}>${savings}</p>
          </div>
        )}
      </div>
      {storeCards.length > 0 && (
        <div style={{ marginTop:20, display:'flex', gap:8 }}>
          <div style={{ flex:1, background:tokens.colors.navy, borderRadius:tokens.radius.sm, padding:'10px 16px', display:'flex', alignItems:'center', gap:8, boxShadow:'0 2px 12px rgba(15,43,70,0.28)' }}>
            <TrendingDown size={15} color={tokens.colors.mintStart} />
            <span style={{ fontSize:tokens.font.micro.size, fontWeight:600, color:tokens.colors.mintStart }}>
              {storeCards.length} stores compared
            </span>
          </div>
          <div style={{ background:tokens.colors.navy, borderRadius:tokens.radius.sm, padding:'10px 16px', display:'flex', alignItems:'center', boxShadow:'0 2px 12px rgba(15,43,70,0.28)' }}>
            <span style={{ fontSize:tokens.font.micro.size, fontWeight:600, color:tokens.colors.mintStart }}>
              {savings ? `$${savings} potential savings` : 'Prices loaded'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
