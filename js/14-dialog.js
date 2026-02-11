// --- DIALOG SYSTEM ---
let dialogChoiceIndex = 0;
let dialogChoiceActive = false;
let dialogChoiceResult = -1;
let dialogInputCooldown = 0;

function startDialog(lines, callback) {
  dialogQueue = lines;
  dialogIndex = 0;
  dialogCharIndex = 0;
  dialogTimer = 0;
  dialogCallback = callback || null;
  dialogChoiceIndex = 0;
  dialogChoiceActive = false;
  dialogChoiceResult = -1;
  gameState = 'dialog';
}

function updateDialog() {
  if (dialogIndex >= dialogQueue.length) {
    gameState = 'playing';
    if (dialogCallback) { dialogCallback(); dialogCallback = null; }
    return;
  }
  if (dialogInputCooldown > 0) dialogInputCooldown--;
  dialogTimer++;
  const line = dialogQueue[dialogIndex];

  // Choice mode
  if (line.choices && dialogCharIndex >= line.text.length) {
    dialogChoiceActive = true;
    if (dialogInputCooldown <= 0) {
      if (isDown('up')) {
        dialogChoiceIndex = (dialogChoiceIndex - 1 + line.choices.length) % line.choices.length;
        SFX.menuMove();
        dialogInputCooldown = 10;
      }
      if (isDown('down')) {
        dialogChoiceIndex = (dialogChoiceIndex + 1) % line.choices.length;
        SFX.menuMove();
        dialogInputCooldown = 10;
      }
    }
    if (confirmJust) {
      dialogChoiceResult = dialogChoiceIndex;
      dialogChoiceActive = false;
      SFX.menuSelect();
      // Execute the choice callback if present
      const choice = line.choices[dialogChoiceIndex];
      if (choice.action) {
        choice.action();
      }
      dialogIndex++;
      dialogCharIndex = 0;
      dialogTimer = 0;
      dialogChoiceIndex = 0;
    }
    return;
  }

  if (dialogCharIndex < line.text.length) {
    dialogCharIndex += 0.5;
    if (gameTick % 3 === 0) SFX.dialog();
  }
  if (confirmJust) {
    if (dialogCharIndex < line.text.length) {
      dialogCharIndex = line.text.length;
    } else if (!line.choices) {
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

  // Draw choices above dialog box
  if (line.choices && dialogCharIndex >= line.text.length) {
    const choiceH = line.choices.length * 28 + 16;
    const choiceY = boxY - choiceH - 8;
    const choiceX = boxX + 60;
    const choiceW = boxW - 80;

    ctx.fillStyle = C.uiBg;
    roundRect(ctx, choiceX, choiceY, choiceW, choiceH, 8);
    ctx.fill();
    ctx.strokeStyle = C.uiBorder;
    ctx.lineWidth = 2;
    roundRect(ctx, choiceX, choiceY, choiceW, choiceH, 8);
    ctx.stroke();

    line.choices.forEach((choice, i) => {
      const cy = choiceY + 12 + i * 28;
      const selected = i === dialogChoiceIndex;
      if (selected) {
        ctx.fillStyle = 'rgba(255,210,50,0.15)';
        roundRect(ctx, choiceX + 6, cy - 4, choiceW - 12, 24, 4);
        ctx.fill();
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('\u25BA', choiceX + 12, cy + 12);
      }
      ctx.fillStyle = selected ? '#ffd700' : '#ccc';
      ctx.font = selected ? 'bold 14px monospace' : '14px monospace';
      ctx.fillText(choice.label, choiceX + 30, cy + 12);
      // Show cost if present
      if (choice.cost !== undefined) {
        const costText = `${choice.cost} munten`;
        const costColor = player.coins >= choice.cost ? '#ffd700' : '#ff5555';
        ctx.fillStyle = costColor;
        ctx.font = '12px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(costText, choiceX + choiceW - 14, cy + 12);
        ctx.textAlign = 'left';
      }
    });
  } else if (dialogCharIndex >= line.text.length && !line.choices) {
    const blink = Math.sin(gameTick*0.1) > 0;
    if (blink) {
      ctx.fillStyle = C.uiBorder;
      ctx.fillText('\u25BC', boxX + boxW - 30, boxY + boxH - 12);
    }
  }
}
