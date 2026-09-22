(()=>{
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const clamp=v=>Math.max(0,Math.min(1,v));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=t=>t*t*(3-2*t);
const smoother=t=>t*t*t*(t*(t*6-15)+10);
const range=(v,a,b)=>clamp((v-a)/(b-a));
const bump=(p,a,b,c,d)=>smooth(range(p,a,b))*(1-smooth(range(p,c,d)));
const mobile=()=>innerWidth<=760;
const rgb=(a,b,t)=>`rgb(${Math.round(mix(a[0],b[0],t))},${Math.round(mix(a[1],b[1],t))},${Math.round(mix(a[2],b[2],t))})`;

const ambient=$('#ambient');
const burger=$('#masterBurger'), layers=$$('#masterBurger .layer');
const receipt=$('#receipt'), pin=$('#continuityPin'), route=$('#route');
const houseFrame=$('.house-frame'), houseCopy=$('.house-copy');
const proofNote=$('.proof-note'), proofSide=$('.proof-side');
const locationTitle=$('.location-title'), map=$('.map'), locationMeta=$('.location-meta');
const orderCopy=$('.order-copy'), orderEcho=$('.order-echo');
const pca=$('.pc-a'), pcb=$('.pc-b'), dca=$('.dc-a'), dcb=$('.dc-b'), dcc=$('.dc-c');
const sceneEls={
  presence:$('#presenca'),desire:$('#desejo'),house:$('#casa'),proof:$('#prova'),location:$('#localizacao'),order:$('#pedido')
};
const layerOffsets=[-58,-42,-24,-7,12,31,48,66,84];
let metrics={};
let ticking=false;

function measure(){
  for(const [k,el] of Object.entries(sceneEls)){
    metrics[k]={top:el.offsetTop,len:Math.max(1,el.offsetHeight-innerHeight)};
  }
  render();
}
function pos(scene,p){const m=metrics[scene];return m.top+m.len*p}
function progress(scene,y=scrollY){const m=metrics[scene];return clamp((y-m.top)/m.len)}
function sample(frames,y){
  if(y<=frames[0].y)return {...frames[0]};
  if(y>=frames.at(-1).y)return {...frames.at(-1)};
  for(let i=0;i<frames.length-1;i++){
    const a=frames[i],b=frames[i+1];
    if(y>=a.y&&y<=b.y){const t=smoother(range(y,a.y,b.y)),o={};for(const key of Object.keys(a)){if(key==='y')continue;o[key]=mix(a[key],b[key],t)}return o;}
  }
  return {...frames.at(-1)};
}
function setTransform(el,s){el.style.transform=`translate(-50%,-50%) translate3d(${s.x-50}vw,${s.y-50}vh,0) scale(${s.s})${s.r?` rotate(${s.r}deg)`:''}`;el.style.opacity=String(clamp(s.o));}
function setOpacity(el,v){el.style.opacity=String(clamp(v))}
function colorTimeline(y){
  const dark=[12,9,7],red=[124,37,29],brown=[40,26,18],proof=[29,20,15],loc=[21,17,15],order=[142,33,27];
  const spans=[
    [pos('presence',.72),pos('desire',.10),dark,red],
    [pos('desire',.74),pos('house',.14),red,brown],
    [pos('house',.70),pos('proof',.18),brown,proof],
    [pos('proof',.72),pos('location',.10),proof,loc],
    [pos('location',.70),pos('order',.10),loc,order]
  ];
  let c=dark;
  if(y<spans[0][0])return rgb(dark,dark,0);
  for(let i=0;i<spans.length;i++){
    const [a,b,c0,c1]=spans[i];
    if(y>=a&&y<=b)return rgb(c0,c1,smooth(range(y,a,b)));
    if(y>b)c=c1;
    if(i<spans.length-1&&y> b && y<spans[i+1][0])return rgb(c,c,0);
  }
  return rgb(order,order,0);
}
function burgerState(y){
  const m=mobile();
  const frames=m?[
    {y:pos('presence',0),x:50,yv:63,s:.68,o:0},
    {y:pos('presence',.08),x:50,yv:63,s:.82,o:1},
    {y:pos('presence',.62),x:50,yv:63,s:1.00,o:1},
    {y:pos('presence',1),x:50,yv:66,s:.92,o:1},
    {y:pos('desire',0),x:50,yv:66,s:.92,o:1},
    {y:pos('desire',.64),x:54,yv:68,s:.88,o:1},
    {y:pos('desire',1),x:50,yv:72,s:.62,o:1},
    {y:pos('house',0),x:50,yv:72,s:.62,o:1},
    {y:pos('house',.32),x:49,yv:73,s:.54,o:1},
    {y:pos('house',.67),x:48,yv:73,s:.50,o:1},
    {y:pos('house',.82),x:48,yv:73,s:.50,o:0},
    {y:pos('order',1),x:48,yv:73,s:.50,o:0}
  ]:[
    {y:pos('presence',0),x:50,yv:57,s:.68,o:0},
    {y:pos('presence',.08),x:50,yv:57,s:.78,o:1},
    {y:pos('presence',.62),x:50,yv:56,s:1.00,o:1},
    {y:pos('presence',1),x:63,yv:56,s:.96,o:1},
    {y:pos('desire',0),x:63,yv:56,s:.96,o:1},
    {y:pos('desire',.62),x:69,yv:58,s:1.02,o:1},
    {y:pos('desire',1),x:56,yv:72,s:.62,o:1},
    {y:pos('house',0),x:56,yv:72,s:.62,o:1},
    {y:pos('house',.32),x:48,yv:73,s:.52,o:1},
    {y:pos('house',.67),x:46,yv:73,s:.49,o:1},
    {y:pos('house',.82),x:46,yv:73,s:.49,o:0},
    {y:pos('order',1),x:46,yv:73,s:.49,o:0}
  ];
  const raw=sample(frames,y);return{x:raw.x,y:raw.yv,s:raw.s,o:raw.o,r:0};
}
function receiptState(y){
  const m=mobile();
  const frames=m?[
    {y:pos('house',.22),x:61,yv:71,s:.46,o:0,r:-2},
    {y:pos('house',.42),x:61,yv:71,s:.56,o:1,r:-2},
    {y:pos('house',.92),x:58,yv:68,s:.62,o:1,r:-1.2},
    {y:pos('proof',0),x:58,yv:68,s:.62,o:1,r:-1.2},
    {y:pos('proof',.34),x:50,yv:53,s:.92,o:1,r:-.5},
    {y:pos('proof',.72),x:50,yv:53,s:.92,o:1,r:-.5},
    {y:pos('location',.06),x:50,yv:51,s:.90,o:0,r:0},
    {y:pos('order',1),x:50,yv:51,s:.90,o:0,r:0}
  ]:[
    {y:pos('house',.22),x:67,yv:71,s:.48,o:0,r:-2},
    {y:pos('house',.42),x:67,yv:71,s:.60,o:1,r:-2},
    {y:pos('house',.92),x:66,yv:68,s:.72,o:1,r:-1.2},
    {y:pos('proof',0),x:66,yv:68,s:.72,o:1,r:-1.2},
    {y:pos('proof',.34),x:34,yv:50,s:1.10,o:1,r:-.4},
    {y:pos('proof',.72),x:34,yv:50,s:1.10,o:1,r:-.4},
    {y:pos('location',.06),x:34,yv:48,s:1.05,o:0,r:0},
    {y:pos('order',1),x:34,yv:48,s:1.05,o:0,r:0}
  ];
  const raw=sample(frames,y);return{x:raw.x,y:raw.yv,s:raw.s,o:raw.o,r:raw.r};
}
function pinState(y){
  const m=mobile();
  const frames=m?[
    {y:pos('proof',.38),x:27,yv:69,s:.65,o:0},
    {y:pos('proof',.50),x:27,yv:69,s:.75,o:1},
    {y:pos('proof',.76),x:27,yv:69,s:.75,o:1},
    {y:pos('location',.10),x:82,yv:52,s:1,o:1},
    {y:pos('location',1),x:82,yv:52,s:1,o:1},
    {y:pos('order',0),x:82,yv:-48,s:1,o:0},
    {y:pos('order',1),x:82,yv:-48,s:1,o:0}
  ]:[
    {y:pos('proof',.38),x:22,yv:69,s:.65,o:0},
    {y:pos('proof',.50),x:22,yv:69,s:.75,o:1},
    {y:pos('proof',.76),x:22,yv:69,s:.75,o:1},
    {y:pos('location',.10),x:88,yv:33,s:1,o:1},
    {y:pos('location',1),x:88,yv:33,s:1,o:1},
    {y:pos('order',0),x:88,yv:-67,s:1,o:0},
    {y:pos('order',1),x:88,yv:-67,s:1,o:0}
  ];
  const raw=sample(frames,y);return{x:raw.x,y:raw.yv,s:raw.s,o:raw.o,r:0};
}
function render(){
  ticking=false;
  if(!metrics.presence)return;
  const y=scrollY;
  ambient.style.background=colorTimeline(y);

  const bp=burgerState(y);setTransform(burger,bp);
  const hp=progress('presence',y),dp=progress('desire',y),ap=progress('house',y),pp=progress('proof',y),lp=progress('location',y),op=progress('order',y);
  const split=Math.max(bump(hp,.25,.37,.56,.72),bump(dp,.18,.32,.48,.64));
  layers.forEach((el,i)=>{const off=layerOffsets[i],xx=split*(mobile()?(i%2?.05:-.04):(i%2?.12:-.10))*Math.abs(off),yy=split*off*(mobile()?.34:.48),rot=split*(i-4)*(mobile()?.12:.28);el.style.transform=`translate3d(${xx}px,${yy}px,0) rotate(${rot}deg)`});

  const rs=receiptState(y);setTransform(receipt,rs);
  const ps=pinState(y);setTransform(pin,ps);

  setOpacity(pca,bump(hp,.11,.18,.28,.36));
  setOpacity(pcb,bump(hp,.48,.57,.68,.78));
  setOpacity(dca,bump(dp,.08,.16,.28,.38));
  setOpacity(dcb,bump(dp,.34,.43,.53,.62));
  setOpacity(dcc,bump(dp,.62,.71,.83,.92));
  setOpacity(houseFrame,smooth(range(ap,.05,.24))*(1-smooth(range(ap,.78,.96))));
  houseFrame.style.transform=`scale(${mix(.96,1,smooth(range(ap,.05,.28)))})`;
  setOpacity(houseCopy,bump(ap,.25,.38,.69,.84));
  setOpacity(proofNote,bump(pp,.24,.38,.70,.84));
  setOpacity(proofSide,bump(pp,.42,.55,.76,.90));
  setOpacity(locationTitle,smooth(range(lp,.08,.20)));
  setOpacity(map,smooth(range(lp,.06,.18)));
  setOpacity(locationMeta,smooth(range(lp,.25,.38)));
  const draw=smooth(range(lp,.16,.58));route.style.strokeDashoffset=String(920*(1-draw));
  setOpacity(orderCopy,mix(.14,1,smooth(range(op,0,.16))));setOpacity(orderEcho,smooth(range(op,.14,.44))*.9);
}
function request(){if(!ticking){ticking=true;requestAnimationFrame(render)}}
addEventListener('scroll',request,{passive:true});
addEventListener('resize',()=>{measure();request()});
addEventListener('load',measure);
measure();
})();
