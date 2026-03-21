// ═══════════════════════════════════════════
//  CITYSCAPE CANVAS
// ═══════════════════════════════════════════
const canvas = document.getElementById('city-canvas');
const ctx = canvas.getContext('2d');
function resize(){ canvas.width=innerWidth; canvas.height=innerHeight; }
resize(); window.addEventListener('resize',()=>{resize();initBuildings();initRain();initBirds();initSnow();initLeaves();initSpring();initSand();initRadioactive();if(typeof splitActive!=='undefined'&&splitActive)applySplitRatio();});
const buildings=[];
function initBuildings(){
  buildings.length=0; const W=canvas.width,H=canvas.height,count=Math.floor(W/28);
  const summerPalette=[['#c8a87a','#b8976a'],['#bfa070','#ae8f60'],['#d4b48a','#c4a47a'],['#b89060','#a88050'],['#cbb080','#bba070'],['#c0a575','#b09565']];
  const winterPalette=[['#2a3e58','#1e3050'],['#243650','#192c48'],['#2e4460','#223858'],['#1e3252','#162840'],['#324a64','#263e56'],['#28405a','#1c3450']];
  const fallPalette=[['#3a2810','#2e1e0a'],['#2e2008','#241806'],['#382610','#2c1c08'],['#342210','#281808'],['#3e2c12','#32220c'],['#302010','#261808']];
  const springPalette=[['#c8d8a0','#b0c888'],['#b8d090','#a0b878'],['#d0e0a8','#b8c890'],['#aac888','#92b070'],['#c0d898','#a8c080'],['#b0cc8c','#98b474']];
  const sandPalette=[['#4a3010','#3a2408'],['#3e2a0c','#2e1e06'],['#52360e','#402808'],['#442e0c','#342208'],['#4e3212','#3c2608'],['#3a2808','#2c1e06']];
  const radioPalette=[['#081808','#040e04'],['#0a1e0a','#061006'],['#0c2008','#080e04'],['#0e1e0e','#060c06'],['#081c08','#041004'],['#0a1a0a','#050c05']];
  for(let i=0;i<count;i++){const w=18+Math.random()*40,h=H*.2+Math.random()*H*.55;
    const sp=summerPalette[Math.floor(Math.random()*summerPalette.length)];
    const wp=winterPalette[Math.floor(Math.random()*winterPalette.length)];
    const fp=fallPalette[Math.floor(Math.random()*fallPalette.length)];
    const spp=springPalette[Math.floor(Math.random()*springPalette.length)];
    const sdp=sandPalette[Math.floor(Math.random()*sandPalette.length)];
    const rdp=radioPalette[Math.floor(Math.random()*radioPalette.length)];
    buildings.push({x:(i/count)*W+Math.random()*12-6,w,h,
      color:Math.random()>.5?'#061428':'#040e1c',
      summerColor:sp[0], summerColorB:sp[1],
      winterColor:wp[0], winterColorB:wp[1],
      fallColor:fp[0], fallColorB:fp[1],
      springColor:spp[0], springColorB:spp[1],
      sandColor:sdp[0], sandColorB:sdp[1],
      radioColor:rdp[0], radioColorB:rdp[1],
      windows:genWins(w,h)});}
}
function genWins(bw,bh){const wins=[],cols=Math.floor(bw/7),rows=Math.floor(bh/10);
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)wins.push({col:c,row:r,lit:Math.random()>.45,
    color:Math.random()>.6?'#00e5ff':Math.random()>.5?'#80d8ff':'#0288d1',flicker:Math.random()>.92});return wins;}
const drops=[];
function initRain(){drops.length=0;for(let i=0;i<350;i++)drops.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,len:8+Math.random()*22,speed:12+Math.random()*22,opacity:.15+Math.random()*.55,angle:.08+Math.random()*.06});}
initBuildings();initRain();let frame=0;
let rainEnabled=localStorage.getItem('ep_rain')!=='0';
let summerEnabled=localStorage.getItem('ep_summer')==='1';
let winterEnabled=localStorage.getItem('ep_winter')==='1';
let fallEnabled=localStorage.getItem('ep_fall')==='1';
let springEnabled=localStorage.getItem('ep_spring')==='1';
let sandEnabled=localStorage.getItem('ep_sand')==='1';
let radioactiveEnabled=localStorage.getItem('ep_radioactive')==='1';
let particlesEnabled=localStorage.getItem('ep_particles')!=='0'; // per-scene particle toggle
let seasonalMode=localStorage.getItem('ep_seasonal')==='1';

// Birds for summer mode
const birds=[];
function initBirds(){
  birds.length=0;
  for(let i=0;i<18;i++) birds.push({
    x:Math.random()*canvas.width, y:50+Math.random()*canvas.height*0.45,
    speed:0.6+Math.random()*1.2, wingPhase:Math.random()*Math.PI*2,
    size:4+Math.random()*5, dir:Math.random()>0.5?1:-1
  });
}
initBirds();

function drawNightScene(W,H){
  if(!W||!H||!isFinite(W)||!isFinite(H)) return;
  // Night sky gradient
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#020c18');sky.addColorStop(.4,'#041524');
  sky.addColorStop(.7,'#061e30');sky.addColorStop(1,'#030d1a');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  // Ambient glows
  const g=ctx.createRadialGradient(W*.5,H*.38,0,W*.5,H*.38,Math.max(1,W*.5));
  g.addColorStop(0,'rgba(0,180,255,.07)');g.addColorStop(1,'transparent');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  const pg=ctx.createRadialGradient(W*.88,H*.3,0,W*.88,H*.3,Math.max(1,W*.25));
  pg.addColorStop(0,'rgba(255,0,120,.06)');pg.addColorStop(1,'transparent');
  ctx.fillStyle=pg;ctx.fillRect(0,0,W,H);
  // Buildings
  buildings.forEach(b=>{
    const baseY=H*.85,bx=b.x,by=baseY-b.h;
    ctx.fillStyle=b.color;ctx.fillRect(bx,by,b.w,b.h);
    ctx.strokeStyle='rgba(0,200,255,.06)';ctx.lineWidth=1;ctx.strokeRect(bx,by,b.w,b.h);
    b.windows.forEach(win=>{
      if(!win.lit)return;
      if(win.flicker&&(frame%90<3||frame%150>145))return;
      ctx.fillStyle=win.color;
      ctx.globalAlpha=.55+.3*Math.sin(frame*.02+win.col);
      ctx.fillRect(bx+3+win.col*7,by+5+win.row*10,4,5);
      ctx.globalAlpha=1;
    });
    ctx.fillStyle='rgba(0,229,255,.04)';ctx.fillRect(bx,by,b.w,2);
  });
  // Ground
  const ground=H*.85;
  const rg=ctx.createLinearGradient(0,ground,0,H);
  rg.addColorStop(0,'rgba(0,229,255,.12)');rg.addColorStop(.3,'rgba(0,100,180,.08)');rg.addColorStop(1,'#010810');
  ctx.fillStyle=rg;ctx.fillRect(0,ground,W,H-ground);
  // Rain
  ctx.lineCap='round';
  if(rainEnabled && particlesEnabled){
    drops.forEach(d=>{
      ctx.beginPath();
      ctx.strokeStyle=`rgba(160,220,255,${d.opacity})`;
      ctx.lineWidth=.7;
      ctx.moveTo(d.x,d.y);
      ctx.lineTo(d.x+d.len*Math.sin(d.angle),d.y+d.len);
      ctx.stroke();
      d.y+=d.speed;d.x+=d.speed*Math.sin(d.angle);
      if(d.y>H){d.y=-d.len;d.x=Math.random()*W;}
    });
  }
}

function drawSummerScene(W,H){
  if(!W||!H||!isFinite(W)||!isFinite(H)) return;

  // Sky: bright blue to warm horizon
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#5bbfe8');
  sky.addColorStop(0.35,'#87ceeb');
  sky.addColorStop(0.65,'#b8dff5');
  sky.addColorStop(0.82,'#f5d98a');
  sky.addColorStop(1,'#f0c060');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);

  // Sun — radiant golden orb near center-top
  const sunX=W*0.52, sunY=H*0.28;
  // Outer corona
  const corona=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,Math.max(1,W*0.22));
  corona.addColorStop(0,'rgba(255,255,200,0.18)');
  corona.addColorStop(0.4,'rgba(255,220,80,0.08)');
  corona.addColorStop(1,'transparent');
  ctx.fillStyle=corona;ctx.fillRect(0,0,W,H);
  // Inner glow
  const sunGlow=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,Math.max(1,W*0.09));
  sunGlow.addColorStop(0,'rgba(255,255,220,0.55)');
  sunGlow.addColorStop(0.5,'rgba(255,210,50,0.18)');
  sunGlow.addColorStop(1,'transparent');
  ctx.fillStyle=sunGlow;ctx.fillRect(0,0,W,H);
  // Sun disc
  const disc=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,Math.max(1,W*0.045));
  disc.addColorStop(0,'rgba(255,255,240,1)');
  disc.addColorStop(0.5,'rgba(255,230,100,0.9)');
  disc.addColorStop(1,'rgba(255,200,0,0)');
  ctx.fillStyle=disc;
  ctx.beginPath();ctx.arc(sunX,sunY,Math.max(1,W*0.045),0,Math.PI*2);ctx.fill();

  // Clouds (layered, parallax via frame)
  ctx.globalAlpha=0.82;
  const cloudDefs=[
    {x:0.08,y:0.12,r:0.07,speed:0.04},
    {x:0.28,y:0.09,r:0.055,speed:0.028},
    {x:0.62,y:0.14,r:0.065,speed:0.035},
    {x:0.80,y:0.08,r:0.05,speed:0.05},
    {x:0.45,y:0.18,r:0.04,speed:0.022},
    {x:0.15,y:0.22,r:0.035,speed:0.018},
    {x:0.72,y:0.22,r:0.042,speed:0.04},
  ];
  cloudDefs.forEach(cd=>{
    const cx=((cd.x*W + frame*cd.speed) % (W+cd.r*W*2)) - cd.r*W;
    const cy=cd.y*H;
    const cr=Math.max(1,cd.r*W);
    const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,cr);
    cg.addColorStop(0,'rgba(255,255,255,0.95)');
    cg.addColorStop(0.5,'rgba(240,248,255,0.75)');
    cg.addColorStop(1,'rgba(200,230,255,0)');
    ctx.fillStyle=cg;
    ctx.beginPath();
    ctx.ellipse(cx,cy,cr,cr*0.55,0,0,Math.PI*2);
    ctx.fill();
    // Puff bumps
    ctx.beginPath();ctx.ellipse(cx-cr*0.4,cy+cr*0.05,cr*0.55,cr*0.45,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(cx+cr*0.42,cy+cr*0.08,cr*0.5,cr*0.42,0,0,Math.PI*2);ctx.fill();
  });
  ctx.globalAlpha=1;

  // Daytime buildings — warm tan/sandstone tones
  const baseY=H*0.85;
  buildings.forEach(b=>{
    const bx=b.x, by=baseY-b.h;
    // Building face — warm gradient
    const bg=ctx.createLinearGradient(bx,by,bx+b.w,by);
    bg.addColorStop(0,b.summerColor||'#c8a87a');
    bg.addColorStop(1,b.summerColorB||'#b8976a');
    ctx.fillStyle=bg;
    ctx.fillRect(bx,by,b.w,b.h);
    // Subtle outline
    ctx.strokeStyle='rgba(100,70,30,0.1)';ctx.lineWidth=1;
    ctx.strokeRect(bx,by,b.w,b.h);
    // Sun-facing highlight on left edge
    ctx.fillStyle='rgba(255,230,150,0.12)';
    ctx.fillRect(bx,by,3,b.h);
    // Windows — daytime, mostly dark with some lit
    b.windows.forEach(win=>{
      ctx.globalAlpha= win.lit ? 0.55 : 0.15;
      ctx.fillStyle= win.lit ? 'rgba(255,240,200,0.9)' : 'rgba(80,60,30,0.6)';
      ctx.fillRect(bx+3+win.col*7,by+5+win.row*10,4,5);
      ctx.globalAlpha=1;
    });
    // Rooftop warm glow
    ctx.fillStyle='rgba(255,200,50,0.08)';ctx.fillRect(bx,by,b.w,2);
  });

  // Ground — warm pavement
  const rg=ctx.createLinearGradient(0,baseY,0,H);
  rg.addColorStop(0,'rgba(200,160,80,0.35)');
  rg.addColorStop(0.4,'rgba(180,140,70,0.2)');
  rg.addColorStop(1,'#c8a040');
  ctx.fillStyle=rg;ctx.fillRect(0,baseY,W,H-baseY);

  // Ground reflection shimmer
  const shim=ctx.createLinearGradient(0,baseY,0,baseY+40);
  shim.addColorStop(0,'rgba(255,220,100,0.18)');
  shim.addColorStop(1,'transparent');
  ctx.fillStyle=shim;ctx.fillRect(0,baseY,W,40);

  // Birds
  if(particlesEnabled) birds.forEach(b=>{
    b.x+=b.speed*b.dir;
    if(b.x>W+30)b.x=-30;
    if(b.x<-30)b.x=W+30;
    b.wingPhase+=0.12;
    const wFlap=Math.sin(b.wingPhase)*b.size*0.9;
    ctx.strokeStyle='rgba(30,30,30,0.55)';
    ctx.lineWidth=1.1;
    ctx.lineCap='round';
    ctx.beginPath();
    // Left wing
    ctx.moveTo(b.x,b.y);ctx.quadraticCurveTo(b.x-b.size*1.1,b.y-wFlap,b.x-b.size*2,b.y-wFlap*0.3);
    ctx.stroke();
    ctx.beginPath();
    // Right wing
    ctx.moveTo(b.x,b.y);ctx.quadraticCurveTo(b.x+b.size*1.1,b.y-wFlap,b.x+b.size*2,b.y-wFlap*0.3);
    ctx.stroke();
  });
}

// Snowflakes for winter mode
const flakes=[];
const bigFlakes=[];
function initSnow(){
  flakes.length=0; bigFlakes.length=0;
  const W=canvas.width, H=canvas.height;
  for(let i=0;i<220;i++) flakes.push({
    x:Math.random()*W, y:Math.random()*H,
    r:1+Math.random()*2.8,
    speed:0.8+Math.random()*1.8,
    drift:Math.sin(Math.random()*Math.PI*2),
    driftSpeed:0.005+Math.random()*0.01,
    driftPhase:Math.random()*Math.PI*2,
    opacity:0.35+Math.random()*0.55
  });
  // Large decorative snowflakes (6-pointed)
  for(let i=0;i<12;i++) bigFlakes.push({
    x:Math.random()*W, y:Math.random()*H,
    size:10+Math.random()*20,
    speed:0.25+Math.random()*0.6,
    rot:Math.random()*Math.PI*2,
    rotSpeed:(Math.random()-0.5)*0.008,
    opacity:0.25+Math.random()*0.45
  });
}
initSnow();

function drawSnowflakeStar(cx,cy,size,rot){
  ctx.save(); ctx.translate(cx,cy); ctx.rotate(rot);
  for(let i=0;i<6;i++){
    ctx.rotate(Math.PI/3);
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,size);
    ctx.stroke();
    // Side arms
    ctx.beginPath(); ctx.moveTo(0,size*0.55); ctx.lineTo(size*0.22,size*0.33); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,size*0.55); ctx.lineTo(-size*0.22,size*0.33); ctx.stroke();
  }
  ctx.restore();
}

