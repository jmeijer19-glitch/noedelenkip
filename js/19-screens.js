// --- TITLE SCREEN ---
function drawTitleScreen() {
  titleTick++;
  const w = canvas.width, h = canvas.height;

  const grad = ctx.createLinearGradient(0,0,0,h);
  grad.addColorStop(0, '#4a90d9');
  grad.addColorStop(0.5, '#87CEEB');
  grad.addColorStop(1, '#5ba84e');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,w,h);

  ctx.fillStyle = '#4a8c3f';
  ctx.beginPath();
  ctx.moveTo(0, h*0.55);
  for (let x=0;x<=w;x+=2) {
    ctx.lineTo(x, h*0.55 + Math.sin(x*0.008+titleTick*0.01)*20 + Math.sin(x*0.003)*30);
  }
  ctx.lineTo(w,h);
  ctx.lineTo(0,h);
  ctx.fill();

  ctx.fillStyle = '#3d7a34';
  ctx.beginPath();
  ctx.moveTo(0, h*0.62);
  for (let x=0;x<=w;x+=2) {
    ctx.lineTo(x, h*0.62 + Math.sin(x*0.006+titleTick*0.008+1)*15 + Math.sin(x*0.004+2)*25);
  }
  ctx.lineTo(w,h);
  ctx.lineTo(0,h);
  ctx.fill();

  const villY = h*0.52;
  ctx.fillStyle = '#6b5030';
  ctx.fillRect(w*0.15, villY, 40, 35); ctx.fillStyle='#c0392b'; ctx.fillRect(w*0.15-5, villY-10, 50, 15);
  ctx.fillStyle = '#6b5030';
  ctx.fillRect(w*0.35, villY+5, 35, 30); ctx.fillStyle='#2980b9'; ctx.fillRect(w*0.35-3, villY-5, 41, 15);
  ctx.fillStyle = '#6b5030';
  ctx.fillRect(w*0.55, villY-5, 45, 40); ctx.fillStyle='#2a7a30'; ctx.fillRect(w*0.55-5, villY-18, 55, 18);
  ctx.fillStyle = '#6b5030';
  ctx.fillRect(w*0.75, villY+2, 38, 33); ctx.fillStyle='#c0392b'; ctx.fillRect(w*0.75-4, villY-8, 46, 14);

  ctx.fillStyle = '#2d6b1e';
  [0.08, 0.28, 0.48, 0.68, 0.88].forEach(px => {
    const tx = w*px;
    ctx.beginPath();
    ctx.arc(tx, villY+5, 20, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#5a3820';
    ctx.fillRect(tx-3, villY+15, 6, 15);
    ctx.fillStyle = '#2d6b1e';
  });

  titleClouds.forEach(c => {
    c.x += c.speed;
    if (c.x > w + 100) c.x = -c.w - 50;
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, c.w/2, 15, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(c.x-c.w*0.25, c.y+5, c.w*0.3, 12, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(c.x+c.w*0.25, c.y+3, c.w*0.35, 14, 0, 0, Math.PI*2);
    ctx.fill();
  });

  ctx.fillStyle = '#5ba84e';
  for (let x=0;x<w;x+=8) {
    const gh = 5 + Math.sin(x*0.1+titleTick*0.05)*3;
    ctx.fillRect(x, h*0.7+Math.sin(x*0.03)*10, 3, gh);
  }

  ctx.fillStyle = C.path;
  ctx.beginPath();
  ctx.moveTo(w*0.3, h);
  ctx.quadraticCurveTo(w*0.5, h*0.65, w*0.6, h*0.55);
  ctx.lineTo(w*0.65, h*0.55);
  ctx.quadraticCurveTo(w*0.55, h*0.65, w*0.38, h);
  ctx.fill();

  const nX = w*0.3, nY = h*0.78;
  drawNoedels(nX, nY, 1, titleTick*0.5, 2.5);

  const kX = w*0.7, kY = h*0.78;
  const kipNod = (titleTick % 180 < 30) ? Math.sin(titleTick*0.3)*3 : 0;
  drawKip(kX, kY + kipNod, 3, titleTick*0.3, 2.5, false);

  if (titleTick % 180 < 30) {
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    const bx = kX - 50, by = kY - 70;
    roundRect(ctx, bx, by, 60, 30, 8);
    ctx.fill();
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('*tok*', bx+8, by+20);
  }

  const titleY = h * 0.12;
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.font = 'bold 48px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('NOEDELS & DE KIP', w/2+3, titleY+3);

  const glowVal = Math.sin(titleTick*0.05)*20+30;
  ctx.shadowColor = '#ffa500';
  ctx.shadowBlur = glowVal;
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 48px monospace';
  ctx.fillText('NOEDELS & DE KIP', w/2, titleY);
  ctx.shadowBlur = 0;

  ctx.strokeStyle = '#c08000';
  ctx.lineWidth = 2;
  ctx.strokeText('NOEDELS & DE KIP', w/2, titleY);

  ctx.fillStyle = '#fff';
  ctx.font = '18px monospace';
  ctx.fillText('Avonturen in het Dorp', w/2, titleY + 36);

  ctx.strokeStyle = C.uiBorder;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w/2-180, titleY+48);
  ctx.lineTo(w/2+180, titleY+48);
  ctx.stroke();

  const menuY = h * 0.35;
  const menuSpacing = 40;

  ctx.fillStyle = 'rgba(20,20,40,0.7)';
  roundRect(ctx, w/2-150, menuY-20, 300, titleOptions.length*menuSpacing+30, 12);
  ctx.fill();
  ctx.strokeStyle = C.uiBorder;
  ctx.lineWidth = 2;
  roundRect(ctx, w/2-150, menuY-20, 300, titleOptions.length*menuSpacing+30, 12);
  ctx.stroke();

  titleOptions.forEach((opt, i) => {
    const oy = menuY + i * menuSpacing + 10;
    const selected = i === titleSelection;
    if (selected) {
      ctx.fillStyle = 'rgba(255,210,50,0.2)';
      roundRect(ctx, w/2-130, oy-14, 260, 32, 6);
      ctx.fill();
    }
    ctx.font = selected ? 'bold 20px monospace' : '18px monospace';
    if (i === 1 && !hasSave) {
      ctx.fillStyle = '#666';
    } else {
      ctx.fillStyle = selected ? '#ffd700' : '#ddd';
    }
    ctx.fillText(opt, w/2, oy + 6);
    if (selected) {
      ctx.fillStyle = '#ffd700';
      ctx.fillText('\u25BA', w/2-120, oy+6);
      ctx.fillText('\u25C4', w/2+110, oy+6);
    }
  });

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '12px monospace';
  ctx.fillText('v4.0 - Made with HTML5 Canvas', 10, h-10);

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '13px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('WASD/Pijltjes = Bewegen | Enter/Spatie = Actie | X = Aanval | I = Tas | Esc = Menu', w/2, h-15);
  ctx.textAlign = 'left';
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

let titleInputCooldown = 0;
function updateTitle() {
  if (titleInputCooldown > 0) { titleInputCooldown--; return; }
  if (isDown('up')) { titleSelection = (titleSelection - 1 + titleOptions.length) % titleOptions.length; SFX.menuMove(); titleInputCooldown = 12; }
  if (isDown('down')) { titleSelection = (titleSelection + 1) % titleOptions.length; SFX.menuMove(); titleInputCooldown = 12; }
  if (confirmJust) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (titleSelection === 0) {
      SFX.menuSelect();
      startNewGame();
    } else if (titleSelection === 1 && hasSave) {
      SFX.menuSelect();
      if (loadGame()) {
        gameState = 'playing';
        spawnEnemies();
      }
    } else if (titleSelection === 2) {
      SFX.menuSelect();
      gameState = 'options';
    } else if (titleSelection === 3) {
      SFX.menuSelect();
      gameState = 'changelog';
    } else if (titleSelection === 4) {
      SFX.menuSelect();
      gameState = 'credits';
    }
  }
}

