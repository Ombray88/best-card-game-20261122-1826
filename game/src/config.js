export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_WIN = 'win';
export const SCREEN_LOSE = 'lose';

export const ELEMENTS = {
  FLAME: { name: 'Flame', color: '#ef4444', symbol: '▲', bg: '#451a03' },
  TIDE: { name: 'Tide', color: '#3b82f6', symbol: '●', bg: '#0f172a' },
  LEAF: { name: 'Leaf', color: '#10b981', symbol: '◆', bg: '#064e3b' },
  STONE: { name: 'Stone', color: '#d97706', symbol: '■', bg: '#422006' }
};

export const CARD_TYPES = [
  { name: 'Flame Slash', element: ELEMENTS.FLAME, cost: 2, attack: 5, effect: 'none' },
  { name: 'Inferno Burst', element: ELEMENTS.FLAME, cost: 4, attack: 10, effect: 'none' },
  { name: 'Tidal Wave', element: ELEMENTS.TIDE, cost: 2, attack: 4, effect: 'draw' },
  { name: 'Healing Rain', element: ELEMENTS.TIDE, cost: 3, attack: 2, effect: 'heal' },
  { name: 'Leaf Blade', element: ELEMENTS.LEAF, cost: 1, attack: 3, effect: 'none' },
  { name: 'Nature Shield', element: ELEMENTS.LEAF, cost: 2, attack: 1, effect: 'guard' },
  { name: 'Stone Crush', element: ELEMENTS.STONE, cost: 3, attack: 7, effect: 'none' },
  { name: 'Granite Wall', element: ELEMENTS.STONE, cost: 2, attack: 2, effect: 'guard' }
];

export const GAME_CONFIG = {
  maxLife: 30,
  maxEmber: 10,
  startCards: 4,
  maxHandSize: 7
};
