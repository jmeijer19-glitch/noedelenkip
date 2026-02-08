// --- MISSION SYSTEM ---
function getActiveMission() {
  return missions[currentMission];
}

function setMissionBar(text) {
  if (missionBarText !== text) missionChangeTick = gameTick;
  missionBarText = text;
  missionBarTarget = 1;
}

function checkMissionTriggers() {
  const m = missions;

  // Mission 1: Golden Egg
  if (m.golden_egg.state === 'inactive') {
    const coopDist = Math.hypot(player.x - 39*T+16, player.y - 17*T+16);
    if (coopDist < 3*T) {
      m.golden_egg.state = 'triggered';
      currentMission = 'golden_egg';
      kip.flutter = true;
      kip.flutterTimer = 120;
      SFX.missionStart();
      startDialog([
        { speaker: 'De Kip', text: '*TOKTOKTOKTOK!!!*' },
        { speaker: 'Noedels', text: 'Wat is er, Kip? Waarom doe je zo paniek--' },
        { speaker: 'Noedels', text: 'Wacht... het nest is leeg! Waar is het Gouden Ei?!' },
        { speaker: 'De Kip', text: '*tok... tok...*' },
        { speaker: 'Noedels', text: 'Iemand heeft het Gouden Ei gestolen! Of... het is weggerold?' },
        { speaker: 'Noedels', text: 'We moeten het terugvinden! Laat ik de dorpelingen vragen of ze iets gezien hebben.' },
      ], () => {
        m.golden_egg.state = 'investigate';
        setMissionBar('Operatie Gouden Omelet: Praat met de dorpelingen (0/3)');
        npcs[0].marker = '!';
        npcs[1].marker = '!';
        npcs[2].marker = '!';
      });
    }
  }

  // Mission 2: Catch fish - triggers after golden egg completed, near visser
  if (m.golden_egg.state === 'completed' && m.catch_fish.state === 'inactive') {
    const visserDist = Math.hypot(player.x - npcs[3].x, player.y - npcs[3].y);
    if (visserDist < 2.5*T) {
      // Will be handled by NPC interaction
    }
  }

  // Mission 3: Fix invention - triggers after fish mission, near professor
  if (m.catch_fish.state === 'completed' && m.fix_invention.state === 'inactive') {
    // Handled by NPC interaction
  }

  // Mission 4: Recipe search - triggers after fix invention, near bakker
  if (m.fix_invention.state === 'completed' && m.recipe_search.state === 'inactive') {
    // Handled by NPC interaction
  }
}

function updateMissionProgress() {
  const m = missions;
  if (m.golden_egg.state === 'investigate') {
    const count = (m.golden_egg.talkedBakker?1:0) + (m.golden_egg.talkedBoer?1:0) + (m.golden_egg.talkedUitvinder?1:0);
    setMissionBar(`Operatie Gouden Omelet: Praat met de dorpelingen (${count}/3)`);
    if (count >= 3) {
      m.golden_egg.state = 'search';
      setMissionBar('Zoek het Gouden Ei in het bos! (Zoek in het hoge gras)');
    }
  }
}