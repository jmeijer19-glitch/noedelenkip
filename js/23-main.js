// --- PAUSE SCREEN ---
function drawPause() {
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = C.uiBorder;
  ctx.font = 'bold 36px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PAUZE', canvas.width/2, canvas.height/2-30);
  ctx.fillStyle = '#ccc';
  ctx.font = '16px monospace';
  ctx.fillText('Druk ESC/B om door te gaan', canvas.width/2, canvas.height/2+10);
  ctx.fillText('Spel wordt automatisch opgeslagen', canvas.width/2, canvas.height/2+40);
  ctx.textAlign = 'left';

  if (cancelJust || confirmJust) {
    gameState = 'playing';
    saveGame();
  }
}

// --- MAIN GAME LOOP ---
let musicToggleCooldown = 0;
function gameLoop(timestamp) {
  gameTick++;
  updateInput();

  // Global music toggle [M] - werkt in elk scherm
  if (musicToggleCooldown > 0) musicToggleCooldown--;
  if ((keys['m'] || keys['M']) && musicToggleCooldown === 0) {
    musicToggleCooldown = 20;
    toggleMusic();
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  switch(gameState) {
    case 'title':
      updateTitle();
      drawTitleScreen();
      break;
    case 'playing':
      dayNight.update();
      updatePlayer();
      updateKip();
      updateMoos();
      updateNPCs();
      updateEnemies();
      updateCamera();
      drawWorld();
      drawHUD();
      if (musicEnabled && !musicPlaying && gameTick % 60 === 0) startMusic();
      if (gameTick % 1800 === 0) saveGame();
      break;
    case 'mist_cutscene':
      dayNight.update();
      updateMist(); // Blijft mist updaten (fade-in, timer)
      updateCamera();
      drawWorld();
      drawHUD();
      // Extra mist overlay op het hele scherm voor sfeer
      if (mistState.fadeIn > 0.3) {
        const overlay = (mistState.fadeIn - 0.3) * 0.3;
        ctx.fillStyle = `rgba(200,210,230,${overlay})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      break;
    case 'dialog':
      dayNight.update();
      updateCamera();
      drawWorld();
      drawHUD();
      updateDialog();
      drawDialog();
      break;
    case 'inventory':
      drawWorld();
      drawHUD();
      drawInventory();
      if (cancelJust || invJust) {
        gameState = 'playing';
      }
      break;
    case 'paused':
      drawWorld();
      drawHUD();
      drawPause();
      break;
    case 'options':
      drawOptions();
      break;
    case 'credits':
      drawCredits();
      break;
    case 'changelog':
      drawChangelog();
      break;
  }

  requestAnimationFrame(gameLoop);
}

// --- START ---
requestAnimationFrame(gameLoop);
