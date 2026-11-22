import { World } from './world.js';
import { renderGame } from './render.js';
import { setupInput } from './input.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const uiLayer = document.getElementById('ui-layer');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const urlParams = new URLSearchParams(window.location.search);
const seed = parseInt(urlParams.get('seed') || '1', 10);
const shotName = urlParams.get('shot');

const world = new World(seed);

if (shotName) {
  stageShot(shotName, world);
}

setupInput(canvas, world);

function frame() {
  renderGame(ctx, canvas, world, uiLayer);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

// Signal ready for headless screenshot capture
if (shotName) {
  setTimeout(() => {
    window.__shotReady = true;
  }, 100);
} else {
  window.__shotReady = true;
}
