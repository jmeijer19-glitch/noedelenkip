// --- TILE DEFINITIONS ---
// 0=grass, 1=path, 2=water, 3=wall, 4=roofRed, 5=roofBlue, 6=door, 7=tree, 8=flower,
// 9=stone, 10=fence, 11=missionBoard, 12=chickenCoop, 13=bridge, 14=tallGrass,
// 15=roofGreen, 16=hollow_tree, 17=pond_edge, 18=mystery_rock, 19=fishSpot, 20=gate
const TILE_SOLID = [2,3,4,5,7,9,10,15,16,17];
const TILE_INTERACT = [6,11,12,16,18,19,20];
let gateOpen = true;

function drawTile(tx, ty, tileId, time) {
  const x = tx * T, y = ty * T;
  switch(tileId) {
    case 0:
      ctx.fillStyle = (tx+ty)%2===0 ? C.grass1 : C.grass2;
      ctx.fillRect(x,y,T,T);
      if ((tx*7+ty*13)%5===0) {
        ctx.fillStyle = C.grass3;
        ctx.fillRect(x+((tx*3)%12), y+((ty*5)%12), 2, 4);
      }
      if ((tx*11+ty*3)%8===0) {
        ctx.fillStyle = '#6bc45a';
        ctx.fillRect(x+((tx*7)%14), y+((ty*9)%14), 1, 3);
      }
      break;
    case 1:
      ctx.fillStyle = C.path;
      ctx.fillRect(x,y,T,T);
      if ((tx+ty*3)%4===0) {
        ctx.fillStyle = C.pathDark;
        ctx.fillRect(x+((tx*5)%10)+4, y+((ty*7)%10)+4, 4, 3);
      }
      break;
    case 2:
      ctx.fillStyle = C.water;
      ctx.fillRect(x,y,T,T);
      const waveOff = Math.sin(time*0.002 + tx*0.5 + ty*0.3)*3;
      ctx.fillStyle = C.waterLight;
      ctx.fillRect(x+8+waveOff, y+6, 8, 2);
      ctx.fillRect(x+4, y+18+waveOff, 10, 2);
      break;
    case 3:
      ctx.fillStyle = C.woodWall;
      ctx.fillRect(x,y,T,T);
      ctx.fillStyle = C.woodDark;
      ctx.fillRect(x,y,T,1);
      ctx.fillRect(x,y+15,T,1);
      ctx.fillRect(x+15,y,1,T);
      if ((tx+ty)%3===0) {
        ctx.fillStyle = '#aaddff';
        ctx.fillRect(x+10,y+8,12,12);
        ctx.fillStyle = C.woodDark;
        ctx.fillRect(x+15,y+8,2,12);
        ctx.fillRect(x+10,y+13,12,2);
      }
      break;
    case 4:
      ctx.fillStyle = C.roofRed;
      ctx.fillRect(x,y,T,T);
      ctx.fillStyle = '#a03020';
      for (let i=0;i<T;i+=6) ctx.fillRect(x,y+i,T,1);
      break;
    case 5:
      ctx.fillStyle = C.roofBlue;
      ctx.fillRect(x,y,T,T);
      ctx.fillStyle = '#1a6aaa';
      for (let i=0;i<T;i+=6) ctx.fillRect(x,y+i,T,1);
      break;
    case 6:
      ctx.fillStyle = C.woodWall;
      ctx.fillRect(x,y,T,T);
      ctx.fillStyle = C.doorBrown;
      ctx.fillRect(x+8,y+2,16,30);
      ctx.fillStyle = C.gold;
      ctx.fillRect(x+20,y+16,3,3);
      break;
    case 7:
      ctx.fillStyle = (tx+ty)%2===0 ? C.grass1 : C.grass2;
      ctx.fillRect(x,y,T,T);
      ctx.fillStyle = C.treeTrunk;
      ctx.fillRect(x+12,y+16,8,16);
      ctx.fillStyle = C.treeGreen;
      ctx.beginPath();
      ctx.arc(x+16,y+10,12,0,Math.PI*2);
      ctx.fill();
      ctx.fillStyle = C.treeDark;
      ctx.beginPath();
      ctx.arc(x+14,y+8,5,0,Math.PI*2);
      ctx.fill();
      break;
    case 8:
      ctx.fillStyle = (tx+ty)%2===0 ? C.grass1 : C.grass2;
      ctx.fillRect(x,y,T,T);
      const fc = [C.flowerRed,C.flowerYellow,C.flowerPurple][(tx+ty)%3];
      ctx.fillStyle = '#3a7030';
      ctx.fillRect(x+14,y+16,4,10);
      ctx.fillStyle = fc;
      ctx.beginPath();
      ctx.arc(x+16,y+14,5,0,Math.PI*2);
      ctx.fill();
      ctx.fillStyle = C.flowerYellow;
      ctx.beginPath();
      ctx.arc(x+16,y+14,2,0,Math.PI*2);
      ctx.fill();
      break;
    case 9:
      ctx.fillStyle = (tx+ty)%2===0 ? C.grass1 : C.grass2;
      ctx.fillRect(x,y,T,T);
      ctx.fillStyle = C.stoneGray;
      ctx.beginPath();
      ctx.ellipse(x+16,y+18,10,8,0,0,Math.PI*2);
      ctx.fill();
      ctx.fillStyle = C.stoneDark;
      ctx.beginPath();
      ctx.ellipse(x+14,y+16,4,3,0,0,Math.PI*2);
      ctx.fill();
      break;
    case 10:
      ctx.fillStyle = (tx+ty)%2===0 ? C.grass1 : C.grass2;
      ctx.fillRect(x,y,T,T);
      ctx.fillStyle = '#c4a060';
      ctx.fillRect(x+2,y+8,28,3);
      ctx.fillRect(x+2,y+20,28,3);
      ctx.fillRect(x+4,y+4,4,26);
      ctx.fillRect(x+24,y+4,4,26);
      break;
    case 11:
      ctx.fillStyle = C.path;
      ctx.fillRect(x,y,T,T);
      ctx.fillStyle = '#5a3a1a';
      ctx.fillRect(x+6,y+4,20,24);
      ctx.fillStyle = '#f0e0b0';
      ctx.fillRect(x+8,y+6,16,16);
      ctx.fillStyle = '#5a3a1a';
      ctx.fillRect(x+13,y+22,6,10);
      ctx.fillStyle = '#c03030';
      ctx.fillRect(x+14,y+9,4,8);
      ctx.fillRect(x+14,y+19,4,2);
      break;
    case 12:
      ctx.fillStyle = (tx+ty)%2===0 ? C.grass1 : C.grass2;
      ctx.fillRect(x,y,T,T);
      ctx.fillStyle = '#8b6914';
      ctx.fillRect(x+2,y+10,28,20);
      ctx.fillStyle = '#a07818';
      ctx.fillRect(x,y+6,T,8);
      ctx.fillStyle = '#6b4f10';
      ctx.fillRect(x+12,y+18,10,12);
      ctx.fillStyle = '#d4b840';
      ctx.fillRect(x+4,y+24,6,4);
      ctx.fillRect(x+22,y+22,6,6);
      break;
    case 13:
      ctx.fillStyle = C.water;
      ctx.fillRect(x,y,T,T);
      ctx.fillStyle = '#8b6914';
      ctx.fillRect(x+4,y,24,T);
      ctx.fillStyle = '#6b4f10';
      ctx.fillRect(x+4,y,2,T);
      ctx.fillRect(x+26,y,2,T);
      for (let i=0;i<T;i+=8) ctx.fillRect(x+6,y+i,20,1);
      break;
    case 14:
      ctx.fillStyle = C.grass2;
      ctx.fillRect(x,y,T,T);
      const shimmer = Math.sin(time*0.003+tx+ty)*0.3+0.7;
      ctx.fillStyle = `rgba(100,200,60,${shimmer})`;
      for (let i=0;i<6;i++) {
        const gx = x + 2 + (i*5)%28;
        const gy = y + 4 + (i*7)%20;
        const sway = Math.sin(time*0.002+i+tx)*2;
        ctx.fillRect(gx+sway,gy,2,10);
        ctx.fillRect(gx-1+sway,gy,4,2);
      }
      break;
    case 15:
      ctx.fillStyle = '#2a7a30';
      ctx.fillRect(x,y,T,T);
      ctx.fillStyle = '#1a6a20';
      for (let i=0;i<T;i+=6) ctx.fillRect(x,y+i,T,1);
      break;
    case 16:
      ctx.fillStyle = (tx+ty)%2===0 ? C.grass1 : C.grass2;
      ctx.fillRect(x,y,T,T);
      ctx.fillStyle = '#5a3018';
      ctx.fillRect(x+8,y+8,16,24);
      ctx.fillStyle = C.treeGreen;
      ctx.beginPath();
      ctx.arc(x+16,y+4,14,0,Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#1a1008';
      ctx.beginPath();
      ctx.ellipse(x+16,y+20,5,6,0,0,Math.PI*2);
      ctx.fill();
      break;
    case 17:
      ctx.fillStyle = C.grass1;
      ctx.fillRect(x,y,T,T);
      ctx.fillStyle = C.water;
      ctx.beginPath();
      ctx.ellipse(x+16,y+16,14,14,0,0,Math.PI*2);
      ctx.fill();
      ctx.fillStyle = C.waterLight;
      ctx.beginPath();
      ctx.ellipse(x+12,y+12,4,3,0,0,Math.PI*2);
      ctx.fill();
      break;
    case 18:
      ctx.fillStyle = (tx+ty)%2===0 ? C.grass1 : C.grass2;
      ctx.fillRect(x,y,T,T);
      const glow = Math.sin(time*0.003)*0.3+0.7;
      ctx.fillStyle = `rgba(160,140,180,${glow})`;
      ctx.beginPath();
      ctx.moveTo(x+16,y+4);
      ctx.lineTo(x+28,y+28);
      ctx.lineTo(x+4,y+28);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#aaa';
      ctx.fillRect(x+13,y+14,6,4);
      ctx.fillRect(x+14,y+20,4,3);
      break;
    case 19: // fish spot
      ctx.fillStyle = C.water;
      ctx.fillRect(x,y,T,T);
      const wOff2 = Math.sin(time*0.002+tx)*3;
      ctx.fillStyle = C.waterLight;
      ctx.fillRect(x+6+wOff2, y+8, 10, 2);
      // Bobber
      const bob2 = Math.sin(time*0.004+tx*2)*3;
      ctx.fillStyle = '#e03030';
      ctx.beginPath();
      ctx.arc(x+16, y+14+bob2, 4, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x+16, y+12+bob2, 3, Math.PI, 0);
      ctx.fill();
      break;
    case 20: // gate
      ctx.fillStyle = (tx+ty)%2===0 ? C.grass1 : C.grass2;
      ctx.fillRect(x,y,T,T);
      if (gateOpen) {
        // Open gate: posts on sides, opening in middle
        ctx.fillStyle = '#907040';
        ctx.fillRect(x, y, 4, T);
        ctx.fillRect(x+T-4, y, 4, T);
        ctx.fillStyle = '#a08050';
        ctx.fillRect(x, y, 4, 4);
        ctx.fillRect(x+T-4, y, 4, 4);
      } else {
        // Closed gate: wooden bars
        ctx.fillStyle = '#907040';
        ctx.fillRect(x, y, 4, T);
        ctx.fillRect(x+T-4, y, 4, T);
        ctx.fillStyle = '#a08050';
        ctx.fillRect(x+4, y+4, T-8, 3);
        ctx.fillRect(x+4, y+T-7, T-8, 3);
        ctx.fillRect(x+4, y+T/2-1, T-8, 3);
        // Vertical bars
        for (let bx=8; bx<T-4; bx+=6) {
          ctx.fillRect(x+bx, y+4, 2, T-8);
        }
      }
      break;
  }
}