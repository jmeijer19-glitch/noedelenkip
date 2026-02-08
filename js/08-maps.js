// --- MAP DATA ---
const MAP_W = 60, MAP_H = 50;
const map = [];

function generateMap() {
  for (let y=0;y<MAP_H;y++) {
    map[y] = [];
    for (let x=0;x<MAP_W;x++) {
      map[y][x] = 0;
    }
  }

  // === DORP (village) area: top-left 30x25 ===
  for (let x=5;x<35;x++) { map[12][x]=1; map[13][x]=1; }
  for (let y=3;y<25;y++) { map[y][17]=1; map[y][18]=1; }

  // Village square
  for (let y=10;y<16;y++) for (let x=14;x<22;x++) map[y][x]=1;
  map[11][17]=11; map[11][18]=11;

  // Noedels' house (red roof)
  for (let y=4;y<6;y++) for (let x=6;x<10;x++) map[y][x]=4;
  for (let y=6;y<9;y++) for (let x=6;x<10;x++) map[y][x]=3;
  map[8][8]=6;

  // Bakker's house (blue roof)
  for (let y=4;y<6;y++) for (let x=22;x<26;x++) map[y][x]=5;
  for (let y=6;y<9;y++) for (let x=22;x<26;x++) map[y][x]=3;
  map[8][24]=6;

  // Boer's house (green roof)
  for (let y=16;y<18;y++) for (let x=6;x<10;x++) map[y][x]=15;
  for (let y=18;y<21;y++) for (let x=6;x<10;x++) map[y][x]=3;
  map[20][8]=6;

  // Visser near water
  for (let y=16;y<18;y++) for (let x=27;x<31;x++) map[y][x]=5;
  for (let y=18;y<21;y++) for (let x=27;x<31;x++) map[y][x]=3;
  map[20][29]=6;

  // Professor Kansen's house
  for (let y=4;y<6;y++) for (let x=30;x<34;x++) map[y][x]=4;
  for (let y=6;y<9;y++) for (let x=30;x<34;x++) map[y][x]=3;
  map[8][32]=6;

  // Chicken coop - groot omheind terrein oost van het dorp
  // Pad van hoofdweg naar coop
  for (let x=35;x<=38;x++) { map[14][x]=1; map[15][x]=1; }
  // Hek rondom (x=36-42, y=16-22)
  for (let x=36;x<=42;x++) { map[16][x]=10; map[22][x]=10; }
  for (let y=16;y<=22;y++) { map[y][36]=10; map[y][42]=10; }
  // Poort: west-kant, bereikbaar vanaf pad
  map[19][36]=20;
  // Gras binnenin
  for (let y=17;y<=21;y++) for (let x=37;x<=41;x++) map[y][x]=0;
  // Het kippenhok (1 tile)
  map[17][39]=12;
  // Pad naar poort
  map[19][35]=1; map[19][34]=1;

  // Flowers
  map[10][6]=8; map[10][7]=8; map[9][22]=8; map[9][23]=8;
  map[15][8]=8; map[15][9]=8; map[10][30]=8;
  map[7][14]=8; map[7][15]=8;

  // Stones
  map[11][10]=9; map[16][15]=9; map[5][14]=9;

  // Trees border
  for (let x=0;x<MAP_W;x++) { map[0][x]=7; map[1][x]=7; }
  for (let y=0;y<25;y++) { map[y][0]=7; map[y][1]=7; }
  for (let x=0;x<5;x++) { map[2][x]=7; map[3][x]=7; }

  // Fence row
  for (let x=2;x<38;x++) { if(map[24][x]===0) map[24][x]=10; }
  map[24][17]=1; map[24][18]=1;
  for (let y=25;y<30;y++) { map[y][17]=1; map[y][18]=1; }

  // Fish spot near visser
  map[22][28]=19; map[23][29]=19;

  // Water/pond
  map[21][30]=2; map[21][31]=2; map[22][30]=2; map[22][31]=2; map[22][32]=2;
  map[23][31]=2; map[23][32]=2;
  for (let x=19;x<30;x++) map[21][x]=1;

  // Bridge
  map[22][29]=13;

  // === BOS (forest) ===
  for (let y=25;y<MAP_H;y++) {
    for (let x=0;x<MAP_W;x++) {
      if (map[y][x]===0) {
        const r = (x*31+y*17)%20;
        if (r<5) map[y][x]=7;
        else if (r===5) map[y][x]=8;
        else if (r===6) map[y][x]=9;
      }
    }
  }

  // Forest paths
  for (let y=25;y<MAP_H;y++) { map[y][17]=1; map[y][18]=1; }
  for (let x=8;x<30;x++) { map[32][x]=1; map[33][x]=1; }
  for (let y=33;y<42;y++) { map[y][8]=1; map[y][9]=1; }
  for (let x=8;x<22;x++) { map[38][x]=1; }

  // Clear around paths
  for (let y=25;y<MAP_H;y++) {
    for (let x=0;x<MAP_W;x++) {
      if (map[y][x]===1) {
        for (let dy=-1;dy<=1;dy++) for (let dx=-1;dx<=1;dx++) {
          const ny=y+dy, nx=x+dx;
          if (ny>=25 && ny<MAP_H && nx>=0 && nx<MAP_W && map[ny][nx]===7 && Math.random()<0.6) {
            map[ny][nx]=0;
          }
        }
      }
    }
  }

  // Tall grass for golden egg
  for (let y=35;y<40;y++) for (let x=12;x<18;x++) {
    if (map[y][x]===0) map[y][x]=14;
  }

  // Bosvijver (groot, met pad ernaartoe)
  // Pad van hoofdpad (x=30, y=32) naar vijver
  for (let x=30;x<36;x++) { map[32][x]=1; map[33][x]=1; }
  // Clear bomen rond vijverpad
  for (let x=29;x<37;x++) for (let y=31;y<35;y++) {
    if (map[y][x]===7) map[y][x]=0;
  }
  // Vijver water (5x4 met onregelmatige rand)
  for (let y=28;y<33;y++) for (let x=34;x<40;x++) {
    if (y===28 && (x<35||x>38)) continue; // onregelmatige bovenkant
    if (y===32 && (x<35||x>38)) continue; // onregelmatige onderkant
    map[y][x]=2;
  }
  // Vijverrand (pond_edge)
  map[27][35]=17; map[27][36]=17; map[27][37]=17; map[27][38]=17;
  map[33][35]=17; map[33][36]=17; map[33][37]=17;
  // Clear bomen rond vijver
  for (let y=26;y<35;y++) for (let x=32;x<42;x++) {
    if (map[y][x]===7 || map[y][x]===9) map[y][x]=0;
  }
  // Bloemen rond vijver
  map[27][34]=8; map[33][39]=8; map[28][41]=8;

  // Mystery spots
  map[30][10]=16;
  map[36][25]=17;
  map[42][15]=18;

  // Forest border
  for (let x=0;x<MAP_W;x++) map[MAP_H-1][x]=7;
  for (let y=25;y<MAP_H;y++) { map[y][0]=7; map[y][1]=7; map[y][MAP_W-1]=7; map[y][MAP_W-2]=7; }
  for (let y=0;y<25;y++) { map[y][MAP_W-1]=7; map[y][MAP_W-2]=7; }
  for (let y=0;y<3;y++) for (let x=36;x<MAP_W;x++) map[y][x]=7;
}

generateMap();