function drawWinterScene(W,H){
  if(!W||!H||!isFinite(W)||!isFinite(H)) return;

  // Cold blue-grey sky
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#0a1628');
  sky.addColorStop(0.3,'#0f2240');
  sky.addColorStop(0.6,'#162d52');
  sky.addColorStop(0.85,'#1e3a60');
  sky.addColorStop(1,'#152e4e');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);

  // Moon — pale white-blue orb with soft corona
  const moonX=W*0.48, moonY=H*0.22;
  const moonCorona=ctx.createRadialGradient(moonX,moonY,0,moonX,moonY,Math.max(1,W*0.18));
  moonCorona.addColorStop(0,'rgba(200,230,255,0.14)');
  moonCorona.addColorStop(0.5,'rgba(168,210,240,0.06)');
  moonCorona.addColorStop(1,'transparent');
  ctx.fillStyle=moonCorona; ctx.fillRect(0,0,W,H);
  // Moon glow
  const moonGlow=ctx.createRadialGradient(moonX,moonY,0,moonX,moonY,Math.max(1,W*0.065));
  moonGlow.addColorStop(0,'rgba(230,245,255,0.55)');
  moonGlow.addColorStop(0.6,'rgba(168,216,240,0.2)');
  moonGlow.addColorStop(1,'transparent');
  ctx.fillStyle=moonGlow; ctx.fillRect(0,0,W,H);
  // Moon disc
  const moonDiscR=Math.max(1,W*0.032);
  const moonDisc=ctx.createRadialGradient(moonX-W*0.008,moonY-W*0.008,0,moonX,moonY,moonDiscR);
  moonDisc.addColorStop(0,'rgba(245,252,255,1)');
  moonDisc.addColorStop(0.55,'rgba(200,230,250,0.9)');
  moonDisc.addColorStop(1,'rgba(168,210,240,0)');
  ctx.fillStyle=moonDisc;
  ctx.beginPath(); ctx.arc(moonX,moonY,moonDiscR,0,Math.PI*2); ctx.fill();

  // Subtle aurora streaks across the upper sky
  ctx.save(); ctx.globalAlpha=0.04+0.02*Math.sin(frame*0.008);
  const aurora=ctx.createLinearGradient(0,H*0.05,W,H*0.25);
  aurora.addColorStop(0,'transparent');
  aurora.addColorStop(0.2,'rgba(100,200,255,0.8)');
  aurora.addColorStop(0.5,'rgba(80,240,200,0.6)');
  aurora.addColorStop(0.8,'rgba(100,180,255,0.6)');
  aurora.addColorStop(1,'transparent');
  ctx.fillStyle=aurora; ctx.fillRect(0,H*0.05,W,H*0.22);
  ctx.restore();

  // Snow-covered buildings — icy steel-blue/slate tones
  const baseY=H*0.85;
  buildings.forEach(b=>{
    const bx=b.x, by=baseY-b.h;
    // Building body gradient — cold steel
    const bg=ctx.createLinearGradient(bx,by,bx+b.w,by);
    bg.addColorStop(0, b.winterColor||'#2a3e58');
    bg.addColorStop(1, b.winterColorB||'#1e3050');
    ctx.fillStyle=bg; ctx.fillRect(bx,by,b.w,b.h);
    ctx.strokeStyle='rgba(100,180,240,0.08)'; ctx.lineWidth=1;
    ctx.strokeRect(bx,by,b.w,b.h);
    // Moon-reflection highlight on one edge
    ctx.fillStyle='rgba(200,230,255,0.06)'; ctx.fillRect(bx,by,2,b.h);
    // Windows — cold blue-white, flickering like frost
    b.windows.forEach(win=>{
      if(!win.lit) return;
      if(win.flicker&&(frame%80<3||frame%130>127)) return;
      ctx.fillStyle='rgba(180,220,255,0.7)';
      ctx.globalAlpha=0.4+0.25*Math.sin(frame*0.018+win.col*0.5);
      ctx.fillRect(bx+3+win.col*7,by+5+win.row*10,4,5);
      ctx.globalAlpha=1;
    });
    // Snow cap on rooftop
    const snowCapH=3+Math.random()*0.5;
    ctx.fillStyle='rgba(220,240,255,0.85)';
    ctx.beginPath();
    ctx.moveTo(bx-1,by+snowCapH);
    ctx.lineTo(bx+b.w/2, by-snowCapH*0.5);
    ctx.lineTo(bx+b.w+1, by+snowCapH);
    ctx.closePath(); ctx.fill();

    // Icicles hanging from roof
    const icicleCols=Math.floor(b.w/5);
    for(let ic=0;ic<icicleCols;ic++){
      const ix=bx+3+ic*5;
      const ilen=4+((ic*7+b.w)%9);
      const ig=ctx.createLinearGradient(ix,by+snowCapH,ix,by+snowCapH+ilen);
      ig.addColorStop(0,'rgba(200,235,255,0.75)');
      ig.addColorStop(1,'rgba(168,216,240,0)');
      ctx.fillStyle=ig;
      ctx.beginPath();
      ctx.moveTo(ix,by+snowCapH);
      ctx.lineTo(ix+1.5,by+snowCapH+ilen);
      ctx.lineTo(ix+3,by+snowCapH);
      ctx.closePath(); ctx.fill();
    }
  });

  // Frozen ground — icy blue-white
  const rg=ctx.createLinearGradient(0,baseY,0,H);
  rg.addColorStop(0,'rgba(168,216,240,0.2)');
  rg.addColorStop(0.3,'rgba(120,180,220,0.12)');
  rg.addColorStop(1,'#0d1e36');
  ctx.fillStyle=rg; ctx.fillRect(0,baseY,W,H-baseY);
  // Ice shimmer
  const shim=ctx.createLinearGradient(0,baseY,0,baseY+30);
  shim.addColorStop(0,'rgba(200,235,255,0.18)');
  shim.addColorStop(1,'transparent');
  ctx.fillStyle=shim; ctx.fillRect(0,baseY,W,30);

  // Small snow particles
  if(particlesEnabled){
  ctx.fillStyle='rgba(255,255,255,1)';
  flakes.forEach(f=>{
    f.driftPhase+=f.driftSpeed;
    f.x+=Math.sin(f.driftPhase)*0.5;
    f.y+=f.speed;
    if(f.y>H+5){ f.y=-5; f.x=Math.random()*W; }
    ctx.globalAlpha=f.opacity;
    ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,Math.PI*2); ctx.fill();
  });
  ctx.globalAlpha=1;

  // Large decorative snowflakes
  bigFlakes.forEach(f=>{
    f.y+=f.speed; f.rot+=f.rotSpeed;
    if(f.y>H+f.size*2){ f.y=-f.size*2; f.x=Math.random()*W; }
    ctx.save();
    ctx.strokeStyle=`rgba(200,235,255,${f.opacity})`;
    ctx.lineWidth=1.2;
    drawSnowflakeStar(f.x,f.y,f.size,f.rot);
    ctx.restore();
  });
  } // end particlesEnabled
}

// Leaves for fall mode
const leaves=[];
const LEAF_COLOURS=['#c0392b','#e67e22','#d35400','#a04000','#8e4a0c','#c8780a','#b5451b','#7b2d00','#cb6d0a','#a03010'];
function initLeaves(){
  leaves.length=0;
  const W=canvas.width, H=canvas.height;
  for(let i=0;i<90;i++) leaves.push({
    x:Math.random()*W, y:Math.random()*H,
    size:6+Math.random()*14,
    colour:LEAF_COLOURS[Math.floor(Math.random()*LEAF_COLOURS.length)],
    rot:Math.random()*Math.PI*2,
    rotSpeed:(Math.random()-0.5)*0.06,
    speedY:0.6+Math.random()*1.4,
    speedX:(Math.random()-0.5)*1.2,
    wobble:Math.random()*Math.PI*2,
    wobbleSpeed:0.02+Math.random()*0.03,
    opacity:0.7+Math.random()*0.3,
    type:Math.floor(Math.random()*3) // 0=oak, 1=maple, 2=simple
  });
}
initLeaves();

function drawLeafShape(cx,cy,size,rot,type){
  ctx.save(); ctx.translate(cx,cy); ctx.rotate(rot);
  ctx.beginPath();
  if(type===0){
    // Oak-ish: lobed ellipse silhouette
    ctx.moveTo(0,-size);
    ctx.bezierCurveTo(size*0.6,-size*0.7, size*0.9,-size*0.2, size*0.5, 0);
    ctx.bezierCurveTo(size*0.9, size*0.3, size*0.5, size*0.8, 0, size);
    ctx.bezierCurveTo(-size*0.5, size*0.8, -size*0.9, size*0.3, -size*0.5, 0);
    ctx.bezierCurveTo(-size*0.9,-size*0.2, -size*0.6,-size*0.7, 0,-size);
  } else if(type===1){
    // Maple-ish: star points
    const pts=5, inner=size*0.45, outer=size;
    for(let i=0;i<pts*2;i++){
      const r=i%2===0?outer:inner;
      const a=(i/pts/2)*Math.PI*2-Math.PI/2;
      i===0?ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r):ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);
    }
  } else {
    // Simple oval leaf
    ctx.ellipse(0,0,size*0.45,size,0,0,Math.PI*2);
  }
  ctx.closePath();
  ctx.fill();
  // Stem
  ctx.beginPath(); ctx.moveTo(0,size*0.5); ctx.lineTo(0,size*1.3);
  ctx.strokeStyle='rgba(60,30,10,0.5)'; ctx.lineWidth=0.8; ctx.stroke();
  ctx.restore();
}

function drawFallScene(W,H){
  if(!W||!H||!isFinite(W)||!isFinite(H)) return;

  // Warm dusk sky — deep amber/purple at top, golden horizon
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#1a0e04');
  sky.addColorStop(0.2,'#2e1808');
  sky.addColorStop(0.45,'#5c2e08');
  sky.addColorStop(0.68,'#c86010');
  sky.addColorStop(0.85,'#e09020');
  sky.addColorStop(1,'#c87818');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);

  // Sun — low on horizon, large warm disc with god-rays
  const sunX=W*0.5, sunY=H*0.55;
  // God rays (crepuscular)
  const rayCount=14;
  for(let i=0;i<rayCount;i++){
    const angle=-Math.PI/2 + (i/(rayCount-1)-0.5)*Math.PI*0.9;
    const len=H*1.1;
    const rayAlpha=0.04+0.03*Math.sin(frame*0.005+i);
    ctx.save();
    ctx.globalAlpha=rayAlpha;
    ctx.fillStyle='rgba(255,220,80,1)';
    ctx.beginPath();
    ctx.moveTo(sunX,sunY);
    ctx.lineTo(sunX+Math.cos(angle-0.025)*len, sunY+Math.sin(angle-0.025)*len);
    ctx.lineTo(sunX+Math.cos(angle+0.025)*len, sunY+Math.sin(angle+0.025)*len);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  // Sun outer corona
  const sunC=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,Math.max(1,W*0.2));
  sunC.addColorStop(0,'rgba(255,200,50,0.22)');
  sunC.addColorStop(0.5,'rgba(220,120,10,0.08)');
  sunC.addColorStop(1,'transparent');
  ctx.fillStyle=sunC; ctx.fillRect(0,0,W,H);
  // Sun glow
  const sunG=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,Math.max(1,W*0.08));
  sunG.addColorStop(0,'rgba(255,230,100,0.6)');
  sunG.addColorStop(0.6,'rgba(220,140,20,0.2)');
  sunG.addColorStop(1,'transparent');
  ctx.fillStyle=sunG; ctx.fillRect(0,0,W,H);
  // Sun disc
  const sunDiscR=Math.max(1,W*0.038);
  const sunD=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,sunDiscR);
  sunD.addColorStop(0,'rgba(255,248,200,1)');
  sunD.addColorStop(0.5,'rgba(255,200,60,0.9)');
  sunD.addColorStop(1,'rgba(220,120,0,0)');
  ctx.fillStyle=sunD;
  ctx.beginPath(); ctx.arc(sunX,sunY,sunDiscR,0,Math.PI*2); ctx.fill();

  // Horizon warm haze
  const haze=ctx.createLinearGradient(0,H*0.6,0,H*0.85);
  haze.addColorStop(0,'rgba(200,100,10,0.0)');
  haze.addColorStop(0.5,'rgba(220,130,10,0.12)');
  haze.addColorStop(1,'rgba(180,80,5,0.0)');
  ctx.fillStyle=haze; ctx.fillRect(0,H*0.6,W,H*0.25);

  // Buildings — dark warm silhouettes
  const baseY=H*0.82;
  buildings.forEach(b=>{
    const bx=b.x, by=baseY-b.h;
    // Silhouette darker near top, slight warm tint near base
    const bg=ctx.createLinearGradient(bx,by,bx,baseY);
    bg.addColorStop(0,b.fallColor||'#2e1e0a');
    bg.addColorStop(0.7,b.fallColorB||'#241808');
    bg.addColorStop(1,'#3a2210');
    ctx.fillStyle=bg; ctx.fillRect(bx,by,b.w,b.h);
    ctx.strokeStyle='rgba(200,100,10,0.06)'; ctx.lineWidth=1;
    ctx.strokeRect(bx,by,b.w,b.h);
    // Warm window glow — amber/orange, some with warm white
    b.windows.forEach(win=>{
      if(!win.lit) return;
      if(win.flicker&&(frame%85<3||frame%140>137)) return;
      const wc=Math.random()>0.5?'rgba(255,180,60,':'rgba(255,220,120,';
      ctx.fillStyle=wc+'0.85)';
      ctx.globalAlpha=0.45+0.3*Math.sin(frame*0.02+win.col*0.7);
      ctx.fillRect(bx+3+win.col*7,by+5+win.row*10,4,5);
      ctx.globalAlpha=1;
    });
    // Rooftop warm edge-light from sun
    const rimAlpha=0.08+0.04*Math.sin(frame*0.01);
    ctx.fillStyle=`rgba(220,140,20,${rimAlpha})`;
    ctx.fillRect(bx,by,b.w,2);
  });

  // Ground — dark earth with warm glow near base of buildings
  const rg=ctx.createLinearGradient(0,baseY,0,H);
  rg.addColorStop(0,'rgba(180,90,10,0.3)');
  rg.addColorStop(0.3,'rgba(120,55,5,0.2)');
  rg.addColorStop(1,'#100800');
  ctx.fillStyle=rg; ctx.fillRect(0,baseY,W,H-baseY);

  // Falling leaves
  if(particlesEnabled){
  leaves.forEach(lf=>{
    lf.wobble+=lf.wobbleSpeed;
    lf.x+=lf.speedX+Math.sin(lf.wobble)*0.8;
    lf.y+=lf.speedY+Math.cos(lf.wobble*0.7)*0.4;
    lf.rot+=lf.rotSpeed;
    if(lf.y>H+lf.size*2){ lf.y=-lf.size*2; lf.x=Math.random()*W; }
    if(lf.x>W+lf.size*2) lf.x=-lf.size*2;
    if(lf.x<-lf.size*2) lf.x=W+lf.size*2;
    ctx.globalAlpha=lf.opacity;
    ctx.fillStyle=lf.colour;
    drawLeafShape(lf.x,lf.y,lf.size,lf.rot,lf.type);
  });
  ctx.globalAlpha=1;
  } // end particlesEnabled
}

// Spring particles
const petals=[];
const springLeaves=[];
const butterflies=[];
const PETAL_COLS=['#f9c8d8','#f5a8c0','#fce0ea','#f8b4cc','#ffd6e0','#ffc0cb','#ffb8d0'];
const SPRING_LEAF_COLS=['#a8d870','#88c050','#b8e080','#78b840','#c8e898'];
function initSpring(){
  petals.length=0; springLeaves.length=0; butterflies.length=0;
  const W=canvas.width,H=canvas.height;
  for(let i=0;i<65;i++) petals.push({
    x:Math.random()*W, y:Math.random()*H,
    size:5+Math.random()*10,
    col:PETAL_COLS[Math.floor(Math.random()*PETAL_COLS.length)],
    rot:Math.random()*Math.PI*2, rotSpeed:(Math.random()-0.5)*0.04,
    speedY:0.5+Math.random()*1.0, speedX:(Math.random()-0.5)*0.7,
    wobble:Math.random()*Math.PI*2, wobbleSpeed:0.018+Math.random()*0.025,
    opacity:0.65+Math.random()*0.3
  });
  for(let i=0;i<35;i++) springLeaves.push({
    x:Math.random()*W, y:Math.random()*H,
    size:6+Math.random()*10,
    col:SPRING_LEAF_COLS[Math.floor(Math.random()*SPRING_LEAF_COLS.length)],
    rot:Math.random()*Math.PI*2, rotSpeed:(Math.random()-0.5)*0.03,
    speedY:0.4+Math.random()*0.8, speedX:(Math.random()-0.5)*0.6,
    wobble:Math.random()*Math.PI*2, wobbleSpeed:0.015+Math.random()*0.02,
    opacity:0.6+Math.random()*0.35
  });
  for(let i=0;i<10;i++){
    const col=Math.random()>0.5?['#e87820','#000080','#f5a020']:['#3060c0','#000000','#6090e0'];
    butterflies.push({
      x:Math.random()*W, y:60+Math.random()*H*0.55,
      wingPhase:Math.random()*Math.PI*2, wingSpeed:0.09+Math.random()*0.08,
      size:9+Math.random()*8, dir:Math.random()>0.5?1:-1,
      speedX:0.5+Math.random()*0.8, speedY:(Math.random()-0.5)*0.3,
      wobbleY:0,wobblePhase:Math.random()*Math.PI*2,
      col:col
    });
  }
}
initSpring();

