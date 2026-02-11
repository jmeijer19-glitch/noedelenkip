// --- TITLE VARIANT PARTICLE HELPERS ---
function initTitleParticles(w, h) {
  titleParticles = [];
  switch(titleVariant) {
    case 'regen':
      for(let i=0;i<100;i++) titleParticles.push({x:Math.random()*w*1.3,y:Math.random()*h,speed:5+Math.random()*5,len:10+Math.random()*10});
      break;
    case 'herfst':
      for(let i=0;i<35;i++) titleParticles.push({x:Math.random()*w,y:Math.random()*h,rot:Math.random()*6.28,sx:0.5+Math.random()*1.5,sy:0.8+Math.random()*1.2,size:4+Math.random()*5,wb:Math.random()*6.28,color:['#c0392b','#e67e22','#f39c12','#d35400','#a0522d'][i%5]});
      break;
    case 'wind':
      for(let i=0;i<30;i++) titleParticles.push({x:Math.random()*w,y:h*0.4+Math.random()*h*0.5,rot:Math.random()*6.28,speed:3+Math.random()*4,size:3+Math.random()*4,wb:Math.random()*6.28,color:['#6a8a3a','#8aaa5a','#5a7a2a','#7a9a4a'][i%4]});
      break;
    case 'sneeuw':
      for(let i=0;i<80;i++) titleParticles.push({x:Math.random()*w,y:Math.random()*h,speed:0.4+Math.random()*1.2,size:2+Math.random()*4,wb:Math.random()*6.28});
      break;
    case 'nacht':
      for(let i=0;i<12;i++) titleParticles.push({x:w*0.2+Math.random()*w*0.6,y:h*0.55+Math.random()*h*0.3,angle:Math.random()*6.28,speed:0.3+Math.random()*0.3});
      break;
    case 'zon':
      for(let i=0;i<6;i++) titleParticles.push({x:w*0.15+Math.random()*w*0.7,y:h*0.45+Math.random()*h*0.3,angle:Math.random()*6.28,speed:0.3+Math.random()*0.4,color:['#ff69b4','#ffa500','#87ceeb','#ff6347','#dda0dd'][i%5],wp:Math.random()*6.28});
      break;
    case 'regenboog':
      for(let i=0;i<15;i++) titleParticles.push({x:Math.random()*w,y:Math.random()*h*0.3,speed:2+Math.random()*2,len:5+Math.random()*5});
      break;
  }
  titleParticlesInit = true;
}

function updateTitleParticles(w, h) {
  titleParticles.forEach(p => {
    switch(titleVariant) {
      case 'regen': p.x-=p.speed*0.3;p.y+=p.speed;if(p.y>h){p.y=-10;p.x=Math.random()*w*1.3;}if(p.x<-20)p.x=w+Math.random()*20; break;
      case 'herfst': p.wb+=0.03;p.x+=p.sx+Math.sin(p.wb)*1.5;p.y+=p.sy;p.rot+=0.02;if(p.y>h+10){p.y=-10;p.x=Math.random()*w;}if(p.x>w+20)p.x=-10; break;
      case 'wind': p.wb+=0.05;p.x+=p.speed;p.y+=Math.sin(p.wb)*1.5;p.rot+=0.08;if(p.x>w+20){p.x=-10;p.y=h*0.4+Math.random()*h*0.5;} break;
      case 'sneeuw': p.wb+=0.02;p.x+=Math.sin(p.wb)*0.8;p.y+=p.speed;if(p.y>h+5){p.y=-5;p.x=Math.random()*w;} break;
      case 'nacht': p.angle+=(Math.random()-0.5)*0.1;p.x+=Math.cos(p.angle)*p.speed;p.y+=Math.sin(p.angle)*p.speed;if(p.x<0||p.x>w)p.angle=Math.PI-p.angle;if(p.y<h*0.45||p.y>h*0.9)p.angle=-p.angle; break;
      case 'zon': p.angle+=(Math.random()-0.5)*0.08;p.wp+=0.15;p.x+=Math.cos(p.angle)*p.speed;p.y+=Math.sin(p.angle)*p.speed*0.5;if(p.x<0||p.x>w)p.angle=Math.PI-p.angle;if(p.y<h*0.35||p.y>h*0.85)p.angle=-p.angle; break;
      case 'regenboog': p.y+=p.speed;p.x-=p.speed*0.15;if(p.y>h){p.y=-5;p.x=Math.random()*w;} break;
    }
  });
}

