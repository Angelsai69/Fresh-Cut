import { TrendingDown } from 'lucide-react'
import { tokens, mintGradient } from '../tokens'

// Color palette (from design brief + JOKR inspiration):
// Price Saved pill  → deep navy  #0F2B46
// % and store count → light blue #C8F0E8 tint on navy-tinted bg
// AI Pro Tips card  → dark navy  #0F2B46

export function SavingsBanner() {
  return (
    <div style={{
      background: mintGradient,
      borderRadius: tokens.radius.hero,
      padding: '28px 24px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

        {/* Left: basket total */}
        <div>
          <p style={{
            fontSize: tokens.font.micro.size,
            fontWeight: 700,
            color: tokens.colors.navy,
            opacity: 0.65,
            margin: '0 0 8px',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
          }}>
            Smart Basket · 6 Items
          </p>
          <p style={{
            fontSize: '36px',
            fontWeight: 700,
            color: 'white',
            margin: 0,
            letterSpacing: '-0.5px',
          }}>
            $58.17
          </p>
          <p style={{
            fontSize: tokens.font.small.size,
            color: 'rgba(255,255,255,0.75)',
            margin: '6px 0 0',
            fontWeight: 450,
          }}>
            at Trader Joe's · Best price today
          </p>
        </div>

        {/* Right: savings pill — DARK NAVY background as requested */}
        <div style={{
          background: tokens.colors.navy,      // deep navy
          borderRadius: tokens.radius.card,
          padding: '12px 16px',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(15,43,70,0.25)',
        }}>
          <p style={{
            fontSize: tokens.font.micro.size,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.6)',
            margin: '0 0 4px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            You Save
          </p>
          <p style={{
            fontSize: '24px',
            fontWeight: 700,
            color: tokens.colors.mintStart,    // mint on navy = crisp
            margin: 0,
            letterSpacing: '-0.3px',
          }}>
            $22.05
          </p>
        </div>
      </div>

      {/* Stat pills — deep navy bg, mint green text */}
      <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>

        {/* Percentage pill */}
        <div style={{
          flex: 1,
          background: tokens.colors.navy,
          borderRadius: tokens.radius.sm,
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 2px 12px rgba(15,43,70,0.28)',
        }}>
          <TrendingDown size={15} color={tokens.colors.mintStart} />
          <span style={{ fontSize: tokens.font.micro.size, fontWeight: 600, color: tokens.colors.mintStart }}>
            27% below avg. price
          </span>
        </div>

        {/* Stores count pill */}
        <div style={{
          background: tokens.colors.navy,
          borderRadius: tokens.radius.sm,
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 12px rgba(15,43,70,0.28)',
        }}>
          <span style={{ fontSize: tokens.font.micro.size, fontWeight: 600, color: tokens.colors.mintStart }}>
            3 stores compared
          </span>
        </div>
      </div>
    </div>
  )
}
