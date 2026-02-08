// --- MULTI-MISSION SYSTEM ---
const missions = {
  // Mission 1: Golden Egg (original)
  golden_egg: {
    state: 'inactive', // inactive, triggered, investigate, search, found, return, completed
    talkedBakker: false,
    talkedBoer: false,
    talkedUitvinder: false,
    eggFound: false,
    eggReturned: false,
    title: 'Operatie Gouden Omelet',
  },
  // Mission 2: Catch fish for visser
  catch_fish: {
    state: 'inactive', // inactive, started, completed
    fishCaught: 0,
    fishNeeded: 3,
    title: 'De Goud-Baars Jacht',
  },
  // Mission 3: Fix Professor's invention (find 3 gears in the forest)
  fix_invention: {
    state: 'inactive', // inactive, started, completed
    gearsFound: 0,
    gearsNeeded: 3,
    title: 'De Ei-O-Matic 3000',
  },
  // Mission 4: Find recipe for bakker
  recipe_search: {
    state: 'inactive', // inactive, started, completed
    recipeFound: false,
    title: 'Het Geheime Recept',
  }
};

// Current active mission tracker
let currentMission = 'golden_egg';

// Gear locations in forest (for fix_invention)
const GEAR_POSITIONS = [
  { x: 10, y: 30, collected: false },
  { x: 25, y: 36, collected: false },
  { x: 8, y: 42, collected: false }
];

// === MIST SYSTEM (Kipland vs Wolkjesland) ===
const mistState = {
  active: false,
  timer: 60,    // eerste mist triggert bijna direct bij bos (1 sec)
  duration: 0,
  x: 0, y: 0,
  firstSeen: false,
  dialogShown: false,
  fadeIn: 0,    // 0-1 fade animatie
  particles: [],
  enteredForest: false,  // heeft speler ooit het bos betreden?
};

// Eerste ontmoeting: volledig gesprek
const MIST_FIRST_DIALOG = [
  { speaker: 'Noedels', text: 'Wacht... wat is DAT?!' },
  { speaker: 'De Kip', text: '*TOK TOK TOK!!*' },
  { speaker: 'Noedels', text: 'Er zweeft een vreemde mistflard tussen de bomen...' },
  { speaker: 'De Kip', text: '*fladdert opgewonden* TOK! TOKTOKTOK!' },
  { speaker: 'Noedels', text: 'Wat bedoel je? Je denkt toch niet dat...' },
  { speaker: 'De Kip', text: '*staat rechtop, borst vooruit* TOK! KIP-LAND!!' },
  { speaker: 'Noedels', text: 'Kipland?! Dat is belachelijk! Het is duidelijk een teken van...' },
  { speaker: 'Noedels', text: 'WOLKJESLAND! Een magisch land van wolken!' },
  { speaker: 'De Kip', text: '*stampvoet* KIP! LAND! KIPLAND!!' },
  { speaker: 'Noedels', text: 'Wolkjesland! Kijk hoe het zweeft, net als wolken!' },
  { speaker: 'De Kip', text: '*draait hoofd weg* ...tok.' },
  { speaker: 'Noedels', text: 'We zijn het duidelijk niet eens. Maar die mist... die is echt bijzonder.' },
  { speaker: 'De Kip', text: '*mompelt* ...kipland...' },
];

