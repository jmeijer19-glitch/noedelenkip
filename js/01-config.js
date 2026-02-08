// ============================================================
// NOEDELS & DE KIP v3 - Avonturen in het Dorp
// Complete HTML5 Canvas RPG with combat, missions, day/night, minimap
// ============================================================

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const T = 32; // tile size

// --- RESIZE ---
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();
