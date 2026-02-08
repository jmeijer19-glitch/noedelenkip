// --- DRAW WORLD ---
function drawWorld() {
  const startTX = Math.max(0, Math.floor(camera.x / T) - 1);
  const startTY = Math.max(0, Math.floor(camera.y / T) - 1);
  const endTX = Math.min(MAP_W, Math.ceil((camera.x + canvas.width) / T) + 1);
  const endTY = Math.min(MAP_H, Math.ceil((camera.y + canvas.height) / T) + 1);

  ctx.save();
  ctx.translate(-Math.floor(camera.x), -Math.floor(camera.y));

  // Draw tiles
  for (let y=startTY;y<endTY;y++) {
    for (let x=startTX;x<endTX;x++) {
      drawTile(x, y, map[y][x], gameTick);
    }
  }

  // Golden egg search circle (shows general area, not exact position)
  if (missions.golden_egg.state === 'search' && !missions.golden_egg.eggFound) {
    const centerX = 15 * T + 16;
    const centerY = 37 * T + 16;
    const pulse = Math.sin(gameTick * 0.02) * 0.15 + 0.25;
    const radius = 4 * T + Math.sin(gameTick * 0.015) * 8;
    // Pulsing search circle
    ctx.strokeStyle = `rgba(255,215,0,${pulse})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.lineDashOffset = gameTick * 0.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    // Subtle glow at actual position (only visible when very close)
    const playerDist = Math.hypot(player.x - GOLDEN_EGG_POS.x * T, player.y - GOLDEN_EGG_POS.y * T);
    if (playerDist < 3 * T) {
      const closePulse = Math.sin(gameTick * 0.06) * 0.3 + 0.4;
      ctx.fillStyle = `rgba(255,215,0,${closePulse})`;
      ctx.beginPath();
      ctx.arc(GOLDEN_EGG_POS.x * T + 16, GOLDEN_EGG_POS.y * T + 16, 10 + Math.sin(gameTick * 0.04) * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw gear shimmer in forest
  if (missions.fix_invention.state === 'started') {
    GEAR_POSITIONS.forEach(g => {
      if (g.collected) return;
      const gx = g.x * T + 16, gy = g.y * T + 16;
      const shimmer = Math.sin(gameTick*0.06 + g.x)*0.4+0.6;
      // Silver gear
      ctx.fillStyle = `rgba(200,210,220,${shimmer})`;
      ctx.beginPath();
      ctx.arc(gx, gy, 8, 0, Math.PI*2);
      ctx.fill();
      // Gear teeth
      for (let i=0;i<6;i++) {
        const a = i*Math.PI/3 + gameTick*0.02;
        ctx.fillRect(gx + Math.cos(a)*8 - 2, gy + Math.sin(a)*8 - 2, 4, 4);
      }
      // Inner circle
      ctx.fillStyle = `rgba(150,160,170,${shimmer})`;
      ctx.beginPath();
      ctx.arc(gx, gy, 4, 0, Math.PI*2);
      ctx.fill();
    });
  }

  // Collect all sprites to sort by Y
  const sprites = [];
  sprites.push({ type: 'player', y: player.y });
  sprites.push({ type: 'kip', y: kip.y });
  if (moos.met || (!moos.met && player.y > 24*T)) sprites.push({ type: 'moos', y: moos.y });
  npcs.forEach((npc, i) => sprites.push({ type: 'npc', y: npc.y, idx: i }));
  enemies.forEach((e, i) => { if (e.state !== 'dead' || e.deadTimer > 0) sprites.push({ type: 'enemy', y: e.y, idx: i }); });

  sprites.sort((a,b) => a.y - b.y);

  sprites.forEach(s => {
    if (s.type === 'player') {
      // Hurt flash
      if (player.hurtTimer > 0 && player.hurtTimer % 4 < 2) {
        ctx.globalAlpha = 0.5;
      }
      drawNoedels(player.x, player.y, player.dir, player.moving ? player.frame*3 : 0, 1);
      ctx.globalAlpha = 1;
      // Attack swing visual
      if (player.attackAnim > 0) {
        const adx = [0,1,0,-1][player.dir];
        const ady = [-1,0,1,0][player.dir];
        const swingX = player.x + adx * 20;
        const swingY = player.y + ady * 20;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(swingX, swingY, 12 + (10-player.attackAnim)*2, 0, Math.PI);
        ctx.stroke();
      }
      // Carrying golden egg
      if (missions.golden_egg.eggFound && !missions.golden_egg.eggReturned) {
        ctx.fillStyle = C.gold;
        ctx.beginPath();
        ctx.ellipse(player.x+8, player.y-8, 5, 7, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = C.goldDark;
        ctx.beginPath();
        ctx.ellipse(player.x+7, player.y-9, 2, 3, 0.3, 0, Math.PI*2);
        ctx.fill();
      }
    } else if (s.type === 'kip') {
      drawKip(kip.x, kip.y, kip.dir, kip.moving ? kip.frame*3 : gameTick*0.3, 1, kip.flutter);
      if (kip.tokBubble) {
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        roundRect(ctx, kip.x-18, kip.y-40, 40, 20, 6);
        ctx.fill();
        ctx.fillStyle = '#333';
        ctx.font = '10px monospace';
        ctx.fillText('*tok*', kip.x-14, kip.y-26);
      }
    } else if (s.type === 'moos') {
      drawMoos(moos.x, moos.y, moos.dir, moos.moving ? moos.frame*3 : gameTick*0.15 + (moos.tailWag > 0 ? gameTick*0.5 : 0), 1);
      // Waf bubble
      if (moos.wafBubble) {
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        roundRect(ctx, moos.x-18, moos.y-35, 40, 20, 6);
        ctx.fill();
        ctx.fillStyle = '#333';
        ctx.font = '10px monospace';
        ctx.fillText('Waf!', moos.x-12, moos.y-21);
      }
      // Naam als dichtbij
      const moosPlayerDist = Math.hypot(player.x-moos.x, player.y-moos.y);
      if (moosPlayerDist < 3*T && moos.met) {
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Moos', moos.x, moos.y+20);
        ctx.textAlign = 'left';
      } else if (moosPlayerDist < 3*T && !moos.met) {
        ctx.fillStyle = 'rgba(255,255,200,0.9)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('???', moos.x, moos.y+20);
        ctx.textAlign = 'left';
      }
    } else if (s.type === 'npc') {
      const npc = npcs[s.idx];
      drawNPC(npc);
    } else if (s.type === 'enemy') {
      drawEnemy(enemies[s.idx]);
    }
  });

  // Cloud shadows
  clouds.forEach(c => {
    c.x += c.speed;
    if (c.x > MAP_W*T+100) c.x = -c.w;
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, c.w, c.w*0.4, 0, 0, Math.PI*2);
    ctx.fill();
  });

  // === MIST RENDERING ===
  if (mistState.active || mistState.fadeIn > 0) {
    const alpha = mistState.fadeIn;

    // Grote achtergrond-gloed (mysterieus licht)
    const bgAlpha = alpha * (0.2 + Math.sin(gameTick * 0.012) * 0.08);
    const bgGrad = ctx.createRadialGradient(mistState.x, mistState.y, 0, mistState.x, mistState.y, 5*T);
    bgGrad.addColorStop(0, `rgba(180,200,240,${bgAlpha})`);
    bgGrad.addColorStop(0.4, `rgba(160,180,220,${bgAlpha * 0.4})`);
    bgGrad.addColorStop(1, `rgba(140,160,200,0)`);
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.arc(mistState.x, mistState.y, 5*T, 0, Math.PI*2);
    ctx.fill();

    // Mist-slierten (particles)
    mistState.particles.forEach(p => {
      const px = mistState.x + p.ox + Math.sin(gameTick * 0.01 * p.speed + p.phase) * 20;
      const py = mistState.y + p.oy + Math.cos(gameTick * 0.008 * p.speed + p.phase) * 12;
      const pulse = 0.7 + Math.sin(gameTick * 0.018 + p.phase) * 0.2;
      const a = alpha * pulse * 0.4;
      const grad = ctx.createRadialGradient(px, py, 0, px, py, p.r * 1.3);
      grad.addColorStop(0, `rgba(210,220,245,${a})`);
      grad.addColorStop(0.4, `rgba(190,200,230,${a * 0.6})`);
      grad.addColorStop(1, `rgba(170,180,210,0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(px, py, p.r * 1.3, p.r * 0.8, gameTick * 0.003 + p.phase, 0, Math.PI * 2);
      ctx.fill();
    });

    // Heldere kern-gloed (het "magische" centrum)
    const coreAlpha = alpha * (0.45 + Math.sin(gameTick * 0.025) * 0.15);
    const coreGrad = ctx.createRadialGradient(mistState.x, mistState.y, 0, mistState.x, mistState.y, 3*T);
    coreGrad.addColorStop(0, `rgba(230,235,255,${coreAlpha})`);
    coreGrad.addColorStop(0.3, `rgba(210,220,245,${coreAlpha * 0.6})`);
    coreGrad.addColorStop(1, `rgba(190,200,230,0)`);
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(mistState.x, mistState.y, 3*T, 0, Math.PI*2);
    ctx.fill();

    // Draaiende lichtflitsen in de kern
    for (let i = 0; i < 4; i++) {
      const angle = gameTick * 0.008 + i * Math.PI / 2;
      const lx = mistState.x + Math.cos(angle) * 1.5 * T;
      const ly = mistState.y + Math.sin(angle) * 1 * T;
      const sparkAlpha = alpha * (0.15 + Math.sin(gameTick * 0.04 + i) * 0.1);
      ctx.fillStyle = `rgba(240,245,255,${sparkAlpha})`;
      ctx.beginPath();
      ctx.arc(lx, ly, 6 + Math.sin(gameTick * 0.05 + i) * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();

  // --- DAY/NIGHT OVERLAY ---
  const dn = dayNight.getOverlay();
  if (dn.a > 0.01) {
    ctx.fillStyle = `rgba(${dn.r},${dn.g},${dn.b},${dn.a})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawNPC(npc) {
  const x = npc.x, y = npc.y;
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(x, y+12, 8, 3, 0, 0, Math.PI*2);
  ctx.fill();

  const colors = {
    'bakker': { hat: '#fff', shirt: '#f0e0c0', apron: '#fff' },
    'boer': { hat: '#8b6914', shirt: '#5a8a3a', apron: null },
    'uitvinder': { hat: null, shirt: '#5050a0', apron: '#aaa' },
    'visser': { hat: '#2a5a9a', shirt: '#3a6a4a', apron: null },
  };
  const c = colors[npc.id] || { hat: '#888', shirt: '#666', apron: null };

  ctx.fillStyle = '#5a4a3a';
  ctx.fillRect(x-4, y+4, 3, 8);
  ctx.fillRect(x+1, y+4, 3, 8);
  ctx.fillStyle = c.shirt;
  ctx.fillRect(x-6, y-6, 12, 12);
  if (c.apron) {
    ctx.fillStyle = c.apron;
    ctx.fillRect(x-4, y-2, 8, 8);
  }
  ctx.fillStyle = C.skinTone;
  ctx.fillRect(x-8, y-4, 3, 7);
  ctx.fillRect(x+5, y-4, 3, 7);
  ctx.fillStyle = C.skinTone;
  ctx.fillRect(x-5, y-14, 10, 9);
  ctx.fillStyle = '#222';
  ctx.fillRect(x-3, y-11, 2, 2);
  ctx.fillRect(x+1, y-11, 2, 2);
  if (c.hat) {
    ctx.fillStyle = c.hat;
    ctx.fillRect(x-6, y-17, 12, 4);
    if (npc.id === 'bakker') {
      ctx.fillRect(x-4, y-22, 8, 6);
    }
  }
  if (npc.id === 'uitvinder') {
    ctx.fillStyle = '#888';
    ctx.fillRect(x-6, y-17, 3, 4);
    ctx.fillRect(x+3, y-17, 3, 4);
    ctx.fillRect(x-4, y-19, 8, 3);
    ctx.fillRect(x-2, y-20, 4, 2);
    ctx.fillStyle = '#aa8833';
    ctx.fillRect(x-5, y-12, 10, 3);
    ctx.fillStyle = '#aaddff';
    ctx.fillRect(x-4, y-12, 3, 2);
    ctx.fillRect(x+1, y-12, 3, 2);
  }
  if (npc.marker) {
    const bounce = Math.sin(gameTick*0.1)*4;
    ctx.fillStyle = npc.marker === '!' ? '#ffd700' : '#5ac4ff';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(npc.marker, x, y-26+bounce);
    ctx.textAlign = 'left';
  }
  const d = Math.hypot(player.x-x, player.y-y);
  if (d < 3*T) {
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(npc.name, x, y+22);
    ctx.textAlign = 'left';
  }
}

// --- MINIMAP ---
function drawMinimap() {
  const mmW = 140, mmH = 110;
  const mmX = canvas.width - mmW - 10;
  const mmY = 10;
  const scaleX = mmW / (MAP_W * T);
  const scaleY = mmH / (MAP_H * T);

  // Background
  ctx.fillStyle = 'rgba(10,10,30,0.75)';
  roundRect(ctx, mmX-2, mmY-2, mmW+4, mmH+4, 6);
  ctx.fill();
  ctx.strokeStyle = C.uiBorder;
  ctx.lineWidth = 1.5;
  roundRect(ctx, mmX-2, mmY-2, mmW+4, mmH+4, 6);
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.rect(mmX, mmY, mmW, mmH);
  ctx.clip();

  // Draw simplified map
  const tileScale = mmW / MAP_W;
  for (let ty=0; ty<MAP_H; ty++) {
    for (let tx=0; tx<MAP_W; tx++) {
      const tile = map[ty][tx];
      let color;
      switch(tile) {
        case 0: color = '#3a6a30'; break;
        case 1: color = '#b09050'; break;
        case 2: case 19: color = '#3070c0'; break;
        case 3: case 4: case 5: case 6: case 15: color = '#806020'; break;
        case 7: color = '#1a5010'; break;
        case 8: color = '#a04040'; break;
        case 9: color = '#666'; break;
        case 10: color = '#907040'; break;
        case 11: color = '#c0a050'; break;
        case 12: color = '#907020'; break;
        case 13: color = '#705010'; break;
        case 14: color = '#50a030'; break;
        case 20: color = gateOpen ? '#b09050' : '#907040'; break;
        default: color = '#3a6a30'; break;
      }
      ctx.fillStyle = color;
      ctx.fillRect(mmX + tx*tileScale, mmY + ty*(mmH/MAP_H), Math.ceil(tileScale), Math.ceil(mmH/MAP_H));
    }
  }

  // NPC dots
  npcs.forEach(npc => {
    if (npc.marker) {
      ctx.fillStyle = '#ffd700';
    } else {
      ctx.fillStyle = '#fff';
    }
    ctx.beginPath();
    ctx.arc(mmX + npc.x*scaleX, mmY + npc.y*scaleY, 2, 0, Math.PI*2);
    ctx.fill();
  });

  // Enemy dots (red)
  enemies.forEach(e => {
    if (e.state === 'dead') return;
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(mmX + e.x*scaleX, mmY + e.y*scaleY, 1.5, 0, Math.PI*2);
    ctx.fill();
  });

  // Objective marker
  let objX = -1, objY = -1;
  const m = missions;
  if (m.golden_egg.state === 'inactive' || m.golden_egg.state === 'return') {
    objX = 39 * T; objY = 17 * T;
  } else if (m.golden_egg.state === 'search') {
    objX = 15 * T; objY = 37 * T;
  } else if (m.catch_fish.state === 'started' && m.catch_fish.fishCaught < m.catch_fish.fishNeeded) {
    objX = 37 * T; objY = 30 * T;
  } else if (m.catch_fish.state === 'started' && m.catch_fish.fishCaught >= m.catch_fish.fishNeeded) {
    objX = npcs[3].x; objY = npcs[3].y;
  } else if (m.fix_invention.state === 'started') {
    if (m.fix_invention.gearsFound >= m.fix_invention.gearsNeeded) {
      objX = npcs[2].x; objY = npcs[2].y;
    } else {
      const next = GEAR_POSITIONS.find(g => !g.collected);
      if (next) { objX = next.x*T+16; objY = next.y*T+16; }
    }
  } else if (m.recipe_search.state === 'started') {
    if (m.recipe_search.recipeFound) {
      objX = npcs[0].x; objY = npcs[0].y;
    } else {
      objX = 15*T; objY = 42*T;
    }
  }

  if (objX >= 0) {
    const pulse = Math.sin(gameTick*0.1)*0.4+0.6;
    ctx.fillStyle = `rgba(255,215,0,${pulse})`;
    ctx.beginPath();
    ctx.arc(mmX + objX*scaleX, mmY + objY*scaleY, 3, 0, Math.PI*2);
    ctx.fill();
  }

  // Player dot (green, pulsing)
  const playerPulse = 2 + Math.sin(gameTick*0.15)*1;
  ctx.fillStyle = '#44ff44';
  ctx.beginPath();
  ctx.arc(mmX + player.x*scaleX, mmY + player.y*scaleY, playerPulse, 0, Math.PI*2);
  ctx.fill();
  // Kip dot (white)
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(mmX + kip.x*scaleX, mmY + kip.y*scaleY, 1.5, 0, Math.PI*2);
  ctx.fill();

  // Moos dot (brown) - alleen als in beeld (ontmoet of in bos)
  if (moos.met || player.y > 24*T) {
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.arc(mmX + moos.x*scaleX, mmY + moos.y*scaleY, 1.5, 0, Math.PI*2);
    ctx.fill();
  }

  ctx.restore();
}

// --- HUD ---
function drawHUD() {
  // Portrait + HP (top-left)
  ctx.fillStyle = C.uiBg;
  roundRect(ctx, 10, 10, 200, 55, 8);
  ctx.fill();
  ctx.strokeStyle = C.uiBorder;
  ctx.lineWidth = 2;
  roundRect(ctx, 10, 10, 200, 55, 8);
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.arc(40, 37, 18, 0, Math.PI*2);
  ctx.clip();
  drawNoedels(40, 50, 2, 0, 1.2);
  ctx.restore();
  ctx.strokeStyle = C.uiBorder;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(40, 37, 18, 0, Math.PI*2);
  ctx.stroke();

  // HP bar
  ctx.fillStyle = '#333';
  ctx.fillRect(65, 22, 130, 12);
  ctx.fillStyle = player.hp > player.maxHp*0.3 ? '#4a4' : '#c44';
  ctx.fillRect(65, 22, 130 * (player.hp/player.maxHp), 12);
  ctx.strokeStyle = '#555';
  ctx.strokeRect(65, 22, 130, 12);
  ctx.fillStyle = '#fff';
  ctx.font = '9px monospace';
  ctx.fillText(`${player.hp}/${player.maxHp}`, 110, 31);

  // Level + XP
  ctx.fillStyle = C.uiBorder;
  ctx.font = '11px monospace';
  ctx.fillText(`Lv.${player.level}`, 68, 50);
  ctx.fillStyle = '#aaa';
  ctx.font = '10px monospace';
  ctx.fillText(`XP:${player.xp}`, 120, 50);

  // Time of day
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '9px monospace';
  ctx.fillText(dayNight.getLabel(), 170, 50);

  // === MISSION TRACKER (top-center) ===
  {
    let mTitle = '';
    let mObjective = '';
    const m = missions;
    if (m.golden_egg.state === 'inactive') {
      mTitle = 'MISSIE';
      mObjective = 'Loop naar het kippenhok (oost) \u2192';
    } else if (m.golden_egg.state === 'triggered') {
      mTitle = 'MISSIE';
      mObjective = 'Luister naar De Kip...';
    } else if (m.golden_egg.state === 'investigate') {
      const cnt = (m.golden_egg.talkedBakker?1:0) + (m.golden_egg.talkedBoer?1:0) + (m.golden_egg.talkedUitvinder?1:0);
      mTitle = 'OPERATIE GOUDEN OMELET';
      mObjective = `Praat met de dorpelingen (${cnt}/3)`;
    } else if (m.golden_egg.state === 'search') {
      mTitle = 'OPERATIE GOUDEN OMELET';
      mObjective = 'Zoek het Gouden Ei in het bos (hoog gras)';
    } else if (m.golden_egg.state === 'return') {
      mTitle = 'OPERATIE GOUDEN OMELET';
      mObjective = 'Breng het Gouden Ei terug naar het kippenhok!';
    } else if (m.golden_egg.state === 'completed' && m.catch_fish.state === 'inactive') {
      mTitle = 'NIEUW';
      mObjective = 'Praat met Visser Jan bij het water';
    } else if (m.catch_fish.state === 'started') {
      mTitle = 'DE GOUD-BAARS JACHT';
      mObjective = m.catch_fish.fishCaught >= m.catch_fish.fishNeeded ?
        'Breng de vissen naar Visser Jan!' :
        `Vang vissen bij de bosvijver (${m.catch_fish.fishCaught}/${m.catch_fish.fishNeeded})`;
    } else if (m.catch_fish.state === 'completed' && m.fix_invention.state === 'inactive') {
      mTitle = 'NIEUW';
      mObjective = 'Praat met Professor Kansen';
    } else if (m.fix_invention.state === 'started') {
      mTitle = 'DE EI-O-MATIC 3000';
      mObjective = m.fix_invention.gearsFound >= m.fix_invention.gearsNeeded ?
        'Breng tandwielen naar Professor Kansen!' :
        `Zoek tandwielen in het bos (${m.fix_invention.gearsFound}/${m.fix_invention.gearsNeeded})`;
    } else if (m.fix_invention.state === 'completed' && m.recipe_search.state === 'inactive') {
      mTitle = 'NIEUW';
      mObjective = 'Praat met Bakker Piet';
    } else if (m.recipe_search.state === 'started') {
      mTitle = 'HET GEHEIME RECEPT';
      mObjective = m.recipe_search.recipeFound ?
        'Breng het recept naar Bakker Piet!' :
        'Zoek het recept bij de mysterieuze steen in het bos';
    } else if (m.recipe_search.state === 'completed') {
      mTitle = 'ALLE MISSIES VOLTOOID!';
      mObjective = 'Je bent een ware dorpsheld!';
    }

    if (mTitle) {
      ctx.save();
      const boxW = 340;
      const boxH = 52;
      const boxX = (canvas.width - boxW) / 2;
      const boxY = 8;

      const sinceTick = gameTick - missionChangeTick;
      const pulseActive = sinceTick < 180;
      if (pulseActive) {
        ctx.shadowColor = C.uiBorder;
        ctx.shadowBlur = 12 + 6 * Math.sin(gameTick * 0.15);
        ctx.globalAlpha = 0.9 + 0.1 * Math.sin(gameTick * 0.15);
      }

      ctx.fillStyle = C.uiBg;
      roundRect(ctx, boxX, boxY, boxW, boxH, 8);
      ctx.fill();

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.strokeStyle = C.uiBorder;
      ctx.lineWidth = 2.5;
      roundRect(ctx, boxX, boxY, boxW, boxH, 8);
      ctx.stroke();

      ctx.fillStyle = C.uiBorder;
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(mTitle, boxX + 10, boxY + 18);

      ctx.fillStyle = '#fff';
      ctx.font = '13px monospace';
      ctx.fillText(mObjective, boxX + 10, boxY + 38);

      if (!['completed','inactive'].includes(m.golden_egg.state) || m.catch_fish.state === 'started' || m.fix_invention.state === 'started' || m.recipe_search.state === 'started') {
        const dotPulse = 0.5 + 0.5 * Math.sin(gameTick * 0.08);
        ctx.fillStyle = `rgba(240, 192, 64, ${dotPulse})`;
        ctx.beginPath();
        ctx.arc(boxX + boxW - 16, boxY + boxH / 2, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // === DIRECTIONAL ARROW ===
  {
    let targetX = -1, targetY = -1;
    const m = missions;
    if (m.golden_egg.state === 'inactive' || m.golden_egg.state === 'return') {
      targetX = 39 * T; targetY = 17 * T;
    } else if (m.golden_egg.state === 'search') {
      // Wijs naar midden van grasgebied, niet exacte ei-positie
      targetX = 15 * T; targetY = 37 * T;
    } else if (m.catch_fish.state === 'started' && m.catch_fish.fishCaught < m.catch_fish.fishNeeded) {
      targetX = 37 * T; targetY = 30 * T;
    } else if (m.catch_fish.state === 'started' && m.catch_fish.fishCaught >= m.catch_fish.fishNeeded) {
      targetX = npcs[3].x; targetY = npcs[3].y;
    } else if (m.fix_invention.state === 'started') {
      if (m.fix_invention.gearsFound >= m.fix_invention.gearsNeeded) {
        targetX = npcs[2].x; targetY = npcs[2].y;
      } else {
        const next = GEAR_POSITIONS.find(g => !g.collected);
        if (next) { targetX = next.x*T+16; targetY = next.y*T+16; }
      }
    } else if (m.recipe_search.state === 'started') {
      if (m.recipe_search.recipeFound) {
        targetX = npcs[0].x; targetY = npcs[0].y;
      } else {
        targetX = 15*T; targetY = 42*T;
      }
    } else if (m.golden_egg.state === 'completed' && m.catch_fish.state === 'inactive') {
      targetX = npcs[3].x; targetY = npcs[3].y;
    } else if (m.catch_fish.state === 'completed' && m.fix_invention.state === 'inactive') {
      targetX = npcs[2].x; targetY = npcs[2].y;
    } else if (m.fix_invention.state === 'completed' && m.recipe_search.state === 'inactive') {
      targetX = npcs[0].x; targetY = npcs[0].y;
    }

    if (targetX >= 0) {
      const worldDX = targetX - player.x;
      const worldDY = targetY - player.y;
      const dist = Math.hypot(worldDX, worldDY);
      if (dist > 3 * T) {
        const angle = Math.atan2(worldDY, worldDX);
        const margin = 50;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const edgeX = Math.cos(angle) * 200;
        const edgeY = Math.sin(angle) * 200;
        let arrowX = cx + edgeX;
        let arrowY = cy + edgeY;
        arrowX = Math.max(margin, Math.min(canvas.width - margin, arrowX));
        arrowY = Math.max(margin + 60, Math.min(canvas.height - margin - 60, arrowY));

        const pulse = 0.5 + 0.5 * Math.sin(gameTick * 0.1);
        ctx.save();
        ctx.translate(arrowX, arrowY);
        ctx.rotate(angle);
        ctx.globalAlpha = 0.6 + 0.3 * pulse;
        ctx.fillStyle = C.uiBorder;
        ctx.beginPath();
        ctx.moveTo(14, 0);
        ctx.lineTo(-8, -9);
        ctx.lineTo(-4, 0);
        ctx.lineTo(-8, 9);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  // Mission bar (bottom)
  if (missionBarText) {
    if (missionBarTarget === 0) {
      missionBarAlpha += (0 - missionBarAlpha) * 0.05;
    } else {
      missionBarAlpha += (1 - missionBarAlpha) * 0.15;
    }
    if (missionBarAlpha > 0.05) {
      ctx.globalAlpha = missionBarAlpha;
      const barH = 44;
      const barY = canvas.height - barH - 12;
      ctx.fillStyle = C.uiBg;
      roundRect(ctx, 16, barY, canvas.width-32, barH, 10);
      ctx.fill();
      ctx.strokeStyle = C.uiBorder;
      ctx.lineWidth = 2.5;
      roundRect(ctx, 16, barY, canvas.width-32, barH, 10);
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(missionBarText, 30, barY+28);
      ctx.globalAlpha = 1;
    }
  }

  // Location indicator
  const inForest = player.y > 24*T;
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(inForest ? '~ Het Bos ~' : '~ Het Dorp ~', canvas.width/2, 72);
  ctx.textAlign = 'left';

  // Interaction hint
  const nearNPC = findNearbyNPC();
  const ddx = [0,1,0,-1][player.dir];
  const ddy = [-1,0,1,0][player.dir];
  const frontTile = getTileAt(player.x + ddx*T, player.y + ddy*T);
  const nearEnemy = enemies.find(e => e.state !== 'dead' && Math.hypot(player.x - e.x, player.y - e.y) < 2.5*T);
  const nearEgg = missions.golden_egg.state === 'search' && Math.hypot(player.x/T - GOLDEN_EGG_POS.x, player.y/T - GOLDEN_EGG_POS.y) < 6;
  if (nearNPC || TILE_INTERACT.includes(frontTile) || nearEgg || nearEnemy) {
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    let hint;
    if (nearEnemy && inForest) {
      hint = '[X/A] Aanvallen!';
    } else if (nearNPC) {
      hint = `[Enter/A] Praat met ${nearNPC.name}`;
    } else {
      hint = '[Enter/A] Onderzoek';
    }
    ctx.fillText(hint, canvas.width/2, canvas.height-72);
    ctx.textAlign = 'left';
  }

  // Minimap (toggle on mobile)
  if (showMinimap) drawMinimap();
}