function drawSpringScene(W,H){
  if(!W||!H||!isFinite(W)||!isFinite(H)) return;

  // Bright clear sky — deep sky blue at top fading to soft white near horizon
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#5bc8f0');
  sky.addColorStop(0.4,'#88d8f5');
  sky.addColorStop(0.72,'#beeaff');
  sky.addColorStop(0.9,'#e0f5ff');
  sky.addColorStop(1,'#f5faff');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);

  // Bright high sun
  const sunX=W*0.5, sunY=H*0.18;
  const sunC=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,Math.max(1,W*0.18));
  sunC.addColorStop(0,'rgba(255,255,220,0.28)'); sunC.addColorStop(1,'transparent');
  ctx.fillStyle=sunC; ctx.fillRect(0,0,W,H);
  const sunG=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,Math.max(1,W*0.065));
  sunG.addColorStop(0,'rgba(255,255,200,0.65)'); sunG.addColorStop(1,'transparent');
  ctx.fillStyle=sunG; ctx.fillRect(0,0,W,H);
  const sunDiscR=Math.max(1,W*0.035);
  const sunD=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,sunDiscR);
  sunD.addColorStop(0,'rgba(255,255,240,1)'); sunD.addColorStop(0.5,'rgba(255,240,150,0.85)'); sunD.addColorStop(1,'rgba(255,220,80,0)');
  ctx.fillStyle=sunD; ctx.beginPath(); ctx.arc(sunX,sunY,sunDiscR,0,Math.PI*2); ctx.fill();

  // Fluffy white clouds
  ctx.globalAlpha=0.88;
  const clouds=[{x:0.1,y:0.1,r:0.06,s:0.025},{x:0.35,y:0.08,r:0.05,s:0.018},{x:0.68,y:0.12,r:0.065,s:0.03},{x:0.85,y:0.07,r:0.045,s:0.038},{x:0.22,y:0.2,r:0.038,s:0.015},{x:0.6,y:0.22,r:0.04,s:0.022}];
  clouds.forEach(cd=>{
    const cx=((cd.x*W+frame*cd.s)%(W+cd.r*W*2))-cd.r*W, cy=cd.y*H, cr=Math.max(1,cd.r*W);
    const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,cr);
    cg.addColorStop(0,'rgba(255,255,255,0.98)'); cg.addColorStop(0.55,'rgba(240,250,255,0.8)'); cg.addColorStop(1,'rgba(200,235,255,0)');
    ctx.fillStyle=cg;
    ctx.beginPath(); ctx.ellipse(cx,cy,cr,cr*0.52,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx-cr*0.38,cy+cr*0.05,cr*0.52,cr*0.42,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx+cr*0.4,cy+cr*0.07,cr*0.48,cr*0.4,0,0,Math.PI*2); ctx.fill();
  });
  ctx.globalAlpha=1;

  // Buildings — fresh spring greens with ivy tones
  const baseY=H*0.82;
  buildings.forEach(b=>{
    const bx=b.x, by=baseY-b.h;
    const bg=ctx.createLinearGradient(bx,by,bx+b.w,by);
    bg.addColorStop(0,b.springColor||'#b8d090'); bg.addColorStop(1,b.springColorB||'#a0c078');
    ctx.fillStyle=bg; ctx.fillRect(bx,by,b.w,b.h);
    ctx.strokeStyle='rgba(60,140,60,0.1)'; ctx.lineWidth=1; ctx.strokeRect(bx,by,b.w,b.h);
    // Sun highlight
    ctx.fillStyle='rgba(255,255,200,0.1)'; ctx.fillRect(bx,by,3,b.h);
    // Windows — daytime, warm white with green tint
    b.windows.forEach(win=>{
      ctx.globalAlpha=win.lit?0.5:0.12;
      ctx.fillStyle=win.lit?'rgba(220,255,200,0.9)':'rgba(80,120,60,0.4)';
      ctx.fillRect(bx+3+win.col*7,by+5+win.row*10,4,5);
      ctx.globalAlpha=1;
    });
    // Rooftop flower/grass strip
    const stripH=Math.min(6,b.w*0.15);
    const flowerCols=['#f9a8c0','#c8e870','#f5c842','#e080c8','#88d8a0'];
    ctx.fillStyle=flowerCols[Math.floor(b.x*7%5)];
    ctx.fillRect(bx,by-stripH,b.w,stripH);
    // Ivy vines on side
    ctx.strokeStyle='rgba(60,160,60,0.35)'; ctx.lineWidth=1;
    for(let v=0;v<Math.floor(b.h/30);v++){
      const vy=by+v*30+15;
      ctx.beginPath(); ctx.moveTo(bx,vy); ctx.quadraticCurveTo(bx-4,vy+8,bx+2,vy+15); ctx.stroke();
    }
  });

  // Ground — fresh green grass
  const rg=ctx.createLinearGradient(0,baseY,0,H);
  rg.addColorStop(0,'rgba(100,200,80,0.5)'); rg.addColorStop(0.3,'rgba(80,170,60,0.3)'); rg.addColorStop(1,'#4a9040');
  ctx.fillStyle=rg; ctx.fillRect(0,baseY,W,H-baseY);
  // Grass shimmer
  const gs=ctx.createLinearGradient(0,baseY,0,baseY+25);
  gs.addColorStop(0,'rgba(180,255,120,0.22)'); gs.addColorStop(1,'transparent');
  ctx.fillStyle=gs; ctx.fillRect(0,baseY,W,25);

  if(particlesEnabled){
    // Cherry blossom petals
    petals.forEach(p=>{
      p.wobble+=p.wobbleSpeed; p.x+=p.speedX+Math.sin(p.wobble)*0.6; p.y+=p.speedY+Math.cos(p.wobble*0.8)*0.3; p.rot+=p.rotSpeed;
      if(p.y>H+p.size*2){p.y=-p.size*2; p.x=Math.random()*W;}
      if(p.x>W+p.size*2) p.x=-p.size*2; if(p.x<-p.size*2) p.x=W+p.size*2;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.globalAlpha=p.opacity;
      ctx.fillStyle=p.col;
      // Petal shape: two ellipses overlapping
      ctx.beginPath(); ctx.ellipse(0,-p.size*0.3,p.size*0.4,p.size*0.8,0.3,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(0,-p.size*0.3,p.size*0.4,p.size*0.8,-0.3,0,Math.PI*2); ctx.fill();
      ctx.restore();
    });
    ctx.globalAlpha=1;

    // Floating leaves
    springLeaves.forEach(sl=>{
      sl.wobble+=sl.wobbleSpeed; sl.x+=sl.speedX+Math.sin(sl.wobble)*0.5; sl.y+=sl.speedY; sl.rot+=sl.rotSpeed;
      if(sl.y>H+sl.size*2){sl.y=-sl.size*2; sl.x=Math.random()*W;}
      ctx.save(); ctx.translate(sl.x,sl.y); ctx.rotate(sl.rot); ctx.globalAlpha=sl.opacity;
      ctx.fillStyle=sl.col;
      ctx.beginPath(); ctx.ellipse(0,0,sl.size*0.35,sl.size,0,0,Math.PI*2); ctx.fill();
      ctx.restore();
    });
    ctx.globalAlpha=1;

    // Butterflies
    butterflies.forEach(bf=>{
      bf.wingPhase+=bf.wingSpeed; bf.wobblePhase+=0.03;
      bf.x+=bf.speedX*bf.dir; bf.y+=bf.speedY+Math.sin(bf.wobblePhase)*0.4;
      if(bf.x>W+40) bf.x=-40; if(bf.x<-40) bf.x=W+40;
      if(bf.y<30) bf.y=30; if(bf.y>H*0.65) bf.y=H*0.65;
      const wFlap=Math.sin(bf.wingPhase)*bf.size;
      ctx.save(); ctx.translate(bf.x,bf.y);
      ctx.globalAlpha=0.85;
      // Wings: filled shapes
      const [bodyCol,wingEdge,wingFill]=bf.col;
      [[1,-0.3],[- 1,-0.3]].forEach(([sx,rx])=>{
        ctx.fillStyle=wingFill;
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.quadraticCurveTo(sx*bf.size*2, -wFlap*1.2, sx*bf.size*2.8, -wFlap*0.6+rx*5);
        ctx.quadraticCurveTo(sx*bf.size*2.2, wFlap*0.5, 0,bf.size*0.4);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle=wingEdge; ctx.lineWidth=0.6; ctx.stroke();
      });
      // Body
      ctx.fillStyle=bodyCol;
      ctx.beginPath(); ctx.ellipse(0,0,bf.size*0.18,bf.size*0.7,0,0,Math.PI*2); ctx.fill();
      ctx.restore();
    });
    ctx.globalAlpha=1;
  }
}

// ── Sand City particles ──
const sandGrains=[];
let sandLightning={active:false,x:0,branches:[],timer:0,flashAlpha:0};
function initSand(){
  sandGrains.length=0;
  const W=canvas.width,H=canvas.height;
  for(let i=0;i<320;i++) sandGrains.push({
    x:Math.random()*W, y:Math.random()*H,
    size:1+Math.random()*2.5,
    speedX:1.5+Math.random()*2.5, speedY:(Math.random()-0.3)*0.8,
    opacity:0.18+Math.random()*0.45,
    wobble:Math.random()*Math.PI*2, wobbleSpeed:0.02+Math.random()*0.03,
    col:Math.random()>0.5?'rgba(200,160,80,':'rgba(220,180,100,'
  });
}
initSand();
function triggerSandLightning(W,H){
  sandLightning.active=true; sandLightning.timer=28; sandLightning.flashAlpha=0.18;
  sandLightning.x=W*0.2+Math.random()*W*0.6;
  sandLightning.branches=[];
  let cx=sandLightning.x, cy=0;
  while(cy<H*0.85){
    const nx=cx+(Math.random()-0.5)*80, ny=cy+30+Math.random()*40;
    sandLightning.branches.push({x1:cx,y1:cy,x2:nx,y2:ny});
    cx=nx; cy=ny;
    if(Math.random()>0.65&&cy<H*0.6){
      let bx=cx,by=cy;
      for(let b=0;b<3;b++){
        const bx2=bx+(Math.random()-0.5)*60, by2=by+20+Math.random()*30;
        sandLightning.branches.push({x1:bx,y1:by,x2:bx2,y2:by2,sub:true});
        bx=bx2; by=by2;
      }
    }
  }
}