function drawTitleParticlesFg(w, h) {
  switch(titleVariant) {
    case 'regen':
      ctx.strokeStyle='rgba(180,200,230,0.5)';ctx.lineWidth=1.5;
      titleParticles.forEach(p=>{ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.len*0.3,p.y+p.len);ctx.stroke();});
      break;
    case 'herfst':
      titleParticles.forEach(p=>{
        ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=p.color;
        ctx.beginPath();ctx.moveTo(0,-p.size);ctx.quadraticCurveTo(p.size*0.6,-p.size*0.3,p.size*0.3,0);
        ctx.quadraticCurveTo(p.size*0.1,p.size*0.3,0,p.size*0.5);ctx.quadraticCurveTo(-p.size*0.1,p.size*0.3,-p.size*0.3,0);
        ctx.quadraticCurveTo(-p.size*0.6,-p.size*0.3,0,-p.size);ctx.fill();ctx.restore();
      });
      break;
    case 'wind':
      titleParticles.forEach(p=>{ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=p.color;ctx.fillRect(-p.size/2,-p.size/4,p.size,p.size*0.4);ctx.restore();});
      break;
    case 'sneeuw':
      titleParticles.forEach(p=>{ctx.fillStyle=`rgba(255,255,255,${0.6+Math.sin(p.wb*5)*0.3})`;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();});
      break;
    case 'nacht':
      titleParticles.forEach(p=>{
        const glow=Math.sin(titleTick*0.1+p.x)*0.3+0.7;
        ctx.fillStyle=`rgba(180,255,100,${glow})`;ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=`rgba(180,255,100,${glow*0.2})`;ctx.beginPath();ctx.arc(p.x,p.y,10,0,Math.PI*2);ctx.fill();
      });
      break;
    case 'zon':
      titleParticles.forEach(p=>{
        const wing=Math.sin(p.wp)*0.6;ctx.fillStyle=p.color;
        ctx.save();ctx.translate(p.x,p.y);
        ctx.beginPath();ctx.ellipse(-3,0,4,6,wing,0,Math.PI*2);ctx.fill();
        ctx.beginPath();ctx.ellipse(3,0,4,6,-wing,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#333';ctx.fillRect(-0.5,-3,1,6);ctx.restore();
      });
      break;
    case 'regenboog':
      ctx.strokeStyle='rgba(150,180,220,0.3)';ctx.lineWidth=1;
      titleParticles.forEach(p=>{ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.len*0.15,p.y+p.len);ctx.stroke();});
      break;
  }
}

