import { motion } from 'framer-motion'
import { tokens } from '../tokens'

export function ProductTile({ item, active, onTap, t }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      transition={tokens.motion.fast}
      onClick={onTap}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        minWidth: 72,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: tokens.radius.card,
          background: active
            ? `linear-gradient(135deg, ${tokens.colors.mintStart}22, ${tokens.colors.mintEnd}22)`
            : t.card,
          border: `2px solid ${active ? tokens.colors.mintStart : 'transparent'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          boxShadow: active ? `0 0 0 4px ${tokens.colors.mintStart}22` : t.shadow1,
          transition: 'all 0.2s ease',
        }}
      >
        {item.emoji}
      </div>
      <span
        style={{
          fontSize: tokens.font.micro.size,
          fontWeight: tokens.font.micro.weight,
          color: active ? tokens.colors.mintEnd : t.textSub,
          lineHeight: tokens.font.micro.lineHeight,
          transition: 'color 0.2s',
        }}
      >
        {item.name}
      </span>
    </motion.button>
  )
}
