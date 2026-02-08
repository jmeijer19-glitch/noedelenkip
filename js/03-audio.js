// --- AUDIO ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playTone(freq, dur, type='square', vol=0.08) {
  try {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = vol;
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + dur);
  } catch(e) {}
}
const SFX = {
  walk: () => playTone(200 + Math.random()*50, 0.05, 'square', 0.03),
  interact: () => { playTone(440, 0.1); setTimeout(()=>playTone(660, 0.1), 100); },
  missionStart: () => { playTone(330,0.15); setTimeout(()=>playTone(440,0.15),150); setTimeout(()=>playTone(550,0.15),300); setTimeout(()=>playTone(660,0.2),450); },
  missionComplete: () => { [330,440,550,660,880].forEach((f,i)=>setTimeout(()=>playTone(f,0.2,'square',0.1),i*120)); },
  tok: () => playTone(800, 0.04, 'square', 0.06),
  dialog: () => playTone(300 + Math.random()*200, 0.03, 'square', 0.03),
  menuMove: () => playTone(400, 0.05, 'square', 0.05),
  menuSelect: () => { playTone(500,0.08); setTimeout(()=>playTone(700,0.1),80); },
  pickup: () => { playTone(600,0.1); setTimeout(()=>playTone(900,0.15),100); },
  hurt: () => playTone(150, 0.3, 'sawtooth', 0.06),
  hurtEnemy: () => playTone(250, 0.15, 'sawtooth', 0.05),
  attack: () => { playTone(350, 0.05, 'square', 0.07); setTimeout(()=>playTone(200, 0.08, 'sawtooth', 0.06), 50); },
  enemyDie: () => { playTone(400,0.1); setTimeout(()=>playTone(300,0.1),100); setTimeout(()=>playTone(200,0.15),200); },
  levelUp: () => { [440,550,660,880,1100].forEach((f,i)=>setTimeout(()=>playTone(f,0.15,'square',0.08),i*100)); },
};

// --- BACKGROUND MUSIC ---
let musicEnabled = true;
let showMinimap = !matchMedia('(pointer:coarse)').matches;
let musicPlaying = false;
let musicGain = null;
let musicInterval = null;

const MUSIC_MELODY = [
  // Vrolijk dorpsmuziekje - vlot tempo, 6 delen
  // A: hoofdthema
  [330,200,0],[349,200,0],[392,250,0],[440,200,0],[392,200,0],[349,200,0],[330,350,0],[0,150,0],
  [294,200,0],[330,200,0],[349,250,0],[392,200,0],[349,200,0],[330,200,0],[294,350,0],[0,150,0],
  // B: herhaling met variatie
  [330,200,0],[392,200,0],[440,250,0],[494,200,0],[440,200,0],[392,250,0],[330,350,0],[0,150,0],
  [349,200,0],[392,200,0],[349,200,0],[330,200,0],[294,200,0],[330,250,0],[262,400,0],[0,200,0],
  // C: brug - hoger register
  [440,200,0],[494,200,0],[523,250,0],[494,200,0],[440,200,0],[392,250,0],[440,350,0],[0,150,0],
  [392,200,0],[440,200,0],[392,200,0],[349,200,0],[330,200,0],[349,250,0],[392,400,0],[0,200,0],
  // D: dalend thema
  [494,200,0],[440,200,0],[392,250,0],[349,200,0],[330,200,0],[294,250,0],[262,350,0],[0,150,0],
  [294,200,0],[330,200,0],[349,200,0],[330,200,0],[294,250,0],[262,200,0],[294,400,0],[0,200,0],
  // E: speels intermezzo
  [330,150,0],[392,150,0],[330,150,0],[392,150,0],[440,200,0],[392,200,0],[349,300,0],[0,150,0],
  [294,150,0],[349,150,0],[294,150,0],[349,150,0],[392,200,0],[349,200,0],[330,300,0],[0,150,0],
  // F: afsluiting terug naar thema
  [262,200,0],[294,200,0],[330,250,0],[349,200,0],[392,200,0],[440,250,0],[392,350,0],[0,150,0],
  [349,200,0],[330,200,0],[294,200,0],[262,200,0],[294,250,0],[330,200,0],[262,500,0],[0,400,0],
];

function startMusic() {
  if (!musicEnabled || musicPlaying) return;
  // Browser vereist user gesture voor AudioContext
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().then(() => startMusic());
    return;
  }
  musicPlaying = true;
  musicGain = audioCtx.createGain();
  musicGain.gain.value = 0.12;
  musicGain.connect(audioCtx.destination);
  let noteIdx = 0;
  function playNext() {
    if (!musicEnabled || !musicPlaying) return;
    const [freq, dur] = MUSIC_MELODY[noteIdx % MUSIC_MELODY.length];
    if (freq > 0) {
      try {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = 'triangle';
        o.frequency.value = freq;
        g.gain.value = 1.0;
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur/1000 * 0.9);
        o.connect(g);
        g.connect(musicGain);
        o.start();
        o.stop(audioCtx.currentTime + dur/1000);
      } catch(e) {}
    }
    noteIdx++;
    musicInterval = setTimeout(playNext, dur);
  }
  playNext();
}

function stopMusic() {
  musicPlaying = false;
  if (musicInterval) { clearTimeout(musicInterval); musicInterval = null; }
}

function toggleMusic() {
  musicEnabled = !musicEnabled;
  if (musicEnabled) startMusic();
  else stopMusic();
}
