import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ShoppingCart, User, MapPin, ChevronDown, Sparkles, TrendingDown, Zap, Plus, X, Star } from "lucide-react";

// ─── DESIGN TOKENS ───────────────────────────────────────────
const tokens = {
  colors: {
    mintStart: "#7BE8C8", mintEnd: "#5ED6C3", navy: "#0F2B46",
    bgLight: "#F5F7F8", bgDark: "#0E1F2A", cardDark: "#132C3A",
    textPrimary: "#1B2A34", textSecondary: "#6B7C86",
    savingsGreen: "#22C55E", coral: "#FF6B6B", lemon: "#F4D35E",
  },
  radius: { sm: "12px", card: "24px", cardLg: "28px", hero: "32px", full: "9999px" },
  // Cubic ease ONLY — no springs
  motion: {
    fast:     { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
    standard: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
    slow:     { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  },
};

const getTheme = (dark) => ({
  bg:      dark ? tokens.colors.bgDark    : tokens.colors.bgLight,
  card:    dark ? tokens.colors.cardDark  : "#FFFFFF",
  glass:   dark ? "rgba(14,31,42,0.88)"   : "rgba(245,247,248,0.88)",
  text:    dark ? "rgba(255,255,255,0.92)": tokens.colors.textPrimary,
  textSub: dark ? "rgba(255,255,255,0.48)": tokens.colors.textSecondary,
  border:  dark ? "rgba(255,255,255,0.07)": "rgba(15,43,70,0.08)",
  shadow1: dark ? "0 2px 16px rgba(0,0,0,0.28)" : "0 2px 16px rgba(15,43,70,0.06)",
  shadow2: dark ? "0 8px 32px rgba(0,0,0,0.42)" : "0 8px 32px rgba(15,43,70,0.10)",
});

// ─── MOCK DATA ────────────────────────────────────────────────
const TOP_10 = [
  { name: "Milk", emoji: "🥛" }, { name: "Eggs", emoji: "🥚" },
  { name: "Bread", emoji: "🍞" }, { name: "Rice", emoji: "🍚" },
  { name: "Chicken", emoji: "🍗" }, { name: "Apples", emoji: "🍎" },
  { name: "Bananas", emoji: "🍌" }, { name: "Cheese", emoji: "🧀" },
  { name: "Tomatoes", emoji: "🍅" }, { name: "Pasta", emoji: "🍝" },
];

const MY_LIST = [
  { name: "Atlantic Salmon", detail: "Wild-caught, per lb", price: "$12.99", emoji: "🐟" },
  { name: "Hass Avocado", detail: "Organic, each", price: "$1.49", emoji: "🥑" },
  { name: "Greek Yogurt", detail: "Plain, 32oz", price: "$5.99", emoji: "🫙" },
  { name: "Baby Spinach", detail: "Pre-washed, 5oz", price: "$3.49", emoji: "🥬" },
  { name: "Ribeye Steak", detail: "USDA Choice, per lb", price: "$18.99", emoji: "🥩" },
  { name: "Blueberries", detail: "Fresh, 6oz pint", price: "$4.29", emoji: "🫐" },
];

const STORES = [
  {
    name: "Whole Foods", logo: "🏪", total: "$67.42", savings: "$12.80",
    distance: "0.4 mi", address: "1440 P St NW",
    badge: "Best Overall", badgeColor: tokens.colors.mintStart,
    deals: ["Salmon 20% off today", "Organic produce 2-for-1", "Member pricing active"],
    tip: "Shop before noon to catch restocked organic produce. Highest quality basket today.",
  },
  {
    name: "Trader Joe's", logo: "🛒", total: "$58.17", savings: "$22.05",
    distance: "1.2 mi", address: "1101 25th St NW",
    badge: "Best Price", badgeColor: tokens.colors.savingsGreen,
    deals: ["Blueberries $2.99", "Avocado 4-pack $3.49", "Free-range eggs deal"],
    tip: "Lowest basket total today by 27%. Pack your own bags for a smoother checkout.",
  },
  {
    name: "Giant Food", logo: "🏬", total: "$72.91", savings: "$7.31",
    distance: "0.7 mi", address: "800 6th St SW",
    badge: "Closest", badgeColor: tokens.colors.lemon,
    deals: ["Weekly circular active", "Digital coupons available", "Loyalty points 2×"],
    tip: "Convenient for top-ups. Stack digital coupons in their app before checkout.",
  },
];

// ─── PRODUCT TILE ─────────────────────────────────────────────
function ProductTile({ item, active, onTap, t }) {
  return (
    <motion.button whileTap={{ scale: 0.93 }} transition={tokens.motion.fast} onClick={onTap}
      style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8,
        minWidth:72, border:"none", background:"transparent", cursor:"pointer" }}
    >
      <div style={{
        width:64, height:64, borderRadius:tokens.radius.card,
        background: active
          ? `linear-gradient(135deg,${tokens.colors.mintStart}22,${tokens.colors.mintEnd}22)` : t.card,
        border: `2px solid ${active ? tokens.colors.mintStart : "transparent"}`,
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:28,
        boxShadow: active ? `0 0 0 4px ${tokens.colors.mintStart}22` : t.shadow1,
        transition:"all 0.2s ease",
      }}>{item.emoji}</div>
      <span style={{
        fontSize:"12px", fontWeight:500, lineHeight:1.3,
        color: active ? tokens.colors.mintEnd : t.textSub,
        transition:"color 0.2s",
      }}>{item.name}</span>
    </motion.button>
  );
}

