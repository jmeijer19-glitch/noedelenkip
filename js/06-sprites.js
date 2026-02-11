// --- PIXEL ART DRAWING HELPERS ---
function drawPixel(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
}

// --- SPRITE DRAWING ---
function drawNoedels(x, y, dir, frame, scale=1) {
  const s = scale;
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(0, 14*s, 8*s, 3*s, 0, 0, Math.PI*2);
  ctx.fill();
  const bounce = Math.sin(frame * 0.3) * 1.5 * s;
  const legFrame = Math.sin(frame * 0.6);
  const legOff = legFrame * 3 * s;
  ctx.fillStyle = C.shortsBlue;
  ctx.fillRect(-4*s, 4*s+bounce, 3*s, 6*s);
  ctx.fillRect(1*s, 4*s+bounce, 3*s, 6*s);
  ctx.fillStyle = '#4a3020';
  ctx.fillRect(-4*s, 10*s+bounce+legOff, 3*s, 3*s);
  ctx.fillRect(1*s, 10*s+bounce-legOff, 3*s, 3*s);
  ctx.fillStyle = C.shortsBlue;
  ctx.fillRect(-5*s, 1*s+bounce, 10*s, 5*s);
  ctx.fillStyle = C.shirtGreen;
  ctx.fillRect(-6*s, -7*s+bounce, 12*s, 10*s);
  ctx.fillStyle = '#f0d060';
  ctx.fillRect(-2*s, -4*s+bounce, 4*s, 1*s);
  ctx.fillRect(-1*s, -3*s+bounce, 2*s, 1*s);
  ctx.fillRect(-2*s, -2*s+bounce, 4*s, 1*s);
  ctx.fillStyle = C.skinTone;
  const armSwing = legFrame * 2 * s;
  ctx.fillRect(-8*s, -5*s+bounce+armSwing, 3*s, 7*s);
  ctx.fillRect(5*s, -5*s+bounce-armSwing, 3*s, 7*s);
  ctx.fillStyle = C.skinTone;
  ctx.fillRect(-6*s, -15*s+bounce, 12*s, 9*s);
  ctx.fillStyle = C.hairBrown;
  ctx.fillRect(-7*s, -18*s+bounce, 14*s, 5*s);
  ctx.fillRect(-8*s, -17*s+bounce, 2*s, 3*s);
  ctx.fillRect(6*s, -17*s+bounce, 2*s, 3*s);
  ctx.fillRect(-5*s, -19*s+bounce, 3*s, 2*s);
  ctx.fillRect(3*s, -19*s+bounce, 4*s, 2*s);
  ctx.fillRect(0*s, -20*s+bounce, 2*s, 2*s);
  ctx.fillStyle = C.glassesDark;
  ctx.fillRect(-5*s, -13*s+bounce, 4*s, 3*s);
  ctx.fillRect(1*s, -13*s+bounce, 4*s, 3*s);
  ctx.fillRect(-1*s, -12*s+bounce, 2*s, 1*s);
  ctx.fillStyle = '#fff';
  ctx.fillRect(-4*s, -12*s+bounce, 2*s, 2*s);
  ctx.fillRect(2*s, -12*s+bounce, 2*s, 2*s);
  ctx.fillStyle = '#222';
  if (dir === 0) {
    ctx.fillRect(-3*s, -12*s+bounce, 1*s, 1*s);
    ctx.fillRect(3*s, -12*s+bounce, 1*s, 1*s);
  } else if (dir === 2) {
    ctx.fillRect(-3*s, -11*s+bounce, 1*s, 1*s);
    ctx.fillRect(3*s, -11*s+bounce, 1*s, 1*s);
  } else if (dir === 1) {
    ctx.fillRect(-3*s, -11*s+bounce, 1*s, 1*s);
    ctx.fillRect(3*s, -11*s+bounce, 1*s, 1*s);
  } else {
    ctx.fillRect(-4*s, -11*s+bounce, 1*s, 1*s);
    ctx.fillRect(2*s, -11*s+bounce, 1*s, 1*s);
  }
  ctx.fillStyle = '#a06040';
  ctx.fillRect(-1*s, -9*s+bounce, 3*s, 1*s);
  ctx.restore();
}