// --- TITLE SCREEN ---
function drawTitleScreen() {
  titleTick++;
  const w = canvas.width, h = canvas.height;
  if (!titleParticlesInit) initTitleParticles(w, h);

  // === SKY ===
  const grad = ctx.createLinearGradient(0,0,0,h);
  switch(titleVariant) {
    case 'regen':    grad.addColorStop(0,'#3a4a5a');grad.addColorStop(0.5,'#5a6a7a');grad.addColorStop(1,'#3a5a34'); break;
    case 'zon':      grad.addColorStop(0,'#2070cc');grad.addColorStop(0.3,'#60b8f0');grad.addColorStop(0.7,'#aaddf0');grad.addColorStop(1,'#6ac050'); break;
    case 'wind':     grad.addColorStop(0,'#5a7a9a');grad.addColorStop(0.5,'#8aaabb');grad.addColorStop(1,'#4a8a3e'); break;
    case 'herfst':   grad.addColorStop(0,'#c07020');grad.addColorStop(0.4,'#d49040');grad.addColorStop(0.7,'#b87830');grad.addColorStop(1,'#6a5a20'); break;
    case 'sneeuw':   grad.addColorStop(0,'#b0b8c8');grad.addColorStop(0.5,'#c8d0d8');grad.addColorStop(1,'#dde4e8'); break;
    case 'nacht':    grad.addColorStop(0,'#080820');grad.addColorStop(0.4,'#101040');grad.addColorStop(0.7,'#182838');grad.addColorStop(1,'#102010'); break;
    case 'regenboog':grad.addColorStop(0,'#4a8ad0');grad.addColorStop(0.3,'#6ab0e8');grad.addColorStop(0.7,'#90c8f0');grad.addColorStop(1,'#5ba84e'); break;
    default:         grad.addColorStop(0,'#4a90d9');grad.addColorStop(0.5,'#87CEEB');grad.addColorStop(1,'#5ba84e');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,w,h);

  // === NACHT: stars behind scene ===
  if (titleVariant==='nacht') {
    for (let i=0;i<50;i++) {
      const sx=(i*137.5+23)%w, sy=(i*73.1+11)%(h*0.38);
      const bright=Math.sin(titleTick*(0.02+(i%5)*0.008)+i)*0.4+0.6;
      ctx.fillStyle=`rgba(255,255,220,${bright})`;
      ctx.beginPath();ctx.arc(sx,sy,0.5+((i*31)%20)/10,0,Math.PI*2);ctx.fill();
    }
  }

  // === MOON / SUN / RAINBOW ===
  if (titleVariant==='nacht') {
    const mx=w*0.8,my=h*0.1;
    ctx.fillStyle='rgba(240,230,180,0.08)';ctx.beginPath();ctx.arc(mx,my,60,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#f0e8c0';ctx.beginPath();ctx.arc(mx,my,28,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#e0d8a8';ctx.beginPath();ctx.arc(mx-5,my-3,5,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(mx+8,my+5,3,0,Math.PI*2);ctx.fill();
  }
  if (titleVariant==='zon') {
    const sx=w*0.82,sy=h*0.12;
    ctx.strokeStyle='rgba(255,220,80,0.3)';ctx.lineWidth=3;
    for(let i=0;i<12;i++){const a=(i/12)*6.28+titleTick*0.01,r1=35,r2=50+Math.sin(titleTick*0.05+i)*10;
      ctx.beginPath();ctx.moveTo(sx+Math.cos(a)*r1,sy+Math.sin(a)*r1);ctx.lineTo(sx+Math.cos(a)*r2,sy+Math.sin(a)*r2);ctx.stroke();}
    ctx.fillStyle='#ffe040';ctx.beginPath();ctx.arc(sx,sy,32,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff8c0';ctx.beginPath();ctx.arc(sx-5,sy-5,15,0,Math.PI*2);ctx.fill();
  }
  if (titleVariant==='regenboog') {
    const rcx=w*0.5,rcy=h*0.7;
    ['#ff0000','#ff8800','#ffff00','#00cc00','#0088ff','#4400cc','#8800aa'].forEach((col,i)=>{
      ctx.strokeStyle=col;ctx.globalAlpha=0.35;ctx.lineWidth=8;
      ctx.beginPath();ctx.arc(rcx,rcy,200+i*10,Math.PI,0);ctx.stroke();
    });
    ctx.globalAlpha=1;
    ctx.fillStyle='rgba(255,230,80,0.3)';ctx.beginPath();ctx.arc(w*0.78,h*0.08,25,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ffe860';ctx.beginPath();ctx.arc(w*0.78,h*0.08,18,0,Math.PI*2);ctx.fill();
  }

  // === HILLS ===
  const hc1=titleVariant==='herfst'?'#8a6a20':titleVariant==='sneeuw'?'#d0d8dd':titleVariant==='nacht'?'#152a15':'#4a8c3f';
  const hc2=titleVariant==='herfst'?'#6a5418':titleVariant==='sneeuw'?'#c4ccd2':titleVariant==='nacht'?'#0f200f':'#3d7a34';
  ctx.fillStyle=hc1;ctx.beginPath();ctx.moveTo(0,h*0.55);
  for(let x=0;x<=w;x+=2) ctx.lineTo(x,h*0.55+Math.sin(x*0.008+titleTick*0.01)*20+Math.sin(x*0.003)*30);
  ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.fill();
  ctx.fillStyle=hc2;ctx.beginPath();ctx.moveTo(0,h*0.62);
  for(let x=0;x<=w;x+=2) ctx.lineTo(x,h*0.62+Math.sin(x*0.006+titleTick*0.008+1)*15+Math.sin(x*0.004+2)*25);
  ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.fill();
  if(titleVariant==='sneeuw'){ctx.fillStyle='rgba(240,244,250,0.45)';ctx.fillRect(0,h*0.68,w,h*0.32);}

  // === VILLAGE ===
  const villY=h*0.52, vwc=titleVariant==='nacht'?'#3a2818':'#6b5030';
  ctx.fillStyle=vwc;ctx.fillRect(w*0.15,villY,40,35);ctx.fillStyle='#c0392b';ctx.fillRect(w*0.15-5,villY-10,50,15);
  ctx.fillStyle=vwc;ctx.fillRect(w*0.35,villY+5,35,30);ctx.fillStyle='#2980b9';ctx.fillRect(w*0.35-3,villY-5,41,15);
  ctx.fillStyle=vwc;ctx.fillRect(w*0.55,villY-5,45,40);ctx.fillStyle='#2a7a30';ctx.fillRect(w*0.55-5,villY-18,55,18);
  ctx.fillStyle=vwc;ctx.fillRect(w*0.75,villY+2,38,33);ctx.fillStyle='#c0392b';ctx.fillRect(w*0.75-4,villY-8,46,14);
  if(titleVariant==='nacht'){
    ctx.fillStyle='rgba(255,200,50,0.8)';
    ctx.fillRect(w*0.15+10,villY+8,8,8);ctx.fillRect(w*0.15+25,villY+8,8,8);
    ctx.fillRect(w*0.35+8,villY+12,8,8);ctx.fillRect(w*0.55+10,villY+5,8,8);
    ctx.fillRect(w*0.55+28,villY+5,8,8);ctx.fillRect(w*0.75+10,villY+10,8,8);
    ctx.fillStyle='rgba(255,200,50,0.1)';
    [w*0.15+14,w*0.35+12,w*0.55+24,w*0.75+14].forEach(wx=>{ctx.beginPath();ctx.arc(wx,villY+12,20,0,Math.PI*2);ctx.fill();});
  }
  if(titleVariant==='sneeuw'){
    ctx.fillStyle='#eef2f6';
    ctx.fillRect(w*0.15-7,villY-12,54,5);ctx.fillRect(w*0.35-5,villY-7,45,5);
    ctx.fillRect(w*0.55-7,villY-20,59,5);ctx.fillRect(w*0.75-6,villY-10,50,5);
  }

  // === TREES ===
  const tc=titleVariant==='herfst'?'#c05a2b':titleVariant==='sneeuw'?'#8aaa8a':titleVariant==='nacht'?'#0a3a08':'#2d6b1e';
  ctx.fillStyle=tc;
  [0.08,0.28,0.48,0.68,0.88].forEach(px=>{
    const tx=w*px;ctx.beginPath();ctx.arc(tx,villY+5,20,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#5a3820';ctx.fillRect(tx-3,villY+15,6,15);ctx.fillStyle=tc;
  });
  if(titleVariant==='herfst'){
    ctx.fillStyle='#e8a030';[0.08,0.28,0.48,0.68,0.88].forEach(px=>{ctx.beginPath();ctx.arc(w*px-8,villY+2,12,0,Math.PI*2);ctx.fill();});
    ctx.fillStyle='#d47010';[0.08,0.48,0.88].forEach(px=>{ctx.beginPath();ctx.arc(w*px+10,villY,10,0,Math.PI*2);ctx.fill();});
  }
  if(titleVariant==='sneeuw'){
    ctx.fillStyle='#eef2f6';[0.08,0.28,0.48,0.68,0.88].forEach(px=>{ctx.beginPath();ctx.arc(w*px,villY-2,14,Math.PI,0);ctx.fill();});
  }

  // === CLOUDS ===
  const cSpd=titleVariant==='wind'?3:titleVariant==='regen'?0.7:1;
  const cCol=titleVariant==='regen'?'rgba(120,130,150,0.85)':titleVariant==='nacht'?'rgba(30,40,60,0.4)':titleVariant==='sneeuw'?'rgba(200,210,220,0.8)':'rgba(255,255,255,0.7)';
  titleClouds.forEach(c=>{
    c.x+=c.speed*cSpd;if(c.x>w+100)c.x=-c.w-50;ctx.fillStyle=cCol;
    ctx.beginPath();ctx.ellipse(c.x,c.y,c.w/2,15,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(c.x-c.w*0.25,c.y+5,c.w*0.3,12,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(c.x+c.w*0.25,c.y+3,c.w*0.35,14,0,0,Math.PI*2);ctx.fill();
  });

  // === GRASS ===
  const gc=titleVariant==='herfst'?'#8a7a30':titleVariant==='sneeuw'?'#98b898':titleVariant==='nacht'?'#0a2a08':'#5ba84e';
  const windBend=titleVariant==='wind'?Math.sin(titleTick*0.05)*8+5:0;
  ctx.fillStyle=gc;
  for(let x=0;x<w;x+=8){const gh=5+Math.sin(x*0.1+titleTick*0.05)*3;ctx.fillRect(x+windBend*Math.sin(x*0.02+titleTick*0.03),h*0.7+Math.sin(x*0.03)*10,3,gh);}

  // === PATH ===
  ctx.fillStyle=titleVariant==='sneeuw'?'#d0c8b8':C.path;
  ctx.beginPath();ctx.moveTo(w*0.3,h);ctx.quadraticCurveTo(w*0.5,h*0.65,w*0.6,h*0.55);
  ctx.lineTo(w*0.65,h*0.55);ctx.quadraticCurveTo(w*0.55,h*0.65,w*0.38,h);ctx.fill();

  // === GROUND FX ===
  if(titleVariant==='regen'){
    ctx.fillStyle='rgba(100,130,170,0.35)';
    ctx.beginPath();ctx.ellipse(w*0.22,h*0.83,30,7,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(w*0.68,h*0.86,22,6,0,0,Math.PI*2);ctx.fill();
    const rip=(titleTick%60)/60;ctx.strokeStyle=`rgba(150,180,220,${(1-rip)*0.4})`;ctx.lineWidth=1;
    ctx.beginPath();ctx.ellipse(w*0.22,h*0.83,rip*25,rip*5,0,0,Math.PI*2);ctx.stroke();
  }
  if(titleVariant==='zon'){
    ctx.fillStyle='rgba(60,130,220,0.35)';ctx.beginPath();ctx.ellipse(w*0.5,h*0.82,40,10,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(100,170,240,0.25)';ctx.beginPath();ctx.ellipse(w*0.5,h*0.81,30,7,0,0,Math.PI*2);ctx.fill();
  }

  // === CHARACTERS (variant-specific poses & props) ===
  const nX=w*0.38, nY=h*0.78;
  let kX, kY=h*0.78;
  switch(titleVariant) {
    case 'regen':
      kX=nX+35;
      drawNoedels(nX,nY,2,titleTick*0.2,2.5);
      drawKip(kX,kY,2,titleTick*0.2,2.5,false);
      // Rode paraplu
      const uX=(nX+kX)/2,uY=nY-70;
      ctx.fillStyle='#c03030';ctx.beginPath();ctx.arc(uX,uY,50,Math.PI,0);ctx.fill();
      ctx.fillStyle='#a02828';ctx.beginPath();ctx.arc(uX-20,uY,20,Math.PI,0);ctx.fill();
      ctx.beginPath();ctx.arc(uX+20,uY,20,Math.PI,0);ctx.fill();
      ctx.strokeStyle='#5a3820';ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(uX,uY);ctx.lineTo(uX,nY-15);ctx.stroke();
      ctx.beginPath();ctx.arc(uX+5,nY-15,5,Math.PI*0.5,Math.PI*1.5);ctx.stroke();
      break;
    case 'zon':
      kX=w*0.55;
      drawNoedels(nX-20,nY,1,titleTick*0.5,2.5);
      drawKip(kX,kY+5,2,titleTick*0.5,2.5,titleTick%90<25);
      if(titleTick%90<25){for(let i=0;i<4;i++){const sa=Math.sin(titleTick*0.3+i*1.5);
        ctx.fillStyle=`rgba(100,180,255,${0.3+sa*0.3})`;ctx.beginPath();ctx.arc(kX+Math.sin(i*2+titleTick*0.2)*15,kY-10+sa*20-i*8,3,0,Math.PI*2);ctx.fill();}}
      break;
    case 'wind':
      kX=w*0.62;
      ctx.save();ctx.translate(nX,nY);ctx.rotate(0.05);drawNoedels(0,0,1,titleTick*0.5,2.5);ctx.restore();
      drawKip(kX,kY,1,titleTick*0.4,2.5,true);
      break;
    case 'herfst':
      kX=w*0.62;
      drawNoedels(nX,nY,1,titleTick*0.4,2.5);
      drawKip(kX,kY+(titleTick%180<30?Math.sin(titleTick*0.3)*3:0),3,titleTick*0.3,2.5,false);
      break;
    case 'sneeuw':
      kX=nX+30;
      drawNoedels(nX,nY,2,titleTick*0.2,2.5);
      drawKip(kX,kY,2,titleTick*0.2,2.5,false);
      // Sjaal
      ctx.fillStyle='#cc2222';ctx.fillRect(nX-12,nY-28,24,6);
      ctx.fillRect(nX+8,nY-28,5,18);ctx.fillRect(nX+7,nY-12,6,8+Math.sin(titleTick*0.08)*3);
      break;
    case 'nacht':
      kX=w*0.62;
      drawNoedels(nX,nY,1,titleTick*0.15,2.5);
      // Lantaarn
      const lx=nX+25,ly=nY-15;
      ctx.fillStyle='#654321';ctx.fillRect(lx-2,ly-15,4,20);
      ctx.fillStyle='rgba(255,200,50,0.9)';ctx.beginPath();ctx.arc(lx,ly-18,8,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,200,50,0.15)';ctx.beginPath();ctx.arc(lx,ly-18,40,0,Math.PI*2);ctx.fill();
      // Slapende kip
      ctx.save();ctx.translate(kX,kY+8);
      ctx.fillStyle=C.kipWhite;ctx.beginPath();ctx.ellipse(0,0,18,10,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(8,-6,8,8,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=C.kipComb;ctx.fillRect(6,-14,3,4);
      ctx.strokeStyle='#333';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(10,-7);ctx.lineTo(14,-7);ctx.stroke();
      const zzO=Math.sin(titleTick*0.04)*3;ctx.fillStyle='rgba(200,200,255,0.6)';
      ctx.font='bold 12px monospace';ctx.fillText('z',18,-14+zzO);
      ctx.font='bold 10px monospace';ctx.fillText('z',24,-20+zzO*1.3);
      ctx.font='bold 8px monospace';ctx.fillText('z',28,-26+zzO*1.5);
      ctx.restore();
      break;
    case 'regenboog':
      kX=w*0.62;
      drawNoedels(nX,nY,0,titleTick*0.3,2.5);
      drawKip(kX,kY,0,titleTick*0.3,2.5,titleTick%120<20);
      break;
    default:
      kX=w*0.7;
      drawNoedels(nX,nY,1,titleTick*0.5,2.5);
      drawKip(kX,kY+(titleTick%180<30?Math.sin(titleTick*0.3)*3:0),3,titleTick*0.3,2.5,false);
  }

  // Variant-specifieke tekstballon
  if(titleTick%180<30){
    let tokText=null;
    switch(titleVariant){
      case 'regen':case 'nacht': break;
      case 'zon': tokText='*plons!*'; break;
      case 'wind': tokText='*tok!!*'; break;
      case 'sneeuw': tokText='*brr..*'; break;
      default: tokText='*tok*';
    }
    if(tokText){
      ctx.font='bold 14px monospace';
      const bw=Math.max(60,ctx.measureText(tokText).width+16);
      ctx.fillStyle='rgba(255,255,255,0.9)';const bx=kX-bw/2,by=kY-70;
      roundRect(ctx,bx,by,bw,30,8);ctx.fill();
      ctx.fillStyle='#333';ctx.fillText(tokText,bx+8,by+20);
    }
  }

  // === PARTICLES foreground ===
  updateTitleParticles(w, h);
  drawTitleParticlesFg(w, h);

  // === OVERLAY ===
  if(titleVariant==='nacht'){ctx.fillStyle='rgba(0,0,20,0.12)';ctx.fillRect(0,0,w,h);}
  if(titleVariant==='regen'){ctx.fillStyle='rgba(80,90,110,0.06)';ctx.fillRect(0,0,w,h);}

  // === TITLE TEXT ===
  const titleY = h * 0.12;
  ctx.fillStyle='rgba(0,0,0,0.3)';ctx.font='bold 48px monospace';ctx.textAlign='center';
  ctx.fillText('NOEDELS & DE KIP',w/2+3,titleY+3);
  const glowVal=Math.sin(titleTick*0.05)*20+30;
  ctx.shadowColor='#ffa500';ctx.shadowBlur=glowVal;
  ctx.fillStyle='#ffd700';ctx.fillText('NOEDELS & DE KIP',w/2,titleY);ctx.shadowBlur=0;
  ctx.strokeStyle='#c08000';ctx.lineWidth=2;ctx.strokeText('NOEDELS & DE KIP',w/2,titleY);
  ctx.fillStyle='#fff';ctx.font='18px monospace';
  ctx.fillText('Avonturen in het Dorp',w/2,titleY+36);
  ctx.strokeStyle=C.uiBorder;ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(w/2-180,titleY+48);ctx.lineTo(w/2+180,titleY+48);ctx.stroke();

  // === MENU ===
  const menuY=h*0.35, menuSpacing=40;
  ctx.fillStyle='rgba(20,20,40,0.7)';
  roundRect(ctx,w/2-150,menuY-20,300,titleOptions.length*menuSpacing+30,12);ctx.fill();
  ctx.strokeStyle=C.uiBorder;ctx.lineWidth=2;
  roundRect(ctx,w/2-150,menuY-20,300,titleOptions.length*menuSpacing+30,12);ctx.stroke();
  titleOptions.forEach((opt,i)=>{
    const oy=menuY+i*menuSpacing+10, selected=i===titleSelection;
    if(selected){ctx.fillStyle='rgba(255,210,50,0.2)';roundRect(ctx,w/2-130,oy-14,260,32,6);ctx.fill();}
    ctx.font=selected?'bold 20px monospace':'18px monospace';
    ctx.fillStyle=(i===1&&!hasSave)?'#666':selected?'#ffd700':'#ddd';
    ctx.fillText(opt,w/2,oy+6);
    if(selected){ctx.fillStyle='#ffd700';ctx.fillText('\u25BA',w/2-120,oy+6);ctx.fillText('\u25C4',w/2+110,oy+6);}
  });

  ctx.textAlign='left';ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='12px monospace';
  ctx.fillText('v4.0',10,h-10);
  ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='13px monospace';ctx.textAlign='center';
  const isMobile=matchMedia('(pointer:coarse)').matches;
  ctx.fillText(isMobile?'Tik op een optie om te kiezen':'WASD/Pijltjes = Bewegen | Enter/Spatie = Actie | X = Aanval | I = Tas | Esc = Menu',w/2,h-15);
  ctx.textAlign='left';
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

let titleInputCooldown = 0;
let titleTapSelection = -1;

// Touch tap support for title menu
canvas.addEventListener('touchstart', function(e) {
  if (gameState !== 'title') return;
  const touch = e.changedTouches[0];
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const tx = (touch.clientX - rect.left) * scaleX;
  const ty = (touch.clientY - rect.top) * scaleY;
  const menuY = canvas.height * 0.35;
  const menuSpacing = 40;
  for (let i = 0; i < titleOptions.length; i++) {
    const oy = menuY + i * menuSpacing + 10;
    if (tx > canvas.width/2 - 130 && tx < canvas.width/2 + 130 && ty > oy - 14 && ty < oy + 18) {
      titleTapSelection = i;
      break;
    }
  }
}, { passive: true });

function updateTitle() {
  if (titleInputCooldown > 0) { titleInputCooldown--; return; }
  if (isDown('up')) { titleSelection = (titleSelection - 1 + titleOptions.length) % titleOptions.length; SFX.menuMove(); titleInputCooldown = 12; }
  if (isDown('down')) { titleSelection = (titleSelection + 1) % titleOptions.length; SFX.menuMove(); titleInputCooldown = 12; }

  // Handle touch tap on menu items
  if (titleTapSelection >= 0) {
    titleSelection = titleTapSelection;
    titleTapSelection = -1;
    confirmJust = true; // trigger as confirm
  }

  if (confirmJust) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (titleSelection === 0) {
      SFX.menuSelect();
      startNewGame();
    } else if (titleSelection === 1 && hasSave) {
      SFX.menuSelect();
      if (loadGame()) {
        gameState = 'playing';
        spawnEnemies();
      }
    } else if (titleSelection === 2) {
      SFX.menuSelect();
      gameState = 'options';
    } else if (titleSelection === 3) {
      SFX.menuSelect();
      gameState = 'changelog';
    } else if (titleSelection === 4) {
      SFX.menuSelect();
      gameState = 'credits';
    }
  }
}

function startNewGame() {
  player.x = 8*T+16; player.y = 10*T+16;
  player.dir = 2; player.hp = 100; player.maxHp = 100; player.xp = 0; player.level = 1;
  player.inventory = []; player.talkedTo = {}; player.coins = 0;
  player.moving = false; player.frame = 0; player.speed = 2.5;
  player.attackCooldown = 0; player.attackAnim = 0; player.hurtTimer = 0;
  hatchingEggs = [];
  hatchedChickens = [];
  coinParticles = [];
  kip.x = player.x + 32; kip.y = player.y;
  kip.flutter = false;
  // Reset all missions
  missions.golden_egg.state = 'inactive';
  missions.golden_egg.talkedBakker = false; missions.golden_egg.talkedBoer = false; missions.golden_egg.talkedUitvinder = false;
  missions.golden_egg.eggFound = false; missions.golden_egg.eggReturned = false;
  missions.catch_fish.state = 'inactive'; missions.catch_fish.fishCaught = 0;
  missions.fix_invention.state = 'inactive'; missions.fix_invention.gearsFound = 0;
  missions.recipe_search.state = 'inactive'; missions.recipe_search.recipeFound = false;
  currentMission = 'golden_egg';
  GEAR_POSITIONS.forEach(g => g.collected = false);
  RECIPE_POS.found = false;
  npcs.forEach(n => n.marker = null);
  generateMap();
  spawnEnemies();
  missionBarText = '';
  missionBarAlpha = 0;
  missionBarTarget = 0;
  missionChangeTick = 0;
  dayNight.time = 0.3; // Start at morning
  gameState = 'playing';
  setTimeout(() => {
    startDialog([
      { speaker: 'Noedels', text: 'Goedemorgen! Weer een mooie dag in het dorp.' },
      { speaker: 'De Kip', text: '*tok*' },
      { speaker: 'Noedels', text: 'Ja Kip, ik weet het. Altijd honger. Laten we eerst even rondkijken.' },
      { speaker: 'Noedels', text: '(TIP: Loop naar het kippenhok in het oosten van het dorp voor je eerste missie!)' },
      { speaker: 'Noedels', text: '(TIP: Druk X om aan te vallen als je vijanden tegenkomt in het bos!)' },
    ]);
  }, 500);
  startMusic();
}

// --- OPTIONS SCREEN ---
function drawOptions() {
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0,0,w,h);
  ctx.fillStyle = C.uiBorder;
  ctx.font = 'bold 32px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('OPTIES', w/2, 80);
  ctx.font = '18px monospace';
  ctx.fillStyle = '#ccc';
  ctx.fillText('Besturing:', w/2, 150);
  ctx.font = '14px monospace';
  ctx.fillText('WASD / Pijltjestoetsen = Bewegen', w/2, 185);
  ctx.fillText('Enter / Spatie = Interactie / Bevestigen', w/2, 210);
  ctx.fillText('X = Aanvallen (in het bos)', w/2, 235);
  ctx.fillText('I = Inventaris (Rugzak)', w/2, 260);
  ctx.fillText('Escape = Terug / Pauze', w/2, 285);
  ctx.fillStyle = '#aaa';
  ctx.font = '16px monospace';
  ctx.fillText('--- Touch/Tablet ---', w/2, 325);
  ctx.font = '14px monospace';
  ctx.fillText('Joystick (links) = Bewegen', w/2, 350);
  ctx.fillText('A-knop = Interactie + Aanval', w/2, 375);
  ctx.fillText('B-knop = Terug / Pauze', w/2, 400);
  ctx.fillText('TAS-knop = Inventaris', w/2, 425);

  // Muziek toggle
  ctx.fillStyle = '#aaa';
  ctx.font = '16px monospace';
  ctx.fillText('--- Instellingen ---', w/2, 465);
  ctx.font = '14px monospace';
  ctx.fillStyle = musicEnabled ? '#6f6' : '#f66';
  ctx.fillText('[M] Muziek: ' + (musicEnabled ? 'AAN' : 'UIT'), w/2, 495);

  ctx.fillStyle = '#888';
  ctx.font = '16px monospace';
  ctx.fillText('Druk ESC om terug te gaan', w/2, h-50);
  ctx.textAlign = 'left';

  if ((keys['m'] || keys['M']) && !drawOptions._mCooldown) {
    drawOptions._mCooldown = true;
    toggleMusic();
  }
  if (!keys['m'] && !keys['M']) drawOptions._mCooldown = false;

  if (cancelJust || confirmJust) { gameState = 'title'; titleInputCooldown = 10; }
}

// --- CREDITS SCREEN ---
function drawCredits() {
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0,0,w,h);
  ctx.fillStyle = C.uiBorder;
  ctx.font = 'bold 32px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CREDITS', w/2, 80);
  ctx.font = '16px monospace';
  ctx.fillStyle = '#ccc';
  ctx.fillText('NOEDELS & DE KIP v4', w/2, 140);
  ctx.fillText('Avonturen in het Dorp', w/2, 165);
  ctx.font = '14px monospace';
  ctx.fillStyle = '#aaa';
  ctx.fillText('Game Design & Programmering', w/2, 210);
  ctx.fillStyle = '#ffd700';
  ctx.fillText('Claude & Jeroen', w/2, 235);
  ctx.fillStyle = '#aaa';
  ctx.fillText('Pixel Art: Proceduraal gegenereerd', w/2, 275);
  ctx.fillText('Audio: Web Audio API', w/2, 300);
  ctx.fillText('Engine: Pure HTML5 Canvas + JavaScript', w/2, 325);
  ctx.fillText('Nieuwe features: Gevechten, Missies, Dag/Nacht, Minimap', w/2, 350);
  ctx.fillStyle = '#666';
  ctx.fillText('Geen kippen zijn verwond tijdens het maken van dit spel.', w/2, 400);
  ctx.fillText('(De wilde kippen in het bos tellen niet.)', w/2, 420);
  ctx.fillStyle = '#888';
  ctx.font = '16px monospace';
  ctx.fillText('Druk ESC om terug te gaan', w/2, h-50);
  ctx.textAlign = 'left';

  if (cancelJust || confirmJust) { gameState = 'title'; titleInputCooldown = 10; }
}

// --- CHANGELOG SCREEN ---
let changelogScroll = 0;
const CHANGELOG = [
  { version: 'v4.1', date: '2026-02-11', items: [
    '7 titelscherm-varianten: regen, zon, wind, herfst, sneeuw, nacht, regenboog',
    'Regen: Noedels & Kip onder een rode paraplu met regendruppels',
    'Zon: Kip speelt in het water met vlinders',
    'Wind: Bladeren en gras waaien, Kip fladdert',
    'Herfst: Warme kleuren, vallende bladeren',
    'Sneeuw: Sneeuw op daken en bomen, Noedels met sjaal',
    'Nacht: Sterren, maan, vuurvliegjes, slapende Kip',
    'Regenboog: Regenboog aan de hemel na een bui',
    'Elke keer dat je het spel opent krijg je een willekeurig weer!',
  ]},
  { version: 'v4.0', date: '2026-02-11', items: [
    'Munten-systeem: versla vijanden voor munten!',
    'Boer Henk verkoopt eieren na de Gouden Ei missie',
    'Drie ei-types: Kippenei, Groot Broedei, Gouden Broedei',
    'Eieren uitbroeden in het kippenhok met timer',
    'Kuikens beginnen klein en groeien in 2 minuten naar volwassen',
    'Gouden kippen hebben een glitter-effect',
    'XP bij uitbroeden: +5 / +15 / +30 per ei-type',
    'Dialog keuze-systeem (pijltjes + enter)',
    'Missies geven nu ook munten als beloning',
  ]},
  { version: 'v3.0', date: '2026-02-07', items: [
    'Ei zoeken: proximity-based (dichtbij komen + actieknop)',
    'Zoekgebied: pulserende cirkel i.p.v. exacte pijl',
    'Kippenhok: groter hek met poortje, mooier ontwerp',
    'Baarsjacht: grotere vijver, duidelijkere instructies',
    'Achtergrondmuziek met [M] toggle in opties',
    'Changelog scherm in hoofdmenu',
    'Minimap toggle op mobiel',
  ]},
  { version: 'v2.0', date: '2026-02-06', items: [
    'Gevechten met wilde kippen in het bos',
    'Missie systeem: 4 unieke missies',
    'Dag/nacht cyclus met dynamische verlichting',
    'Minimap in de hoek',
    'Inventory systeem (rugzak)',
    'NPC dialogen en interacties',
    'Save/load systeem',
    'Geluidseffecten (Web Audio)',
    'Touchscreen besturing (joystick + knoppen)',
  ]},
  { version: 'v1.0', date: '2026-02-05', items: [
    'Eerste versie: dorpswereld met karakter',
    'Basisbeweging en tile-based map',
    'Noedels en de Kip ontmoeten elkaar',
  ]},
];

function drawChangelog() {
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0,0,w,h);

  ctx.fillStyle = C.uiBorder;
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('WAT IS NIEUW', w/2, 50);

  const startY = 90 - changelogScroll;
  let y = startY;
  const left = Math.max(40, w/2 - 240);

  ctx.textAlign = 'left';
  for (const entry of CHANGELOG) {
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 20px monospace';
    if (y > 50 && y < h-60) ctx.fillText(entry.version + '  (' + entry.date + ')', left, y);
    y += 30;

    ctx.font = '13px monospace';
    ctx.fillStyle = '#bbb';
    for (const item of entry.items) {
      if (y > 50 && y < h-60) ctx.fillText('  + ' + item, left, y);
      y += 20;
    }
    y += 15;
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#666';
  ctx.font = '14px monospace';
  ctx.fillText('Pijltjes omhoog/omlaag om te scrollen  |  ESC = terug', w/2, h-30);
  ctx.textAlign = 'left';

  // Scroll input
  if (isDown('up') && changelogScroll > 0) changelogScroll = Math.max(0, changelogScroll - 3);
  if (isDown('down')) changelogScroll += 3;

  if (cancelJust || confirmJust) { changelogScroll = 0; gameState = 'title'; titleInputCooldown = 10; }
}
