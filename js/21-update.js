// --- UPDATE PLAYER ---
function updatePlayer() {
  let dx = 0, dy = 0;
  // Keyboard
  if (isDown('up')) { dy = -1; player.dir = 0; }
  if (isDown('down')) { dy = 1; player.dir = 2; }
  if (isDown('left')) { dx = -1; player.dir = 3; }
  if (isDown('right')) { dx = 1; player.dir = 1; }

  // Joystick analog (override if active)
  if (joystickState.active && (Math.abs(joystickState.dx) > 0.2 || Math.abs(joystickState.dy) > 0.2)) {
    dx = joystickState.dx;
    dy = joystickState.dy;
    // Set direction from joystick
    if (Math.abs(dx) > Math.abs(dy)) {
      player.dir = dx > 0 ? 1 : 3;
    } else {
      player.dir = dy > 0 ? 2 : 0;
    }
  } else if (dx !== 0 && dy !== 0) {
    dx *= 0.707;
    dy *= 0.707;
  }

  player.moving = Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1;

  if (player.moving) {
    const sp = player.speed;
    const nx = player.x + dx * sp;
    const ny = player.y + dy * sp;
    if (canWalk(nx, player.y)) player.x = nx;
    if (canWalk(player.x, ny)) player.y = ny;
    player.frame += 0.2;
    walkSfxTimer++;
    if (walkSfxTimer > 12) { SFX.walk(); walkSfxTimer = 0; }
  } else {
    walkSfxTimer = 0;
  }

  // Cooldowns
  if (player.attackCooldown > 0) player.attackCooldown--;
  if (player.attackAnim > 0) player.attackAnim--;
  if (player.hurtTimer > 0) player.hurtTimer--;

  // Interaction
  if (confirmJust) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    // On touch: A button doubles as attack if near enemy
    const nearEnemy = enemies.find(e => e.state !== 'dead' && Math.hypot(player.x - e.x, player.y - e.y) < 2*T);
    if (nearEnemy && player.y > 24*T) {
      playerAttack();
    } else {
      checkInteraction();
    }
  }

  // Attack key (X or tap A near enemy)
  if ((keys['x'] || keys['X']) && gameState === 'playing') {
    keys['x'] = false; keys['X'] = false;
    playerAttack();
  }

  // Inventory toggle
  if (invJust) {
    gameState = 'inventory';
  }

  // Pause
  if (cancelJust && gameState === 'playing') {
    gameState = 'paused';
  }

  // Mission triggers
  checkMissionTriggers();
  // Gear pickup check
  checkGearPickup();
  // Mist system
  updateMist();
  // Hatching eggs + coop chickens
  updateHatching();
  updateCoopChickens();
  // Coin particles
  updateCoinParticles();
}

// --- UPDATE KIP ---
function updateKip() {
  const dist = Math.hypot(player.x - kip.x, player.y - kip.y);
  const followDist = 40;
  const runDist = 100;

  if (kip.flutterTimer > 0) {
    kip.flutterTimer--;
    if (kip.flutterTimer <= 0) kip.flutter = false;
  }

  if (dist > followDist) {
    const angle = Math.atan2(player.y - kip.y, player.x - kip.x);
    let speed = kip.speed;
    if (dist > runDist) speed = player.speed * 1.5;

    const nx = kip.x + Math.cos(angle) * speed;
    const ny = kip.y + Math.sin(angle) * speed;

    if (canWalk(nx, kip.y, 4)) kip.x = nx;
    if (canWalk(kip.x, ny, 4)) kip.y = ny;
    kip.moving = true;
    kip.frame += 0.15;

    const adx = player.x - kip.x;
    const ady = player.y - kip.y;
    if (Math.abs(adx) > Math.abs(ady)) {
      kip.dir = adx > 0 ? 1 : 3;
    } else {
      kip.dir = ady > 0 ? 2 : 0;
    }
  } else {
    kip.moving = false;
    kip.dir = player.dir;
  }

  kip.tokTimer++;
  if (kip.tokTimer > 300 + Math.random()*200) {
    kip.tokTimer = 0;
    kip.tokBubble = true;
    SFX.tok();
    setTimeout(() => { kip.tokBubble = false; }, 1500);
  }

  if (missions.golden_egg.state === 'search' && !missions.golden_egg.eggFound) {
    const eggDist = Math.hypot(kip.x/T - GOLDEN_EGG_POS.x, kip.y/T - GOLDEN_EGG_POS.y);
    if (eggDist < 4) {
      if (!kip.flutter && Math.random() < 0.01) {
        kip.flutter = true;
        kip.flutterTimer = 60;
      }
    }
  }
}

