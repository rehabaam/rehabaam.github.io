(()=>{
  const cv=document.getElementById('st'),ctx=cv.getContext('2d');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W=0,H=0,dpr=1,t=0,col={};
  const M={x:0,y:0,tx:0,ty:0,user:false};
  function readCols(){const s=getComputedStyle(document.documentElement);
    col={grid:s.getPropertyValue('--rule').trim(),blue:s.getPropertyValue('--blue').trim(),red:s.getPropertyValue('--red').trim(),muted:s.getPropertyValue('--muted').trim()}}
  function size(){dpr=Math.min(devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    if(!M.user){M.x=M.tx=W*.68;M.y=M.ty=H*.42}}
  // test particles
  const P=[];function seed(){P.length=0;for(let i=0;i<7;i++){const r=60+i*28,a=Math.random()*6.28,v=Math.sqrt(1800/r);
    P.push({x:M.x+r*Math.cos(a),y:M.y+r*Math.sin(a),vx:-v*Math.sin(a),vy:v*Math.cos(a),tr:[]})}}
  function warp(x,y){const dx=M.x-x,dy=M.y-y,r=Math.hypot(dx,dy)+1,k=Math.min(2400/(r+40),r*.55);return[x+dx/r*k,y+dy/r*k]}
  function draw(){
    ctx.clearRect(0,0,W,H);const g=34;ctx.lineWidth=1;ctx.strokeStyle=col.grid;
    for(let y=-g;y<=H+g;y+=g){ctx.beginPath();for(let x=-g;x<=W+g;x+=8){const[p,q]=warp(x,y);x===-g?ctx.moveTo(p,q):ctx.lineTo(p,q)}ctx.stroke()}
    for(let x=-g;x<=W+g;x+=g){ctx.beginPath();for(let y=-g;y<=H+g;y+=8){const[p,q]=warp(x,y);y===-g?ctx.moveTo(p,q):ctx.lineTo(p,q)}ctx.stroke()}
    // horizon + photon sphere
    ctx.fillStyle=col.blue;ctx.beginPath();ctx.arc(M.x,M.y,5,0,6.28);ctx.fill();
    ctx.setLineDash([3,4]);ctx.strokeStyle=col.muted;ctx.beginPath();ctx.arc(M.x,M.y,22,0,6.28);ctx.stroke();ctx.setLineDash([]);
    ctx.font='500 11px "IBM Plex Mono",monospace';ctx.fillStyle=col.muted;ctx.fillText('r = 3GM/c²',M.x+26,M.y-24);
    for(const p of P){if(p.tr.length<2)continue;ctx.strokeStyle=col.red;ctx.globalAlpha=.75;ctx.beginPath();ctx.moveTo(p.tr[0][0],p.tr[0][1]);
      for(const s of p.tr)ctx.lineTo(s[0],s[1]);ctx.stroke();ctx.globalAlpha=1;ctx.fillStyle=col.red;ctx.beginPath();ctx.arc(p.x,p.y,2.5,0,6.28);ctx.fill()}
  }
  function step(){
    t+=1/60;if(!M.user){M.tx=W*(.66+.12*Math.sin(t*.23));M.ty=H*(.42+.12*Math.sin(t*.31))}
    M.x+=(M.tx-M.x)*.06;M.y+=(M.ty-M.y)*.06;
    for(const p of P){for(let s=0;s<3;s++){const dx=M.x-p.x,dy=M.y-p.y,r2=dx*dx+dy*dy+400,r=Math.sqrt(r2),a=1800/r2*(1+3600/r2);
      p.vx+=a*dx/r/3;p.vy+=a*dy/r/3;p.x+=p.vx/3;p.y+=p.vy/3}
      p.tr.push([p.x,p.y]);if(p.tr.length>90)p.tr.shift();
      const d=Math.hypot(p.x-M.x,p.y-M.y);if(d<10||d>Math.max(W,H)){const r=80+Math.random()*180,a=Math.random()*6.28,v=Math.sqrt(1800/r);
        Object.assign(p,{x:M.x+r*Math.cos(a),y:M.y+r*Math.sin(a),vx:-v*Math.sin(a),vy:v*Math.cos(a),tr:[]})}}
    draw();requestAnimationFrame(step)}
  cv.parentElement.addEventListener('pointermove',e=>{const b=cv.getBoundingClientRect();M.user=true;M.tx=e.clientX-b.left;M.ty=e.clientY-b.top});
  cv.parentElement.addEventListener('pointerleave',()=>{M.user=false});
  addEventListener('resize',size);
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{readCols();if(reduce)draw()});
  document.getElementById('frame').addEventListener('click',()=>{const r=document.documentElement;
    const dark=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
    r.dataset.theme=dark?'light':'dark';try{localStorage.setItem('theme',r.dataset.theme)}catch(e){}
    readCols();if(reduce)draw()});
  readCols();size();seed();
  if(reduce){for(let i=0;i<120;i++){for(const p of P){const dx=M.x-p.x,dy=M.y-p.y,r2=dx*dx+dy*dy+400,r=Math.sqrt(r2),a=1800/r2;p.vx+=a*dx/r;p.vy+=a*dy/r;p.x+=p.vx;p.y+=p.vy;p.tr.push([p.x,p.y])}}draw()}
  else requestAnimationFrame(step);
})();
