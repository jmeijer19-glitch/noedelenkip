// --- INVENTORY SCREEN ---
function drawInventory() {
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0,0,w,h);

  const boxW = 420, boxH = 400;
  const bx = (w-boxW)/2, by = (h-boxH)/2;
  ctx.fillStyle = C.uiBg;
  roundRect(ctx, bx, by, boxW, boxH, 12);
  ctx.fill();
  ctx.strokeStyle = C.uiBorder;
  ctx.lineWidth = 3;
  roundRect(ctx, bx, by, boxW, boxH, 12);
  ctx.stroke();

  ctx.fillStyle = C.uiBorder;
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('RUGZAK', w/2, by+35);

  ctx.font = '14px monospace';
  ctx.fillStyle = '#ccc';
  if (player.inventory.length === 0) {
    ctx.fillText('Je rugzak is leeg.', w/2, by+100);
  } else {
    player.inventory.forEach((item, i) => {
      ctx.fillStyle = '#fff';
      if (item === 'Gouden Ei') {
        ctx.fillStyle = C.gold;
        ctx.beginPath();
        ctx.ellipse(bx+50, by+75+i*30, 8, 10, 0, 0, Math.PI*2);
        ctx.fill();
      } else if (item === 'Omelet Recept' || item === 'Geheim Recept') {
        ctx.fillStyle = '#f0e0b0';
        ctx.fillRect(bx+40, by+64+i*30, 20, 20);
        ctx.fillStyle = '#555';
        ctx.font = '8px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('abc', bx+44, by+78+i*30);
      } else if (item === 'Vishengel') {
        ctx.fillStyle = '#8b6914';
        ctx.fillRect(bx+48, by+62+i*30, 3, 22);
        ctx.fillStyle = '#aaa';
        ctx.fillRect(bx+48, by+82+i*30, 8, 1);
      } else if (item === 'Snelheids-Schoenen') {
        ctx.fillStyle = '#4a9af0';
        ctx.fillRect(bx+40, by+70+i*30, 10, 8);
        ctx.fillRect(bx+52, by+70+i*30, 10, 8);
      } else if (item === 'Noedelbrood') {
        ctx.fillStyle = '#d4a040';
        ctx.beginPath();
        ctx.ellipse(bx+50, by+75+i*30, 10, 7, 0, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.fillStyle = '#fff';
      ctx.font = '15px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(item, bx+75, by+80+i*30);
    });
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#888';
  ctx.font = '12px monospace';
  ctx.fillText(`Level: ${player.level} | XP: ${player.xp} | HP: ${player.hp}/${player.maxHp}`, w/2, by+boxH-55);
  ctx.fillText(`Missies voltooid: ${[missions.golden_egg, missions.catch_fish, missions.fix_invention, missions.recipe_search].filter(m=>m.state==='completed').length}/4`, w/2, by+boxH-35);
  ctx.fillText('Druk ESC, I of TAS om te sluiten', w/2, by+boxH-15);
  ctx.textAlign = 'left';
}
