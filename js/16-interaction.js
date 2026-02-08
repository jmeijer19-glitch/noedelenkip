// --- NPC INTERACTION ---
function interactWithNPC(npc) {
  SFX.interact();
  const m = missions;

  // Golden egg mission dialogs
  if (m.golden_egg.state === 'investigate') {
    const key = 'golden_omelet_investigate';
    if (npc.missionDialog[key]) {
      if (npc.id === 'bakker' && !m.golden_egg.talkedBakker) {
        m.golden_egg.talkedBakker = true;
        npc.marker = null;
        startDialog(npc.missionDialog[key], () => { updateMissionProgress(); });
        return;
      }
      if (npc.id === 'boer' && !m.golden_egg.talkedBoer) {
        m.golden_egg.talkedBoer = true;
        npc.marker = null;
        startDialog(npc.missionDialog[key], () => { updateMissionProgress(); });
        return;
      }
      if (npc.id === 'uitvinder' && !m.golden_egg.talkedUitvinder) {
        m.golden_egg.talkedUitvinder = true;
        npc.marker = null;
        startDialog(npc.missionDialog[key], () => { updateMissionProgress(); });
        return;
      }
    }
  }

  // Mission 2: Catch fish - start
  if (npc.id === 'visser' && m.golden_egg.state === 'completed' && m.catch_fish.state === 'inactive') {
    m.catch_fish.state = 'started';
    currentMission = 'catch_fish';
    npc.marker = null;
    SFX.missionStart();
    startDialog(npc.missionDialog['catch_fish_start'], () => {
      setMissionBar('De Goud-Baars Jacht: Vang 3 vissen bij de bosvijver (0/3)');
      // Add fish spots around the forest pond
      FISH_SPOTS.forEach(s => { map[s.y][s.x] = 19; });
    });
    return;
  }

  // Mission 2: Complete fish delivery
  if (npc.id === 'visser' && m.catch_fish.state === 'started' && m.catch_fish.fishCaught >= m.catch_fish.fishNeeded) {
    m.catch_fish.state = 'completed';
    SFX.missionComplete();
    player.xp += 40;
    player.inventory.push('Vishengel');
    startDialog(npc.missionDialog['catch_fish'], () => {
      setMissionBar('Missie Voltooid: De Goud-Baars Jacht!');
      npcs[2].marker = '!'; // Professor gets marker for next mission
      setTimeout(() => { missionBarTarget = 0; }, 4000);
      saveGame();
    });
    return;
  }

  // Mission 3: Fix invention - start
  if (npc.id === 'uitvinder' && m.catch_fish.state === 'completed' && m.fix_invention.state === 'inactive') {
    m.fix_invention.state = 'started';
    currentMission = 'fix_invention';
    npc.marker = null;
    SFX.missionStart();
    startDialog([
      { speaker: 'Professor Kansen', text: 'Noedels! Mijn Ei-O-Matic 3000 is kapot!' },
      { speaker: 'Professor Kansen', text: 'Er zijn 3 tandwielen uitgevlogen bij de explosie. Ze liggen ergens in het bos!' },
      { speaker: 'Professor Kansen', text: 'Zoek de glinsterende tandwielen! Ze zijn groot en zilverkleurig.' },
      { speaker: 'Noedels', text: 'Drie tandwielen in het bos? We gaan zoeken!' },
      { speaker: 'De Kip', text: '*tok tok*' },
    ], () => {
      setMissionBar('De Ei-O-Matic 3000: Zoek 3 tandwielen in het bos (0/3)');
      // Reset gear positions
      GEAR_POSITIONS.forEach(g => g.collected = false);
    });
    return;
  }

  // Mission 3: Complete gear delivery
  if (npc.id === 'uitvinder' && m.fix_invention.state === 'started' && m.fix_invention.gearsFound >= m.fix_invention.gearsNeeded) {
    m.fix_invention.state = 'completed';
    SFX.missionComplete();
    player.xp += 60;
    player.speed = 3.0; // Speed boost!
    player.inventory.push('Snelheids-Schoenen');
    startDialog(npc.missionDialog['fix_invention'], () => {
      setMissionBar('Missie Voltooid: De Ei-O-Matic 3000!');
      npcs[0].marker = '!'; // Bakker gets marker for recipe mission
      setTimeout(() => { missionBarTarget = 0; }, 4000);
      saveGame();
    });
    return;
  }

  // Mission 4: Recipe search - start
  if (npc.id === 'bakker' && m.fix_invention.state === 'completed' && m.recipe_search.state === 'inactive') {
    m.recipe_search.state = 'started';
    currentMission = 'recipe_search';
    npc.marker = null;
    SFX.missionStart();
    startDialog([
      { speaker: 'Bakker Piet', text: 'Noedels! Ik heb je hulp nodig!' },
      { speaker: 'Bakker Piet', text: 'Mijn overgrootmoeders Geheime Noedelbrood Recept is kwijt!' },
      { speaker: 'Bakker Piet', text: 'Ze zei altijd dat ze het verstopt had bij de mysterieuze steen in het bos...' },
      { speaker: 'Bakker Piet', text: 'Kun je het voor me zoeken? Het moet ergens bij die vreemde rots zijn!' },
      { speaker: 'Noedels', text: 'Een geheim recept bij een mysterieuze steen? Klinkt avontuurlijk!' },
      { speaker: 'De Kip', text: '*tok!*' },
    ], () => {
      setMissionBar('Het Geheime Recept: Zoek het recept bij de mysterieuze steen');
      RECIPE_POS.found = false;
    });
    return;
  }

  // Mission 4: Complete recipe delivery
  if (npc.id === 'bakker' && m.recipe_search.state === 'started' && m.recipe_search.recipeFound) {
    m.recipe_search.state = 'completed';
    SFX.missionComplete();
    player.xp += 80;
    player.inventory.push('Noedelbrood');
    player.maxHp = 150;
    player.hp = 150;
    startDialog(npc.missionDialog['recipe_search'], () => {
      setMissionBar('ALLE MISSIES VOLTOOID! Je bent een ware dorpsheld!');
      setTimeout(() => { missionBarTarget = 0; }, 6000);
      saveGame();
    });
    return;
  }

  // Default dialog
  startDialog(npc.defaultDialog);
}