// --- UPDATE MOOS ---
function updateMoos() {
  if (!moos.following && !moos.met) {
    // Moos wacht in het bos - lichte idle animatie
    moos.frame += 0.05;
    // Check of speler dichtbij komt voor ontmoeting
    if (player.y > 24 * T) {
      const dist = Math.hypot(player.x - moos.x, player.y - moos.y);
      if (dist < 4 * T && gameState === 'playing') {
        moos.met = true;
        moos.following = true;
        moos.tailWag = 120; // Extra kwispel
        startDialog(MOOS_MEET_DIALOG, () => {
          player.inventory.push('Moos (Friese Stabij)');
        });
      }
    }
    return;
  }

  if (!moos.following) return;

  // Volg de kip (die al achter Noedels loopt) - zo vormen ze een rij
  const followTarget = kip;
  const dist = Math.hypot(followTarget.x - moos.x, followTarget.y - moos.y);
  const followDist = 35;
  const runDist = 90;

  if (moos.tailWag > 0) moos.tailWag--;

  if (dist > followDist) {
    const angle = Math.atan2(followTarget.y - moos.y, followTarget.x - moos.x);
    let speed = moos.speed;
    if (dist > runDist) speed = player.speed * 1.6; // Moos is snel!

    const nx = moos.x + Math.cos(angle) * speed;
    const ny = moos.y + Math.sin(angle) * speed;

    if (canWalk(nx, moos.y, 4)) moos.x = nx;
    if (canWalk(moos.x, ny, 4)) moos.y = ny;
    moos.moving = true;
    moos.frame += 0.2;

    const adx = followTarget.x - moos.x;
    const ady = followTarget.y - moos.y;
    if (Math.abs(adx) > Math.abs(ady)) {
      moos.dir = adx > 0 ? 1 : 3;
    } else {
      moos.dir = ady > 0 ? 2 : 0;
    }
  } else {
    moos.moving = false;
    moos.dir = kip.dir; // Kijkt dezelfde kant op als Kip
  }

  // Af en toe blaffen
  moos.wafTimer++;
  if (moos.wafTimer > 400 + Math.random()*300) {
    moos.wafTimer = 0;
    moos.wafBubble = true;
    moos.tailWag = 60;
    setTimeout(() => { moos.wafBubble = false; }, 1200);
  }
}

// --- UPDATE NPCs ---
function updateNPCs() {
  npcs.forEach(npc => {
    npc.moveTimer++;
    if (npc.moveTimer > 120 + Math.random()*120) {
      npc.moveTimer = 0;
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * npc.moveRadius * T;
      const tx = npc.homeX + Math.cos(angle) * dist;
      const ty = npc.homeY + Math.sin(angle) * dist;
      if (canWalk(tx, ty, 6)) {
        npc.x += (tx - npc.x) * 0.02;
        npc.y += (ty - npc.y) * 0.02;
      }
    }
    const d = Math.hypot(player.x - npc.x, player.y - npc.y);
    if (d < 3*T) {
      const adx = player.x - npc.x;
      const ady = player.y - npc.y;
      if (Math.abs(adx) > Math.abs(ady)) npc.dir = adx > 0 ? 1 : 3;
      else npc.dir = ady > 0 ? 2 : 0;
    }
  });
}

