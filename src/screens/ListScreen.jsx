import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { tokens, mintGradient } from '../tokens'
import { MY_LIST } from '../data'
import { ItemCard } from '../components/ItemCard'

export function ListScreen({ t }) {
  const [items, setItems] = useState(MY_LIST)

  return (
    <motion.div
      key="list"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={tokens.motion.standard}
      style={{ padding: '32px 24px 0' }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: tokens.font.h1.size,
              fontWeight: tokens.font.h1.weight,
              letterSpacing: tokens.font.h1.letterSpacing,
              margin: 0,
              color: t.text,
            }}
          >
            My List
          </h1>
          <p style={{ fontSize: tokens.font.small.size, color: t.textSub, margin: '4px 0 0' }}>
            {items.length} items · Est. $58.17
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          transition={tokens.motion.fast}
          style={{
            width: 44,
            height: 44,
            borderRadius: tokens.radius.full,
            background: mintGradient,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: t.shadow2,
          }}
        >
          <Plus size={20} color="white" strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Item list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <AnimatePresence>
          {items.map((item) => (
            <ItemCard
              key={item.name}
              item={item}
              t={t}
              onRemove={() => setItems(items.filter((i) => i.name !== item.name))}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={tokens.motion.standard}
          style={{ textAlign: 'center', padding: '64px 0' }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
          <p style={{ fontSize: tokens.font.body.size, color: t.textSub }}>
            Your list is empty
          </p>
          <p style={{ fontSize: tokens.font.small.size, color: t.textSub, marginTop: 4 }}>
            Add items to compare prices
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
