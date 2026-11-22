import { GAME_CONFIG, SCREEN_TITLE, SCREEN_PLAY, SCREEN_WIN, SCREEN_LOSE } from './config.js';
import { createRandom, generateDeck, shuffleDeck } from './deck.js';
import { computeAIMove } from './ai.js';

export class World {
  constructor(seed = 1) {
    this.seed = seed;
    this.rng = createRandom(seed);
    this.reset();
  }

  reset() {
    this.screen = SCREEN_TITLE;
    this.playerLife = GAME_CONFIG.maxLife;
    this.aiLife = GAME_CONFIG.maxLife;
    this.playerEmber = 3;
    this.aiEmber = 3;
    this.playerMaxEmber = 3;
    this.aiMaxEmber = 3;
    this.playerShield = 0;
    this.aiShield = 0;
    this.playerGuard = 0;
    this.aiGuard = 0;
    this.wins = 0;
    this.losses = 0;
    this.turn = 'player'; // 'player' | 'ai'

    this.playerDeck = shuffleDeck(generateDeck(this.rng), this.rng);
    this.aiDeck = shuffleDeck(generateDeck(this.rng), this.rng);
    this.playerDiscard = [];
    this.aiDiscard = [];

    this.playerHand = [];
    this.aiHand = [];

    // Draw initial hands
    for (let i = 0; i < GAME_CONFIG.startCards; i++) {
      this.drawPlayerCard();
      this.drawAICard();
    }

    this.selectedCardIndex = null;
    this.message = 'Welcome to Ember Duel! Click to start.';
    this.animations = [];
  }

  drawPlayerCard() {
    if (this.playerDeck.length === 0) {
      this.playerDeck = shuffleDeck([...this.playerDiscard], this.rng);
      this.playerDiscard = [];
    }
    if (this.playerDeck.length > 0 && this.playerHand.length < GAME_CONFIG.maxHandSize) {
      this.playerHand.push(this.playerDeck.pop());
    }
  }

  drawAICard() {
    if (this.aiDeck.length === 0) {
      this.aiDeck = shuffleDeck([...this.aiDiscard], this.rng);
      this.aiDiscard = [];
    }
    if (this.aiDeck.length > 0 && this.aiHand.length < GAME_CONFIG.maxHandSize) {
      this.aiHand.push(this.aiDeck.pop());
    }
  }

  startBattle() {
    this.screen = SCREEN_PLAY;
    this.message = 'Your turn! Choose a card to play.';
  }

  playPlayerCard(index, target) {
    if (this.turn !== 'player' || this.screen !== SCREEN_PLAY) return false;
    if (index < 0 || index >= this.playerHand.length) return false;
    const card = this.playerHand[index];
    if (card.cost > this.playerEmber) {
      this.message = 'Not enough ember for this card!';
      return false;
    }

    this.playerEmber -= card.cost;
    this.playerHand.splice(index, 1);
    this.playerDiscard.push(card);
    this.selectedCardIndex = null;

    // Resolve effect / attack
    if (card.effect === 'guard') {
      this.playerShield += card.attack;
      this.message = `You played ${card.name}, gaining ${card.attack} shield!`;
    } else if (card.effect === 'heal') {
      this.playerLife = Math.min(GAME_CONFIG.maxLife, this.playerLife + card.attack);
      this.message = `You played ${card.name}, healing ${card.attack} life!`;
    } else if (card.effect === 'draw') {
      this.drawPlayerCard();
      this.dealDamageToAI(card.attack);
      this.message = `You played ${card.name} for ${card.attack} damage and drew a card!`;
    } else {
      this.dealDamageToAI(card.attack);
      this.message = `You played ${card.name} dealing ${card.attack} damage!`;
    }

    if (this.aiLife <= 0) {
      this.aiLife = 0;
      this.wins++;
      this.screen = SCREEN_WIN;
      this.message = 'Victory! You defeated the opponent.';
    }
    return true;
  }

  dealDamageToAI(amount) {
    let effectiveDamage = amount;
    if (this.aiShield > 0) {
      if (this.aiShield >= effectiveDamage) {
        this.aiShield -= effectiveDamage;
        effectiveDamage = 0;
      } else {
        effectiveDamage -= this.aiShield;
        this.aiShield = 0;
      }
    }
    this.aiLife = Math.max(0, this.aiLife - effectiveDamage);
  }

  dealDamageToPlayer(amount) {
    let effectiveDamage = amount;
    if (this.playerShield > 0) {
      if (this.playerShield >= effectiveDamage) {
        this.playerShield -= effectiveDamage;
        effectiveDamage = 0;
      } else {
        effectiveDamage -= this.playerShield;
        this.playerShield = 0;
      }
    }
    this.playerLife = Math.max(0, this.playerLife - effectiveDamage);
  }

  endPlayerTurn() {
    if (this.turn !== 'player' || this.screen !== SCREEN_PLAY) return;
    this.turn = 'ai';
    this.message = 'Opponent is thinking...';

    // AI turn logic after short delay or instantly for shots
    setTimeout(() => {
      this.runAITurn();
    }, 400);
  }

  runAITurn() {
    if (this.screen !== SCREEN_PLAY) return;
    this.aiMaxEmber = Math.min(GAME_CONFIG.maxEmber, this.aiMaxEmber + 1);
    this.aiEmber = this.aiMaxEmber;
    this.drawAICard();

    const moves = computeAIMove(this);
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const card = move.card;
      // Remove from AI hand
      const handIdx = this.aiHand.findIndex(c => c.id === card.id);
      if (handIdx !== -1) {
        this.aiHand.splice(handIdx, 1);
        this.aiDiscard.push(card);
        this.aiEmber -= card.cost;

        if (card.effect === 'guard') {
          this.aiShield += card.attack;
        } else if (card.effect === 'heal') {
          this.aiLife = Math.min(GAME_CONFIG.maxLife, this.aiLife + card.attack);
        } else if (card.effect === 'draw') {
          this.drawAICard();
          this.dealDamageToPlayer(card.attack);
        } else {
          this.dealDamageToPlayer(card.attack);
        }
      }
    }

    if (this.playerLife <= 0) {
      this.playerLife = 0;
      this.losses++;
      this.screen = SCREEN_LOSE;
      this.message = 'Defeat! The opponent bested you.';
      return;
    }

    // Back to player turn
    this.turn = 'player';
    this.playerMaxEmber = Math.min(GAME_CONFIG.maxEmber, this.playerMaxEmber + 1);
    this.playerEmber = this.playerMaxEmber;
    this.drawPlayerCard();
    this.message = 'Your turn! Choose a card to play.';
  }
}
