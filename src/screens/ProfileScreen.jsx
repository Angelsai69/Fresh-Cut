import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Sun, Moon, MapPin, Plus, X, Star } from 'lucide-react'
import { tokens, mintGradient } from '../tokens'

const STATS = [
  { label: 'Trips',  value: '12' },
  { label: 'Items',  value: '87' },
  { label: 'Saved',  value: '$214' },
]

const MENU_ITEMS = ['Notifications', 'Preferred Stores', 'Price Alerts', 'Privacy', 'Help & Support']

const DEFAULT_LOCATIONS = [
  { id: 1, name: 'Home',    address: '142 Elm St, Gaithersburg MD',  emoji: '🏠', primary: true  },
  { id: 2, name: 'Work',    address: '1200 K St NW, Washington DC',  emoji: '🏢', primary: false },
  { id: 3, name: 'Mom\'s',  address: '88 Maple Ave, Rockville MD',   emoji: '👵', primary: false },
]

export function ProfileScreen({ t, dark, setDark }) {
  const [locations, setLocations] = useState(DEFAULT_LOCATIONS)
  const [addingNew, setAddingNew] = useState(false)
  const [newLabel, setNewLabel]   = useState('')
  const [newAddr, setNewAddr]     = useState('')

  const setPrimary = (id) => setLocations(locs =>
    locs.map(l => ({ ...l, primary: l.id === id }))
  )
  const removeLocation = (id) => setLocations(locs => locs.filter(l => l.id !== id))
  const addLocation = () => {
    if (!newLabel.trim()) return
    setLocations(locs => [...locs, {
      id: Date.now(), name: newLabel, address: newAddr || 'Address not set',
      emoji: '📍', primary: false,
    }])
    setNewLabel(''); setNewAddr(''); setAddingNew(false)
  }

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={tokens.motion.standard}
      style={{ padding: '32px 24px 0' }}
    >
      {/* ── Profile Banner ── */}
      <div style={{
        background: mintGradient,
        borderRadius: tokens.radius.hero,
        padding: '28px 24px',
        marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: tokens.radius.full,
          background: 'rgba(255,255,255,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, flexShrink: 0,
        }}>👤</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: tokens.font.h2.size, fontWeight: 600, color: 'white', margin: 0, letterSpacing: '-0.2px' }}>
            Alex Chen
          </p>
          <p style={{ fontSize: tokens.font.small.size, color: 'rgba(255,255,255,0.75)', margin: '4px 0 0' }}>
            Saved $214 this month
          </p>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
        {STATS.map((s) => (
          <div key={s.label} style={{
            background: t.card, borderRadius: tokens.radius.card,
            padding: 16, textAlign: 'center', boxShadow: t.shadow1,
          }}>
            <p style={{ fontSize: '22px', fontWeight: 700, color: t.text, margin: 0, letterSpacing: '-0.3px' }}>
              {s.value}
            </p>
            <p style={{ fontSize: tokens.font.micro.size, color: t.textSub, margin: '4px 0 0' }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Saved Locations ── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 12,
        }}>
          <div>
            <p style={{ fontSize: tokens.font.section.size, fontWeight: 600, color: t.text, margin: 0 }}>
              Saved Locations
            </p>
            <p style={{ fontSize: tokens.font.micro.size, color: t.textSub, margin: '2px 0 0' }}>
              Compare prices at each location
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.90 }}
            transition={tokens.motion.fast}
            onClick={() => setAddingNew(true)}
            style={{
              width: 36, height: 36,
              borderRadius: tokens.radius.full,
              background: mintGradient,
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: t.shadow2,
            }}
          >
            <Plus size={17} color="white" strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Location list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <AnimatePresence>
            {locations.map((loc) => (
              <motion.div
                key={loc.id}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24, scale: 0.95 }}
                transition={tokens.motion.standard}
                style={{
                  background: loc.primary
                    ? tokens.colors.navy
                    : t.card,
                  borderRadius: tokens.radius.cardLg,
                  padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  boxShadow: loc.primary
                    ? '0 4px 20px rgba(15,43,70,0.25)'
                    : t.shadow1,
                  border: loc.primary
                    ? 'none'
                    : `1px solid ${t.border}`,
                }}
              >
                {/* Emoji */}
                <div style={{
                  width: 42, height: 42, borderRadius: tokens.radius.card,
                  background: loc.primary
                    ? 'rgba(123,232,200,0.18)'
                    : `linear-gradient(135deg, ${tokens.colors.mintStart}18, ${tokens.colors.mintEnd}18)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                }}>
                  {loc.emoji}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <p style={{
                      fontSize: '15px', fontWeight: 600, margin: 0, lineHeight: 1.2,
                      color: loc.primary ? 'white' : t.text,
                    }}>
                      {loc.name}
                    </p>
                    {loc.primary && (
                      <span style={{
                        fontSize: '10px', fontWeight: 700,
                        background: mintGradient,
                        color: tokens.colors.navy,
                        padding: '2px 8px',
                        borderRadius: tokens.radius.full,
                        letterSpacing: '0.3px',
                      }}>
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <p style={{
                    fontSize: '12px', margin: '3px 0 0',
                    color: loc.primary ? 'rgba(255,255,255,0.60)' : t.textSub,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    <MapPin size={10} style={{ display: 'inline', marginRight: 3 }} />
                    {loc.address}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {!loc.primary && (
                    <motion.button
                      whileTap={{ scale: 0.86 }}
                      onClick={() => setPrimary(loc.id)}
                      title="Set as primary"
                      style={{
                        width: 28, height: 28, borderRadius: tokens.radius.full,
                        background: `${tokens.colors.mintStart}20`,
                        border: `1px solid ${tokens.colors.mintStart}40`,
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: tokens.colors.mintEnd,
                      }}
                    >
                      <Star size={13} strokeWidth={2} />
                    </motion.button>
                  )}
                  {!loc.primary && (
                    <motion.button
                      whileTap={{ scale: 0.86 }}
                      onClick={() => removeLocation(loc.id)}
                      style={{
                        width: 28, height: 28, borderRadius: tokens.radius.full,
                        background: `${tokens.colors.coral}15`,
                        border: `1px solid ${tokens.colors.coral}30`,
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: tokens.colors.coral,
                      }}
                    >
                      <X size={13} strokeWidth={2.5} />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add new location form */}
        <AnimatePresence>
          {addingNew && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={tokens.motion.standard}
              style={{ overflow: 'hidden', marginTop: 10 }}
            >
              <div style={{
                background: t.card, borderRadius: tokens.radius.cardLg,
                padding: '16px', boxShadow: t.shadow1,
                border: `1px solid ${tokens.colors.mintStart}30`,
              }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: t.text, margin: '0 0 12px' }}>
                  Add New Location
                </p>
                <input
                  placeholder="Label (e.g. Gym, School)"
                  value={newLabel}
                  onChange={e => setNewLabel(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px',
                    borderRadius: tokens.radius.sm,
                    border: `1px solid ${t.border}`,
                    background: t.bg, color: t.text,
                    fontSize: '14px', fontFamily: 'inherit',
                    outline: 'none', marginBottom: 8, boxSizing: 'border-box',
                  }}
                />
                <input
                  placeholder="Address or ZIP code"
                  value={newAddr}
                  onChange={e => setNewAddr(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px',
                    borderRadius: tokens.radius.sm,
                    border: `1px solid ${t.border}`,
                    background: t.bg, color: t.text,
                    fontSize: '14px', fontFamily: 'inherit',
                    outline: 'none', marginBottom: 12, boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={addLocation}
                    style={{
                      flex: 1, padding: '10px',
                      borderRadius: tokens.radius.sm,
                      background: mintGradient, border: 'none',
                      cursor: 'pointer', fontSize: '13px',
                      fontWeight: 700, color: tokens.colors.navy,
                    }}
                  >
                    Save Location
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAddingNew(false)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: tokens.radius.sm,
                      background: 'transparent',
                      border: `1px solid ${t.border}`,
                      cursor: 'pointer', fontSize: '13px',
                      fontWeight: 600, color: t.textSub,
                    }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Appearance toggle ── */}
      <div style={{
        background: t.card, borderRadius: tokens.radius.card,
        padding: '16px 20px', marginBottom: 8, boxShadow: t.shadow1,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <p style={{ fontSize: tokens.font.body.size, color: t.text, margin: 0, fontWeight: 500 }}>Appearance</p>
          <p style={{ fontSize: tokens.font.micro.size, color: t.textSub, margin: '2px 0 0' }}>
            {dark ? 'Dark mode' : 'Light mode'}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setDark(!dark)}
          style={{
            width: 56, height: 30, borderRadius: tokens.radius.full,
            background: dark
              ? mintGradient
              : 'rgba(15,43,70,0.12)',
            border: 'none', cursor: 'pointer', position: 'relative',
            transition: 'background 0.3s ease',
            display: 'flex', alignItems: 'center', padding: '0 3px',
            justifyContent: dark ? 'flex-end' : 'flex-start',
          }}
        >
          <motion.div layout transition={tokens.motion.standard} style={{
            width: 24, height: 24, borderRadius: tokens.radius.full,
            background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {dark
              ? <Moon size={12} color={tokens.colors.mintEnd} strokeWidth={2} />
              : <Sun size={12} color={tokens.colors.textSecondary} strokeWidth={2} />
            }
          </motion.div>
        </motion.button>
      </div>

      {/* ── Menu items ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {MENU_ITEMS.map((item) => (
          <motion.div key={item} whileTap={{ scale: 0.985 }} transition={tokens.motion.fast} style={{
            background: t.card, borderRadius: tokens.radius.card, padding: '16px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: t.shadow1, cursor: 'pointer',
          }}>
            <span style={{ fontSize: tokens.font.body.size, color: t.text }}>{item}</span>
            <ChevronDown size={16} color={t.textSub} style={{ transform: 'rotate(-90deg)' }} />
          </motion.div>
        ))}
      </div>

      {/* ── Sign out ── */}
      <motion.button whileTap={{ scale: 0.97 }} transition={tokens.motion.fast} style={{
        width: '100%', marginTop: 16, padding: '14px',
        borderRadius: tokens.radius.card,
        border: `1.5px solid ${tokens.colors.coral}40`,
        background: `${tokens.colors.coral}08`,
        cursor: 'pointer', fontSize: tokens.font.body.size,
        fontWeight: 600, color: tokens.colors.coral,
      }}>
        Sign Out
      </motion.button>
    </motion.div>
  )
}
