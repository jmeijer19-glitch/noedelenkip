// --- COMBAT SYSTEM ---
function playerAttack() {
  if (player.attackCooldown > 0) return;
  player.attackCooldown = 20;
  player.attackAnim = 10;
  SFX.attack();

  const dx = [0,1,0,-1][player.dir];
  const dy = [-1,0,1,0][player.dir];
  const attackX = player.x + dx * 24;
  const attackY = player.y + dy * 24;
  const attackRange = 30;
  const baseDmg = 10 + player.level * 2;

  enemies.forEach(e => {
    if (e.state === 'dead') return;
    const dist = Math.hypot(e.x - attackX, e.y - attackY);
    if (dist < attackRange) {
      const dmg = baseDmg + Math.floor(Math.random() * 5);
      e.hp -= dmg;
      e.hurtTimer = 10;
      SFX.hurtEnemy();
      if (e.hp <= 0) {
        e.hp = 0;
        e.state = 'dead';
        e.deadTimer = 60;
        player.xp += e.xp;
        SFX.enemyDie();
        checkLevelUp();

        // Drop coins: 1 per kip, 2 per vos/ander beest
        const coinDrop = e.type === 'wild_chicken' ? 1 : 2;
        player.coins += coinDrop;
        SFX.coin();
        // Spawn coin particles
        for (let ci = 0; ci < Math.min(coinDrop, 5); ci++) {
          coinParticles.push({
            x: e.x + (Math.random()-0.5)*20,
            y: e.y - 10,
            vy: -2 - Math.random()*2,
            life: 40 + Math.floor(Math.random()*20),
            text: ci === 0 ? `+${coinDrop}` : null,
          });
        }

        // Chance to drop a gear if fix_invention mission active
        if (missions.fix_invention.state === 'started') {
          const closestGear = GEAR_POSITIONS.find(g => !g.collected && Math.hypot(g.x*T+16 - e.x, g.y*T+16 - e.y) < 8*T);
          if (closestGear && Math.random() < 0.5) {
            // Just mark it collectible - player still has to walk there
          }
        }
      }
    }
  });
}

function checkLevelUp() {
  const newLevel = Math.floor(player.xp / 80) + 1;
  if (newLevel > player.level) {
    player.level = newLevel;
    player.maxHp = 100 + (player.level - 1) * 20;
    player.hp = player.maxHp;
    SFX.levelUp();
    setMissionBar(`LEVEL UP! Level ${player.level}! HP verhoogd naar ${player.maxHp}!`);
    setTimeout(() => { missionBarTarget = 0; }, 3000);
  }
}

function updateEnemies() {
  enemies.forEach(e => {
    if (e.state === 'dead') {
      e.deadTimer--;
      if (e.deadTimer <= 0) {
        // Respawn at home after a while
        e.hp = e.maxHp;
        e.state = 'idle';
        e.x = e.homeX;
        e.y = e.homeY;
      }
      return;
    }
    if (e.hurtTimer > 0) e.hurtTimer--;
    if (e.attackCooldown > 0) e.attackCooldown--;

    const dist = Math.hypot(player.x - e.x, player.y - e.y);

    if (dist < e.aggroRange && dist > 16) {
      e.state = 'chase';
      const angle = Math.atan2(player.y - e.y, player.x - e.x);
      const nx = e.x + Math.cos(angle) * e.speed;
      const ny = e.y + Math.sin(angle) * e.speed;
      if (canWalk(nx, e.y, 5)) e.x = nx;
      if (canWalk(e.x, ny, 5)) e.y = ny;
      e.frame += 0.15;
      // Update direction
      const adx = player.x - e.x;
      const ady = player.y - e.y;
      if (Math.abs(adx) > Math.abs(ady)) e.dir = adx > 0 ? 1 : 3;
      else e.dir = ady > 0 ? 2 : 0;

      // Attack player if close enough
      if (dist < 20 && e.attackCooldown <= 0) {
        e.attackCooldown = 60;
        player.hp -= e.damage;
        player.hurtTimer = 15;
        SFX.hurt();
        if (player.hp <= 0) {
          player.hp = 1; // Don't kill, just hurt badly
          // Teleport back to village
          player.x = 17*T+16;
          player.y = 12*T+16;
          kip.x = player.x + 32;
          kip.y = player.y;
          startDialog([
            { speaker: 'Noedels', text: 'Au au au... We moeten voorzichtiger zijn in het bos!' },
            { speaker: 'De Kip', text: '*tok tok tok...*' },
          ], () => {
            player.hp = Math.floor(player.maxHp * 0.5);
          });
        }
      }
    } else {
      e.state = 'idle';
      // Wander slowly
      e.moveTimer++;
      if (e.moveTimer > 90) {
        e.moveTimer = 0;
        e.wanderAngle += (Math.random()-0.5)*2;
        const wx = e.homeX + Math.cos(e.wanderAngle) * T * 2;
        const wy = e.homeY + Math.sin(e.wanderAngle) * T * 2;
        if (canWalk(wx, wy, 5)) {
          e.x += (wx - e.x) * 0.05;
          e.y += (wy - e.y) * 0.05;
        }
      }
    }
  });
}

