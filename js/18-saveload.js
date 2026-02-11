// --- SAVE / LOAD ---
function saveGame() {
  const save = {
    player: { x:player.x, y:player.y, dir:player.dir, hp:player.hp, maxHp:player.maxHp, xp:player.xp, level:player.level, inventory:player.inventory, talkedTo:player.talkedTo, speed:player.speed, coins:player.coins },
    missions: JSON.parse(JSON.stringify(missions)),
    currentMission,
    kipPos: { x:kip.x, y:kip.y },
    gears: GEAR_POSITIONS.map(g => g.collected),
    recipeFound: RECIPE_POS.found,
    dayTime: dayNight.time,
    gateOpen,
    mistFirstSeen: mistState.firstSeen,
    mistEnteredForest: mistState.enteredForest,
    moos: { x: moos.x, y: moos.y, met: moos.met, following: moos.following },
    hatchingEggs: hatchingEggs.map(e => ({ type: e.type, startTime: e.startTime, hatchTime: e.hatchTime })),
    hatchedChickens: hatchedChickens.map(c => ({ type: c.type, x: c.x, y: c.y, color: c.color, birthTime: c.birthTime })),
  };
  localStorage.setItem('noedels_save_v2', JSON.stringify(save));
  hasSave = true;
}

function loadGame() {
  const raw = localStorage.getItem('noedels_save_v2');
  if (!raw) return false;
  try {
    const save = JSON.parse(raw);
    Object.assign(player, save.player);
    Object.assign(missions, save.missions);
    currentMission = save.currentMission || 'golden_egg';
    kip.x = save.kipPos.x;
    kip.y = save.kipPos.y;
    if (save.gears) save.gears.forEach((c,i) => { if(GEAR_POSITIONS[i]) GEAR_POSITIONS[i].collected = c; });
    if (save.recipeFound !== undefined) RECIPE_POS.found = save.recipeFound;
    if (save.dayTime !== undefined) dayNight.time = save.dayTime;
    if (save.gateOpen !== undefined) gateOpen = save.gateOpen;
    if (save.mistFirstSeen !== undefined) mistState.firstSeen = save.mistFirstSeen;
    if (save.mistEnteredForest !== undefined) mistState.enteredForest = save.mistEnteredForest;
    if (save.moos) {
      moos.x = save.moos.x; moos.y = save.moos.y;
      moos.met = save.moos.met; moos.following = save.moos.following;
    }
    // Restore coins
    if (save.player.coins !== undefined) player.coins = save.player.coins;
    // Restore hatching eggs (timers persist via startTime)
    if (save.hatchingEggs) {
      hatchingEggs = save.hatchingEggs.map(e => ({
        type: e.type, startTime: e.startTime, hatchTime: e.hatchTime
      }));
    } else {
      hatchingEggs = [];
    }
    // Restore hatched chickens
    if (save.hatchedChickens) {
      hatchedChickens = save.hatchedChickens.map(c => ({
        type: c.type, x: c.x, y: c.y,
        dir: Math.floor(Math.random() * 4),
        frame: Math.random() * 100,
        wanderAngle: Math.random() * Math.PI * 2,
        wanderTimer: 0,
        color: c.color,
        birthTime: c.birthTime || (Date.now() - 120000), // fallback: already grown
      }));
    } else {
      hatchedChickens = [];
    }

    // Restore NPC markers
    npcs.forEach(n => n.marker = null);
    const m = missions;
    if (m.golden_egg.state === 'investigate') {
      if (!m.golden_egg.talkedBakker) npcs[0].marker = '!';
      if (!m.golden_egg.talkedBoer) npcs[1].marker = '!';
      if (!m.golden_egg.talkedUitvinder) npcs[2].marker = '!';
    }
    if (m.golden_egg.state === 'completed' && m.catch_fish.state === 'inactive') npcs[3].marker = '!';
    if (m.catch_fish.state === 'started' && m.catch_fish.fishCaught >= m.catch_fish.fishNeeded) npcs[3].marker = '?';
    if (m.catch_fish.state === 'completed' && m.fix_invention.state === 'inactive') npcs[2].marker = '!';
    if (m.fix_invention.state === 'started' && m.fix_invention.gearsFound >= m.fix_invention.gearsNeeded) npcs[2].marker = '?';
    if (m.fix_invention.state === 'completed' && m.recipe_search.state === 'inactive') npcs[0].marker = '!';
    if (m.recipe_search.state === 'started' && m.recipe_search.recipeFound) npcs[0].marker = '?';

    // Restore mission bar
    if (m.golden_egg.state === 'investigate') {
      const count = (m.golden_egg.talkedBakker?1:0)+(m.golden_egg.talkedBoer?1:0)+(m.golden_egg.talkedUitvinder?1:0);
      setMissionBar(`Operatie Gouden Omelet: Praat met de dorpelingen (${count}/3)`);
    } else if (m.golden_egg.state === 'search') {
      setMissionBar('Zoek het Gouden Ei in het bos! (Zoek in het hoge gras)');
    } else if (m.golden_egg.state === 'return') {
      setMissionBar('Breng het Gouden Ei terug naar het kippenhok!');
    } else if (m.catch_fish.state === 'started') {
      if (m.catch_fish.fishCaught >= m.catch_fish.fishNeeded) setMissionBar('Breng de vissen terug naar Visser Jan!');
      else setMissionBar(`De Goud-Baars Jacht: Vang vissen (${m.catch_fish.fishCaught}/${m.catch_fish.fishNeeded})`);
    } else if (m.fix_invention.state === 'started') {
      if (m.fix_invention.gearsFound >= m.fix_invention.gearsNeeded) setMissionBar('Breng de tandwielen terug naar Professor Kansen!');
      else setMissionBar(`De Ei-O-Matic 3000: Tandwielen (${m.fix_invention.gearsFound}/${m.fix_invention.gearsNeeded})`);
    } else if (m.recipe_search.state === 'started') {
      if (m.recipe_search.recipeFound) setMissionBar('Breng het Geheime Recept terug naar Bakker Piet!');
      else setMissionBar('Het Geheime Recept: Zoek het recept bij de mysterieuze steen');
    }
    startMusic();
    return true;
  } catch(e) { return false; }
}