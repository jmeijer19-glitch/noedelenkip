// --- COLLISION ---
function isSolid(px, py) {
  const tx = Math.floor(px / T);
  const ty = Math.floor(py / T);
  if (tx<0||ty<0||tx>=MAP_W||ty>=MAP_H) return true;
  const tile = map[ty][tx];
  if (tile === 20) return !gateOpen; // gate: solid when closed
  return TILE_SOLID.includes(tile);
}

function canWalk(px, py, radius=6) {
  return !isSolid(px-radius, py-radius) && !isSolid(px+radius, py-radius) &&
         !isSolid(px-radius, py+radius) && !isSolid(px+radius, py+radius);
}

function getTileAt(px, py) {
  const tx = Math.floor(px / T);
  const ty = Math.floor(py / T);
  if (tx<0||ty<0||tx>=MAP_W||ty>=MAP_H) return -1;
  return map[ty][tx];
}