function drawSandScene(W,H){
  if(!W||!H||!isFinite(W)||!isFinite(H)) return;

  // Storm sky — deep ochre/brown haze
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#1a0e02');
  sky.addColorStop(0.2,'#2e1a06');
  sky.addColorStop(0.45,'#4a2e0a');
  sky.addColorStop(0.7,'#7a5018');
  sky.addColorStop(0.88,'#a07028');
  sky.addColorStop(1,'#8a5c18');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);

  // Dusty haze layers
  const haze1=ctx.createLinearGradient(0,H*0.3,0,H*0.75);
  haze1.addColorStop(0,'rgba(160,110,30,0)');
  haze1.addColorStop(0.5,'rgba(180,130,40,0.12)');
  haze1.addColorStop(1,'rgba(140,90,20,0)');
  ctx.fillStyle=haze1; ctx.fillRect(0,H*0.3,W,H*0.45);

  // Swirling dust clouds
  ctx.globalAlpha=0.06+0.03*Math.sin(frame*0.007);
  const dustClouds=[{x:0.15,y:0.35,r:0.18},{x:0.55,y:0.28,r:0.22},{x:0.82,y:0.42,r:0.16},{x:0.38,y:0.5,r:0.14}];
  dustClouds.forEach(dc=>{
    const cx=((dc.x*W+frame*0.4)%(W+dc.r*W*2))-dc.r*W;
    const cy=dc.y*H+Math.sin(frame*0.005+dc.x*5)*H*0.03;
    const cr=Math.max(1,dc.r*W);
    const dg=ctx.createRadialGradient(cx,cy,0,cx,cy,cr);
    dg.addColorStop(0,'rgba(180,130,50,0.7)'); dg.addColorStop(1,'transparent');
    ctx.fillStyle=dg; ctx.beginPath(); ctx.ellipse(cx,cy,cr,cr*0.45,0,0,Math.PI*2); ctx.fill();
  });
  ctx.globalAlpha=1;

  // Lightning flash screen overlay
  if(sandLightning.active&&sandLightning.flashAlpha>0){
    ctx.fillStyle=`rgba(255,220,100,${sandLightning.flashAlpha})`;
    ctx.fillRect(0,0,W,H);
    sandLightning.flashAlpha*=0.75;
  }

  // Buildings — sepia silhouettes with amber windows
  const baseY=H*0.83;
  buildings.forEach(b=>{
    const bx=b.x, by=baseY-b.h;
    const bg=ctx.createLinearGradient(bx,by,bx,baseY);
    bg.addColorStop(0,b.sandColor||'#2e1c06');
    bg.addColorStop(1,b.sandColorB||'#1e1204');
    ctx.fillStyle=bg; ctx.fillRect(bx,by,b.w,b.h);
    ctx.strokeStyle='rgba(180,120,30,0.08)'; ctx.lineWidth=1; ctx.strokeRect(bx,by,b.w,b.h);
    // Amber-glowing windows
    b.windows.forEach(win=>{
      if(!win.lit) return;
      if(win.flicker&&(frame%70<4||frame%110>106)) return;
      ctx.fillStyle='rgba(255,180,50,0.88)';
      ctx.globalAlpha=0.4+0.35*Math.sin(frame*0.025+win.col*0.8+win.row*0.5);
      ctx.fillRect(bx+3+win.col*7,by+5+win.row*10,4,5);
      ctx.globalAlpha=1;
    });
    // Dusty rooftop
    ctx.fillStyle=`rgba(180,130,40,${0.07+0.04*Math.sin(frame*0.008)})`;
    ctx.fillRect(bx,by,b.w,2);
  });

  // Ground — sandy drift
  const rg=ctx.createLinearGradient(0,baseY,0,H);
  rg.addColorStop(0,'rgba(160,110,30,0.35)');
  rg.addColorStop(0.4,'rgba(120,80,20,0.25)');
  rg.addColorStop(1,'#180e02');
  ctx.fillStyle=rg; ctx.fillRect(0,baseY,W,H-baseY);
  const gs=ctx.createLinearGradient(0,baseY,0,baseY+30);
  gs.addColorStop(0,'rgba(220,170,60,0.18)'); gs.addColorStop(1,'transparent');
  ctx.fillStyle=gs; ctx.fillRect(0,baseY,W,30);

  // Lightning bolt
  if(sandLightning.active){
    sandLightning.timer--;
    if(sandLightning.timer<=0) sandLightning.active=false;
    const la=Math.min(1,(sandLightning.timer/28)*1.4);
    ctx.save();
    sandLightning.branches.forEach(seg=>{
      ctx.strokeStyle=seg.sub?`rgba(255,200,80,${la*0.55})`:`rgba(255,240,120,${la*0.95})`;
      ctx.lineWidth=seg.sub?0.8:2.2;
      ctx.shadowColor='rgba(255,220,80,0.8)'; ctx.shadowBlur=seg.sub?4:12;
      ctx.beginPath(); ctx.moveTo(seg.x1,seg.y1); ctx.lineTo(seg.x2,seg.y2); ctx.stroke();
    });
    ctx.restore();
  }
  // Random lightning trigger
  if(Math.random()<0.003&&!sandLightning.active) triggerSandLightning(W,H);

  // Swirling sand grain particles
  if(particlesEnabled){
    sandGrains.forEach(g=>{
      g.wobble+=g.wobbleSpeed;
      g.x+=g.speedX+Math.sin(g.wobble)*0.8;
      g.y+=g.speedY+Math.cos(g.wobble*0.7)*0.4;
      if(g.x>W+g.size*2){g.x=-g.size*2; g.y=Math.random()*H;}
      if(g.y>H+g.size*2){g.y=-g.size*2;}
      if(g.y<-g.size*2){g.y=H+g.size*2;}
      ctx.globalAlpha=g.opacity;
      ctx.fillStyle=g.col+`${g.opacity})`;
      ctx.beginPath(); ctx.arc(g.x,g.y,g.size,0,Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha=1;
  }
}

// ── Radioactive City particles ──
const toxicParticles=[];
let radioLightning={active:false,branches:[],timer:0,flashAlpha:0};
function initRadioactive(){
  toxicParticles.length=0;
  const W=canvas.width,H=canvas.height;
  for(let i=0;i<200;i++) toxicParticles.push({
    x:Math.random()*W, y:Math.random()*H,
    size:2+Math.random()*6,
    speedX:(Math.random()-0.5)*0.5, speedY:-0.3-Math.random()*0.8,
    opacity:0.12+Math.random()*0.35,
    wobble:Math.random()*Math.PI*2, wobbleSpeed:0.01+Math.random()*0.02,
    life:Math.random()
  });
}
initRadioactive();
function triggerRadioLightning(W,H){
  radioLightning.active=true; radioLightning.timer=22; radioLightning.flashAlpha=0.12;
  radioLightning.branches=[];
  let cx=W*0.1+Math.random()*W*0.8, cy=0;
  while(cy<H*0.8){
    const nx=cx+(Math.random()-0.5)*70, ny=cy+25+Math.random()*35;
    radioLightning.branches.push({x1:cx,y1:cy,x2:nx,y2:ny});
    cx=nx; cy=ny;
    if(Math.random()>0.6&&cy<H*0.55){
      let bx=cx,by=cy;
      for(let b=0;b<3;b++){
        const bx2=bx+(Math.random()-0.5)*50, by2=by+15+Math.random()*25;
        radioLightning.branches.push({x1:bx,y1:by,x2:bx2,y2:by2,sub:true});
        bx=bx2; by=by2;
      }
    }
  }
}

function drawRadioactiveScene(W,H){
  if(!W||!H||!isFinite(W)||!isFinite(H)) return;

  // Sickly green sky
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#010801');
  sky.addColorStop(0.25,'#020f02');
  sky.addColorStop(0.5,'#041804');
  sky.addColorStop(0.75,'#062006');
  sky.addColorStop(1,'#082808');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);

  // Toxic green ambient glow from horizon
  const horizonGlow=ctx.createRadialGradient(W*0.5,H*0.75,0,W*0.5,H*0.75,Math.max(1,W*0.6));
  horizonGlow.addColorStop(0,'rgba(57,255,20,0.07)');
  horizonGlow.addColorStop(0.5,'rgba(40,180,10,0.04)');
  horizonGlow.addColorStop(1,'transparent');
  ctx.fillStyle=horizonGlow; ctx.fillRect(0,0,W,H);

  // Swirling toxic fog clouds
  ctx.globalAlpha=0.05+0.025*Math.sin(frame*0.006);
  const fogClouds=[{x:0.1,y:0.4,r:0.2,s:0.12},{x:0.5,y:0.32,r:0.25,s:0.08},{x:0.78,y:0.45,r:0.18,s:0.14},{x:0.32,y:0.55,r:0.15,s:0.1}];
  fogClouds.forEach(fc=>{
    const cx=((fc.x*W+frame*fc.s)%(W+fc.r*W*2))-fc.r*W;
    const cy=fc.y*H+Math.sin(frame*0.004+fc.x*4)*H*0.04;
    const cr=Math.max(1,fc.r*W);
    const fg=ctx.createRadialGradient(cx,cy,0,cx,cy,cr);
    fg.addColorStop(0,'rgba(57,255,20,0.65)'); fg.addColorStop(0.5,'rgba(30,150,10,0.3)'); fg.addColorStop(1,'transparent');
    ctx.fillStyle=fg; ctx.beginPath(); ctx.ellipse(cx,cy,cr,cr*0.4,0,0,Math.PI*2); ctx.fill();
  });
  ctx.globalAlpha=1;

  // Lightning flash overlay
  if(radioLightning.active&&radioLightning.flashAlpha>0){
    ctx.fillStyle=`rgba(57,255,20,${radioLightning.flashAlpha})`;
    ctx.fillRect(0,0,W,H);
    radioLightning.flashAlpha*=0.78;
  }

  // Dark overgrown buildings with eerie green windows
  const baseY=H*0.83;
  buildings.forEach(b=>{
    const bx=b.x, by=baseY-b.h;
    const bg=ctx.createLinearGradient(bx,by,bx,baseY);
    bg.addColorStop(0,b.radioColor||'#081408');
    bg.addColorStop(1,b.radioColorB||'#040a04');
    ctx.fillStyle=bg; ctx.fillRect(bx,by,b.w,b.h);
    ctx.strokeStyle='rgba(57,255,20,0.06)'; ctx.lineWidth=1; ctx.strokeRect(bx,by,b.w,b.h);
    // Toxic green windows
    b.windows.forEach(win=>{
      if(!win.lit) return;
      if(win.flicker&&(frame%65<4||frame%105>101)) return;
      ctx.fillStyle='rgba(57,255,20,0.9)';
      ctx.globalAlpha=0.3+0.4*Math.sin(frame*0.022+win.col*0.9+win.row*0.6);
      ctx.fillRect(bx+3+win.col*7,by+5+win.row*10,4,5);
      ctx.globalAlpha=1;
      // Window glow bloom
      const wg=ctx.createRadialGradient(bx+5+win.col*7,by+7+win.row*10,0,bx+5+win.col*7,by+7+win.row*10,8);
      wg.addColorStop(0,'rgba(57,255,20,0.15)'); wg.addColorStop(1,'transparent');
      ctx.fillStyle=wg; ctx.fillRect(bx+win.col*7-4,by+win.row*10-4,16,14);
    });
    // Ivy/vine overgrowth on building sides
    ctx.strokeStyle='rgba(40,180,10,0.3)'; ctx.lineWidth=1.2;
    for(let v=0;v<Math.floor(b.h/25);v++){
      const vy=by+v*25+10;
      ctx.beginPath(); ctx.moveTo(bx,vy);
      ctx.quadraticCurveTo(bx-5,vy+10,bx+2,vy+20); ctx.stroke();
      if(v%2===0){
        ctx.beginPath(); ctx.moveTo(bx+b.w,vy+5);
        ctx.quadraticCurveTo(bx+b.w+5,vy+12,bx+b.w-2,vy+22); ctx.stroke();
      }
    }
    // Rooftop eerie glow
    const rimA=0.06+0.04*Math.sin(frame*0.012+b.x*0.01);
    ctx.fillStyle=`rgba(57,255,20,${rimA})`; ctx.fillRect(bx,by,b.w,2);
  });

  // Ground — dark toxic mud
  const rg=ctx.createLinearGradient(0,baseY,0,H);
  rg.addColorStop(0,'rgba(40,120,10,0.25)');
  rg.addColorStop(0.4,'rgba(20,70,5,0.18)');
  rg.addColorStop(1,'#010601');
  ctx.fillStyle=rg; ctx.fillRect(0,baseY,W,H-baseY);
  // Toxic puddle shimmer
  const ps=ctx.createLinearGradient(0,baseY,0,baseY+20);
  ps.addColorStop(0,'rgba(57,255,20,0.12)'); ps.addColorStop(1,'transparent');
  ctx.fillStyle=ps; ctx.fillRect(0,baseY,W,20);

  // Green lightning
  if(radioLightning.active){
    radioLightning.timer--;
    if(radioLightning.timer<=0) radioLightning.active=false;
    const la=Math.min(1,(radioLightning.timer/22)*1.5);
    ctx.save();
    radioLightning.branches.forEach(seg=>{
      ctx.strokeStyle=seg.sub?`rgba(57,255,20,${la*0.5})`:`rgba(100,255,60,${la*0.95})`;
      ctx.lineWidth=seg.sub?0.8:2;
      ctx.shadowColor='rgba(57,255,20,0.9)'; ctx.shadowBlur=seg.sub?6:16;
      ctx.beginPath(); ctx.moveTo(seg.x1,seg.y1); ctx.lineTo(seg.x2,seg.y2); ctx.stroke();
    });
    ctx.restore();
  }
  if(Math.random()<0.004&&!radioLightning.active) triggerRadioLightning(W,H);

  // Rising toxic smoke/fog particles
  if(particlesEnabled){
    toxicParticles.forEach(p=>{
      p.wobble+=p.wobbleSpeed;
      p.x+=p.speedX+Math.sin(p.wobble)*0.6;
      p.y+=p.speedY;
      p.life+=0.003;
      if(p.y<-p.size*3||p.life>1){ p.y=baseY+p.size; p.x=Math.random()*W; p.life=Math.random()*0.3; }
      const fade=Math.sin(p.life*Math.PI);
      ctx.globalAlpha=p.opacity*fade;
      const pg=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,Math.max(1,p.size));
      pg.addColorStop(0,'rgba(57,255,20,0.7)'); pg.addColorStop(1,'transparent');
      ctx.fillStyle=pg; ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha=1;
  }
}

function getSeasonFromDate(){
  const m=new Date().getMonth()+1, d=new Date().getDate();
  // Spring: Mar 20 – Jun 20, Summer: Jun 21 – Sep 21, Fall: Sep 22 – Dec 20, Winter: Dec 21 – Mar 19
  if((m===3&&d>=20)||(m===4||m===5)||(m===6&&d<=20)) return 'spring';
  if((m===6&&d>=21)||(m===7||m===8)||(m===9&&d<=21)) return 'summer';
  if((m===9&&d>=22)||(m===10||m===11)||(m===12&&d<=20)) return 'fall';
  return 'winter';
}

function applySeasonalMode(){
  if(!seasonalMode) return;
  const s=getSeasonFromDate();
  summerEnabled=s==='summer'; winterEnabled=s==='winter';
  fallEnabled=s==='fall'; springEnabled=s==='spring';
  sandEnabled=false; radioactiveEnabled=false;
}

function draw(){
  frame++;const W=canvas.width,H=canvas.height;
  if(summerEnabled)           drawSummerScene(W,H);
  else if(winterEnabled)      drawWinterScene(W,H);
  else if(fallEnabled)        drawFallScene(W,H);
  else if(springEnabled)      drawSpringScene(W,H);
  else if(sandEnabled)        drawSandScene(W,H);
  else if(radioactiveEnabled) drawRadioactiveScene(W,H);
  else                        drawNightScene(W,H);
  requestAnimationFrame(draw);
}
draw();

// ═══════════════════════════════════════════
//  ELEMENTS & STATE
// ═══════════════════════════════════════════
const homePage=document.getElementById('home-page');
const webPanel=document.getElementById('web-panel');
const webIframe=document.getElementById('web-iframe');
const mimsPanel=document.getElementById('mims-panel');
const mimsIframe=document.getElementById('mims-iframe');
const navAddrText=document.getElementById('nav-address-text');
const searchInput=document.getElementById('search-input');
const searchClear=document.getElementById('search-clear');
const suggestionsEl=document.getElementById('suggestions');

const MIMS_ID=999;
let mimsLoaded=false;

let tabs=JSON.parse(localStorage.getItem('ep_tabs4')||'null')||[{id:1,title:'Endless Proxy',active:true}];
if(!tabs.find(t=>t.id===MIMS_ID))tabs.splice(1,0,{id:MIMS_ID,title:'MIMS Portal',active:false,fixed:true});
let activeTabId=tabs.find(t=>t.active)?.id||1;
const nonFixed=tabs.filter(t=>t.id!==MIMS_ID);
let nextTabId=(nonFixed.length?Math.max(...nonFixed.map(t=>t.id)):1)+1;
const tabState={};
tabs.forEach(t=>{tabState[t.id]={history:[t.id===MIMS_ID?'mims://portal':'ep://home'],histIdx:0,panel:t.id===MIMS_ID?'mims':'home',url:t.id===MIMS_ID?'MIMS Portal':'New Tab'};});
function saveTabs(){localStorage.setItem('ep_tabs4',JSON.stringify(tabs));}

// ═══════════════════════════════════════════
//  BOOKMARKS
// ═══════════════════════════════════════════
let bookmarks=JSON.parse(localStorage.getItem('ep_bookmarks')||'null')||[
  {id:1,title:'Google',url:'https://google.com'},
  {id:2,title:'YouTube',url:'https://youtube.com'},
  {id:3,title:'GitHub',url:'https://github.com'},
];
let nextBmId=Math.max(...bookmarks.map(b=>b.id),0)+1;
function saveBookmarks(){localStorage.setItem('ep_bookmarks',JSON.stringify(bookmarks));}

function getFavicon(url){try{return `https://www.google.com/s2/favicons?sz=16&domain=${new URL(url).hostname}`;}catch{return '';}}

function renderBookmarksBar(){
  const bar=document.getElementById('bookmarks-bar');
  bar.querySelectorAll('.bm-item,.bm-sep').forEach(el=>el.remove());
  const addBtn=document.getElementById('bm-bar-add');
  bookmarks.forEach(bm=>{
    const el=document.createElement('div');
    el.className='bm-item';
    const fav=getFavicon(bm.url);
    el.innerHTML=`${fav?`<img src="${fav}" onerror="this.style.display='none'">`:''}${bm.title}`;
    el.title=bm.url;
    el.addEventListener('click',()=>openUrl(bm.url));
    el.addEventListener('contextmenu',e=>{e.preventDefault();if(confirm(`Remove "${bm.title}" from bookmarks?`)){bookmarks=bookmarks.filter(b=>b.id!==bm.id);saveBookmarks();renderBookmarksBar();renderBookmarksPanel();}});
    bar.insertBefore(el,addBtn);
  });
}

function renderBookmarksPanel(){
  const body=document.getElementById('bookmarks-body');
  if(!body)return;
  body.innerHTML='';
  // Add form
  const form=document.createElement('div');
  form.innerHTML=`
    <div class="panel-section-title">Add Bookmark</div>
    <div class="panel-input-row">
      <input class="panel-input" id="bm-add-name" placeholder="Name" autocomplete="off">
    </div>
    <div class="panel-input-row">
      <input class="panel-input" id="bm-add-url" placeholder="https://..." autocomplete="off" value="${(()=>{const s=tabState[activeTabId];return(s&&s.url&&s.url!=='ep://home'&&s.url!=='mims://portal')?s.url:'';})()}">
      <button class="panel-btn" id="bm-add-save">Add</button>
    </div>
    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:12px 0;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
      <div class="panel-section-title" style="margin:0;border:none;">Saved (${bookmarks.length})</div>
      ${bookmarks.length>0?`<div style="font-size:11px;color:rgba(255,100,100,0.7);cursor:pointer;padding:2px 8px;border-radius:4px;border:1px solid rgba(255,100,100,0.2);" id="bm-clear-all">Clear all</div>`:''}
    </div>
  `;
  body.appendChild(form);
  // Wire clear-all
  const _bca=document.getElementById('bm-clear-all');
  if(_bca)_bca.addEventListener('click',()=>{if(confirm('Remove all bookmarks?')){bookmarks=[];saveBookmarks();renderBookmarksBar();renderBookmarksPanel();showToast('All bookmarks cleared');}});
  // Auto-fill name from current page
  const _ban=document.getElementById('bm-add-name');
  if(_ban){const s=tabState[activeTabId];if(s&&s.url&&s.url!=='ep://home'&&s.url!=='mims://portal'){try{_ban.value=new URL(s.url).hostname.replace('www.','');}catch{}}}
  document.getElementById('bm-add-save').addEventListener('click',()=>{
    const name=document.getElementById('bm-add-name').value.trim();
    const url=document.getElementById('bm-add-url').value.trim();
    if(!name||!url){showToast('Fill in both fields');return;}
    bookmarks.push({id:nextBmId++,title:name,url});
    saveBookmarks();renderBookmarksBar();renderBookmarksPanel();
    showToast('Bookmark added!');
  });
  if(bookmarks.length===0){
    const empty=document.createElement('div');
    empty.className='panel-empty';
    empty.innerHTML='<span class="pe-icon">🔖</span>No bookmarks yet';
    body.appendChild(empty);return;
  }
  bookmarks.forEach(bm=>{
    const el=document.createElement('div');
    el.className='bm-manager-item';
    const fav=getFavicon(bm.url);
    el.innerHTML=`${fav?`<img src="${fav}" onerror="this.style.display='none'">`:'🌐'}<span title="${bm.url}">${bm.title}</span><span class="bm-del" title="Delete">✕</span>`;
    el.querySelector('span:first-of-type').addEventListener('click',()=>openUrl(bm.url));
    el.querySelector('.bm-del').addEventListener('click',e=>{e.stopPropagation();bookmarks=bookmarks.filter(b=>b.id!==bm.id);saveBookmarks();renderBookmarksBar();renderBookmarksPanel();});
    body.appendChild(el);
  });
}

// ═══════════════════════════════════════════
//  DOWNLOADS
// ═══════════════════════════════════════════
let downloads=JSON.parse(localStorage.getItem('ep_downloads')||'[]');
let nextDlId=downloads.length?Math.max(...downloads.map(d=>d.id))+1:1;
function saveDownloads(){localStorage.setItem('ep_downloads',JSON.stringify(downloads));}
function updateDlBadge(){
  const badge=document.getElementById('dl-badge');
  const active=downloads.filter(d=>d.status==='downloading').length;
  if(badge){badge.style.display=active>0?'flex':'none';badge.textContent=active;}
}
function renderDownloadsPanel(){
  const body=document.getElementById('downloads-body');
  if(!body)return;
  body.innerHTML='';
  // Manual add row
  const addRow=document.createElement('div');
  const curUrl=(()=>{const s=tabState[activeTabId];return(s&&s.url&&s.url!=='ep://home'&&s.url!=='mims://portal')?s.url:'';})();
  addRow.innerHTML=`
    <div class="panel-section-title">Simulate Download</div>
    <div class="panel-input-row">
      <input class="panel-input" id="dl-add-url" placeholder="https://example.com/file.zip" autocomplete="off" value="${curUrl}">
      <button class="panel-btn" id="dl-add-btn" title="Start download">⬇</button>
    </div>
    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:12px 0;">
  `;
  body.appendChild(addRow);
  document.getElementById('dl-add-btn').addEventListener('click',()=>{
    const url=document.getElementById('dl-add-url').value.trim();
    if(!url){showToast('Enter a URL');return;}
    addDownload(url);
    document.getElementById('dl-add-url').value='';
  });
  if(downloads.length===0){
    const empty=document.createElement('div');
    empty.className='panel-empty';
    empty.innerHTML='<span class="pe-icon">⬇️</span>No downloads yet';
    body.appendChild(empty);return;
  }
  // Clear all button
  const clearRow=document.createElement('div');
  clearRow.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;';
  clearRow.innerHTML=`<div class="panel-section-title" style="margin:0;border:none;">History (${downloads.length})</div><div style="font-size:11px;color:rgba(255,100,100,0.7);cursor:pointer;padding:2px 8px;border-radius:4px;border:1px solid rgba(255,100,100,0.2);" id="dl-clear-all">Clear all</div>`;
  body.appendChild(clearRow);
  document.getElementById('dl-clear-all').addEventListener('click',()=>{downloads=[];saveDownloads();renderDownloadsPanel();updateDlBadge();showToast('Downloads cleared');});
  const typeColors={'pdf':'#f44336','zip':'#ff9800','mp4':'#9c27b0','mp3':'#2196f3','exe':'#607d8b','png':'#4caf50','jpg':'#4caf50','gif':'#00bcd4','doc':'#1976d2','xls':'#388e3c'};
  const typeIcons={'pdf':'📄','zip':'🗜️','mp4':'🎬','mp3':'🎵','exe':'⚙️','png':'🖼️','jpg':'🖼️','gif':'🖼️','doc':'📝','xls':'📊'};
  [...downloads].reverse().forEach(dl=>{
    const el=document.createElement('div');
    el.className='dl-item';
    const ext=(dl.name||'').split('.').pop().toLowerCase();
    const icon=typeIcons[ext]||'📎';
    const color=typeColors[ext]||'#78909c';
    const pct=dl.progress||0;
    const statusColor=dl.status==='done'?'#4caf50':dl.status==='error'?'#f44336':'var(--cyan)';
    el.innerHTML=`
      <div class="dl-icon" style="font-size:20px;width:36px;height:36px;border-radius:8px;background:${color}22;border:1px solid ${color}44;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${icon}</div>
      <div class="dl-info">
        <div class="dl-name">${dl.name||'Unknown file'}</div>
        <div class="dl-meta" style="color:${statusColor};">${dl.status==='done'?'✓ Complete':dl.status==='error'?'✗ Failed':`${pct}% · downloading`} ${dl.size&&dl.size!=='?'?'· '+dl.size:''}</div>
        ${dl.status==='downloading'?`<div class="dl-bar"><div class="dl-bar-fill" style="width:${pct}%;background:${color};"></div></div>`:''}
      </div>
      <div class="dl-actions">
        ${dl.status==='done'?`<div class="dl-btn" title="Open" onclick="window.open('${dl.url}','_blank')">🔗</div>`:''}
        <div class="dl-btn" title="Remove" onclick="removeDownload(${dl.id})">✕</div>
      </div>
    `;
    body.appendChild(el);
  });
}

function addDownload(url){
  let name; try{name=decodeURIComponent(new URL(url).pathname.split('/').pop())||'file';}catch{name='file';}
  const dl={id:nextDlId++,name,url,size:'?',progress:0,status:'downloading'};
  downloads.push(dl);saveDownloads();renderDownloadsPanel();updateDlBadge();
  // Simulate progress
  let pct=0;
  const iv=setInterval(()=>{
    pct+=Math.random()*15+5;
    if(pct>=100){pct=100;dl.progress=100;dl.status='done';dl.size=Math.floor(Math.random()*50+1)+'MB';clearInterval(iv);}
    else dl.progress=Math.floor(pct);
    saveDownloads();renderDownloadsPanel();updateDlBadge();
  },400);
  showToast(`Downloading: ${name}`);
  openPanel('downloads');
}

function removeDownload(id){
  downloads=downloads.filter(d=>d.id!==id);
  saveDownloads();renderDownloadsPanel();updateDlBadge();
}

// ═══════════════════════════════════════════
//  EXTENSIONS
// ═══════════════════════════════════════════
let extensions=JSON.parse(localStorage.getItem('ep_extensions')||'null')||[
  {id:1,name:'Ad Blocker Pro',icon:'🛡️',desc:'Blocks ads and trackers on all websites.',enabled:true,version:'3.2.1'},
  {id:2,name:'Dark Reader',icon:'🌙',desc:'Enables dark mode for every website automatically.',enabled:true,version:'4.9.58'},
  {id:3,name:'Proxy Switcher',icon:'🔀',desc:'Quickly switch between proxy configurations.',enabled:false,version:'1.0.4'},
  {id:4,name:'Password Manager',icon:'🔐',desc:'Saves and autofills your passwords securely.',enabled:true,version:'2.1.0'},
  {id:5,name:'Video Downloader',icon:'📥',desc:'Download videos from any website with one click.',enabled:false,version:'1.5.2'},
  {id:6,name:'Screenshot Tool',icon:'📸',desc:'Capture full page or selected area screenshots.',enabled:true,version:'2.0.1'},
];
let nextExtId=Math.max(...extensions.map(e=>e.id))+1;
function saveExtensions(){localStorage.setItem('ep_extensions',JSON.stringify(extensions));}

function renderExtensionsPanel(){
  const body=document.getElementById('extensions-body');
  if(!body)return;
  body.innerHTML='';

  // ── Visual Effects section ──
  const effectsSection=document.createElement('div');
  const activeSeason=summerEnabled?'summer':winterEnabled?'winter':fallEnabled?'fall':springEnabled?'spring':sandEnabled?'sand':radioactiveEnabled?'radioactive':'night';
  const particleLabel={night:'🌧️ Rain',summer:'🐦 Birds',winter:'❄️ Snowflakes',fall:'🍂 Falling Leaves',spring:'🌸 Petals & Butterflies',sand:'⚡ Sandstorm & Lightning',radioactive:'☢️ Toxic Smoke & Lightning'}[activeSeason];
  const particleDesc={night:'Animated rain on the night cityscape.',summer:'Seagulls soaring across the summer sky.',winter:'Snowflakes and decorative snow crystals.',fall:'Falling autumn leaves swirling in the breeze.',spring:'Cherry blossom petals, leaves and butterflies.',sand:'Swirling sand grains and lightning strikes.',radioactive:'Rising toxic fog particles and neon lightning.'}[activeSeason];
  const sCard=(on,r,g,b)=>on?`rgba(${r},${g},${b},0.1)`:`rgba(255,255,255,0.04)`;
  const sBdr=(on,r,g,b)=>on?`rgba(${r},${g},${b},0.32)`:`rgba(255,255,255,0.07)`;
  const curSeason=getSeasonFromDate();
  const curSeasonLabel=curSeason.charAt(0).toUpperCase()+curSeason.slice(1);
  effectsSection.innerHTML=`
    <div class="panel-section-title">Scenes</div>
    <div class="ext-item" style="align-items:center;margin-bottom:4px;background:${sCard(summerEnabled,200,130,10)};border-color:${sBdr(summerEnabled,200,130,10)};">
      <div class="ext-icon">☀️</div>
      <div class="ext-info">
        <div class="ext-name" style="${summerEnabled?'color:#8a5200':''}">Summer City</div>
        <div class="ext-desc">Golden sun, drifting clouds &amp; birds. Light warm UI.</div>
      </div>
      <div class="ext-toggle${summerEnabled?' on':''}" id="summer-toggle" style="${summerEnabled?'background:#d4820a':''}"></div>
    </div>
    <div class="ext-item" style="align-items:center;margin-bottom:4px;background:${sCard(fallEnabled,200,96,26)};border-color:${sBdr(fallEnabled,200,96,26)};">
      <div class="ext-icon">🍂</div>
      <div class="ext-info">
        <div class="ext-name" style="${fallEnabled?'color:#d4720a':''}">Fall City</div>
        <div class="ext-desc">Dusk god-rays &amp; warm amber windows. Cozy dark UI.</div>
      </div>
      <div class="ext-toggle${fallEnabled?' on':''}" id="fall-toggle" style="${fallEnabled?'background:#c8601a':''}"></div>
    </div>
    <div class="ext-item" style="align-items:center;margin-bottom:4px;background:${sCard(winterEnabled,168,216,240)};border-color:${sBdr(winterEnabled,168,216,240)};">
      <div class="ext-icon">❄️</div>
      <div class="ext-info">
        <div class="ext-name" style="${winterEnabled?'color:#a8d8f0':''}">Winter City</div>
        <div class="ext-desc">Moonlit snowscape, icicles &amp; aurora. Cold blue UI.</div>
      </div>
      <div class="ext-toggle${winterEnabled?' on':''}" id="winter-toggle" style="${winterEnabled?'background:#a8d8f0':''}"></div>
    </div>
    <div class="ext-item" style="align-items:center;margin-bottom:4px;background:${sCard(springEnabled,58,170,90)};border-color:${sBdr(springEnabled,58,170,90)};">
      <div class="ext-icon">🌸</div>
      <div class="ext-info">
        <div class="ext-name" style="${springEnabled?'color:#1a7a38':''}">Spring City</div>
        <div class="ext-desc">Bright sky, blooming rooftops, butterflies &amp; petals.</div>
      </div>
      <div class="ext-toggle${springEnabled?' on':''}" id="spring-toggle" style="${springEnabled?'background:#3aaa5a':''}"></div>
    </div>
    <div class="ext-item" style="align-items:center;margin-bottom:4px;background:${sCard(sandEnabled,139,94,26)};border-color:${sBdr(sandEnabled,139,94,26)};">
      <div class="ext-icon">⚡</div>
      <div class="ext-info">
        <div class="ext-name" style="${sandEnabled?'color:#8B5E1A':''}">Sand City</div>
        <div class="ext-desc">Dusty ochre storm, swirling grains &amp; lightning strikes.</div>
      </div>
      <div class="ext-toggle${sandEnabled?' on':''}" id="sand-toggle" style="${sandEnabled?'background:#8B5E1A':''}"></div>
    </div>
    <div class="ext-item" style="align-items:center;margin-bottom:4px;background:${sCard(radioactiveEnabled,57,255,20)};border-color:${sBdr(radioactiveEnabled,57,255,20)};">
      <div class="ext-icon">☢️</div>
      <div class="ext-info">
        <div class="ext-name" style="${radioactiveEnabled?'color:#39ff14':''}">Radioactive City</div>
        <div class="ext-desc">Toxic green fog, glowing ruins &amp; neon lightning.</div>
      </div>
      <div class="ext-toggle${radioactiveEnabled?' on':''}" id="radioactive-toggle" style="${radioactiveEnabled?'background:#39ff14':''}"></div>
    </div>
    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:12px 0;">
    <div class="panel-section-title">Animations</div>
    <div class="ext-item" style="align-items:center;margin-bottom:4px;">
      <div class="ext-icon">${{night:'🌧️',summer:'🐦',winter:'❄️',fall:'🍂',spring:'🌸',sand:'⚡',radioactive:'☢️'}[activeSeason]}</div>
      <div class="ext-info">
        <div class="ext-name">${particleLabel}</div>
        <div class="ext-desc">${particleDesc}</div>
      </div>
      <div class="ext-toggle${particlesEnabled?' on':''}" id="particles-toggle"></div>
    </div>
    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:12px 0;">
    <div class="panel-section-title">Smart Season</div>
    <div class="ext-item" style="align-items:center;background:${seasonalMode?'rgba(120,80,220,0.1)':'rgba(255,255,255,0.04)'};border-color:${seasonalMode?'rgba(140,100,240,0.35)':'rgba(255,255,255,0.07)'};">
      <div class="ext-icon">📅</div>
      <div class="ext-info">
        <div class="ext-name" style="${seasonalMode?'color:#b090f0':''}">Seasonal Mode</div>
        <div class="ext-desc">Auto-sets scene to today's real-world season. Now: <strong style="${seasonalMode?'color:#c0a8ff':''}">${curSeasonLabel}</strong></div>
      </div>
      <div class="ext-toggle${seasonalMode?' on':''}" id="seasonal-toggle" style="${seasonalMode?'background:#9060e0':''}"></div>
    </div>
    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:14px 0;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
      <div class="panel-section-title" style="margin:0;border:none;">Installed Extensions (${extensions.length})</div>
      <div style="display:flex;gap:6px;">
        <div style="font-size:10px;color:rgba(0,229,255,0.7);cursor:pointer;padding:2px 8px;border-radius:4px;border:1px solid rgba(0,229,255,0.2);" id="ext-enable-all">Enable all</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.4);cursor:pointer;padding:2px 8px;border-radius:4px;border:1px solid rgba(255,255,255,0.1);" id="ext-disable-all">Disable all</div>
      </div>
    </div>
  `;
  body.appendChild(effectsSection);

  function _activateSeason(which){
    summerEnabled=which==='summer'; winterEnabled=which==='winter';
    fallEnabled=which==='fall'; springEnabled=which==='spring';
    sandEnabled=which==='sand'; radioactiveEnabled=which==='radioactive';
    if(which!=='auto'){ seasonalMode=false; localStorage.setItem('ep_seasonal','0'); }
    localStorage.setItem('ep_summer',summerEnabled?'1':'0');
    localStorage.setItem('ep_winter',winterEnabled?'1':'0');
    localStorage.setItem('ep_fall',fallEnabled?'1':'0');
    localStorage.setItem('ep_spring',springEnabled?'1':'0');
    localStorage.setItem('ep_sand',sandEnabled?'1':'0');
    localStorage.setItem('ep_radioactive',radioactiveEnabled?'1':'0');
    applySeasonTheme(); renderExtensionsPanel();
  }
  const _st=document.getElementById('summer-toggle');
  if(_st)_st.addEventListener('click',()=>{ _activateSeason(summerEnabled?'night':'summer'); showToast(summerEnabled?'☀️ Summer City activated!':'🌙 Night City restored'); });
  const _ft=document.getElementById('fall-toggle');
  if(_ft)_ft.addEventListener('click',()=>{ _activateSeason(fallEnabled?'night':'fall'); showToast(fallEnabled?'🍂 Fall City activated!':'🌙 Night City restored'); });
  const _wt=document.getElementById('winter-toggle');
  if(_wt)_wt.addEventListener('click',()=>{ _activateSeason(winterEnabled?'night':'winter'); showToast(winterEnabled?'❄️ Winter City activated!':'🌙 Night City restored'); });
  const _spt=document.getElementById('spring-toggle');
  if(_spt)_spt.addEventListener('click',()=>{ _activateSeason(springEnabled?'night':'spring'); showToast(springEnabled?'🌸 Spring City activated!':'🌙 Night City restored'); });
  const _sdt=document.getElementById('sand-toggle');
  if(_sdt)_sdt.addEventListener('click',()=>{ _activateSeason(sandEnabled?'night':'sand'); showToast(sandEnabled?'⚡ Sand City activated!':'🌙 Night City restored'); });
  const _rdt=document.getElementById('radioactive-toggle');
  if(_rdt)_rdt.addEventListener('click',()=>{ _activateSeason(radioactiveEnabled?'night':'radioactive'); showToast(radioactiveEnabled?'☢️ Radioactive City activated!':'🌙 Night City restored'); });

  const _ptt=document.getElementById('particles-toggle');
  if(_ptt)_ptt.addEventListener('click',()=>{
    particlesEnabled=!particlesEnabled;
    localStorage.setItem('ep_particles',particlesEnabled?'1':'0');
    document.getElementById('particles-toggle').classList.toggle('on',particlesEnabled);
    showToast(particlesEnabled?`${particleLabel} enabled`:`${particleLabel} disabled`);
  });

  const _seaT=document.getElementById('seasonal-toggle');
  if(_seaT)_seaT.addEventListener('click',()=>{
    seasonalMode=!seasonalMode;
    localStorage.setItem('ep_seasonal',seasonalMode?'1':'0');
    if(seasonalMode){ applySeasonalMode(); applySeasonTheme(); const s=getSeasonFromDate(); showToast(`📅 Seasonal Mode on — it's ${s.charAt(0).toUpperCase()+s.slice(1)}!`); }
    else showToast('📅 Seasonal Mode off');
    renderExtensionsPanel();
  });

  const _eea=document.getElementById('ext-enable-all');
  if(_eea)_eea.addEventListener('click',()=>{extensions.forEach(e=>e.enabled=true);saveExtensions();renderExtensionsPanel();showToast('All extensions enabled');});
  const _eda=document.getElementById('ext-disable-all');
  if(_eda)_eda.addEventListener('click',()=>{extensions.forEach(e=>e.enabled=false);saveExtensions();renderExtensionsPanel();showToast('All extensions disabled');});
  // Add custom extension
  const addRow=document.createElement('div');
  addRow.innerHTML=`
    <div class="panel-section-title" style="margin-top:8px;">Add Extension</div>
    <div class="panel-input-row">
      <input class="panel-input" id="ext-add-name" placeholder="Extension name" autocomplete="off">
      <button class="panel-btn" id="ext-add-btn">Add</button>
    </div>
    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:12px 0;">
  `;
  body.appendChild(addRow);
  document.getElementById('ext-add-btn').addEventListener('click',()=>{
    const name=document.getElementById('ext-add-name').value.trim();
    if(!name){showToast('Enter a name');return;}
    extensions.push({id:nextExtId++,name,icon:'🧩',desc:'Custom extension',enabled:true,version:'1.0.0'});
    saveExtensions();renderExtensionsPanel();
    showToast(`"${name}" added`);
  });
  extensions.forEach(ext=>{
    const el=document.createElement('div');
    el.className='ext-item';
    el.innerHTML=`
      <div class="ext-icon">${ext.icon}</div>
      <div class="ext-info">
        <div class="ext-name">${ext.name} <span style="font-size:10px;color:rgba(255,255,255,0.25);font-weight:400;">v${ext.version}</span></div>
        <div class="ext-desc">${ext.desc}</div>
        <div class="ext-actions">
          <div class="ext-action-btn" onclick="removeExt(${ext.id})">Remove</div>
          <div class="ext-action-btn" onclick="showToast('Extension details')">Details</div>
        </div>
      </div>
      <div class="ext-toggle${ext.enabled?' on':''}" id="ext-toggle-${ext.id}" onclick="toggleExt(${ext.id})"></div>
    `;
    body.appendChild(el);
  });
}

function toggleExt(id){
  const ext=extensions.find(e=>e.id===id);
  if(!ext)return;
  ext.enabled=!ext.enabled;
  saveExtensions();
  const t=document.getElementById(`ext-toggle-${id}`);
  if(t)t.classList.toggle('on',ext.enabled);
  showToast(`${ext.name} ${ext.enabled?'enabled':'disabled'}`);
}
function removeExt(id){
  const ext=extensions.find(e=>e.id===id);
  if(ext&&confirm(`Remove "${ext.name}"?`)){extensions=extensions.filter(e=>e.id!==id);saveExtensions();renderExtensionsPanel();}
}

// ═══════════════════════════════════════════
//  PANEL SYSTEM
// ═══════════════════════════════════════════
let activePanel=null;
function openPanel(name){
  if(activePanel===name){closePanel(name);return;}
  if(activePanel)document.getElementById(`panel-${activePanel}`).classList.remove('open');
  activePanel=name;
  const panel=document.getElementById(`panel-${name}`);
  if(!panel)return;
  // Refresh content
  if(name==='bookmarks')renderBookmarksPanel();
  if(name==='downloads')renderDownloadsPanel();
  if(name==='extensions')renderExtensionsPanel();
  panel.classList.add('open');
  document.getElementById('panel-scrim').classList.add('show');
}
function closePanel(name){
  const panel=document.getElementById(`panel-${name}`);
  if(panel)panel.classList.remove('open');
  document.getElementById('panel-scrim').classList.remove('show');
  activePanel=null;
}
const _ps=document.getElementById('panel-scrim');if(_ps)_ps.addEventListener('click',()=>{if(activePanel)closePanel(activePanel);});
const _bdl=document.getElementById('btn-downloads');if(_bdl)_bdl.addEventListener('click',()=>openPanel('downloads'));
const _bext=document.getElementById('btn-extensions');if(_bext)_bext.addEventListener('click',()=>openPanel('extensions'));
const _bbmm=document.getElementById('btn-bm-mgr');if(_bbmm)_bbmm.addEventListener('click',()=>openPanel('bookmarks'));

// ═══════════════════════════════════════════
//  BOOKMARKS BAR TOGGLE
// ═══════════════════════════════════════════
let bmBarVisible=localStorage.getItem('ep_bmbar')!=='0';
function applyBmBar(){
  const bar=document.getElementById('bookmarks-bar');
  if(bar)bar.classList.toggle('hidden-bar',!bmBarVisible);
}
applyBmBar();
const _bbmb=document.getElementById('btn-bm-bar');if(_bbmb)_bbmb.addEventListener('click',()=>{
  bmBarVisible=!bmBarVisible;
  localStorage.setItem('ep_bmbar',bmBarVisible?'1':'0');
  applyBmBar();
  showToast(bmBarVisible?'Bookmarks bar shown':'Bookmarks bar hidden');
});

// Bookmark current page button
const _bbm=document.getElementById('btn-bookmark');if(_bbm)_bbm.addEventListener('click',()=>{
  const state=tabState[activeTabId];
  if(!state||state.url==='ep://home'||state.url==='New Tab'){showToast('Nothing to bookmark');return;}
  const url=state.url;
  if(url==='mims://portal'){showToast('Nothing to bookmark');return;}
  let title;try{title=new URL(url).hostname.replace('www.','');}catch{title=url.slice(0,30);}
  const existing=bookmarks.find(b=>b.url===url);
  if(existing){
    bookmarks=bookmarks.filter(b=>b.url!==url);
    saveBookmarks();renderBookmarksBar();renderBookmarksPanel();
    showToast(`Bookmark removed`);
  } else {
    bookmarks.push({id:nextBmId++,title,url});
    saveBookmarks();renderBookmarksBar();renderBookmarksPanel();
    showToast(`Bookmarked: ${title}`);
  }
  updateBookmarkStar();
});

// Add current page to bookmarks bar shortcut
const _bbma=document.getElementById('bm-bar-add');if(_bbma)_bbma.addEventListener('click',()=>{
  document.getElementById('btn-bookmark').click();
});

// ═══════════════════════════════════════════
//  PANELS & NAVIGATION
// ═══════════════════════════════════════════
function showPanel(which){
  homePage.style.display=which==='home'?'flex':'none';
  webPanel.style.display=which==='web'?'block':'none';
  mimsPanel.style.display=which==='mims'?'block':'none';
}
function loadMims(){
  if(mimsLoaded)return; mimsLoaded=true;
  const el=document.getElementById('mims-source');if(!el)return;
  try{const c=JSON.parse(el.textContent);const blob=new Blob([c],{type:'text/html'});mimsIframe.src=URL.createObjectURL(blob);}catch(e){console.warn('MIMS load error:',e);}
}

function openUrl(raw,addToHistory=true){
  let url=(raw||'').trim();if(!url)return;
  let full;
  if(url==='ep://home'||url==='mims://portal')full=url;
  else if(/^https?:\/\//i.test(url))full=url;
  else if(url.includes('.')&&!url.includes(' '))full='https://'+url;
  else full='https://www.google.com/search?q='+encodeURIComponent(url);
  const state=tabState[activeTabId];if(!state)return;
  if(addToHistory&&full!==state.history[state.histIdx]){state.history=state.history.slice(0,state.histIdx+1);state.history.push(full);state.histIdx=state.history.length-1;}
  state.url=full;
  const tab=tabs.find(t=>t.id===activeTabId);
  if(tab&&!tab.fixed){if(full==='ep://home')tab.title='Endless Proxy';else{try{tab.title=new URL(full).hostname.replace('www.','');}catch{tab.title=full.slice(0,20);}}saveTabs();}
  if(full==='ep://home'){state.panel='home';showPanel('home');}
  else if(full==='mims://portal'){state.panel='mims';showPanel('mims');loadMims();}
  else{
    state.panel='web';showPanel('web');webIframe.src=full;
    // Loading indicator on active tab
    const activeTabEl=tabBarEl?.querySelector(`.tab[data-id="${activeTabId}"]`);
    if(activeTabEl)activeTabEl.classList.add('loading');
    webIframe.onload=()=>{
      const el=tabBarEl?.querySelector(`.tab[data-id="${activeTabId}"]`);
      if(el)el.classList.remove('loading');
      // Try to update tab title from iframe
      try{
        const iTitle=webIframe.contentDocument?.title;
        if(iTitle){const tab=tabs.find(t=>t.id===activeTabId);if(tab&&!tab.fixed){tab.title=iTitle.slice(0,28);saveTabs();renderTabs();}}
      }catch{}
    };
  }
  updateAddressBar(full);updateNavBtns();renderTabs();hideSuggestions();
  if(searchInput){searchInput.value='';} if(searchClear){searchClear.style.opacity='0';}
}

function updateAddressBar(url){
  if(!navAddrText)return;
  if(!url||url==='ep://home')navAddrText.textContent='Search with Google or enter address';
  else if(url==='mims://portal')navAddrText.textContent='mims://portal';
  else navAddrText.textContent=url;
  updateAddressBarIcon(url);
  updateBookmarkStar();
}
function updateNavBtns(){
  const s=tabState[activeTabId];
  const b=document.getElementById('btn-back'),f=document.getElementById('btn-forward');
  if(b)b.classList.toggle('disabled',!s||s.histIdx<=0);
  if(f)f.classList.toggle('disabled',!s||s.histIdx>=s.history.length-1);
}

// ═══════════════════════════════════════════
//  TAB MANAGEMENT
// ═══════════════════════════════════════════
const tabBarEl=document.getElementById('tab-bar');
const addBtn=document.getElementById('btn-new-tab');

// ── Tab context menu ──
const tabCtxMenu=document.getElementById('tab-ctx-menu');
let tabCtxId=null;

function showTabCtxMenu(e,id){
  e.preventDefault(); e.stopPropagation();
  tabCtxId=id;
  const tab=tabs.find(t=>t.id===id);
  const isMims=id===MIMS_ID;
  const isPinned=tab&&tab.pinned;

  document.getElementById('tctx-switch').style.display=id===activeTabId?'none':'flex';
  document.getElementById('tctx-rename').style.display=isMims?'none':'flex';
  document.getElementById('tctx-pin').textContent=isPinned?'📌 Unpin tab':'📌 Pin tab';
  document.getElementById('tctx-pin').style.display=isMims?'none':'flex';
  document.getElementById('tctx-split').style.display=isMims?'none':'flex';
  document.getElementById('tctx-duplicate').style.display=isMims?'none':'flex';
  document.getElementById('tctx-close-others').style.display=isMims?'none':'flex';
  document.getElementById('tctx-close').style.display=isMims?'none':'flex';

  tabCtxMenu.style.left=Math.min(e.clientX,innerWidth-180)+'px';
  tabCtxMenu.style.top=Math.min(e.clientY,innerHeight-220)+'px';
  tabCtxMenu.style.display='block';
  requestAnimationFrame(()=>tabCtxMenu.style.opacity='1');
}
function hideTabCtxMenu(){
  tabCtxMenu.style.opacity='0';
  setTimeout(()=>tabCtxMenu.style.display='none',120);
}
document.addEventListener('click',e=>{
  if(!e.target.closest('#tab-ctx-menu'))hideTabCtxMenu();
});

const _tcs=document.getElementById('tctx-switch');if(_tcs)_tcs.addEventListener('click',()=>{ switchTab(tabCtxId); hideTabCtxMenu(); });

const _tcr=document.getElementById('tctx-rename');if(_tcr)_tcr.addEventListener('click',()=>{
  hideTabCtxMenu();
  const el=tabBarEl.querySelector(`.tab[data-id="${tabCtxId}"] .tab-title`);
  if(!el)return;
  const tab=tabs.find(t=>t.id===tabCtxId);
  if(!tab)return;
  const inp=document.createElement('input');
  inp.value=tab.title;
  inp.style.cssText='background:transparent;border:none;outline:none;color:rgba(255,255,255,0.85);font-family:Rajdhani,sans-serif;font-size:12px;width:100%;';
  el.replaceWith(inp); inp.focus(); inp.select();
  const done=()=>{ tab.title=inp.value.trim()||'New Tab'; saveTabs(); renderTabs(); };
  inp.addEventListener('blur',done);
  inp.addEventListener('keydown',e=>{ if(e.key==='Enter')inp.blur(); if(e.key==='Escape'){inp.value=tab.title;inp.blur();} });
});

const _tcp=document.getElementById('tctx-pin');if(_tcp)_tcp.addEventListener('click',()=>{
  const tab=tabs.find(t=>t.id===tabCtxId);
  if(!tab)return;
  tab.pinned=!tab.pinned;
  // Pinned tabs go to front (after MIMS), unpinned go after pinned
  if(tab.pinned){
    tabs=tabs.filter(t=>t.id!==tabCtxId);
    const insertAt=tabs.findIndex(t=>!t.pinned&&t.id!==MIMS_ID);
    tabs.splice(insertAt===-1?tabs.length:insertAt,0,tab);
  }
  saveTabs(); renderTabs();
  showToast(tab.pinned?`"${tab.title}" pinned`:`"${tab.title}" unpinned`);
  hideTabCtxMenu();
});

const _tcd=document.getElementById('tctx-duplicate');if(_tcd)_tcd.addEventListener('click',()=>{
  const orig=tabs.find(t=>t.id===tabCtxId);
  if(!orig)return;
  const nt={id:nextTabId++,title:orig.title,active:false,pinned:false};
  const origState=tabState[orig.id];
  tabs.push(nt);
  tabState[nt.id]={
    history:[...origState.history],
    histIdx:origState.histIdx,
    panel:origState.panel,
    url:origState.url
  };
  saveTabs(); renderTabs();
  switchTab(nt.id);
  hideTabCtxMenu();
  showToast(`Duplicated: ${orig.title}`);
});

const _tcco=document.getElementById('tctx-close-others');if(_tcco)_tcco.addEventListener('click',()=>{
  const keep=[MIMS_ID,tabCtxId];
  const toClose=tabs.filter(t=>!keep.includes(t.id)).map(t=>t.id);
  toClose.forEach(id=>{tabs=tabs.filter(t=>t.id!==id);delete tabState[id];});
  if(!tabs.find(t=>t.id===activeTabId)){
    activeTabId=tabCtxId;
    tabs.forEach(t=>t.active=t.id===activeTabId);
  }
  saveTabs(); switchTab(activeTabId);
  hideTabCtxMenu();
  showToast(`Closed ${toClose.length} tab${toClose.length!==1?'s':''}`);
});

const _tcc=document.getElementById('tctx-close');if(_tcc)_tcc.addEventListener('click',()=>{ closeTab(tabCtxId); hideTabCtxMenu(); });

// ── Drag & Drop ──
let dragId=null, dragEl=null;

function onDragStart(e,id){
  dragId=id;
  dragEl=e.currentTarget;
  dragEl.classList.add('dragging');
  e.dataTransfer.effectAllowed='move';
  e.dataTransfer.setData('text/plain',id);
}
function onDragEnd(){
  if(dragEl)dragEl.classList.remove('dragging');
  tabBarEl.querySelectorAll('.tab').forEach(t=>t.classList.remove('drag-over'));
  dragId=null; dragEl=null;
}
function onDragOver(e,id){
  if(dragId===null||dragId===id||tabs.find(t=>t.id===dragId)?.pinned)return;
  e.preventDefault();
  e.dataTransfer.dropEffect='move';
  tabBarEl.querySelectorAll('.tab').forEach(t=>t.classList.remove('drag-over'));
  const target=tabBarEl.querySelector(`.tab[data-id="${id}"]`);
  if(target)target.classList.add('drag-over');
}
function onDrop(e,targetId){
  e.preventDefault();
  tabBarEl.querySelectorAll('.tab').forEach(t=>t.classList.remove('drag-over'));
  if(dragId===null||dragId===targetId)return;
  const dragTab=tabs.find(t=>t.id===dragId);
  const targetTab=tabs.find(t=>t.id===targetId);
  if(!dragTab||!targetTab)return;
  // Respect pinned zones: pinned tabs can't be dragged past unpinned and vice versa
  if(dragTab.pinned!==targetTab.pinned)return;
  const fromIdx=tabs.indexOf(dragTab);
  const toIdx=tabs.indexOf(targetTab);
  tabs.splice(fromIdx,1);
  tabs.splice(toIdx,0,dragTab);
  saveTabs(); renderTabs();
}

// ── Render ──
function renderTabs(){
  tabBarEl.querySelectorAll('.tab').forEach(el=>el.remove());
  tabs.forEach(tab=>{
    const isActive=tab.id===activeTabId;
    const isMims=tab.id===MIMS_ID;
    const isPinned=tab.pinned||isMims;
    const el=document.createElement('div');
    el.className='tab'+(isActive?'':' tab-inactive')+(isPinned?' pinned':'');
    el.dataset.id=tab.id;

    const fav=isMims
      ?`<div class="tab-favicon" style="background:rgba(0,229,255,0.25)"><svg viewBox="0 0 24 24" style="width:10px;height:10px;fill:#020a12"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>`
      :`<div class="tab-favicon"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg></div>`;

    const action=(isMims)
      ? `<span style="font-size:9px;opacity:0.5;flex-shrink:0;">📌</span>`
      : isPinned
      ? ``
      : `<div class="tab-close">✕</div>`;

    el.innerHTML=`${fav}<span class="tab-title">${tab.title}</span>${action}`;

    // Click to switch
    el.addEventListener('click',e=>{
      if(e.target.classList.contains('tab-close'))return;
      switchTab(tab.id);
    });

    // Right-click context menu
    el.addEventListener('contextmenu',e=>showTabCtxMenu(e,tab.id));

    // Double-click title to rename (non-pinned, non-MIMS)
    if(!isMims&&!isPinned){
      el.querySelector('.tab-title').addEventListener('dblclick',e=>{
        e.stopPropagation();
        const inp=document.createElement('input');
        inp.value=tab.title;
        inp.style.cssText='background:transparent;border:none;outline:none;color:rgba(255,255,255,0.85);font-family:Rajdhani,sans-serif;font-size:12px;width:100%;';
        el.querySelector('.tab-title').replaceWith(inp);
        inp.focus(); inp.select();
        const done=()=>{ tab.title=inp.value.trim()||'New Tab'; saveTabs(); renderTabs(); };
        inp.addEventListener('blur',done);
        inp.addEventListener('keydown',e=>{ if(e.key==='Enter')inp.blur(); if(e.key==='Escape'){inp.value=tab.title;inp.blur();} });
      });
    }

    // Close button (non-pinned, non-MIMS tabs)
    if(!isMims&&!isPinned){
      const x=el.querySelector('.tab-close');
      if(x)x.addEventListener('click',e=>{ e.stopPropagation(); closeTab(tab.id); });
    }

    // Drag & Drop (not for MIMS)
    if(!isMims){
      el.setAttribute('draggable','true');
      el.addEventListener('dragstart',e=>onDragStart(e,tab.id));
      el.addEventListener('dragend',onDragEnd);
      el.addEventListener('dragover',e=>onDragOver(e,tab.id));
      el.addEventListener('drop',e=>onDrop(e,tab.id));
    }

    tabBarEl.insertBefore(el,addBtn);
  });
}

function switchTab(id){
  tabs.forEach(t=>t.active=t.id===id); activeTabId=id; saveTabs();
  if(!tabState[id])tabState[id]={history:[id===MIMS_ID?'mims://portal':'ep://home'],histIdx:0,panel:id===MIMS_ID?'mims':'home',url:'New Tab'};
  const s=tabState[id]; showPanel(s.panel);
  if(s.panel==='web')webIframe.src=s.history[s.histIdx];
  if(s.panel==='mims')loadMims();
  updateAddressBar(s.url); updateNavBtns(); renderTabs();
}

function closeTab(id){
  if(id===MIMS_ID){showToast('MIMS Portal is pinned');return;}
  const tab=tabs.find(t=>t.id===id);
  if(tab&&tab.pinned){showToast('Unpin tab before closing');return;}
  if(tabs.filter(t=>t.id!==MIMS_ID&&!t.pinned).length<=1){showToast("Can't close last tab");return;}
  const idx=tabs.findIndex(t=>t.id===id);
  tabs=tabs.filter(t=>t.id!==id); delete tabState[id];
  if(activeTabId===id){
    const next=tabs[Math.min(idx,tabs.length-1)];
    activeTabId=next.id; tabs.forEach(t=>t.active=t.id===activeTabId);
  }
  saveTabs(); switchTab(activeTabId);
}

if(addBtn)addBtn.addEventListener('click',()=>{
  const t={id:nextTabId++,title:'New Tab',active:false,pinned:false};
  tabs.push(t);
  tabState[t.id]={history:['ep://home'],histIdx:0,panel:'home',url:'New Tab'};
  saveTabs(); switchTab(t.id);
});

// ═══════════════════════════════════════════
//  SHORTCUTS
// ═══════════════════════════════════════════
const DEFAULT_SHORTCUTS=[
  {id:1,label:'Downloads',url:'chrome://downloads',icon:'S',type:'letter'},
  {id:2,label:'Google',url:'https://google.com',type:'google'},
  {id:3,label:'YouTube',url:'https://youtube.com',type:'favicon'},
  {id:4,label:'GitHub',url:'https://github.com',type:'favicon'},
  {id:5,label:'Reddit',url:'https://reddit.com',type:'favicon'},
];
let shortcuts=JSON.parse(localStorage.getItem('ep_shortcuts')||'null')||DEFAULT_SHORTCUTS;
let nextId=Math.max(...shortcuts.map(s=>s.id))+1;
function saveShortcuts(){localStorage.setItem('ep_shortcuts',JSON.stringify(shortcuts));}
function gSVG(){return `<svg viewBox="0 0 48 48" width="28" height="28"><path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/><path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.32-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.68 28.18A13.97 13.97 0 0110.9 24c0-1.45.25-2.86.78-4.18v-5.7H4.34A23.93 23.93 0 002 24c0 3.86.92 7.51 2.34 10.88l7.34-6.7z"/><path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 13.12l7.34 5.7c1.74-5.2 6.59-9.07 12.32-9.07z"/></svg>`;}
function bSVG(){return `<svg viewBox="0 0 24 24" width="26" height="26"><path fill="#3b9ce5" d="M5 3l4 1.5v12.3l4.3-2.5-1.8-1.1 2.8-5.9L20 9.8 12.8 21 5 17.3z"/></svg>`;}
function favImg(url){try{const d=new URL(url).hostname;return `<img src="https://www.google.com/s2/favicons?sz=32&domain=${d}" width="28" height="28" onerror="this.outerHTML='<span style=font-size:18px>🌐</span>'">`;}catch{return `<span style="font-size:18px">🌐</span>`;}}
function iconHTML(s){if(s.type==='google')return gSVG();if(s.type==='bing')return bSVG();if(s.type==='letter')return `<div class="icon-sw">${s.icon||'?'}</div>`;return favImg(s.url);}
function renderShortcuts(){
  const c=document.getElementById('shortcuts-container');if(!c)return;c.innerHTML='';
  shortcuts.forEach(s=>{const el=document.createElement('div');el.className='shortcut';el.innerHTML=`<div class="shortcut-icon">${iconHTML(s)}</div><span class="shortcut-label">${s.label}</span>`;
    el.addEventListener('click',()=>openUrl(s.url));el.addEventListener('contextmenu',e=>showCtxMenu(e,s.id));
    el.addEventListener('mousedown',e=>{const r=document.createElement('span');r.className='ripple';const rect=el.getBoundingClientRect(),sz=Math.max(rect.width,rect.height);r.style.cssText=`width:${sz}px;height:${sz}px;left:${e.clientX-rect.left-sz/2}px;top:${e.clientY-rect.top-sz/2}px`;el.appendChild(r);setTimeout(()=>r.remove(),600);});
    c.appendChild(el);});
}
renderShortcuts();

// ═══════════════════════════════════════════
//  SEARCH
// ═══════════════════════════════════════════
const quickSugg=[{text:'google.com',url:'https://google.com'},{text:'youtube.com',url:'https://youtube.com'},{text:'github.com',url:'https://github.com'},{text:'reddit.com',url:'https://reddit.com'},{text:'twitter.com',url:'https://twitter.com'},{text:'wikipedia.org',url:'https://wikipedia.org'}];
if(searchInput){
  searchInput.addEventListener('input',()=>{const v=searchInput.value.trim();if(searchClear)searchClear.style.opacity=v?'1':'0';if(navAddrText)navAddrText.textContent=v||'Search with Google or enter address';showSugg(v);});
  searchInput.addEventListener('keydown',e=>{if(e.key==='Enter'){const v=searchInput.value.trim();if(v){hideSuggestions();openUrl(v);searchInput.blur();}}if(e.key==='Escape'){hideSuggestions();searchInput.blur();}if(e.key==='ArrowDown'){const items=suggestionsEl?suggestionsEl.querySelectorAll('.suggestion-item'):[];if(items.length){items[0].focus();e.preventDefault();}}});
}
if(searchClear)searchClear.addEventListener('click',()=>{if(searchInput){searchInput.value='';searchInput.focus();}searchClear.style.opacity='0';if(navAddrText)navAddrText.textContent='Search with Google or enter address';hideSuggestions();});
const _addr=document.getElementById('nav-address-bar');
if(_addr)_addr.addEventListener('click',()=>{if(searchInput){const s=tabState[activeTabId];if(s&&s.url&&s.url!=='ep://home'&&s.url!=='New Tab')searchInput.value=s.url;searchInput.focus();searchInput.select();}});
const _bsi=document.getElementById('btn-search-icon');
if(_bsi)_bsi.addEventListener('click',()=>{if(searchInput){searchInput.focus();searchInput.select();}});
function showSugg(val){
  if(!val||!suggestionsEl){hideSuggestions();return;}
  const f=quickSugg.filter(s=>s.text.includes(val.toLowerCase()));
  const all=[{text:`Search Google for "${val}"`,url:`https://www.google.com/search?q=${encodeURIComponent(val)}`,isSearch:true},...f].slice(0,6);
  suggestionsEl.innerHTML=all.map(s=>`<div class="suggestion-item" tabindex="0" data-url="${s.url}">${s.isSearch?'🔍':'🌐'} <span>${s.text}</span></div>`).join('');
  suggestionsEl.style.display='block';
  suggestionsEl.querySelectorAll('.suggestion-item').forEach(item=>{item.addEventListener('click',()=>openUrl(item.dataset.url));item.addEventListener('keydown',e=>{if(e.key==='Enter')openUrl(item.dataset.url);if(e.key==='ArrowDown'&&item.nextSibling)item.nextSibling.focus();if(e.key==='ArrowUp'){const p=item.previousSibling;p?p.focus():(searchInput&&searchInput.focus());}});});
}
function hideSuggestions(){if(suggestionsEl)suggestionsEl.style.display='none';}
document.addEventListener('click',e=>{if(!e.target.closest('.search-wrap')&&!e.target.closest('#nav-address-bar'))hideSuggestions();});

// ═══════════════════════════════════════════
//  NAV BUTTONS
// ═══════════════════════════════════════════
const _reload=document.getElementById('btn-reload');
if(_reload)_reload.addEventListener('click',()=>{_reload.style.transform='rotate(360deg)';_reload.style.transition='transform 0.5s ease';setTimeout(()=>{_reload.style.transform='';_reload.style.transition='';},500);const s=tabState[activeTabId];if(!s)return;if(s.panel==='web')try{webIframe.contentWindow.location.reload();}catch{webIframe.src=s.history[s.histIdx];}if(s.panel==='mims')try{mimsIframe.contentWindow.location.reload();}catch{}});
const _back=document.getElementById('btn-back');
if(_back)_back.addEventListener('click',()=>{const s=tabState[activeTabId];if(!s||s.histIdx<=0)return;s.histIdx--;openUrl(s.history[s.histIdx],false);});
const _fwd=document.getElementById('btn-forward');
if(_fwd)_fwd.addEventListener('click',()=>{const s=tabState[activeTabId];if(!s||s.histIdx>=s.history.length-1)return;s.histIdx++;openUrl(s.history[s.histIdx],false);});

// ═══════════════════════════════════════════
//  CONTEXT MENU
// ═══════════════════════════════════════════
const ctxMenu=document.getElementById('ctx-menu');let ctxTargetId=null;
function showCtxMenu(e,id){if(!ctxMenu)return;e.preventDefault();ctxTargetId=id;ctxMenu.style.left=Math.min(e.clientX,innerWidth-160)+'px';ctxMenu.style.top=Math.min(e.clientY,innerHeight-80)+'px';ctxMenu.style.display='block';requestAnimationFrame(()=>ctxMenu.style.opacity='1');}
function hideCtxMenu(){if(!ctxMenu)return;ctxMenu.style.opacity='0';setTimeout(()=>ctxMenu.style.display='none',150);}
document.addEventListener('click',hideCtxMenu);
const _ce=document.getElementById('ctx-edit');if(_ce)_ce.addEventListener('click',()=>{const s=shortcuts.find(x=>x.id===ctxTargetId);if(s)openModal(s);});
const _cr=document.getElementById('ctx-remove');if(_cr)_cr.addEventListener('click',()=>{shortcuts=shortcuts.filter(x=>x.id!==ctxTargetId);saveShortcuts();renderShortcuts();showToast('Shortcut removed');});

// ═══════════════════════════════════════════
//  MODAL
// ═══════════════════════════════════════════
const modalOverlay=document.getElementById('modal-overlay');
const modalName=document.getElementById('modal-name');
const modalUrl=document.getElementById('modal-url');
let editingId=null;
function openModal(s){if(!modalOverlay||!modalName||!modalUrl)return;editingId=s?s.id:null;const t=document.getElementById('modal-title');if(t)t.textContent=s?'Edit Shortcut':'Add Shortcut';modalName.value=s?s.label:'';modalUrl.value=s?s.url:'';modalOverlay.style.display='flex';requestAnimationFrame(()=>modalOverlay.style.opacity='1');modalName.focus();}
function closeModal(){if(!modalOverlay)return;modalOverlay.style.opacity='0';setTimeout(()=>modalOverlay.style.display='none',200);}
const _mc=document.getElementById('modal-cancel');if(_mc)_mc.addEventListener('click',closeModal);
if(modalOverlay)modalOverlay.addEventListener('click',e=>{if(e.target===modalOverlay)closeModal();});
const _ms=document.getElementById('modal-save');
if(_ms)_ms.addEventListener('click',()=>{if(!modalName||!modalUrl)return;const name=modalName.value.trim(),url=modalUrl.value.trim();if(!name||!url){showToast('Fill in both fields');return;}if(editingId){const s=shortcuts.find(x=>x.id===editingId);if(s){s.label=name;s.url=url;s.type='favicon';}}else shortcuts.push({id:nextId++,label:name,url,type:'favicon'});saveShortcuts();renderShortcuts();closeModal();showToast(editingId?'Shortcut updated!':'Shortcut added!');});
[modalName,modalUrl].filter(Boolean).forEach(inp=>inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&_ms)_ms.click();if(e.key==='Escape')closeModal();}));
const _ab=document.getElementById('add-shortcut-btn');if(_ab)_ab.addEventListener('click',()=>openModal(null));

