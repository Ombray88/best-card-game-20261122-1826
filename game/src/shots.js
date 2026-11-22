import { SCREEN_TITLE, SCREEN_PLAY, SCREEN_WIN, SCREEN_LOSE } from './config.js';

export function stageShot(name, world) {
  world.reset();

  if (name === 'title') {
    world.screen = SCREEN_TITLE;
  } else if (name === 'play') {
    world.startBattle();
    // Play 1 card if possible
    if (world.playerHand.length > 0) {
      world.playPlayerCard(0, 'ai');
    }
  } else if (name === 'win') {
    world.startBattle();
    world.aiLife = 0;
    world.screen = SCREEN_WIN;
  } else if (name === 'lose') {
    world.startBattle();
    world.playerLife = 0;
    world.screen = SCREEN_LOSE;
  } else {
    world.screen = SCREEN_TITLE;
  }
}
