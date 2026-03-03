# PriceAI – Smart Grocery Comparison

> Apple Wallet × Clay.global × Intelligent Grocery Companion

A pixel-perfect, production-ready React app built to the full PriceAI design system.

---

## Stack

| Layer      | Tech                        |
|------------|----------------------------|
| Framework  | React 18 + Vite 5           |
| Animation  | Framer Motion 11            |
| Icons      | Lucide React                |
| Deployment | Vercel                      |
| Fonts      | SF Pro (system) + Inter     |

---

## Project Structure

```
priceai/
├── index.html              # Entry HTML (meta, font preload, base styles)
├── vite.config.js          # Vite + React plugin
├── vercel.json             # Vercel config (SPA rewrites)
├── package.json
└── src/
    ├── main.jsx            # React DOM root
    ├── App.jsx             # Shell: nav, dark mode, floating AI button
    ├── tokens.js           # Full design token system + getTheme()
    ├── data.js             # Mock data (TOP_10, MY_LIST, STORES)
    ├── components/
    │   ├── ProductTile.jsx  # 64px emoji tile, mint active border
    │   ├── ItemCard.jsx     # Horizontal card, swipe-to-remove
    │   ├── StoreCard.jsx    # Expandable: Mint Deals + AI Tip
    │   └── SavingsBanner.jsx # Full-width mint gradient value prop card
    └── screens/
        ├── HomeScreen.jsx   # ZIP input → Top 10 → Savings → Stores
        ├── ListScreen.jsx   # My List with add/remove
        └── ProfileScreen.jsx # Profile banner, stats, settings
```

---

## Deploy to Vercel

### Option A — Vercel CLI (fastest)
```bash
npm install
npx vercel --prod
```

### Option B — GitHub + Vercel Dashboard
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import the repo
4. Vercel auto-detects Vite — click **Deploy**

### Option C — Drag & Drop
1. Run `npm run build` locally
2. Drag the `dist/` folder to [vercel.com/new](https://vercel.com/new)

---

## Local Development
```bash
npm install
npm run dev
# → http://localhost:5173
```

---

## Design System Highlights

### Colors
- **Mint Gradient:** `#7BE8C8 → #5ED6C3`
- **Navy Accent:** `#0F2B46`
- **Dark Base:** `#0E1F2A` / Cards: `#132C3A`

### Motion
- Cubic ease-in-out only: `[0.4, 0, 0.2, 1]`
- Fast: 150ms · Standard: 250ms · Slow: 350ms
- No springs, no bounce

### Elevation
- Level 1 (cards): soft 6% opacity shadow
- Level 2 (floating): 10% opacity, 32px blur
- Level 3 (sheets): 15% opacity, 48px blur

---

## Customization

All design tokens live in `src/tokens.js`. Change colors, radii, spacing, and motion curves in one place — the entire UI updates automatically.