// ═══════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════
let toastTimer;
function showToast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.className='show';clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.className='',2500);}

// ═══════════════════════════════════════════
//  PROXY TITLE → RESET SHORTCUTS
// ═══════════════════════════════════════════
const _pt=document.getElementById('proxy-title');
if(_pt)_pt.addEventListener('dblclick',()=>{if(confirm('Reset shortcuts to default?')){shortcuts=JSON.parse(JSON.stringify(DEFAULT_SHORTCUTS));saveShortcuts();renderShortcuts();showToast('Shortcuts reset');}});

// ═══════════════════════════════════════════
//  SPLIT SCREEN
// ═══════════════════════════════════════════
const paneLeft    = document.getElementById('pane-left');
const paneRight   = document.getElementById('pane-right');
const splitDiv    = document.getElementById('split-divider');
const splitIframe = document.getElementById('split-iframe');
const splitInput  = document.getElementById('split-url-input');
const splitPlaceholder = document.getElementById('split-placeholder');
let splitActive = false;
let splitRatio  = 0.5; // left pane fraction

function openSplit(url) {
  splitActive = true;
  paneRight.style.display  = 'flex';
  splitDiv.style.display   = 'block';
  const _bsp = document.getElementById('btn-split');
  if (_bsp) _bsp.classList.add('split-on');
  applySplitRatio();
  if (url) loadSplitUrl(url);
}

