import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, RefreshCw } from 'lucide-react'
import { tokens, mintGradient } from '../tokens'
import { ItemCard } from '../components/ItemCard'

export function ListScreen({ t, items, addItem, removeItem, resetItems }) {
  const [newItemText, setNewItemText] = useState('')

  const handleAdd = () => {
    if (newItemText.trim()) {
      addItem(newItemText.trim())
      setNewItemText('')
    }
  }

  return (
    <motion.div
      key="list"
      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }}
      transition={tokens.motion.standard}
      style={{ padding:'32px 24px 0' }}
    >
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:tokens.font.h1.size, fontWeight:tokens.font.h1.weight, letterSpacing:tokens.font.h1.letterSpacing, margin:0, color:t.text }}>
            My List
          </h1>
          <p style={{ fontSize:tokens.font.small.size, color:t.textSub, margin:'4px 0 0' }}>
            {items.length} items · tap Compare to find best prices
          </p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {/* Reset */}
          <motion.button whileTap={{ scale:0.9 }} onClick={resetItems}
            style={{ width:40, height:40, borderRadius:tokens.radius.full, background:t.isDark?'rgba(255,255,255,0.06)':'rgba(15,43,70,0.06)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:t.textSub }}>
            <RefreshCw size={16} strokeWidth={2} />
          </motion.button>
          {/* Add */}
          <motion.button whileTap={{ scale:0.92 }} onClick={handleAdd}
            style={{ width:44, height:44, borderRadius:tokens.radius.full, background:mintGradient, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:t.shadow2 }}>
            <Plus size={20} color="white" strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>

      {/* Add input */}
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <input
          value={newItemText}
          onChange={e => setNewItemText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add item (e.g. Organic Oat Milk)"
          style={{
            flex:1, padding:'12px 16px', borderRadius:tokens.radius.card,
            border:`1.5px solid ${t.border}`, background:t.card,
            color:t.text, fontSize:'14px', fontFamily:'inherit', outline:'none',
            boxSizing:'border-box',
          }}
        />
      </div>

      {/* Items */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <AnimatePresence>
          {items.map(name => (
            <ItemCard
              key={name}
              item={{ name }}
              t={t}
              onRemove={() => removeItem(name)}
            />
          ))}
        </AnimatePresence>
      </div>

      {items.length === 0 && (
        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={tokens.motion.standard}
          style={{ textAlign:'center', padding:'64px 0' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🛒</div>
          <p style={{ fontSize:tokens.font.body.size, color:t.textSub }}>Your list is empty</p>
          <p style={{ fontSize:tokens.font.small.size, color:t.textSub, marginTop:4 }}>Add items above to compare prices</p>
        </motion.div>
      )}
    </motion.div>
  )
}