// 30+ korte varianten voor herhalende mist (willekeurige volgorde sprekers)
const MIST_SHORT_DIALOGS = [
  [{ speaker: 'De Kip', text: 'KIPLAND!!' }, { speaker: 'Noedels', text: 'Nope! Wolkjes!' }],
  [{ speaker: 'Noedels', text: 'Wolkjesland!' }, { speaker: 'De Kip', text: '*boos* KIPLAND!' }],
  [{ speaker: 'De Kip', text: '*wijst met vleugel* KIP! LAND!' }, { speaker: 'Noedels', text: 'Dat zijn wolken en dat weet je best.' }],
  [{ speaker: 'Noedels', text: 'Kijk, weer mist! Wolkjesland groeit!' }, { speaker: 'De Kip', text: '*tok tok* Kipland groeit, bedoel je!' }],
  [{ speaker: 'De Kip', text: 'TOK! Zie je? KIPLAND!' }, { speaker: 'Noedels', text: 'Ik zie wolken. Wolkjesland. Punt.' }],
  [{ speaker: 'Noedels', text: 'Wolkjes... land...' }, { speaker: 'De Kip', text: '*onderbreekt* KIP!' }],
  [{ speaker: 'De Kip', text: '*fluistert* ...kipland...' }, { speaker: 'Noedels', text: '*fluistert terug* ...wolkjesland...' }],
  [{ speaker: 'Noedels', text: 'Het is en blijft Wolkjesland.' }, { speaker: 'De Kip', text: '*schudt hoofd* Nee. Kip. Land.' }],
  [{ speaker: 'De Kip', text: '*springt op en neer* KIPKIPKIPLAND!!' }, { speaker: 'Noedels', text: 'Rustig! Het zijn gewoon wolken!' }],
  [{ speaker: 'Noedels', text: 'Daar weer! Zie je die wolkachtige structuur?' }, { speaker: 'De Kip', text: '*rolt met ogen* Dat is DUIDELIJK Kipland.' }],
  [{ speaker: 'De Kip', text: '*parmantig* Kip zegt: Kipland.' }, { speaker: 'Noedels', text: 'Noedels zegt: Wolkjesland. Einde discussie.' }],
  [{ speaker: 'Noedels', text: 'Wolken! Wolken! Wolken!' }, { speaker: 'De Kip', text: 'KIP! KIP! KIP!' }],
  [{ speaker: 'De Kip', text: '*tok* Je weet dat ik gelijk heb.' }, { speaker: 'Noedels', text: 'In welk universum? Het zijn WOLKEN.' }],
  [{ speaker: 'Noedels', text: '...Is dat niet gewoon nevel?' }, { speaker: 'De Kip', text: '*VERONTWAARDIGD TOK* Dat is Kipland en dat weet je!' }],
  [{ speaker: 'De Kip', text: 'Elke keer als ik mist zie denk ik: thuis!' }, { speaker: 'Noedels', text: 'Je thuis is HIER. En dat daar zijn wolken.' }],
  [{ speaker: 'Noedels', text: 'Serieus? Weer deze discussie?' }, { speaker: 'De Kip', text: '*koppig* KIPLAND. Altijd Kipland.' }],
  [{ speaker: 'De Kip', text: '*zingt* Kip-land, Kip-land, Kiiiiipland~' }, { speaker: 'Noedels', text: '*zucht* Wolkjesland. En je zingt vals.' }],
  [{ speaker: 'Noedels', text: 'Weet je wat het echte bewijs is? Het ZWEEFT.' }, { speaker: 'De Kip', text: '*fladdert* Kippen zweven ook! Soort van!' }],
  [{ speaker: 'De Kip', text: 'Oké maar als het Kipland is mag ik dan president zijn?' }, { speaker: 'Noedels', text: 'Het is Wolkjesland dus nee.' }],
  [{ speaker: 'Noedels', text: 'Wolkjesland. Finale antwoord.' }, { speaker: 'De Kip', text: '*stille tok* ...kipland.' }],
  [{ speaker: 'De Kip', text: '*staart naar mist* Kipland... zo mooi...' }, { speaker: 'Noedels', text: 'Dat is letterlijk water in de lucht.' }],
  [{ speaker: 'Noedels', text: 'Als wetenschapper zeg ik: condensatie.' }, { speaker: 'De Kip', text: 'Als kip zeg ik: KIPLAND.' }],
  [{ speaker: 'De Kip', text: '*plukt grassprieten* Voor het Kipland-welkomstfeest!' }, { speaker: 'Noedels', text: '...er is geen feest. Het zijn wolken.' }],
  [{ speaker: 'Noedels', text: 'Hé kijk, weer mist!' }, { speaker: 'De Kip', text: '*GALOPPEREERT ernaartoe* KIPLAND KIPLAND KIPL-' }, { speaker: 'Noedels', text: 'STOP! Niet in de mist rennen!' }],
  [{ speaker: 'De Kip', text: 'Weet je wat mijn droombaan is? Burgemeester van Kipland.' }, { speaker: 'Noedels', text: 'Dat land bestaat niet. Net als die baan.' }],
  [{ speaker: 'Noedels', text: 'Wolkjesland! Met pluizige huizen en...' }, { speaker: 'De Kip', text: '*boos getok* Dat is MIJN fantasie! Maar dan met kippen!' }],
  [{ speaker: 'De Kip', text: '*trots* Ik heb al een vlag ontworpen voor Kipland.' }, { speaker: 'Noedels', text: 'Met je vleugels?! ...en het is Wolkjesland.' }],
  [{ speaker: 'Noedels', text: 'Oké, compromis: Wolkenkipland?' }, { speaker: 'De Kip', text: '*overweegt* ...nee. Gewoon Kipland.' }],
  [{ speaker: 'De Kip', text: '*dansje* Kip-kip-kip-LAND! Kip-kip-kip-LAND!' }, { speaker: 'Noedels', text: 'Je maakt me gek. Wolkjesland.' }],
  [{ speaker: 'Noedels', text: 'Ik heb een boek gelezen over wolken. DIT is een wolk.' }, { speaker: 'De Kip', text: 'Ik heb een boek gelezen over KIP. DIT is Kipland.' }, { speaker: 'Noedels', text: '...kippen lezen geen boeken.' }],
  [{ speaker: 'De Kip', text: '*fluistert naar mist* Ik kom eraan, Kipland...' }, { speaker: 'Noedels', text: 'De mist kan je niet horen. Want het zijn wolken.' }],
  [{ speaker: 'Noedels', text: 'Moet je die mistflard zien! Prachtig!' }, { speaker: 'De Kip', text: 'Ja! Want het is van MIJ! Kipland!' }, { speaker: 'Noedels', text: 'Nee! Want het is van DE WOLKEN!' }],
  [{ speaker: 'De Kip', text: '*to-hok* Wacht, ik bedoel: TO-KIPLAND!' }, { speaker: 'Noedels', text: 'Dat is niet eens een woord. Wolkjesland.' }],
  [{ speaker: 'Noedels', text: 'Elke keer... elke keer dezelfde discussie.' }, { speaker: 'De Kip', text: 'Omdat je elke keer FOUT zit! KIPLAND!' }],
  [{ speaker: 'De Kip', text: '*legt ei van schrik* TOK! Kipland verschijnt weer!' }, { speaker: 'Noedels', text: 'Dat is mist. En raap je ei op.' }],
];

// Recipe location (for recipe_search)
const RECIPE_POS = { x: 15, y: 42, found: false };

// Fish spot positions (for catch_fish) - rond de bosvijver
const FISH_SPOTS = [
  { x: 34, y: 29 },
  { x: 37, y: 28 },
  { x: 39, y: 30 },
  { x: 36, y: 32 },
];

let gameTick = 0;
let walkSfxTimer = 0;
let clouds = [];
for (let i=0;i<8;i++) clouds.push({ x: Math.random()*MAP_W*T, y: Math.random()*MAP_H*T, w: 40+Math.random()*60, speed: 0.2+Math.random()*0.3 });

let titleTick = 0;
let titleClouds = [];
for (let i=0;i<6;i++) titleClouds.push({ x: Math.random()*canvas.width, y: 50+Math.random()*150, w: 60+Math.random()*80, speed: 0.3+Math.random()*0.4 });