function closeSplit() {
  splitActive = false;
  paneRight.style.display  = 'none';
  splitDiv.style.display   = 'none';
  paneLeft.style.marginRight = '';
  const _bsp = document.getElementById('btn-split');
  if (_bsp) _bsp.classList.remove('split-on');
  splitIframe.src = 'about:blank';
  splitInput.value = '';
  splitPlaceholder.style.display = 'flex';
}

function applySplitRatio() {
  const totalW = window.innerWidth;
  const rightW = Math.round(totalW * (1 - splitRatio));
  const divX   = totalW - rightW - 5;
  // Right pane: fixed from right, width = rightW
  paneRight.style.width = rightW + 'px';
  // Divider: fixed at divX from left
  splitDiv.style.left  = divX + 'px';
  // Shrink left pane so content doesn't go under the right pane
  paneLeft.style.marginRight = (rightW + 5) + 'px';
}

function loadSplitUrl(raw) {
  let url = (raw || '').trim();
  if (!url) return;
  if (url.includes('.') && !url.includes(' ') && !/^https?:\/\//i.test(url)) url = 'https://' + url;
  else if (!/^https?:\/\//i.test(url)) url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
  splitIframe.src = url;
  splitInput.value = url;
  splitPlaceholder.style.display = 'none';
}

// Toggle button
const _bsp=document.getElementById('btn-split');if(_bsp)_bsp.addEventListener('click', () => {
  if (splitActive) closeSplit();
  else openSplit('');
});

// URL bar — navigate on Enter
splitInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') loadSplitUrl(splitInput.value);
});