function startNewGame() {
  player.x = 8*T+16; player.y = 10*T+16;
  player.dir = 2; player.hp = 100; player.maxHp = 100; player.xp = 0; player.level = 1;
  player.inventory = []; player.talkedTo = {}; player.coins = 0;
  player.moving = false; player.frame = 0; player.speed = 2.5;
  player.attackCooldown = 0; player.attackAnim = 0; player.hurtTimer = 0;
  hatchingEggs = [];
  hatchedChickens = [];
  coinParticles = [];
  kip.x = player.x + 32; kip.y = player.y;
  kip.flutter = false;
  // Reset all missions
  missions.golden_egg.state = 'inactive';
  missions.golden_egg.talkedBakker = false; missions.golden_egg.talkedBoer = false; missions.golden_egg.talkedUitvinder = false;
  missions.golden_egg.eggFound = false; missions.golden_egg.eggReturned = false;
  missions.catch_fish.state = 'inactive'; missions.catch_fish.fishCaught = 0;
  missions.fix_invention.state = 'inactive'; missions.fix_invention.gearsFound = 0;
  missions.recipe_search.state = 'inactive'; missions.recipe_search.recipeFound = false;
  currentMission = 'golden_egg';
  GEAR_POSITIONS.forEach(g => g.collected = false);
  RECIPE_POS.found = false;
  npcs.forEach(n => n.marker = null);
  generateMap();
  spawnEnemies();
  missionBarText = '';
  missionBarAlpha = 0;
  missionBarTarget = 0;
  missionChangeTick = 0;
  dayNight.time = 0.3; // Start at morning
  gameState = 'playing';
  setTimeout(() => {
    startDialog([
      { speaker: 'Noedels', text: 'Goedemorgen! Weer een mooie dag in het dorp.' },
      { speaker: 'De Kip', text: '*tok*' },
      { speaker: 'Noedels', text: 'Ja Kip, ik weet het. Altijd honger. Laten we eerst even rondkijken.' },
      { speaker: 'Noedels', text: '(TIP: Loop naar het kippenhok in het oosten van het dorp voor je eerste missie!)' },
      { speaker: 'Noedels', text: '(TIP: Druk X om aan te vallen als je vijanden tegenkomt in het bos!)' },
    ]);
  }, 500);
  startMusic();
}

