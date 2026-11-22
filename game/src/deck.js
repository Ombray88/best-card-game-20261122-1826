import { CARD_TYPES } from './config.js';

export function createRandom(seed = 1) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateDeck(rng) {
  const deck = [];
  // Build a deck of 20 cards
  for (let i = 0; i < 20; i++) {
    const templateIndex = Math.floor(rng() * CARD_TYPES.length);
    const template = CARD_TYPES[templateIndex];
    deck.push({
      id: 'card_' + i + '_' + Math.floor(rng() * 10000),
      name: template.name,
      element: template.element,
      cost: template.cost,
      attack: template.attack,
      effect: template.effect
    });
  }
  return deck;
}

export function shuffleDeck(deck, rng) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  return deck;
}
