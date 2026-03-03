import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { tokens } from '../tokens'

export function ItemCard({ item, t, onRemove }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 32, scale: 0.95 }}
      transition={tokens.motion.standard}
      style={{
        background: t.card,
        borderRadius: tokens.radius.cardLg,
        boxShadow: t.shadow1,
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        gap: 16,
      }}
    >
      {/* Emoji avatar */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: tokens.radius.card,
          flexShrink: 0,
          background: `linear-gradient(135deg, ${tokens.colors.mintStart}18, ${tokens.colors.mintEnd}18)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 26,
        }}
      >
        {item.emoji}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: tokens.font.body.size,
            fontWeight: 500,
            color: t.text,
            margin: 0,
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.name}
        </p>
        <p
          style={{
            fontSize: tokens.font.small.size,
            color: t.textSub,
            margin: '2px 0 0',
          }}
        >
          {item.detail}
        </p>
      </div>

      {/* Price + Remove */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
        <span style={{ fontSize: tokens.font.body.size, fontWeight: 600, color: t.text }}>
          {item.price}
        </span>
        <motion.button
          whileTap={{ scale: 0.86 }}
          onClick={onRemove}
          style={{
            width: 24,
            height: 24,
            borderRadius: tokens.radius.full,
            background: `${tokens.colors.coral}18`,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: tokens.colors.coral,
          }}
        >
          <X size={12} strokeWidth={2.5} />
        </motion.button>
      </div>
    </motion.div>
  )
}