function drawKip(x, y, dir, frame, scale=1, flutter=false) {
  const s = scale;
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(0, 10*s, 7*s, 2.5*s, 0, 0, Math.PI*2);
  ctx.fill();
  const bob = Math.sin(frame * 0.4) * s;
  const flt = flutter ? Math.sin(frame * 2) * 3 * s : 0;
  ctx.fillStyle = '#d4a020';
  const legF = Math.sin(frame * 0.5) * 2 * s;
  ctx.fillRect(-3*s, 5*s+bob, 2*s, 5*s);
  ctx.fillRect(1*s, 5*s+bob, 2*s, 5*s);
  ctx.fillRect(-4*s, 9*s+bob+legF, 3*s, 2*s);
  ctx.fillRect(0*s, 9*s+bob-legF, 3*s, 2*s);
  ctx.fillStyle = C.kipWhite;
  ctx.beginPath();
  ctx.ellipse(0, 0+bob+flt, 8*s, 7*s, 0, 0, Math.PI*2);
  ctx.fill();
  if (flutter) {
    ctx.fillStyle = '#e8e8e0';
    ctx.save();
    ctx.translate(-7*s, -2*s+bob+flt);
    ctx.rotate(Math.sin(frame*3)*0.5);
    ctx.fillRect(-6*s, -2*s, 6*s, 5*s);
    ctx.restore();
    ctx.save();
    ctx.translate(7*s, -2*s+bob+flt);
    ctx.rotate(-Math.sin(frame*3)*0.5);
    ctx.fillRect(0, -2*s, 6*s, 5*s);
    ctx.restore();
  } else {
    ctx.fillStyle = '#e8e8e0';
    ctx.fillRect(-8*s, -1*s+bob, 3*s, 5*s);
    ctx.fillRect(5*s, -1*s+bob, 3*s, 5*s);
  }
  ctx.fillStyle = '#e0e0d0';
  ctx.fillRect(-3*s, -6*s+bob+flt, 6*s, 3*s);
  ctx.fillRect(-2*s, -8*s+bob+flt, 4*s, 3*s);
  ctx.fillStyle = C.kipWhite;
  ctx.beginPath();
  ctx.ellipse(0, -9*s+bob+flt, 5*s, 5*s, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = C.kipComb;
  ctx.fillRect(-2*s, -15*s+bob+flt, 2*s, 3*s);
  ctx.fillRect(0, -16*s+bob+flt, 2*s, 4*s);
  ctx.fillRect(2*s, -14*s+bob+flt, 2*s, 2*s);
  ctx.fillStyle = C.kipBeak;
  if (dir === 1 || dir === 2) {
    ctx.fillRect(3*s, -10*s+bob+flt, 5*s, 3*s);
    ctx.fillRect(4*s, -7*s+bob+flt, 3*s, 2*s);
  } else if (dir === 3) {
    ctx.fillRect(-8*s, -10*s+bob+flt, 5*s, 3*s);
    ctx.fillRect(-7*s, -7*s+bob+flt, 3*s, 2*s);
  } else {
    ctx.fillRect(-1*s, -10*s+bob+flt, 3*s, 3*s);
    ctx.fillRect(0, -7*s+bob+flt, 2*s, 2*s);
  }
  ctx.fillStyle = '#cc3333';
  if (dir === 1 || dir === 2) {
    ctx.fillRect(4*s, -7*s+bob+flt, 2*s, 3*s);
  } else if (dir === 3) {
    ctx.fillRect(-6*s, -7*s+bob+flt, 2*s, 3*s);
  } else {
    ctx.fillRect(0, -7*s+bob+flt, 2*s, 2*s);
  }
  ctx.fillStyle = C.kipEye;
  if (dir === 0) {
    ctx.fillRect(-2*s, -11*s+bob+flt, 2*s, 2*s);
    ctx.fillRect(1*s, -11*s+bob+flt, 2*s, 2*s);
  } else if (dir === 1 || dir === 2) {
    ctx.fillRect(1*s, -11*s+bob+flt, 2*s, 2*s);
  } else {
    ctx.fillRect(-3*s, -11*s+bob+flt, 2*s, 2*s);
  }
  ctx.fillStyle = '#888';
  if (dir === 0 || dir === 2) {
    ctx.fillRect(-3*s, -12*s+bob+flt, 3*s, 1*s);
    ctx.fillRect(1*s, -12*s+bob+flt, 3*s, 1*s);
  }
  ctx.restore();
}

// --- DRAW COOP CHICKEN (small chickens in the coop) ---
// growth: 0 = just hatched (tiny chick), 1 = fully grown
function drawCoopChicken(x, y, dir, frame, chickenColor, isGolden, growth) {
  // Scale: chick starts at 0.25, grows to 0.6
  const s = 0.25 + growth * 0.35;
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath();
  ctx.ellipse(0, 6*s, 5*s, 2*s, 0, 0, Math.PI*2);
  ctx.fill();

  const bob = Math.sin(frame * 0.5) * s;
  // Baby chicks bob faster
  const chickBob = growth < 0.5 ? Math.sin(frame * 0.8) * s * 1.5 : bob;

  // Legs
  ctx.fillStyle = '#d4a020';
  ctx.fillRect(-2*s, 3*s+chickBob, 1.5*s, 3*s);
  ctx.fillRect(0.5*s, 3*s+chickBob, 1.5*s, 3*s);

  if (growth < 0.4) {
    // --- BABY CHICK: round fluffy ball ---
    // Fluffy body (rounder, yellow-ish)
    const babyColor = chickenColor === '#ffd700' ? '#ffe44d' : '#f5e880';
    ctx.fillStyle = babyColor;
    ctx.beginPath();
    ctx.ellipse(0, -1+chickBob, 5*s, 5*s, 0, 0, Math.PI*2);
    ctx.fill();
    // Tiny beak
    ctx.fillStyle = '#dda030';
    ctx.fillRect(3*s, -2*s+chickBob, 2.5*s, 1.5*s);
    // Dot eyes (bigger relative to head)
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(1.5*s, -2.5*s+chickBob, 1*s, 0, Math.PI*2);
    ctx.fill();
    // Tiny wing fluff
    ctx.fillStyle = babyColor === '#ffe44d' ? '#ffd200' : '#e8d860';
    ctx.fillRect(-5*s, -1*s+chickBob, 2*s, 2.5*s);
    ctx.fillRect(3*s, -1*s+chickBob, 2*s, 2.5*s);
  } else {
    // --- GROWING / ADULT CHICKEN ---
    // Body
    ctx.fillStyle = chickenColor;
    ctx.beginPath();
    ctx.ellipse(0, 0+bob, 5*s, 4*s, 0, 0, Math.PI*2);
    ctx.fill();
    // Wings
    ctx.fillStyle = chickenColor === '#ffd700' ? '#e6c200' : '#d8d0c0';
    ctx.fillRect(-5*s, -0.5*s+bob, 2*s, 3*s);
    ctx.fillRect(3*s, -0.5*s+bob, 2*s, 3*s);
    // Head
    ctx.fillStyle = chickenColor;
    ctx.beginPath();
    ctx.ellipse(0, -5*s+bob, 3.5*s, 3.5*s, 0, 0, Math.PI*2);
    ctx.fill();
    // Comb (grows with age)
    const combScale = Math.max(0, (growth - 0.4) / 0.6); // 0 at 0.4, 1 at 1.0
    if (combScale > 0.1) {
      ctx.fillStyle = '#cc3333';
      ctx.fillRect(-1*s, (-9-combScale)*s+bob, 1.5*s, 2*combScale*s);
      ctx.fillRect(0.5*s, (-10-combScale)*s+bob, 1.5*s, 3*combScale*s);
    }
    // Beak
    ctx.fillStyle = '#dda030';
    ctx.fillRect(2*s, -6*s+bob, 3*s, 2*s);
    // Eye
    ctx.fillStyle = '#222';
    ctx.fillRect(1*s, -6.5*s+bob, 1.5*s, 1.5*s);
  }

  // Golden glitter effect
  if (isGolden) {
    const sparkle = Math.sin(frame * 0.3 + x) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(255,255,150,${sparkle * 0.6})`;
    ctx.beginPath();
    ctx.arc(Math.sin(frame*0.7)*3, -3*s+chickBob+Math.cos(frame*0.5)*2, 1.5+s, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(Math.cos(frame*0.4)*4, chickBob+Math.sin(frame*0.6)*3, 1+s, 0, Math.PI*2);
    ctx.fill();
  }

  ctx.restore();
}

// --- DRAW MOOS (Friese Stabij) ---
function drawMoos(x, y, dir, frame, scale=1) {
  const s = scale;
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  // Schaduw
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(0, 8*s, 10*s, 3*s, 0, 0, Math.PI*2);
  ctx.fill();

  const bob = Math.sin(frame * 0.5) * 1.5 * s;
  const wag = Math.sin(frame * 0.8) * 0.3; // staart kwispel

  // Poten (bruin-wit)
  const legF = Math.sin(frame * 0.6) * 3 * s;
  ctx.fillStyle = '#f0e6d0'; // wit/creme
  ctx.fillRect(-6*s, 3*s+bob, 3*s, 6*s);
  ctx.fillRect(3*s, 3*s+bob, 3*s, 6*s);
  // Achterpoten
  ctx.fillRect(-5*s, 4*s+bob+legF, 2.5*s, 5*s);
  ctx.fillRect(2*s, 4*s+bob-legF, 2.5*s, 5*s);

  // Lichaam (zwart-wit vlekkenpatroon - Friese Stabij)
  ctx.fillStyle = '#1a1a1a'; // zwart hoofdkleur
  ctx.beginPath();
  ctx.ellipse(0, 0+bob, 10*s, 7*s, 0, 0, Math.PI*2);
  ctx.fill();
  // Witte buik/borstvlek
  ctx.fillStyle = '#f5f0e8';
  ctx.beginPath();
  ctx.ellipse(0, 3*s+bob, 6*s, 4*s, 0, 0, Math.PI*2);
  ctx.fill();
  // Zwarte rug
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.ellipse(0, -3*s+bob, 8*s, 4*s, 0, 0, Math.PI*2);
  ctx.fill();

  // Staart (kwispelend!)
  ctx.save();
  if (dir === 0) { // omhoog
    ctx.translate(0, 7*s+bob);
  } else if (dir === 1) { // rechts
    ctx.translate(-8*s, -1*s+bob);
  } else if (dir === 3) { // links
    ctx.translate(8*s, -1*s+bob);
  } else { // omlaag
    ctx.translate(0, -7*s+bob);
  }
  ctx.rotate(wag);
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(-1.5*s, -6*s, 3*s, 7*s);
  // Witte staartpunt
  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(-1*s, -8*s, 2*s, 3*s);
  ctx.restore();

  // Kop
  ctx.fillStyle = '#1a1a1a';
  const headX = dir === 1 ? 6*s : dir === 3 ? -6*s : 0;
  const headY = dir === 0 ? -6*s : dir === 2 ? 4*s : -4*s;
  ctx.beginPath();
  ctx.ellipse(headX, headY+bob, 6*s, 5*s, 0, 0, Math.PI*2);
  ctx.fill();

  // Snuit (wit/bruin)
  ctx.fillStyle = '#d4a060';
  const snuitX = dir === 1 ? headX+4*s : dir === 3 ? headX-4*s : headX;
  const snuitY = dir === 0 ? headY-2*s : dir === 2 ? headY+3*s : headY+2*s;
  ctx.beginPath();
  ctx.ellipse(snuitX, snuitY+bob, 3*s, 2.5*s, 0, 0, Math.PI*2);
  ctx.fill();

  // Neus
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(snuitX, snuitY-1*s+bob, 1.5*s, 0, Math.PI*2);
  ctx.fill();

  // Floppy oren (Stabij kenmerk!)
  ctx.fillStyle = '#1a1a1a';
  if (dir === 1 || dir === 2) {
    // Rechts kijkend - linkeroor zichtbaar
    ctx.beginPath();
    ctx.ellipse(headX-5*s, headY+1*s+bob, 3*s, 5*s, -0.2, 0, Math.PI*2);
    ctx.fill();
  } else if (dir === 3) {
    // Links kijkend - rechteroor zichtbaar
    ctx.beginPath();
    ctx.ellipse(headX+5*s, headY+1*s+bob, 3*s, 5*s, 0.2, 0, Math.PI*2);
    ctx.fill();
  } else {
    // Beide oren
    ctx.beginPath();
    ctx.ellipse(headX-4*s, headY+1*s+bob, 2.5*s, 5*s, -0.2, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(headX+4*s, headY+1*s+bob, 2.5*s, 5*s, 0.2, 0, Math.PI*2);
    ctx.fill();
  }

  // Ogen
  ctx.fillStyle = '#4a2800'; // bruine ogen
  if (dir === 0) {
    ctx.fillRect(headX-3*s, headY-2*s+bob, 2*s, 2*s);
    ctx.fillRect(headX+1*s, headY-2*s+bob, 2*s, 2*s);
  } else if (dir === 1 || dir === 2) {
    ctx.fillRect(headX+1*s, headY-2*s+bob, 2*s, 2*s);
  } else {
    ctx.fillRect(headX-3*s, headY-2*s+bob, 2*s, 2*s);
  }
  // Oog glans
  ctx.fillStyle = '#fff';
  if (dir === 0) {
    ctx.fillRect(headX-2*s, headY-2*s+bob, 1*s, 1*s);
    ctx.fillRect(headX+2*s, headY-2*s+bob, 1*s, 1*s);
  } else if (dir === 1 || dir === 2) {
    ctx.fillRect(headX+2*s, headY-2*s+bob, 1*s, 1*s);
  } else {
    ctx.fillRect(headX-2*s, headY-2*s+bob, 1*s, 1*s);
  }

  // Tong (soms uitstekend als hij blij is)
  if (Math.sin(frame * 0.1) > 0.7) {
    ctx.fillStyle = '#ff6080';
    ctx.fillRect(snuitX-1*s, snuitY+2*s+bob, 2*s, 3*s);
  }

  ctx.restore();
}
