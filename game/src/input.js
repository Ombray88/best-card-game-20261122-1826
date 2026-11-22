import { SCREEN_TITLE, SCREEN_PLAY, SCREEN_WIN, SCREEN_LOSE } from './config.js';

export function setupInput(canvas, world) {
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;

    if (world.screen === SCREEN_TITLE) {
      // Check click in center region or let UI button handle it
    } else if (world.screen === SCREEN_PLAY && world.turn === 'player') {
      // Check player hand clicks
      const playerHand = world.playerHand;
      const pCardW = 110;
      const pCardH = 150;
      const pStartX = width / 2 - (playerHand.length * (pCardW + 12)) / 2;
      const cy = height - 300;

      for (let i = 0; i < playerHand.length; i++) {
        const cx = pStartX + i * (pCardW + 12);
        if (x >= cx && x <= cx + pCardW && y >= cy && y <= cy + pCardH) {
          if (world.selectedCardIndex === i) {
            // Play card
            world.playPlayerCard(i, 'ai');
          } else {
            world.selectedCardIndex = i;
          }
          return;
        }
      }

      // If clicked outside cards, deselect
      world.selectedCardIndex = null;
    } else if (world.screen === SCREEN_WIN || world.screen === SCREEN_LOSE) {
      // Handled by UI button
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (world.screen === SCREEN_TITLE) {
        world.startBattle();
      } else if (world.screen === SCREEN_WIN || world.screen === SCREEN_LOSE) {
        world.reset();
      } else if (world.screen === SCREEN_PLAY && world.turn === 'player' && world.selectedCardIndex !== null) {
        world.playPlayerCard(world.selectedCardIndex, 'ai');
      }
    } else if (e.key === 'Escape') {
      if (world.screen === SCREEN_PLAY) {
        // Pause or toggle title
      }
    }
  });
}
