import { SCREEN_TITLE, SCREEN_PLAY, SCREEN_WIN, SCREEN_LOSE } from './config.js';

export function renderGame(ctx, canvas, world, uiLayer) {
  const width = canvas.width;
  const height = canvas.height;

  // Clear background
  ctx.clearRect(0, 0, width, height);

  // Background radial gradient
  const grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height) / 1.2);
  grad.addColorStop(0, '#1e293b');
  grad.addColorStop(1, '#090d16');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Update UI Layer HTML based on screen
  updateUI(world, uiLayer);

  if (world.screen === SCREEN_TITLE) {
    renderTitleScreen(ctx, width, height, world);
  } else if (world.screen === SCREEN_PLAY) {
    renderPlayScreen(ctx, width, height, world);
  } else if (world.screen === SCREEN_WIN) {
    renderPlayScreen(ctx, width, height, world);
    renderWinScreen(ctx, width, height, world);
  } else if (world.screen === SCREEN_LOSE) {
    renderPlayScreen(ctx, width, height, world);
    renderLoseScreen(ctx, width, height, world);
  }
}

function renderTitleScreen(ctx, width, height, world) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Title glow
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 56px system-ui, sans-serif';
  ctx.fillText('EMBER DUEL', width / 2, height / 2 - 80);

  ctx.shadowBlur = 10;
  ctx.fillStyle = '#94a3b8';
  ctx.font = '22px system-ui, sans-serif';
  ctx.fillText('A mystical turn-based elemental card duel', width / 2, height / 2 - 15);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '18px system-ui, sans-serif';
  ctx.fillText('Click "Start Duel" or press Enter/Space to begin', width / 2, height / 2 + 35);

  ctx.restore();
}

function renderPlayScreen(ctx, width, height, world) {
  // Opponent Area (Top)
  ctx.save();
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(width / 2 - 200, 20, 400, 100);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.strokeRect(width / 2 - 200, 20, 400, 100);

  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Opponent (AI)', width / 2 - 180, 50);

  ctx.fillStyle = '#f1f5f9';
  ctx.font = '16px system-ui, sans-serif';
  ctx.fillText(`Life: ${world.aiLife} / 30`, width / 2 - 180, 78);
  ctx.fillText(`Ember: ${world.aiEmber} / 10`, width / 2 - 180, 102);
  if (world.aiShield > 0) {
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`Shield: ${world.aiShield}`, width / 2 - 30, 78);
  }

  // Opponent Hand (Face down)
  const aiHandCount = world.aiHand.length;
  const cardW = 90;
  const cardH = 130;
  const startX = width / 2 - (aiHandCount * (cardW + 10)) / 2;
  for (let i = 0; i < aiHandCount; i++) {
    const cx = startX + i * (cardW + 10);
    const cy = 135;
    renderCardBack(ctx, cx, cy, cardW, cardH);
  }

  // Center Battlefield / Message
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.fillRect(width / 2 - 300, height / 2 - 40, 600, 80);
  ctx.strokeStyle = '#475569';
  ctx.strokeRect(width / 2 - 300, height / 2 - 40, 600, 80);

  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(world.turn === 'player' ? 'YOUR TURN' : 'OPPONENT TURN', width / 2, height / 2 - 18);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText(world.message, width / 2, height / 2 + 10);

  // Player Area (Bottom)
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(width / 2 - 200, height - 130, 400, 100);
  ctx.strokeStyle = '#334155';
  ctx.strokeRect(width / 2 - 200, height - 130, 400, 100);

  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Player (You)', width / 2 - 180, height - 100);

  ctx.fillStyle = '#f1f5f9';
  ctx.font = '16px system-ui, sans-serif';
  ctx.fillText(`Life: ${world.playerLife} / 30`, width / 2 - 180, height - 72);
  ctx.fillText(`Ember: ${world.playerEmber} / 10`, width / 2 - 180, height - 48);
  if (world.playerShield > 0) {
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`Shield: ${world.playerShield}`, width / 2 - 30, height - 72);
  }
  ctx.fillStyle = '#fbbf24';
  ctx.fillText(`Wins: ${world.wins} | Losses: ${world.losses}`, width / 2 + 40, height - 48);

  // Player Hand (Face up)
  const playerHand = world.playerHand;
  const pCardW = 110;
  const pCardH = 150;
  const pStartX = width / 2 - (playerHand.length * (pCardW + 12)) / 2;
  for (let i = 0; i < playerHand.length; i++) {
    const card = playerHand[i];
    const cx = pStartX + i * (pCardW + 12);
    const cy = height - 300;
    const isSelected = world.selectedCardIndex === i;
    renderCardFace(ctx, cx, cy, pCardW, pCardH, card, isSelected);
  }

  ctx.restore();
}