function drawEnemy(e) {
  if (e.state === 'dead') {
    // Fade out
    ctx.globalAlpha = e.deadTimer / 60;
  }
  if (e.hurtTimer > 0 && e.hurtTimer % 4 < 2) {
    ctx.globalAlpha *= 0.5;
  }

  const x = e.x, y = e.y;
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(x, y+10, 8, 3, 0, 0, Math.PI*2);
  ctx.fill();

  if (e.type === 'wild_chicken') {
    // Red/brown wild chicken
    const bob = Math.sin(e.frame * 0.5) * 2;
    ctx.fillStyle = '#aa4422';
    ctx.beginPath();
    ctx.ellipse(x, y+bob, 7, 6, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#882211';
    ctx.beginPath();
    ctx.ellipse(x, y-7+bob, 4, 4, 0, 0, Math.PI*2);
    ctx.fill();
    // Comb
    ctx.fillStyle = '#ff3333';
    ctx.fillRect(x-1, y-13+bob, 3, 4);
    // Beak
    ctx.fillStyle = '#dda030';
    ctx.fillRect(x+3, y-8+bob, 4, 2);
    // Eye
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(x+1, y-9+bob, 2, 2);
    // Legs
    ctx.fillStyle = '#cc8020';
    ctx.fillRect(x-3, y+6, 2, 4);
    ctx.fillRect(x+1, y+6, 2, 4);
  } else if (e.type === 'fox') {
    // Orange fox
    const bob = Math.sin(e.frame * 0.4) * 1.5;
    // Body
    ctx.fillStyle = '#cc6622';
    ctx.beginPath();
    ctx.ellipse(x, y+2+bob, 10, 7, 0, 0, Math.PI*2);
    ctx.fill();
    // Head
    ctx.fillStyle = '#dd7733';
    ctx.beginPath();
    ctx.ellipse(x+(e.dir===1?6:e.dir===3?-6:0), y-6+bob, 6, 5, 0, 0, Math.PI*2);
    ctx.fill();
    // Ears
    ctx.fillStyle = '#cc6622';
    const hx = x+(e.dir===1?6:e.dir===3?-6:0);
    ctx.fillRect(hx-4, y-13+bob, 3, 5);
    ctx.fillRect(hx+1, y-13+bob, 3, 5);
    // Ear tips
    ctx.fillStyle = '#222';
    ctx.fillRect(hx-4, y-13+bob, 3, 2);
    ctx.fillRect(hx+1, y-13+bob, 3, 2);
    // Eyes
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(hx-3, y-7+bob, 2, 2);
    ctx.fillRect(hx+1, y-7+bob, 2, 2);
    // Snout
    ctx.fillStyle = '#fff';
    ctx.fillRect(hx-1, y-4+bob, 3, 2);
    // Tail
    ctx.fillStyle = '#cc6622';
    const td = e.dir === 1 ? -1 : e.dir === 3 ? 1 : 0;
    ctx.beginPath();
    ctx.ellipse(x+td*10, y+5+bob, 5, 3, td*0.5, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(x+td*13, y+5+bob, 3, 2, 0, 0, Math.PI*2);
    ctx.fill();
    // Legs
    ctx.fillStyle = '#aa5511';
    ctx.fillRect(x-5, y+7, 2, 4);
    ctx.fillRect(x+3, y+7, 2, 4);
  }

  // HP bar above enemy if damaged
  if (e.hp < e.maxHp && e.state !== 'dead') {
    const bw = 24;
    ctx.fillStyle = '#333';
    ctx.fillRect(x-bw/2, y-20, bw, 4);
    ctx.fillStyle = '#e44';
    ctx.fillRect(x-bw/2, y-20, bw*(e.hp/e.maxHp), 4);
  }

  // Aggro indicator
  if (e.state === 'chase') {
    ctx.fillStyle = '#ff4444';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('!', x, y-22);
    ctx.textAlign = 'left';
  }

  ctx.globalAlpha = 1;
}

// --- MIST UPDATE ---
function spawnMist(nearPlayer) {
  mistState.active = true;
  mistState.fadeIn = 0;
  mistState.dialogShown = false;
  mistState.duration = 480 + Math.floor(Math.random() * 240); // 8-12 sec zichtbaar

  if (nearPlayer) {
    // Spawn dichtbij speler (2-4 tiles ervoor)
    const offsetX = (Math.random() - 0.5) * 4 * T;
    const offsetY = -2 * T + (Math.random() - 0.5) * 2 * T;
    mistState.x = Math.max(3*T, Math.min(55*T, player.x + offsetX));
    mistState.y = Math.max(26*T, Math.min(45*T, player.y + offsetY));
  } else {
    // Random positie in bos, maar niet te ver van speler (max 10 tiles)
    const angle = Math.random() * Math.PI * 2;
    const dist = (3 + Math.random() * 7) * T;
    mistState.x = Math.max(3*T, Math.min(55*T, player.x + Math.cos(angle) * dist));
    mistState.y = Math.max(26*T, Math.min(45*T, player.y + Math.sin(angle) * dist));
  }

  // Genereer mist-particles (meer en groter voor duidelijker effect)
  mistState.particles = [];
  for (let i = 0; i < 18; i++) {
    mistState.particles.push({
      ox: (Math.random() - 0.5) * 6 * T,
      oy: (Math.random() - 0.5) * 4 * T,
      r: 30 + Math.random() * 50,
      speed: 0.15 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
    });
  }
}

function updateMist() {
  if (gameState !== 'playing' && gameState !== 'mist_cutscene') return;
  const inForest = player.y > 24 * T;

  // Eerste keer het bos betreden → direct mist triggeren (dichtbij, op de speler)
  if (inForest && !mistState.enteredForest && !mistState.firstSeen) {
    mistState.enteredForest = true;
    // Spawn mist precies op de speler
    mistState.active = true;
    mistState.fadeIn = 0;
    mistState.dialogShown = false;
    mistState.duration = 900; // lang genoeg voor cutscene
    mistState.x = player.x;
    mistState.y = player.y;
    mistState.particles = [];
    for (let i = 0; i < 24; i++) {
      mistState.particles.push({
        ox: (Math.random() - 0.5) * 6 * T,
        oy: (Math.random() - 0.5) * 4 * T,
        r: 30 + Math.random() * 50,
        speed: 0.15 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
      });
    }
    // Start cutscene: blokkeer controls, begin fade in
    gameState = 'mist_cutscene';
    mistState.cutsceneTimer = 0;
    return;
  }
  if (inForest) mistState.enteredForest = true;

  // === MIST CUTSCENE (eerste keer) ===
  if (gameState === 'mist_cutscene') {
    mistState.cutsceneTimer++;
    // Fade mist snel in
    mistState.fadeIn = Math.min(1, mistState.fadeIn + 0.02);

    // Na 90 frames (~1.5 sec) mist volledig, start dialoog
    if (mistState.cutsceneTimer === 90) {
      mistState.firstSeen = true;
      mistState.dialogShown = true;
      startDialog(MIST_FIRST_DIALOG, () => {
        // Na dialoog: terug naar playing, mist begint te verdwijnen
        mistState.duration = 120; // nog 2 sec mist na dialoog
      });
    }
    // Camera en wereld nog updaten voor visueel effect
    updateCamera();
    return;
  }

  if (mistState.active) {
    // Snellere fade in
    if (mistState.fadeIn < 1) mistState.fadeIn = Math.min(1, mistState.fadeIn + 0.015);
    // Countdown
    mistState.duration--;

    // Trigger dialog wanneer speler dichtbij genoeg is
    if (!mistState.dialogShown) {
      const distToMist = Math.hypot(player.x - mistState.x, player.y - mistState.y);
      if (distToMist < 7 * T) {
        mistState.dialogShown = true;
        if (!mistState.firstSeen) {
          mistState.firstSeen = true;
          startDialog(MIST_FIRST_DIALOG, () => {});
        } else {
          const idx = Math.floor(Math.random() * MIST_SHORT_DIALOGS.length);
          startDialog(MIST_SHORT_DIALOGS[idx], () => {});
        }
      }
    }

    // Fade out en verdwijnen
    if (mistState.duration <= 0) {
      mistState.fadeIn = Math.max(0, mistState.fadeIn - 0.015);
      if (mistState.fadeIn <= 0) {
        mistState.active = false;
        // 30-60 seconden tot volgende mist (1800-3600 frames bij 60fps)
        mistState.timer = 1800 + Math.floor(Math.random() * 1800);
      }
    }
  } else if (inForest) {
    // Timer countdown alleen in het bos
    mistState.timer--;
    if (mistState.timer <= 0) {
      spawnMist(false);
    }
  }
}

// --- Check nearby gear pickups ---
function checkGearPickup() {
  if (missions.fix_invention.state !== 'started') return;
  GEAR_POSITIONS.forEach(g => {
    if (g.collected) return;
    const dist = Math.hypot(player.x - (g.x*T+16), player.y - (g.y*T+16));
    if (dist < 30) {
      g.collected = true;
      missions.fix_invention.gearsFound++;
      SFX.pickup();
      startDialog([
        { speaker: 'Noedels', text: `Een tandwiel gevonden! (${missions.fix_invention.gearsFound}/${missions.fix_invention.gearsNeeded})` },
        { speaker: 'De Kip', text: missions.fix_invention.gearsFound >= missions.fix_invention.gearsNeeded ? '*TOKTOK!*' : '*tok*' },
      ], () => {
        if (missions.fix_invention.gearsFound >= missions.fix_invention.gearsNeeded) {
          setMissionBar('Breng de tandwielen terug naar Professor Kansen!');
          npcs[2].marker = '?';
        } else {
          setMissionBar(`De Ei-O-Matic 3000: Tandwielen (${missions.fix_invention.gearsFound}/${missions.fix_invention.gearsNeeded})`);
        }
      });
    }
  });
}