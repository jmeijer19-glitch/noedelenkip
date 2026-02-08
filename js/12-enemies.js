// --- ENEMIES (Combat system) ---
const enemies = [];
const ENEMY_TYPES = {
  wild_chicken: { name: 'Wilde Kip', hp: 20, maxHp: 20, speed: 1, damage: 5, xp: 15, color: '#aa4422' },
  fox: { name: 'Bosvos', hp: 35, maxHp: 35, speed: 1.5, damage: 10, xp: 25, color: '#cc6622' },
};

function spawnEnemies() {
  enemies.length = 0;
  // Spawn enemies only in forest area (y >= 26)
  const spawnPoints = [
    { x: 12, y: 28, type: 'wild_chicken' },
    { x: 22, y: 30, type: 'wild_chicken' },
    { x: 6, y: 35, type: 'fox' },
    { x: 20, y: 40, type: 'fox' },
    { x: 28, y: 34, type: 'wild_chicken' },
    { x: 14, y: 44, type: 'fox' },
    { x: 10, y: 38, type: 'wild_chicken' },
  ];
  spawnPoints.forEach(sp => {
    const t = ENEMY_TYPES[sp.type];
    enemies.push({
      type: sp.type,
      name: t.name,
      x: sp.x * T + 16,
      y: sp.y * T + 16,
      homeX: sp.x * T + 16,
      homeY: sp.y * T + 16,
      hp: t.maxHp,
      maxHp: t.maxHp,
      speed: t.speed,
      damage: t.damage,
      xp: t.xp,
      color: t.color,
      dir: 2,
      frame: 0,
      state: 'idle', // idle, chase, hurt, dead
      moveTimer: 0,
      attackCooldown: 0,
      hurtTimer: 0,
      deadTimer: 0,
      aggroRange: 4 * T,
      wanderAngle: Math.random() * Math.PI * 2,
    });
  });
}