// --- OPTIONS SCREEN ---
function drawOptions() {
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0,0,w,h);
  ctx.fillStyle = C.uiBorder;
  ctx.font = 'bold 32px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('OPTIES', w/2, 80);
  ctx.font = '18px monospace';
  ctx.fillStyle = '#ccc';
  ctx.fillText('Besturing:', w/2, 150);
  ctx.font = '14px monospace';
  ctx.fillText('WASD / Pijltjestoetsen = Bewegen', w/2, 185);
  ctx.fillText('Enter / Spatie = Interactie / Bevestigen', w/2, 210);
  ctx.fillText('X = Aanvallen (in het bos)', w/2, 235);
  ctx.fillText('I = Inventaris (Rugzak)', w/2, 260);
  ctx.fillText('Escape = Terug / Pauze', w/2, 285);
  ctx.fillStyle = '#aaa';
  ctx.font = '16px monospace';
  ctx.fillText('--- Touch/Tablet ---', w/2, 325);
  ctx.font = '14px monospace';
  ctx.fillText('Joystick (links) = Bewegen', w/2, 350);
  ctx.fillText('A-knop = Interactie + Aanval', w/2, 375);
  ctx.fillText('B-knop = Terug / Pauze', w/2, 400);
  ctx.fillText('TAS-knop = Inventaris', w/2, 425);

  // Muziek toggle
  ctx.fillStyle = '#aaa';
  ctx.font = '16px monospace';
  ctx.fillText('--- Instellingen ---', w/2, 465);
  ctx.font = '14px monospace';
  ctx.fillStyle = musicEnabled ? '#6f6' : '#f66';
  ctx.fillText('[M] Muziek: ' + (musicEnabled ? 'AAN' : 'UIT'), w/2, 495);

  ctx.fillStyle = '#888';
  ctx.font = '16px monospace';
  ctx.fillText('Druk ESC om terug te gaan', w/2, h-50);
  ctx.textAlign = 'left';

  if ((keys['m'] || keys['M']) && !drawOptions._mCooldown) {
    drawOptions._mCooldown = true;
    toggleMusic();
  }
  if (!keys['m'] && !keys['M']) drawOptions._mCooldown = false;

  if (cancelJust || confirmJust) { gameState = 'title'; titleInputCooldown = 10; }
}