// ─── ITEM CARD (horizontal) ───────────────────────────────────
function ItemCard({ item, t, onRemove }) {
  return (
    <motion.div layout
      initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
      exit={{ opacity:0, x:32, scale:0.95 }} transition={tokens.motion.standard}
      style={{ background:t.card, borderRadius:tokens.radius.cardLg, boxShadow:t.shadow1,
        display:"flex", alignItems:"center", padding:"16px", gap:16 }}
    >
      <div style={{
        width:56, height:56, borderRadius:tokens.radius.card, flexShrink:0,
        background:`linear-gradient(135deg,${tokens.colors.mintStart}18,${tokens.colors.mintEnd}18)`,
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:26,
      }}>{item.emoji}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:"16px", fontWeight:500, color:t.text, margin:0, lineHeight:1.3 }}>{item.name}</p>
        <p style={{ fontSize:"14px", color:t.textSub, margin:"2px 0 0" }}>{item.detail}</p>
      </div>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
        <span style={{ fontSize:"16px", fontWeight:600, color:t.text }}>{item.price}</span>
        <motion.button whileTap={{ scale:0.86 }} onClick={onRemove} style={{
          width:24, height:24, borderRadius:tokens.radius.full,
          background:`${tokens.colors.coral}18`, border:"none", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", color:tokens.colors.coral,
        }}><X size={12} strokeWidth={2.5} /></motion.button>
      </div>
    </motion.div>
  );
}

