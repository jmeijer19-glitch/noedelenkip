// --- DIALOG SYSTEM ---
function startDialog(lines, callback) {
  dialogQueue = lines;
  dialogIndex = 0;
  dialogCharIndex = 0;
  dialogTimer = 0;
  dialogCallback = callback || null;
  gameState = 'dialog';
}

function updateDialog() {
  if (dialogIndex >= dialogQueue.length) {
    gameState = 'playing';
    if (dialogCallback) { dialogCallback(); dialogCallback = null; }
    return;
  }
  dialogTimer++;
  const line = dialogQueue[dialogIndex];
  if (dialogCharIndex < line.text.length) {
    dialogCharIndex += 0.5;
    if (gameTick % 3 === 0) SFX.dialog();
  }
  if (confirmJust) {
    if (dialogCharIndex < line.text.length) {
      dialogCharIndex = line.text.length;
    } else {
      dialogIndex++;
      dialogCharIndex = 0;
      dialogTimer = 0;
    }
  }
}

function drawDialog() {
  if (dialogIndex >= dialogQueue.length) return;
  const line = dialogQueue[dialogIndex];
  const boxH = 120;
  const boxY = canvas.height - boxH - 20;
  const boxX = 20;
  const boxW = canvas.width - 40;

  ctx.fillStyle = C.uiBg;
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.strokeStyle = C.uiBorder;
  ctx.lineWidth = 3;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  ctx.fillStyle = C.uiBorder;
  ctx.font = 'bold 16px monospace';
  ctx.fillText(line.speaker, boxX + 80, boxY + 24);

  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(boxX+8, boxY+8, 60, 60);

  ctx.save();
  ctx.beginPath();
  ctx.rect(boxX+8, boxY+8, 60, 60);
  ctx.clip();
  if (line.speaker === 'Noedels') {
    drawNoedels(boxX+38, boxY+52, 2, 0, 1.8);
  } else if (line.speaker === 'De Kip' || line.speaker.includes('Kip')) {
    drawKip(boxX+38, boxY+48, 2, gameTick, 1.5, line.text.includes('TOK'));
  } else {
    ctx.fillStyle = C.skinTone;
    ctx.fillRect(boxX+22, boxY+18, 30, 30);
    ctx.fillStyle = C.hairBrown;
    ctx.fillRect(boxX+20, boxY+14, 34, 10);
    ctx.fillStyle = '#222';
    ctx.fillRect(boxX+28, boxY+28, 4, 4);
    ctx.fillRect(boxX+38, boxY+28, 4, 4);
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.fillText(line.speaker[0], boxX+34, boxY+56);
  }
  ctx.restore();

  const displayText = line.text.substring(0, Math.floor(dialogCharIndex));
  ctx.fillStyle = C.uiText;
  ctx.font = '14px monospace';
  const maxW = boxW - 100;
  const words = displayText.split(' ');
  let lineText = '';
  let lineY = boxY + 50;
  for (const word of words) {
    const test = lineText + word + ' ';
    if (ctx.measureText(test).width > maxW) {
      ctx.fillText(lineText, boxX + 80, lineY);
      lineText = word + ' ';
      lineY += 20;
    } else {
      lineText = test;
    }
  }
  ctx.fillText(lineText, boxX + 80, lineY);

  if (dialogCharIndex >= line.text.length) {
    const blink = Math.sin(gameTick*0.1) > 0;
    if (blink) {
      ctx.fillStyle = C.uiBorder;
      ctx.fillText('\u25BC', boxX + boxW - 30, boxY + boxH - 12);
    }
  }
}