// --- GAME STATE ---
let gameState = 'title';
let titleSelection = 0;
const titleOptions = ['Nieuw Spel', 'Doorgaan', 'Opties', 'Wat is nieuw', 'Credits'];
let hasSave = !!localStorage.getItem('noedels_save_v2');

const player = {
  x: 8*T+16, y: 10*T+16,
  dir: 2,
  speed: 2.5,
  frame: 0,
  moving: false,
  hp: 100, maxHp: 100,
  xp: 0, level: 1,
  inventory: [],
  talkedTo: {},
  attackCooldown: 0,
  attackAnim: 0,
  hurtTimer: 0,
  fishCount: 0,
  gearsFound: 0,
};

const kip = {
  x: 8*T+48, y: 10*T+16,
  dir: 2,
  frame: 0,
  moving: false,
  flutter: false,
  flutterTimer: 0,
  targetX: 0, targetY: 0,
  speed: 2.2,
  tokTimer: 0,
  tokBubble: false,
};

// === MOOS (Friese Stabij) ===
const moos = {
  x: 15*T, y: 34*T,  // Startpositie in het bos (op een pad)
  dir: 2,
  frame: 0,
  moving: false,
  speed: 2.4,
  met: false,          // Heeft speler Moos al ontmoet?
  following: false,    // Volgt Moos de groep?
  wafTimer: 0,
  wafBubble: false,
  tailWag: 0,          // Extra kwispel bij interactie
};

const MOOS_MEET_DIALOG = [
  { speaker: 'Noedels', text: 'Hé, kijk daar eens! Een hond!' },
  { speaker: 'Noedels', text: 'MOOS!! Ben jij dat?!' },
  { speaker: 'Moos', text: '*WAF WAF!!* 🐕' },
  { speaker: 'Noedels', text: 'Moos! Wat doe jij hier in het bos, joh!' },
  { speaker: 'Moos', text: '*kwispelt zo hard dat zijn hele lijf wiebelt* WAF!' },
  { speaker: 'De Kip', text: '*verstijft* ...tok?' },
  { speaker: 'De Kip', text: '*schuilt achter Noedels* TOK TOK TOK!!' },
  { speaker: 'Noedels', text: 'Kip, rustig! Moos is lief! Hij doet je niks!' },
  { speaker: 'De Kip', text: '*kijkt angstig naar Moos* ...hij... hij eet kippen op!' },
  { speaker: 'Moos', text: '*likt De Kip over zijn hele kop* WAF!' },
  { speaker: 'De Kip', text: '*FLADDERT VAN SCHRIK* TOKTOKTOKTOKTOK!!' },
  { speaker: 'Noedels', text: 'Haha! Zie je? Hij vindt je juist leuk!' },
  { speaker: 'De Kip', text: '*rillt* ...oké... maar als hij me opeet is het JOUW schuld.' },
  { speaker: 'Noedels', text: 'Moos, ga je mee op avontuur?' },
  { speaker: 'Moos', text: '*WAF!!* 🐕 *draait rondjes van blijdschap*' },
  { speaker: 'Noedels', text: 'Dan zijn we nu met z\'n drieën! Noedels, De Kip, en Moos!' },
  { speaker: 'De Kip', text: '*mompelt* ...als ik maar niet het toetje ben...' },
];

const camera = { x: 0, y: 0 };
let dialogQueue = [];
let dialogIndex = 0;
let dialogCharIndex = 0;
let dialogTimer = 0;
let dialogCallback = null;
let missionBarText = '';
let missionBarAlpha = 0;
let missionBarTarget = 0;
let missionChangeTick = 0;