// ─── STORE CARD (with expandable AI section) ──────────────────
function StoreCard({ store, t }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div layout transition={tokens.motion.standard}
      style={{ background:t.card, borderRadius:tokens.radius.hero, boxShadow:t.shadow1, overflow:"hidden" }}
    >
      <div style={{ padding:"20px 24px" }}>
        {/* Badge + distance */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:5, padding:"4px 12px",
            borderRadius:tokens.radius.full,
            background:`${store.badgeColor}18`, border:`1px solid ${store.badgeColor}30`,
          }}>
            <Star size={10} fill={store.badgeColor} color={store.badgeColor} />
            <span style={{ fontSize:"12px", fontWeight:600, color:store.badgeColor }}>{store.badge}</span>
          </div>
          <span style={{ fontSize:"12px", color:t.textSub, fontWeight:500 }}>{store.distance} away</span>
        </div>
        {/* Logo + name + price */}
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{
            width:52, height:52, borderRadius:tokens.radius.card, flexShrink:0,
            background:`linear-gradient(135deg,${tokens.colors.mintStart}15,${tokens.colors.mintEnd}15)`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:26,
          }}>{store.logo}</div>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:"18px", fontWeight:600, color:t.text, margin:0 }}>{store.name}</p>
            <p style={{ fontSize:"12px", color:t.textSub, margin:"3px 0 0", display:"flex", alignItems:"center", gap:4 }}>
              <MapPin size={10} />{store.address}
            </p>
          </div>
          <div style={{ textAlign:"right" }}>
            <p style={{ fontSize:"22px", fontWeight:700, color:t.text, margin:0, letterSpacing:"-0.3px" }}>{store.total}</p>
            <p style={{ fontSize:"12px", color:tokens.colors.savingsGreen, margin:"2px 0 0", fontWeight:600 }}>
              Save {store.savings}
            </p>
          </div>
        </div>
        {/* Expand button */}
        <motion.button whileTap={{ scale:0.97 }} onClick={() => setExpanded(!expanded)} style={{
          width:"100%", marginTop:16, padding:"10px 0", borderRadius:tokens.radius.sm,
          background:`linear-gradient(135deg,${tokens.colors.mintStart}12,${tokens.colors.mintEnd}12)`,
          border:`1px solid ${tokens.colors.mintStart}25`, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          color:tokens.colors.mintEnd, fontSize:"14px", fontWeight:500,
        }}>
          <Sparkles size={13} />View Deals & AI Tip
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={tokens.motion.fast} style={{ display:"flex" }}>
            <ChevronDown size={14} />
          </motion.span>
        </motion.button>
      </div>
      {/* Expandable */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }}
            exit={{ height:0, opacity:0 }} transition={tokens.motion.standard}
            style={{ overflow:"hidden" }}
          >
            <div style={{ padding:"0 24px 24px", display:"flex", flexDirection:"column", gap:12 }}>
              {/* Mint Deals Card */}
              <div style={{
                background:`linear-gradient(135deg,${tokens.colors.mintStart},${tokens.colors.mintEnd})`,
                borderRadius:tokens.radius.cardLg, padding:"20px 24px",
              }}>
                <p style={{ fontSize:"12px", fontWeight:700, color:tokens.colors.navy, opacity:0.7,
                  margin:"0 0 12px", letterSpacing:"0.8px", textTransform:"uppercase" }}>Top 3 Deals</p>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {store.deals.map((deal, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{
                        width:22, height:22, borderRadius:tokens.radius.full,
                        background:"rgba(15,43,70,0.14)", display:"flex", alignItems:"center",
                        justifyContent:"center", fontSize:10, fontWeight:700,
                        color:tokens.colors.navy, flexShrink:0,
                      }}>{i+1}</div>
                      <span style={{ fontSize:"14px", color:"white", fontWeight:500 }}>{deal}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* AI Tip Card */}
              <div style={{
                borderRadius:tokens.radius.cardLg, padding:"20px 24px",
                background:t.bg, border:`1px solid ${tokens.colors.mintStart}25`,
                display:"flex", gap:14, alignItems:"flex-start",
              }}>
                <div style={{
                  width:36, height:36, borderRadius:tokens.radius.full, flexShrink:0,
                  background:`linear-gradient(135deg,${tokens.colors.mintStart},${tokens.colors.mintEnd})`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}><Zap size={16} color="white" /></div>
                <div>
                  <p style={{ fontSize:"12px", fontWeight:700, color:tokens.colors.mintEnd,
                    margin:"0 0 4px", textTransform:"uppercase", letterSpacing:"0.5px" }}>AI Tip</p>
                  <p style={{ fontSize:"14px", color:t.text, margin:0, lineHeight:1.55 }}>{store.tip}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── SAVINGS BANNER ───────────────────────────────────────────
function SavingsBanner() {
  return (
    <div style={{
      background:`linear-gradient(135deg,${tokens.colors.mintStart},${tokens.colors.mintEnd})`,
      borderRadius:tokens.radius.hero, padding:"28px 24px",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <p style={{ fontSize:"12px", fontWeight:700, color:tokens.colors.navy, opacity:0.65,
            margin:"0 0 8px", letterSpacing:"0.8px", textTransform:"uppercase" }}>Smart Basket · 6 Items</p>
          <p style={{ fontSize:"36px", fontWeight:700, color:"white", margin:0, letterSpacing:"-0.5px" }}>$58.17</p>
          <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.75)", margin:"6px 0 0", fontWeight:500 }}>
            at Trader Joe's · Best price today
          </p>
        </div>
        <div style={{ background:"rgba(15,43,70,0.15)", borderRadius:tokens.radius.card,
          padding:"12px 16px", backdropFilter:"blur(8px)", textAlign:"center" }}>
          <p style={{ fontSize:"12px", fontWeight:700, color:"rgba(255,255,255,0.7)",
            margin:"0 0 4px", textTransform:"uppercase", letterSpacing:"0.5px" }}>You Save</p>
          <p style={{ fontSize:"24px", fontWeight:700, color:tokens.colors.navy, margin:0, letterSpacing:"-0.3px" }}>$22.05</p>
        </div>
      </div>
      <div style={{ marginTop:20, display:"flex", gap:8 }}>
        <div style={{
          flex:1, background:"rgba(255,255,255,0.20)", borderRadius:tokens.radius.sm,
          padding:"10px 16px", display:"flex", alignItems:"center", gap:8,
        }}>
          <TrendingDown size={15} color="white" />
          <span style={{ fontSize:"12px", fontWeight:600, color:"white" }}>27% below avg. price</span>
        </div>
        <div style={{ background:"rgba(255,255,255,0.20)", borderRadius:tokens.radius.sm,
          padding:"10px 16px", display:"flex", alignItems:"center" }}>
          <span style={{ fontSize:"12px", fontWeight:600, color:"white" }}>3 stores compared</span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedItem, setSelectedItem] = useState(null);
  const [listItems, setListItems] = useState(MY_LIST);
  const t = getTheme(dark);

  const tabs = [
    { id:"home", icon:Home, label:"Home" },
    { id:"list", icon:ShoppingCart, label:"My List" },
    { id:"profile", icon:User, label:"Profile" },
  ];

  return (
    <div style={{
      minHeight:"100vh", background:t.bg,
      fontFamily:"-apple-system,'SF Pro Display','SF Pro Text','Inter',sans-serif",
      color:t.text, transition:"background 0.35s ease, color 0.35s ease",
      position:"relative", overflowX:"hidden",
    }}>
      {/* TOP BAR */}
      <motion.header
        initial={{ y:-60, opacity:0 }} animate={{ y:0, opacity:1 }}
        transition={tokens.motion.slow}
        style={{
          position:"fixed", top:0, left:0, right:0, zIndex:100,
          background:t.glass, backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
          borderBottom:`1px solid ${t.border}`, padding:"14px 24px",
          display:"flex", justifyContent:"space-between", alignItems:"center",
        }}
      >
        <div>
          <div style={{ fontSize:"18px", fontWeight:700, color:t.text, letterSpacing:"-0.3px", lineHeight:1.2 }}>PriceAI</div>
          <div style={{ fontSize:"12px", color:t.textSub, fontWeight:500, marginTop:1 }}>Gaithersburg, MD</div>
        </div>
        <motion.button whileTap={{ scale:0.94 }} onClick={() => setDark(!dark)} style={{
          padding:"8px 16px", borderRadius:tokens.radius.full, border:"none",
          background:`linear-gradient(135deg,${tokens.colors.mintStart}20,${tokens.colors.mintEnd}20)`,
          cursor:"pointer", fontSize:"12px", fontWeight:600, color:tokens.colors.mintEnd,
        }}>{dark ? "☀️ Light" : "🌙 Dark"}</motion.button>
      </motion.header>

      {/* SCROLLABLE MAIN */}
      <main style={{ paddingTop:80, paddingBottom:100 }}>
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div key="home"
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-16 }} transition={tokens.motion.standard}
            >
              {/* Hero */}
              <section style={{ padding:"32px 24px 0" }}>
                <h1 style={{ fontSize:"28px", fontWeight:600, letterSpacing:"-0.3px",
                  lineHeight:1.35, margin:"0 0 8px", color:t.text }}>
                  Best prices,<br />near you.
                </h1>
                <p style={{ fontSize:"16px", color:t.textSub, margin:"0 0 24px" }}>
                  Add items and compare stores instantly.
                </p>
                <div style={{ display:"flex", gap:12 }}>
                  <div style={{
                    flex:1, display:"flex", alignItems:"center", gap:10,
                    padding:"14px 16px", borderRadius:tokens.radius.card,
                    background:t.card, boxShadow:t.shadow1, border:`1px solid ${t.border}`,
                  }}>
                    <MapPin size={16} color={t.textSub} />
                    <input placeholder="ZIP code" style={{
                      flex:1, border:"none", outline:"none",
                      background:"transparent", fontSize:"16px",
                      color:t.text, fontFamily:"inherit",
                    }} />
                  </div>
                  <button style={{
                    padding:"14px 24px", borderRadius:tokens.radius.card, border:"none",
                    cursor:"pointer", fontSize:"16px", fontWeight:600, color:"white",
                    background:`linear-gradient(135deg,${tokens.colors.mintStart},${tokens.colors.mintEnd})`,
                    whiteSpace:"nowrap",
                  }}>Compare</button>
                </div>
              </section>

              {/* Top 10 */}
              <section style={{ padding:"32px 0 0" }}>
                <div style={{ padding:"0 24px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <h2 style={{ fontSize:"18px", fontWeight:500, margin:0, color:t.text }}>Top Essentials</h2>
                  <span style={{ fontSize:"12px", color:tokens.colors.mintEnd, fontWeight:600, cursor:"pointer" }}>See all</span>
                </div>
                <div style={{ display:"flex", gap:12, overflowX:"auto", padding:"4px 24px 8px", scrollbarWidth:"none" }}>
                  {TOP_10.map((item) => (
                    <ProductTile key={item.name} item={item} t={t}
                      active={selectedItem === item.name}
                      onTap={() => setSelectedItem(selectedItem === item.name ? null : item.name)}
                    />
                  ))}
                </div>
              </section>

              {/* Savings Banner */}
              <section style={{ padding:"32px 24px 0" }}><SavingsBanner /></section>

              {/* Store Comparisons */}
              <section style={{ padding:"32px 24px 0" }}>
                <h2 style={{ fontSize:"18px", fontWeight:500, margin:"0 0 16px", color:t.text }}>Stores Nearby</h2>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {STORES.map((store) => <StoreCard key={store.name} store={store} t={t} />)}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === "list" && (
            <motion.div key="list"
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-16 }} transition={tokens.motion.standard}
              style={{ padding:"32px 24px 0" }}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
                <div>
                  <h1 style={{ fontSize:"28px", fontWeight:600, letterSpacing:"-0.3px", margin:0, color:t.text }}>My List</h1>
                  <p style={{ fontSize:"14px", color:t.textSub, margin:"4px 0 0" }}>{listItems.length} items · Est. $58.17</p>
                </div>
                <motion.button whileTap={{ scale:0.92 }} style={{
                  width:44, height:44, borderRadius:tokens.radius.full,
                  background:`linear-gradient(135deg,${tokens.colors.mintStart},${tokens.colors.mintEnd})`,
                  border:"none", cursor:"pointer", display:"flex", alignItems:"center",
                  justifyContent:"center", boxShadow:t.shadow2,
                }}><Plus size={20} color="white" strokeWidth={2.5} /></motion.button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <AnimatePresence>
                  {listItems.map((item) => (
                    <ItemCard key={item.name} item={item} t={t}
                      onRemove={() => setListItems(listItems.filter((i) => i.name !== item.name))}
                    />
                  ))}
                </AnimatePresence>
              </div>
              {listItems.length === 0 && (
                <div style={{ textAlign:"center", padding:"64px 0" }}>
                  <div style={{ fontSize:48, marginBottom:16 }}>🛒</div>
                  <p style={{ fontSize:"16px", color:t.textSub }}>Your list is empty</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div key="profile"
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-16 }} transition={tokens.motion.standard}
              style={{ padding:"32px 24px 0" }}
            >
              <div style={{
                background:`linear-gradient(135deg,${tokens.colors.mintStart},${tokens.colors.mintEnd})`,
                borderRadius:tokens.radius.hero, padding:"28px 24px", marginBottom:24,
                display:"flex", alignItems:"center", gap:20,
              }}>
                <div style={{
                  width:64, height:64, borderRadius:tokens.radius.full,
                  background:"rgba(255,255,255,0.25)", display:"flex",
                  alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0,
                }}>👤</div>
                <div>
                  <p style={{ fontSize:"22px", fontWeight:600, color:"white", margin:0, letterSpacing:"-0.2px" }}>Alex Chen</p>
                  <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.75)", margin:"4px 0 0" }}>Saved $214 this month</p>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:24 }}>
                {[{ label:"Trips", value:"12" },{ label:"Items", value:"87" },{ label:"Saved", value:"$214" }].map((s) => (
                  <div key={s.label} style={{ background:t.card, borderRadius:tokens.radius.card, padding:16, textAlign:"center", boxShadow:t.shadow1 }}>
                    <p style={{ fontSize:"22px", fontWeight:700, color:t.text, margin:0, letterSpacing:"-0.3px" }}>{s.value}</p>
                    <p style={{ fontSize:"12px", color:t.textSub, margin:"4px 0 0" }}>{s.label}</p>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {["Notifications","Preferred Stores","Price Alerts","Privacy","Help"].map((item) => (
                  <div key={item} style={{
                    background:t.card, borderRadius:tokens.radius.card, padding:"16px 20px",
                    display:"flex", justifyContent:"space-between", alignItems:"center",
                    boxShadow:t.shadow1, cursor:"pointer",
                  }}>
                    <span style={{ fontSize:"16px", color:t.text }}>{item}</span>
                    <ChevronDown size={16} color={t.textSub} style={{ transform:"rotate(-90deg)" }} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* BOTTOM NAV */}
      <div style={{
        position:"fixed", bottom:0, left:0, right:0,
        background:t.glass, backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
        borderTop:`1px solid ${t.border}`, padding:"12px 0 20px",
        display:"flex", justifyContent:"space-around", zIndex:100,
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button key={tab.id} whileTap={{ scale:0.86 }} onClick={() => setActiveTab(tab.id)} style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:4,
              padding:"4px 24px", border:"none", background:"transparent", cursor:"pointer",
              color: isActive ? tokens.colors.mintEnd : t.textSub, transition:"color 0.2s",
            }}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span style={{ fontSize:10, fontWeight: isActive ? 600 : 400 }}>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* FLOATING AI BUTTON — 56px, mint gradient, Level 2 elevation */}
      <motion.button
        initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
        whileHover={{ scale:1.06 }} whileTap={{ scale:0.92 }}
        transition={{ ...tokens.motion.slow, delay:0.3 }}
        style={{
          position:"fixed", bottom:88, right:24, width:56, height:56,
          borderRadius:tokens.radius.full, border:"none", cursor:"pointer",
          background:`linear-gradient(135deg,${tokens.colors.mintStart},${tokens.colors.mintEnd})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow: dark
            ? `0 8px 32px ${tokens.colors.mintEnd}40`
            : `0 8px 24px ${tokens.colors.mintStart}50`,
          zIndex:200,
        }}
      >
        <Sparkles size={22} color="white" strokeWidth={2} />
      </motion.button>
    </div>
  );
}