// Close button
const _scb=document.getElementById('split-close-btn');if(_scb)_scb.addEventListener('click', closeSplit);

// Swap panes — swap iframes src
const _ssb=document.getElementById('split-swap-btn');if(_ssb)_ssb.addEventListener('click', () => {
  const state = tabState[activeTabId];
  if (!state) return;
  const leftUrl  = state.url === 'ep://home' ? '' : (state.url === 'mims://portal' ? '' : webIframe.src);
  const rightUrl = splitIframe.src === 'about:blank' ? '' : splitIframe.src;
  // Swap
  if (rightUrl) openUrl(rightUrl);
  if (leftUrl)  loadSplitUrl(leftUrl);
  showToast('Panes swapped');
});

// Draggable divider
let divDragging = false;
splitDiv.addEventListener('mousedown', e => {
  divDragging = true;
  splitDiv.classList.add('dragging');
  e.preventDefault();
});
document.addEventListener('mousemove', e => {
  if (!divDragging) return;
  const raw = e.clientX / window.innerWidth;
  splitRatio = Math.min(0.8, Math.max(0.2, raw));
  applySplitRatio();
});
document.addEventListener('mouseup', () => {
  if (divDragging) { divDragging = false; splitDiv.classList.remove('dragging'); }
});

// Also wire the tab context menu "Open in split" option
const _tcsp=document.getElementById('tctx-split');if(_tcsp)_tcsp.addEventListener('click', () => {
  const state = tabState[tabCtxId];
  if (!state) return;
  const url = state.url;
  if (!url || url === 'ep://home' || url === 'mims://portal') { showToast('Nothing to split with'); hideTabCtxMenu(); return; }
  openSplit(url);
  hideTabCtxMenu();
  showToast('Opened in split screen');
});

