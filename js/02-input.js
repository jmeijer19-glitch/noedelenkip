// --- INPUT ---
const keys = {};
window.addEventListener('keydown', e => { keys[e.key] = true; e.preventDefault(); });
window.addEventListener('keyup', e => { keys[e.key] = false; });

// --- VIRTUAL JOYSTICK ---
const joystickState = { active: false, dx: 0, dy: 0 };
const joystickBase = document.getElementById('joystick-base');
const joystickThumb = document.getElementById('joystick-thumb');
const joystickZone = document.getElementById('joystick-zone');

let joystickTouchId = null;
let joystickCenterX = 0, joystickCenterY = 0;

function initJoystick() {
  if (!joystickBase) return;
  joystickZone.addEventListener('touchstart', e => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    joystickTouchId = touch.identifier;
    const rect = joystickBase.getBoundingClientRect();
    joystickCenterX = rect.left + rect.width/2;
    joystickCenterY = rect.top + rect.height/2;
    joystickState.active = true;
    updateJoystickPos(touch.clientX, touch.clientY);
  }, {passive:false});

  document.addEventListener('touchmove', e => {
    if (joystickTouchId === null) return;
    for (let i=0;i<e.changedTouches.length;i++) {
      if (e.changedTouches[i].identifier === joystickTouchId) {
        e.preventDefault();
        updateJoystickPos(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
        break;
      }
    }
  }, {passive:false});

  document.addEventListener('touchend', e => {
    for (let i=0;i<e.changedTouches.length;i++) {
      if (e.changedTouches[i].identifier === joystickTouchId) {
        joystickTouchId = null;
        joystickState.active = false;
        joystickState.dx = 0;
        joystickState.dy = 0;
        joystickThumb.style.transform = 'translate(0px, 0px)';
        break;
      }
    }
  });
  document.addEventListener('touchcancel', e => {
    joystickTouchId = null;
    joystickState.active = false;
    joystickState.dx = 0;
    joystickState.dy = 0;
    joystickThumb.style.transform = 'translate(0px, 0px)';
  });
}

function updateJoystickPos(cx, cy) {
  let dx = cx - joystickCenterX;
  let dy = cy - joystickCenterY;
  const maxR = 45;
  const dist = Math.hypot(dx, dy);
  if (dist > maxR) { dx = dx/dist*maxR; dy = dy/dist*maxR; }
  joystickThumb.style.transform = `translate(${dx}px, ${dy}px)`;
  const deadzone = 10;
  if (dist < deadzone) {
    joystickState.dx = 0;
    joystickState.dy = 0;
  } else {
    joystickState.dx = dx / maxR;
    joystickState.dy = dy / maxR;
  }
}

initJoystick();

// --- TOUCH BUTTONS ---
const touchBtnState = { action: false, cancel: false, inventory: false };
function setupTouchBtn(id, key) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('touchstart', e => { e.preventDefault(); touchBtnState[key] = true; }, {passive:false});
  el.addEventListener('touchend', e => { e.preventDefault(); touchBtnState[key] = false; }, {passive:false});
  el.addEventListener('touchcancel', e => { touchBtnState[key] = false; });
}
setupTouchBtn('btn-action', 'action');
setupTouchBtn('btn-cancel', 'cancel');
setupTouchBtn('btn-inventory', 'inventory');

// Minimap toggle button
const minimapBtn = document.getElementById('btn-minimap');
if (minimapBtn) {
  minimapBtn.addEventListener('touchstart', e => {
    e.preventDefault();
    showMinimap = !showMinimap;
    minimapBtn.style.background = showMinimap ? 'rgba(100,200,100,0.5)' : 'rgba(100,200,100,0.15)';
  }, {passive:false});
}

function isDown(action) {
  switch(action) {
    case 'up': return keys['ArrowUp']||keys['w']||keys['W']||(joystickState.dy < -0.3);
    case 'down': return keys['ArrowDown']||keys['s']||keys['S']||(joystickState.dy > 0.3);
    case 'left': return keys['ArrowLeft']||keys['a']||keys['A']||(joystickState.dx < -0.3);
    case 'right': return keys['ArrowRight']||keys['d']||keys['D']||(joystickState.dx > 0.3);
    case 'confirm': return keys['Enter']||keys[' ']||touchBtnState.action;
    case 'cancel': return keys['Escape']||keys['Backspace']||touchBtnState.cancel;
  }
  return false;
}

// Joystick gives analog direction
function getJoystickDir() {
  if (!joystickState.active) return { dx:0, dy:0 };
  return { dx: joystickState.dx, dy: joystickState.dy };
}

let confirmPressed = false, confirmJust = false;
let cancelPressed = false, cancelJust = false;
let invPressed = false, invJust = false;

function updateInput() {
  const cp = isDown('confirm');
  confirmJust = cp && !confirmPressed;
  confirmPressed = cp;
  const cc = isDown('cancel');
  cancelJust = cc && !cancelPressed;
  cancelPressed = cc;
  const ip = keys['i']||keys['I']||touchBtnState.inventory;
  invJust = ip && !invPressed;
  invPressed = ip;
}
