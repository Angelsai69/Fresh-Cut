import { tokens } from './tokens'

export const TOP_10 = [
  { name: 'Milk',     emoji: '🥛' },
  { name: 'Eggs',     emoji: '🥚' },
  { name: 'Bread',    emoji: '🍞' },
  { name: 'Rice',     emoji: '🍚' },
  { name: 'Chicken',  emoji: '🍗' },
  { name: 'Apples',   emoji: '🍎' },
  { name: 'Bananas',  emoji: '🍌' },
  { name: 'Cheese',   emoji: '🧀' },
  { name: 'Tomatoes', emoji: '🍅' },
  { name: 'Pasta',    emoji: '🍝' },
]

export const MY_LIST = [
  { name: 'Atlantic Salmon', detail: 'Wild-caught, per lb',  price: '$12.99', emoji: '🐟' },
  { name: 'Hass Avocado',    detail: 'Organic, each',        price: '$1.49',  emoji: '🥑' },
  { name: 'Greek Yogurt',    detail: 'Plain, 32oz',          price: '$5.99',  emoji: '🫙' },
  { name: 'Baby Spinach',    detail: 'Pre-washed, 5oz',      price: '$3.49',  emoji: '🥬' },
  { name: 'Ribeye Steak',    detail: 'USDA Choice, per lb',  price: '$18.99', emoji: '🥩' },
  { name: 'Blueberries',     detail: 'Fresh, 6oz pint',      price: '$4.29',  emoji: '🫐' },
]

export const STORES = [
  {
    name: 'Whole Foods',
    logo: '🏪',
    total: '$67.42',
    savings: '$12.80',
    distance: '0.4 mi',
    address: '1440 P St NW',
    badge: 'Best Overall',
    badgeColor: tokens.colors.mintStart,
    deals: [
      'Salmon 20% off today',
      'Organic produce 2-for-1',
      'Member pricing active',
    ],
    tip: 'Shop before noon to catch restocked organic produce. Highest quality basket today.',
  },
  {
    name: "Trader Joe's",
    logo: '🛒',
    total: '$58.17',
    savings: '$22.05',
    distance: '1.2 mi',
    address: '1101 25th St NW',
    badge: 'Best Price',
    badgeColor: tokens.colors.savingsGreen,
    deals: [
      'Blueberries $2.99',
      'Avocado 4-pack $3.49',
      'Free-range eggs deal',
    ],
    tip: 'Lowest basket total today by 27%. Pack your own bags for a smoother checkout.',
  },
  {
    name: 'Giant Food',
    logo: '🏬',
    total: '$72.91',
    savings: '$7.31',
    distance: '0.7 mi',
    address: '800 6th St SW',
    badge: 'Closest',
    badgeColor: tokens.colors.lemon,
    deals: [
      'Weekly circular active',
      'Digital coupons available',
      'Loyalty points 2×',
    ],
    tip: 'Convenient for top-ups. Stack digital coupons in their app before checkout.',
  },
]