// ═══════════════════════════════════════════
// ═══════════════════════════════════════════
//  SEASON THEMES
// ═══════════════════════════════════════════
function applySeasonTheme(){
  document.body.classList.toggle('summer-city', summerEnabled);
  document.body.classList.toggle('winter-city', winterEnabled);
  document.body.classList.toggle('fall-city', fallEnabled);
  document.body.classList.toggle('spring-city', springEnabled);
  document.body.classList.toggle('sand-city', sandEnabled);
  document.body.classList.toggle('radioactive-city', radioactiveEnabled);
  const pt=document.getElementById('proxy-title');
  if(pt){
    const anySeasonActive=summerEnabled||winterEnabled||fallEnabled||springEnabled||sandEnabled||radioactiveEnabled;
    if(anySeasonActive){
      pt.style.fontStyle='italic';
      pt.style.fontFamily="'Pacifico','Orbitron',cursive";
      pt.style.letterSpacing='2px';
    } else {
      pt.style.fontStyle='';
      pt.style.fontFamily='';
      pt.style.letterSpacing='';
    }
  }
  if(springEnabled)           document.title='🌸 Endless Proxy';
  else if(fallEnabled)        document.title='🍂 Endless Proxy';
  else if(winterEnabled)      document.title='❄️ Endless Proxy';
  else if(summerEnabled)      document.title='🌅 Endless Proxy';
  else if(sandEnabled)        document.title='⚡ Endless Proxy';
  else if(radioactiveEnabled) document.title='☢️ Endless Proxy';
  else                        document.title='Endless Proxy';
}
// Keep old name as alias so nothing breaks
function applySummerTheme(){ applySeasonTheme(); }

// ═══════════════════════════════════════════
//  BROWSING HISTORY (global across tabs)
// ═══════════════════════════════════════════
let browsingHistory = JSON.parse(localStorage.getItem('ep_bhistory') || '[]');
const MAX_HIST = 200;
function saveBrowsingHistory() { localStorage.setItem('ep_bhistory', JSON.stringify(browsingHistory)); }
function addToHistory(url, title) {
  if (!url || url === 'ep://home' || url === 'mims://portal') return;
  const entry = { url, title: title || (() => { try { return new URL(url).hostname.replace('www.',''); } catch { return url.slice(0, 40); } })(), time: Date.now() };
  browsingHistory.unshift(entry);
  if (browsingHistory.length > MAX_HIST) browsingHistory = browsingHistory.slice(0, MAX_HIST);
  saveBrowsingHistory();
}
function renderHistoryPanel() {
  const body = document.getElementById('history-body');
  if (!body) return;
  body.innerHTML = '';
  if (browsingHistory.length === 0) {
    body.innerHTML = '<div class="panel-empty"><span class="pe-icon">🕐</span>No history yet</div>';
    return;
  }
  // Group by day
  const groups = {};
  browsingHistory.forEach(e => {
    const d = new Date(e.time);
    const today = new Date(); const yesterday = new Date(); yesterday.setDate(today.getDate()-1);
    let label;
    if (d.toDateString() === today.toDateString()) label = 'Today';
    else if (d.toDateString() === yesterday.toDateString()) label = 'Yesterday';
    else label = d.toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' });
    if (!groups[label]) groups[label] = [];
    groups[label].push(e);
  });
  // Clear all button
  const clearBtn = document.createElement('div');
  clearBtn.innerHTML = `<div style="display:flex;justify-content:flex-end;margin-bottom:8px;"><div style="font-size:11px;color:rgba(255,100,100,0.65);cursor:pointer;padding:3px 10px;border-radius:6px;border:1px solid rgba(255,80,80,0.2);" id="hist-clear-all">Clear all</div></div>`;
  body.appendChild(clearBtn);
  document.getElementById('hist-clear-all').addEventListener('click', () => {
    if (confirm('Clear all browsing history?')) { browsingHistory = []; saveBrowsingHistory(); renderHistoryPanel(); showToast('History cleared'); }
  });
  Object.entries(groups).forEach(([label, entries]) => {
    const hdr = document.createElement('div');
    hdr.className = 'hist-date-header';
    hdr.textContent = label;
    body.appendChild(hdr);
    entries.forEach((e, idx) => {
      const el = document.createElement('div');
      el.className = 'hist-item';
      const t = new Date(e.time);
      const hh = String(t.getHours()).padStart(2,'0'), mm = String(t.getMinutes()).padStart(2,'0');
      const fav = (() => { try { return `https://www.google.com/s2/favicons?sz=14&domain=${new URL(e.url).hostname}`; } catch { return ''; } })();
      el.innerHTML = `${fav ? `<img src="${fav}" onerror="this.style.display='none'">` : '<span style="width:14px;height:14px;flex-shrink:0;">🌐</span>'}<span class="hist-item-title" title="${e.url}">${e.title}</span><span class="hist-item-time">${hh}:${mm}</span><span class="hist-item-del" title="Remove">✕</span>`;
      el.querySelector('.hist-item-title').addEventListener('click', () => { openUrl(e.url); closePanel('history'); });
      el.querySelector('.hist-item-del').addEventListener('click', ev => { ev.stopPropagation(); browsingHistory = browsingHistory.filter(h => h !== e); saveBrowsingHistory(); renderHistoryPanel(); });
      body.appendChild(el);
    });
  });
}

// Wire history button
const _bhist = document.getElementById('btn-history');
if (_bhist) _bhist.addEventListener('click', () => openPanel('history'));

// Patch openPanel to support history
// NOTE: must use variable assignment (not function declaration) so the
// hoisted first openPanel is correctly captured in _origOpenPanel.
const _origOpenPanel = openPanel;
openPanel = function openPanelPatched(name) {
  if (name === 'history') {
    if (activePanel === 'history') { closePanel('history'); return; }
    if (activePanel) document.getElementById(`panel-${activePanel}`)?.classList.remove('open');
    activePanel = 'history';
    renderHistoryPanel();
    document.getElementById('panel-history')?.classList.add('open');
    document.getElementById('panel-scrim')?.classList.add('show');
    return;
  }
  _origOpenPanel(name);
};

// Patch openUrl to record history
const _origOpenUrl = openUrl;
openUrl = function openUrlPatched(raw, addToHistory = true) {
  _origOpenUrl(raw, addToHistory);
  const url = (raw || '').trim();
  if (url && url !== 'ep://home' && url !== 'mims://portal' && /^https?:\/\//i.test(url)) {
    addToHistory(url);
  }
};

// ═══════════════════════════════════════════
//  HOME DATE DISPLAY
// ═══════════════════════════════════════════
const dateEl = document.getElementById('home-date');
function updateDate() {
  if (!dateEl) return;
  const d = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  dateEl.textContent = `${days[d.getDay()]} · ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
updateDate();
setInterval(updateDate, 60000);

// ═══════════════════════════════════════════
//  ADDRESS BAR OVERLAY (click to edit)
// ═══════════════════════════════════════════
const addrOverlay = document.getElementById('addr-overlay');
const addrInput = document.getElementById('addr-input');

function openAddrOverlay() {
  const state = tabState[activeTabId];
  const cur = state?.url;
  addrInput.value = (!cur || cur === 'ep://home' || cur === 'mims://portal') ? '' : cur;
  addrOverlay.style.display = 'flex';
  requestAnimationFrame(() => { addrInput.focus(); addrInput.select(); });
}
function closeAddrOverlay() {
  addrOverlay.style.display = 'none';
}
document.getElementById('nav-address-bar')?.addEventListener('click', openAddrOverlay);
document.getElementById('btn-search-icon')?.addEventListener('click', e => { e.stopPropagation(); openAddrOverlay(); });
addrOverlay?.addEventListener('click', e => { if (e.target === addrOverlay) closeAddrOverlay(); });
addrInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter') { closeAddrOverlay(); openUrl(addrInput.value); }
  if (e.key === 'Escape') closeAddrOverlay();
});

// ═══════════════════════════════════════════
//  KEYBOARD SHORTCUTS OVERLAY
// ═══════════════════════════════════════════
const shortcutsOverlay = document.getElementById('shortcuts-overlay');
function openShortcutsOverlay() {
  shortcutsOverlay.style.display = 'flex';
  shortcutsOverlay.querySelector('#shortcuts-overlay-close').onmouseenter = function() { this.style.background = 'rgba(255,255,255,0.08)'; };
  shortcutsOverlay.querySelector('#shortcuts-overlay-close').onmouseleave = function() { this.style.background = ''; };
}
function closeShortcutsOverlay() { shortcutsOverlay.style.display = 'none'; }
document.getElementById('btn-help')?.addEventListener('click', openShortcutsOverlay);
document.getElementById('shortcuts-overlay-close')?.addEventListener('click', closeShortcutsOverlay);
shortcutsOverlay?.addEventListener('click', e => { if (e.target === shortcutsOverlay) closeShortcutsOverlay(); });

// ═══════════════════════════════════════════
//  TAB SEARCH OVERLAY (Ctrl+Shift+A)
// ═══════════════════════════════════════════
const tabSearchOverlay = document.getElementById('tab-search-overlay');
const tabSearchInput = document.getElementById('tab-search-input');
const tabSearchResults = document.getElementById('tab-search-results');

function openTabSearch() {
  tabSearchOverlay.style.display = 'flex';
  tabSearchInput.value = '';
  renderTabSearch('');
  tabSearchInput.focus();
}
function closeTabSearch() { tabSearchOverlay.style.display = 'none'; }

function renderTabSearch(query) {
  tabSearchResults.innerHTML = '';
  const q = query.toLowerCase();
  tabs.forEach(tab => {
    const state = tabState[tab.id];
    const title = tab.title || 'New Tab';
    const url = state?.url || '';
    if (q && !title.toLowerCase().includes(q) && !url.toLowerCase().includes(q)) return;
    const el = document.createElement('div');
    el.className = 'ts-item' + (tab.id === activeTabId ? ' ts-item-active' : '');
    const fav = url && url !== 'ep://home' && url !== 'mims://portal' ? `https://www.google.com/s2/favicons?sz=14&domain=${(() => { try { return new URL(url).hostname; } catch { return ''; } })()}` : '';
    el.innerHTML = `<div class="ts-item-icon">${fav ? `<img src="${fav}" width="14" height="14" style="border-radius:2px;" onerror="this.style.display='none'">` : '🌐'}</div><div style="flex:1;min-width:0;"><div class="ts-item-title">${title}</div><div class="ts-item-url">${url === 'ep://home' ? 'New Tab' : url === 'mims://portal' ? 'MIMS Portal' : url}</div></div>${tab.id === activeTabId ? '<span class="ts-active-pill">active</span>' : ''}`;
    el.addEventListener('click', () => { switchTab(tab.id); closeTabSearch(); });
    tabSearchResults.appendChild(el);
  });
  if (!tabSearchResults.children.length) {
    tabSearchResults.innerHTML = '<div style="padding:20px;text-align:center;color:rgba(255,255,255,0.3);font-size:13px;font-family:Rajdhani,sans-serif;">No matching tabs</div>';
  }
}
tabSearchInput?.addEventListener('input', () => renderTabSearch(tabSearchInput.value));
tabSearchInput?.addEventListener('keydown', e => { if (e.key === 'Escape') closeTabSearch(); });
tabSearchOverlay?.addEventListener('click', e => { if (e.target === tabSearchOverlay) closeTabSearch(); });

// ═══════════════════════════════════════════
//  EXTENDED KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════
document.addEventListener('keydown', e => {
  const tag = document.activeElement?.tagName;
  const inInput = tag === 'INPUT' || tag === 'TEXTAREA';
  // Ctrl+? → shortcuts overlay
  if (e.ctrlKey && (e.key === '?' || e.key === '/') && !inInput) { e.preventDefault(); openShortcutsOverlay(); }
  // Ctrl+Shift+A → tab search
  if (e.ctrlKey && e.shiftKey && e.key === 'A') { e.preventDefault(); openTabSearch(); }
  // Ctrl+H → history
  if (e.ctrlKey && e.key === 'h' && !inInput) { e.preventDefault(); openPanel('history'); }
  // Ctrl+D → bookmark
  if (e.ctrlKey && e.key === 'd' && !inInput) { e.preventDefault(); document.getElementById('btn-bookmark')?.click(); }
  // Ctrl+R → reload
  if (e.ctrlKey && e.key === 'r' && !inInput) { e.preventDefault(); document.getElementById('btn-reload')?.click(); }
  // Ctrl+\ → split screen
  if (e.ctrlKey && e.key === '\\' && !inInput) { e.preventDefault(); document.getElementById('btn-split')?.click(); }
  // Alt+Left → back
  if (e.altKey && e.key === 'ArrowLeft' && !inInput) { e.preventDefault(); document.getElementById('btn-back')?.click(); }
  // Alt+Right → forward
  if (e.altKey && e.key === 'ArrowRight' && !inInput) { e.preventDefault(); document.getElementById('btn-forward')?.click(); }
  // Escape → also close address overlay and shortcuts overlay
  if (e.key === 'Escape') {
    if (addrOverlay?.style.display !== 'none') { closeAddrOverlay(); return; }
    if (shortcutsOverlay?.style.display !== 'none') { closeShortcutsOverlay(); return; }
    if (tabSearchOverlay?.style.display !== 'none') { closeTabSearch(); return; }
  }
});

applySeasonalMode(); // Apply seasonal mode before theme (may override manual picks)
applySeasonTheme();  // Apply persisted season state on load

// ═══════════════════════════════════════════
//  CHROME HEIGHT → split pane offset
// ═══════════════════════════════════════════
function updateChromeHeight(){
  const chrome=document.querySelector('.browser-chrome');
  if(chrome){
    document.documentElement.style.setProperty('--chrome-height', chrome.offsetHeight+'px');
  }
}
updateChromeHeight();
new ResizeObserver(updateChromeHeight).observe(document.querySelector('.browser-chrome'));

// ═══════════════════════════════════════════
//  HOME CLOCK
// ═══════════════════════════════════════════
const clockEl=document.getElementById('home-clock');
function tickClock(){
  if(!clockEl)return;
  const n=new Date();
  const hh=String(n.getHours()).padStart(2,'0');
  const mm=String(n.getMinutes()).padStart(2,'0');
  const ss=String(n.getSeconds()).padStart(2,'0');
  clockEl.textContent=`${hh}:${mm}:${ss}`;
}
tickClock();
setInterval(tickClock,1000);

// ═══════════════════════════════════════════
//  ADDRESS BAR LOCK ICON
// ═══════════════════════════════════════════
function updateAddressBarIcon(url){
  const lock=document.getElementById('nav-lock-icon');
  const globe=document.getElementById('nav-globe-icon');
  if(!lock||!globe)return;
  const isHttps=/^https:\/\//i.test(url||'');
  lock.style.display=isHttps?'block':'none';
  globe.style.display=isHttps?'none':'block';
}

// ═══════════════════════════════════════════
//  BOOKMARK STAR ACTIVE STATE
// ═══════════════════════════════════════════
function updateBookmarkStar(){
  const btn=document.getElementById('btn-bookmark');
  if(!btn)return;
  const state=tabState[activeTabId];
  if(!state||state.url==='ep://home'||state.url==='New Tab'||state.url==='mims://portal'){
    btn.classList.remove('bookmarked');return;
  }
  const isBookmarked=bookmarks.some(b=>b.url===state.url);
  btn.classList.toggle('bookmarked',isBookmarked);
}

// ═══════════════════════════════════════════
//  KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════
document.addEventListener('keydown',e=>{
  const tag=document.activeElement?.tagName;
  const inInput=tag==='INPUT'||tag==='TEXTAREA';
  // Ctrl+T → new tab
  if(e.ctrlKey&&e.key==='t'&&!inInput){
    e.preventDefault();
    document.getElementById('btn-new-tab')?.click();
  }
  // Ctrl+W → close active tab
  if(e.ctrlKey&&e.key==='w'&&!inInput){
    e.preventDefault();
    closeTab(activeTabId);
  }
  // Ctrl+L → focus address bar
  if(e.ctrlKey&&e.key==='l'){
    e.preventDefault();
    document.getElementById('nav-address-bar')?.click();
  }
  // Escape → hide suggestions & blur search
  if(e.key==='Escape'&&!inInput){
    hideSuggestions();
    if(activePanel)closePanel(activePanel);
  }
});