function renderCardBack(ctx, x, y, w, h) {
  ctx.save();
  ctx.fillStyle = '#334155';
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 8);
  ctx.fill();
  ctx.stroke();

  // Pattern on back
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(x + 10, y + 10, w - 20, h - 20, 6);
  ctx.fill();

  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦', x + w / 2, y + h / 2);
  ctx.restore();
}

function renderCardFace(ctx, x, y, w, h, card, isSelected) {
  ctx.save();

  if (isSelected) {
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 15;
    y -= 15; // Lift selected card
  }

  // Card background
  ctx.fillStyle = card.element.bg;
  ctx.strokeStyle = card.element.color;
  ctx.lineWidth = isSelected ? 3 : 2;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 8);
  ctx.fill();
  ctx.stroke();

  // Element symbol and color badge
  ctx.fillStyle = card.element.color;
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(card.element.symbol, x + 10, y + 10);

  // Cost badge
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(x + w - 18, y + 18, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 14px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(card.cost, x + w - 18, y + 18);

  // Card Name
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(card.name, x + w / 2, y + 60);

  // Attack / Effect Value
  ctx.fillStyle = card.element.color;
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.fillText(card.attack, x + w / 2, y + 100);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillText(card.effect !== 'none' ? card.effect.toUpperCase() : 'ATTACK', x + w / 2, y + 125);

  ctx.restore();
}

function renderWinScreen(ctx, width, height, world) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(0, 0, width, height);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#4ade80';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 52px system-ui, sans-serif';
  ctx.fillText('VICTORY!', width / 2, height / 2 - 50);

  ctx.shadowBlur = 10;
  ctx.fillStyle = '#f1f5f9';
  ctx.font = '20px system-ui, sans-serif';
  ctx.fillText('You have vanquished your opponent in elemental combat.', width / 2, height / 2 + 10);
  ctx.restore();
}

function renderLoseScreen(ctx, width, height, world) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(0, 0, width, height);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 52px system-ui, sans-serif';
  ctx.fillText('DEFEAT', width / 2, height / 2 - 50);

  ctx.shadowBlur = 10;
  ctx.fillStyle = '#f1f5f9';
  ctx.font = '20px system-ui, sans-serif';
  ctx.fillText('Your ember has been extinguished...', width / 2, height / 2 + 10);
  ctx.restore();
}

function updateUI(world, uiLayer) {
  // Clear previous interactive buttons
  uiLayer.innerHTML = '';

  if (world.screen === SCREEN_TITLE) {
    const btn = document.createElement('button');
    btn.className = 'interactive';
    btn.textContent = 'Start Duel';
    btn.style.position = 'absolute';
    btn.style.left = '50%';
    btn.style.top = 'calc(50% + 90px)';
    btn.style.transform = 'translateX(-50%)';
    btn.onclick = () => world.startBattle();
    uiLayer.appendChild(btn);
  } else if (world.screen === SCREEN_PLAY) {
    if (world.turn === 'player') {
      const btn = document.createElement('button');
      btn.className = 'interactive';
      btn.textContent = 'End Turn';
      btn.style.position = 'absolute';
      btn.style.right = '40px';
      btn.style.bottom = '40px';
      btn.onclick = () => world.endPlayerTurn();
      uiLayer.appendChild(btn);
    }
  } else if (world.screen === SCREEN_WIN || world.screen === SCREEN_LOSE) {
    const btn = document.createElement('button');
    btn.className = 'interactive';
    btn.textContent = 'Play Again';
    btn.style.position = 'absolute';
    btn.style.left = '50%';
    btn.style.top = 'calc(50% + 70px)';
    btn.style.transform = 'translateX(-50%)';
    btn.onclick = () => world.reset();
    uiLayer.appendChild(btn);
  }
}