// --- UPDATE HATCHING EGGS ---
function updateHatching() {
  const now = Date.now();
  for (let i = hatchingEggs.length - 1; i >= 0; i--) {
    const egg = hatchingEggs[i];
    const elapsed = (now - egg.startTime) / 1000;
    if (elapsed >= egg.hatchTime) {
      // Egg has hatched! Create a chicken
      const eggType = EGG_TYPES[egg.type];
      const coopCenterX = 39 * T + 16;
      const coopCenterY = 17 * T + 16;
      hatchedChickens.push({
        type: egg.type,
        x: coopCenterX + (Math.random() - 0.5) * 3 * T,
        y: coopCenterY + (Math.random() - 0.5) * 2 * T,
        dir: Math.floor(Math.random() * 4),
        frame: Math.random() * 100,
        wanderAngle: Math.random() * Math.PI * 2,
        wanderTimer: 0,
        color: eggType.chickenColor,
      });
      hatchingEggs.splice(i, 1);
      SFX.hatch();
      // XP reward based on egg type
      const xpReward = egg.type === 'gouden_ei' ? 30 : egg.type === 'groot_ei' ? 15 : 5;
      player.xp += xpReward;
      checkLevelUp();
      setMissionBar(`Een ${eggType.name} is uitgebroed! +${xpReward} XP! Er loopt een nieuw kuiken in het hok!`);
      setTimeout(() => { missionBarTarget = 0; }, 4000);
      saveGame();
    }
  }
}

// --- UPDATE COOP CHICKENS (wandering) ---
function updateCoopChickens() {
  const coopCenterX = 39 * T + 16;
  const coopCenterY = 17 * T + 16;
  const coopRadius = 3 * T;

  hatchedChickens.forEach(chick => {
    chick.frame += 0.05;
    chick.wanderTimer++;
    if (chick.wanderTimer > 120 + Math.random() * 180) {
      chick.wanderTimer = 0;
      chick.wanderAngle += (Math.random() - 0.5) * 2;
    }
    // Wander slowly
    const speed = 0.3;
    const nx = chick.x + Math.cos(chick.wanderAngle) * speed;
    const ny = chick.y + Math.sin(chick.wanderAngle) * speed;
    // Stay within coop area
    const distFromCenter = Math.hypot(nx - coopCenterX, ny - coopCenterY);
    if (distFromCenter < coopRadius) {
      chick.x = nx;
      chick.y = ny;
    } else {
      // Turn around
      chick.wanderAngle = Math.atan2(coopCenterY - chick.y, coopCenterX - chick.x) + (Math.random() - 0.5) * 1;
    }
    // Update direction
    const cos = Math.cos(chick.wanderAngle);
    const sin = Math.sin(chick.wanderAngle);
    if (Math.abs(cos) > Math.abs(sin)) chick.dir = cos > 0 ? 1 : 3;
    else chick.dir = sin > 0 ? 2 : 0;
  });
}

// --- UPDATE COIN PARTICLES ---
function updateCoinParticles() {
  for (let i = coinParticles.length - 1; i >= 0; i--) {
    const p = coinParticles[i];
    p.y += p.vy;
    p.vy += 0.05;
    p.life--;
    if (p.life <= 0) coinParticles.splice(i, 1);
  }
}

// --- CAMERA ---
function updateCamera() {
  const targetX = player.x - canvas.width/2;
  const targetY = player.y - canvas.height/2;
  camera.x += (targetX - camera.x) * 0.1;
  camera.y += (targetY - camera.y) * 0.1;
  camera.x = Math.max(0, Math.min(MAP_W*T - canvas.width, camera.x));
  camera.y = Math.max(0, Math.min(MAP_H*T - canvas.height, camera.y));
}