// --- CREDITS SCREEN ---
function drawCredits() {
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0,0,w,h);
  ctx.fillStyle = C.uiBorder;
  ctx.font = 'bold 32px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CREDITS', w/2, 80);
  ctx.font = '16px monospace';
  ctx.fillStyle = '#ccc';
  ctx.fillText('NOEDELS & DE KIP v4', w/2, 140);
  ctx.fillText('Avonturen in het Dorp', w/2, 165);
  ctx.font = '14px monospace';
  ctx.fillStyle = '#aaa';
  ctx.fillText('Game Design & Programmering', w/2, 210);
  ctx.fillStyle = '#ffd700';
  ctx.fillText('Claude & Jeroen', w/2, 235);
  ctx.fillStyle = '#aaa';
  ctx.fillText('Pixel Art: Proceduraal gegenereerd', w/2, 275);
  ctx.fillText('Audio: Web Audio API', w/2, 300);
  ctx.fillText('Engine: Pure HTML5 Canvas + JavaScript', w/2, 325);
  ctx.fillText('Nieuwe features: Gevechten, Missies, Dag/Nacht, Minimap', w/2, 350);
  ctx.fillStyle = '#666';
  ctx.fillText('Geen kippen zijn verwond tijdens het maken van dit spel.', w/2, 400);
  ctx.fillText('(De wilde kippen in het bos tellen niet.)', w/2, 420);
  ctx.fillStyle = '#888';
  ctx.font = '16px monospace';
  ctx.fillText('Druk ESC om terug te gaan', w/2, h-50);
  ctx.textAlign = 'left';

  if (cancelJust || confirmJust) { gameState = 'title'; titleInputCooldown = 10; }
}

// --- CHANGELOG SCREEN ---
let changelogScroll = 0;
const CHANGELOG = [
  { version: 'v4.0', date: '2026-02-11', items: [
    'Munten-systeem: versla vijanden voor munten!',
    'Boer Henk verkoopt eieren na de Gouden Ei missie',
    'Drie ei-types: Kippenei, Groot Broedei, Gouden Broedei',
    'Eieren uitbroeden in het kippenhok met timer',
    'Kuikens beginnen klein en groeien in 2 minuten naar volwassen',
    'Gouden kippen hebben een glitter-effect',
    'XP bij uitbroeden: +5 / +15 / +30 per ei-type',
    'Dialog keuze-systeem (pijltjes + enter)',
    'Missies geven nu ook munten als beloning',
  ]},
  { version: 'v3.0', date: '2026-02-07', items: [
    'Ei zoeken: proximity-based (dichtbij komen + actieknop)',
    'Zoekgebied: pulserende cirkel i.p.v. exacte pijl',
    'Kippenhok: groter hek met poortje, mooier ontwerp',
    'Baarsjacht: grotere vijver, duidelijkere instructies',
    'Achtergrondmuziek met [M] toggle in opties',
    'Changelog scherm in hoofdmenu',
    'Minimap toggle op mobiel',
  ]},
  { version: 'v2.0', date: '2026-02-06', items: [
    'Gevechten met wilde kippen in het bos',
    'Missie systeem: 4 unieke missies',
    'Dag/nacht cyclus met dynamische verlichting',
    'Minimap in de hoek',
    'Inventory systeem (rugzak)',
    'NPC dialogen en interacties',
    'Save/load systeem',
    'Geluidseffecten (Web Audio)',
    'Touchscreen besturing (joystick + knoppen)',
  ]},
  { version: 'v1.0', date: '2026-02-05', items: [
    'Eerste versie: dorpswereld met karakter',
    'Basisbeweging en tile-based map',
    'Noedels en de Kip ontmoeten elkaar',
  ]},
];

function drawChangelog() {
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0,0,w,h);

  ctx.fillStyle = C.uiBorder;
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('WAT IS NIEUW', w/2, 50);

  const startY = 90 - changelogScroll;
  let y = startY;
  const left = Math.max(40, w/2 - 240);

  ctx.textAlign = 'left';
  for (const entry of CHANGELOG) {
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 20px monospace';
    if (y > 50 && y < h-60) ctx.fillText(entry.version + '  (' + entry.date + ')', left, y);
    y += 30;

    ctx.font = '13px monospace';
    ctx.fillStyle = '#bbb';
    for (const item of entry.items) {
      if (y > 50 && y < h-60) ctx.fillText('  + ' + item, left, y);
      y += 20;
    }
    y += 15;
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#666';
  ctx.font = '14px monospace';
  ctx.fillText('Pijltjes omhoog/omlaag om te scrollen  |  ESC = terug', w/2, h-30);
  ctx.textAlign = 'left';

  // Scroll input
  if (isDown('up') && changelogScroll > 0) changelogScroll = Math.max(0, changelogScroll - 3);
  if (isDown('down')) changelogScroll += 3;

  if (cancelJust || confirmJust) { changelogScroll = 0; gameState = 'title'; titleInputCooldown = 10; }
}
