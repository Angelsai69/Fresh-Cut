// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
// Fresh~CUT design spec
// Apple-level precision · Clay.global playfulness · Mint × Navy palette
// Color palette inspired by JOKR: deep teal bg, mint green, warm yellow, coral

export const tokens = {
  colors: {
    // Primary
    mintStart:    '#7BE8C8',
    mintEnd:      '#5ED6C3',
    navy:         '#0F2B46',
    // Backgrounds
    bgLight:      '#F5F7F8',
    bgDark:       '#0E1F2A',
    cardDark:     '#132C3A',
    // Text
    textPrimary:  '#1B2A34',
    textSecondary:'#6B7C86',
    white:        '#FFFFFF',
    // Semantic
    savingsGreen: '#22C55E',
    coral:        '#FF6B6B',
    lemon:        '#F4D35E',
    // AI Button — distinct from mint, stands out on all backgrounds
    aiButton:     '#FF6B6B',
    aiButtonDark: '#FF8A80',
    // Shadows
    shadow:       'rgba(15,43,70,0.06)',
    shadowMd:     'rgba(15,43,70,0.10)',
    shadowLg:     'rgba(15,43,70,0.15)',
  },

  radius: {
    sm:     '12px',
    card:   '24px',
    cardLg: '28px',
    hero:   '32px',
    full:   '9999px',
  },

  spacing: {
    xs:  '4px',
    sm:  '8px',
    md:  '12px',
    lg:  '16px',
    xl:  '24px',
    '2xl': '32px',
    '3xl': '40px',
    '4xl': '48px',
  },

  font: {
    display: { size: '32px', weight: 600, letterSpacing: '-0.3px', lineHeight: 1.35 },
    h1:      { size: '28px', weight: 600, letterSpacing: '-0.3px', lineHeight: 1.35 },
    h2:      { size: '22px', weight: 500, letterSpacing: '-0.2px', lineHeight: 1.40 },
    section: { size: '18px', weight: 500, letterSpacing:  '0px',   lineHeight: 1.40 },
    body:    { size: '16px', weight: 400, letterSpacing:  '0px',   lineHeight: 1.45 },
    small:   { size: '14px', weight: 400, letterSpacing:  '0px',   lineHeight: 1.45 },
    micro:   { size: '12px', weight: 500, letterSpacing:  '0px',   lineHeight: 1.40 },
  },

  // Cubic ease-in-out ONLY — no springs, no bounce
  motion: {
    fast:     { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
    standard: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
    slow:     { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  },

  elevation: {
    // Level 0: flat (no shadow)
    0: 'none',
    // Level 1: list cards
    1: (dark) => dark
      ? '0 2px 16px rgba(0,0,0,0.28)'
      : '0 2px 16px rgba(15,43,70,0.06)',
    // Level 2: floating elements
    2: (dark) => dark
      ? '0 8px 32px rgba(0,0,0,0.42)'
      : '0 8px 32px rgba(15,43,70,0.10)',
    // Level 3: expanded sheets / modals
    3: (dark) => dark
      ? '0 16px 48px rgba(0,0,0,0.55)'
      : '0 16px 48px rgba(15,43,70,0.15)',
  },
}

// Computed theme by mode
// glass = 40% opacity frosted bars
export const getTheme = (dark) => ({
  isDark:  dark,
  bg:      dark ? tokens.colors.bgDark    : tokens.colors.bgLight,
  card:    dark ? tokens.colors.cardDark  : tokens.colors.white,
  glass:   dark ? 'rgba(14,31,42,0.40)'   : 'rgba(245,247,248,0.40)',
  text:    dark ? 'rgba(255,255,255,0.92)': tokens.colors.textPrimary,
  textSub: dark ? 'rgba(255,255,255,0.48)': tokens.colors.textSecondary,
  border:  dark ? 'rgba(255,255,255,0.07)': 'rgba(15,43,70,0.08)',
  mint:    dark ? tokens.colors.mintEnd   : tokens.colors.mintStart,
  aiBtn:   dark ? tokens.colors.aiButtonDark : tokens.colors.aiButton,
  shadow1: tokens.elevation[1](dark),
  shadow2: tokens.elevation[2](dark),
  shadow3: tokens.elevation[3](dark),
})

// Gradient helper
export const mintGradient = `linear-gradient(135deg, ${tokens.colors.mintStart}, ${tokens.colors.mintEnd})`
