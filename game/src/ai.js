export function computeAIMove(state) {
  // AI decision making
  const actions = [];
  let currentEmber = state.aiEmber;
  const hand = [...state.aiHand];

  // Sort hand by attack descending / cost ascending
  hand.sort((a, b) => (b.attack / (b.cost || 1)) - (a.attack / (a.cost || 1)));

  for (let i = 0; i < hand.length; i++) {
    const card = hand[i];
    if (card.cost <= currentEmber) {
      // Decide target: if player has guard and AI wants to break guard or attack player directly
      const target = state.playerGuard > 0 ? 'guard' : 'player';
      actions.push({ card, target });
      currentEmber -= card.cost;
    }
  }

  // Also if life is low and we have guard card, prioritize guard
  if (state.aiLife < 15) {
    const guardCardIndex = hand.findIndex(c => c.effect === 'guard' && c.cost <= state.aiEmber);
    if (guardCardIndex !== -1 && !actions.some(a => a.card.id === hand[guardCardIndex].id)) {
      actions.unshift({ card: hand[guardCardIndex], target: 'self' });
    }
  }

  return actions;
}