function findNearbyNPC() {
  for (const npc of npcs) {
    const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
    if (dist < 2.5*T) return npc;
  }
  return null;
}

// --- CHECK INTERACTION ---
function checkInteraction() {
  const npc = findNearbyNPC();
  if (npc) {
    interactWithNPC(npc);
    return;
  }

  const dx = [0,1,0,-1][player.dir];
  const dy = [-1,0,1,0][player.dir];
  const checkX = player.x + dx * T;
  const checkY = player.y + dy * T;
  const tile = getTileAt(checkX, checkY);
  const m = missions;

  if (tile === 11) {
    SFX.interact();
    if (m.golden_egg.state === 'inactive') {
      startDialog([
        { speaker: 'Noedels', text: 'Het prikbord van het dorp. Er hangt een briefje: "GEZOCHT: avonturiers voor klusjes".' },
        { speaker: 'De Kip', text: '*tok*' },
        { speaker: 'Noedels', text: 'Hmm, misschien later. Eerst even rondkijken in het dorp.' },
      ]);
    } else {
      const allDone = m.golden_egg.state === 'completed' && m.catch_fish.state === 'completed' &&
                       m.fix_invention.state === 'completed' && m.recipe_search.state === 'completed';
      if (allDone) {
        startDialog([{ speaker: 'Noedels', text: 'Alle missies voltooid! Het dorp is veilig dankzij ons!' }, { speaker: 'De Kip', text: '*tok tok tok*' }]);
      } else {
        startDialog([{ speaker: 'Noedels', text: `Huidige missie: ${missionBarText}` }]);
      }
    }
    return;
  }

  // Kippenhok: proximity-based (binnen 3 tiles van het hok)
  const coopTileX = 39, coopTileY = 17;
  const playerTileX = Math.floor(player.x / T);
  const playerTileY = Math.floor(player.y / T);
  const distToCoop = Math.hypot(playerTileX - coopTileX, playerTileY - coopTileY);
  if (tile === 12 || (distToCoop < 3 && (m.golden_egg.state === 'return' || m.golden_egg.state === 'inactive' || m.golden_egg.state === 'completed'))) {
    SFX.interact();
    if (m.golden_egg.state === 'return' || (m.golden_egg.state === 'search' && m.golden_egg.eggFound)) {
      m.golden_egg.state = 'completed';
      m.golden_egg.eggReturned = true;
      SFX.missionComplete();
      player.xp += 50;
      player.inventory.push('Omelet Recept');
      startDialog([
        { speaker: 'Noedels', text: 'Hier Kip, het Gouden Ei! Terug waar het hoort.' },
        { speaker: 'De Kip', text: '*TOKTOKTOKTOK!!!*' },
        { speaker: 'Noedels', text: 'Blij dat je blij bent! Dat was best een avontuur.' },
        { speaker: 'De Kip', text: '*tok. tok tok.*' },
        { speaker: 'Noedels', text: 'Wacht, geeft ze mij een... recept? "Gouden Omelet Recept"?!' },
        { speaker: 'De Kip', text: '*tok*' },
        { speaker: 'Noedels', text: '+50 XP verdiend! En een Omelet Recept!' },
        { speaker: 'Professor Kansen', text: 'Oh! Jullie hebben het gevonden! Mooi mooi... Ik beloof dat de volgende versie niet meer wegrolt. Waarschijnlijk.' },
        { speaker: 'Noedels', text: '...Waarschijnlijk. Geweldig.' },
      ], () => {
        setMissionBar('Missie Voltooid: Operatie Gouden Omelet!');
        npcs[3].marker = '!'; // Visser gets marker for next mission
        setTimeout(() => { missionBarTarget = 0; }, 4000);
        checkLevelUp();
        saveGame();
      });
      return;
    }
    if (m.golden_egg.state === 'completed') {
      startDialog([
        { speaker: 'Noedels', text: 'Het Gouden Ei ligt veilig in het nest. Kip ziet er tevreden uit.' },
        { speaker: 'De Kip', text: '*tok*' },
      ]);
    } else if (distToCoop < 3) {
      startDialog([
        { speaker: 'Noedels', text: 'Het kippenhok. Ruikt naar... kip.' },
        { speaker: 'De Kip', text: '*tok*' },
      ]);
    }
    return;
  }

  if (tile === 20) {
    SFX.interact();
    gateOpen = !gateOpen;
    startDialog([
      { speaker: 'Noedels', text: gateOpen ? 'De poort staat nu open.' : 'De poort is weer dicht.' },
    ]);
    return;
  }

  if (m.golden_egg.state === 'search') {
    // Proximity-based egg finding: check player distance to egg
    const playerTX = Math.floor(player.x / T);
    const playerTY = Math.floor(player.y / T);
    const eggDist = Math.hypot(playerTX - GOLDEN_EGG_POS.x, playerTY - GOLDEN_EGG_POS.y);
    if (eggDist < 3) {
      SFX.pickup();
      m.golden_egg.eggFound = true;
      m.golden_egg.state = 'return';
      map[GOLDEN_EGG_POS.y][GOLDEN_EGG_POS.x] = 0;
      startDialog([
        { speaker: 'Noedels', text: 'Wacht... wat glinst daar?!' },
        { speaker: 'De Kip', text: '*TOKTOKTOK!!!*' },
        { speaker: 'Noedels', text: 'Het GOUDEN EI! Gevonden! Het lag hier verstopt in het gras!' },
        { speaker: 'Noedels', text: 'Het gloeit een beetje... Professor Kansen z\'n werk, denk ik.' },
        { speaker: 'De Kip', text: '*tok tok tok*' },
        { speaker: 'Noedels', text: 'Snel, terug naar het kippenhok!' },
      ], () => {
        setMissionBar('Breng het Gouden Ei terug naar het kippenhok!');
        player.inventory.push('Gouden Ei');
      });
    } else if (eggDist < 6) {
      kip.flutter = true;
      kip.flutterTimer = 60;
      startDialog([
        { speaker: 'De Kip', text: '*tok?! TOK?!*' },
        { speaker: 'Noedels', text: 'Kip wordt opgewonden... Het moet dichtbij zijn!' },
      ]);
    } else if (tile === 14) {
      startDialog([
        { speaker: 'Noedels', text: 'Alleen maar gras hier...' },
        { speaker: 'De Kip', text: '*tok...*' },
      ]);
    }
    return;
  }

  // Fish spot interaction - proximity-based (within 2 tiles of any fish spot)
  if (m.catch_fish.state === 'started' && m.catch_fish.fishCaught < m.catch_fish.fishNeeded) {
    const nearFish = FISH_SPOTS.find(s => {
      const dist = Math.hypot(Math.floor(player.x/T) - s.x, Math.floor(player.y/T) - s.y);
      return dist < 2.5;
    });
    if (nearFish || tile === 19) {
      SFX.interact();
      m.catch_fish.fishCaught++;
      SFX.pickup();
      startDialog([
        { speaker: 'Noedels', text: `*SPLASH* ...Gevangen! Een mooie Goud-Baars! (${m.catch_fish.fishCaught}/${m.catch_fish.fishNeeded})` },
        { speaker: 'De Kip', text: m.catch_fish.fishCaught >= m.catch_fish.fishNeeded ? '*TOKTOK!*' : '*tok*' },
      ], () => {
        if (m.catch_fish.fishCaught >= m.catch_fish.fishNeeded) {
          setMissionBar('Breng de vissen terug naar Visser Jan!');
          npcs[3].marker = '?';
        } else {
          setMissionBar(`De Goud-Baars Jacht: Vang vissen (${m.catch_fish.fishCaught}/${m.catch_fish.fishNeeded})`);
        }
      });
      return;
    }
  }

  if (tile === 19) {
    SFX.interact();
    startDialog([
      { speaker: 'Noedels', text: 'Een visgelegenheid. Het water kolkt hier.' },
      { speaker: 'De Kip', text: '*tok*' },
    ]);
    return;
  }

  if (tile === 16) {
    SFX.interact();
    startDialog([
      { speaker: 'Noedels', text: 'Een holle boom. Er zit iets in... nee, het is gewoon een eekhoorn.' },
      { speaker: 'De Kip', text: '*tok*' },
    ]);
    return;
  }

  if (tile === 18) {
    SFX.interact();
    // Recipe search: mystery rock
    if (m.recipe_search.state === 'started' && !m.recipe_search.recipeFound) {
      m.recipe_search.recipeFound = true;
      SFX.pickup();
      player.inventory.push('Geheim Recept');
      startDialog([
        { speaker: 'Noedels', text: 'Wacht... er zit iets onder deze steen!' },
        { speaker: 'Noedels', text: 'Een oud, vergeeld perkament... "Geheim Noedelbrood Recept"!' },
        { speaker: 'Noedels', text: 'Dit is het! We moeten dit naar Bakker Piet brengen!' },
        { speaker: 'De Kip', text: '*TOKTOK!*' },
      ], () => {
        setMissionBar('Breng het Geheime Recept terug naar Bakker Piet!');
        npcs[0].marker = '?';
      });
      return;
    }
    startDialog([
      { speaker: 'Noedels', text: 'Een vreemde steen met een symbool erop. Het lijkt op een... noodle?' },
      { speaker: 'Noedels', text: 'Bizar. Ik vraag me af wie dit hier heeft neergezet.' },
      { speaker: 'De Kip', text: '*tok tok*' },
    ]);
    return;
  }

  if (tile === 6) {
    SFX.interact();
    startDialog([{ speaker: 'Noedels', text: 'De deur zit op slot. Misschien een andere keer.' }]);
    return;
  }
}