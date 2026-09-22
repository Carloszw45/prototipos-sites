(()=>{
'use strict';
const clamp=v=>Math.max(0,Math.min(1,v));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=t=>t*t*(3-2*t);
const range=(v,a,b)=>clamp((v-a)/(b-a));
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

const burger=$('#burger'), shadow=$('#burgerShadow');
const layers=$$('#burger .layer');
const presenca=$('#presenca'), desejo=$('#desejo'), casa=$('#casa');
const heroTitle=$('.copy-presenca h1'), heroTag=$('.copy-presenca p'), heroEye=$('.copy-presenca .eyebrow');
const desireA=$('.copy-desejo-a'), desireB=$('.copy-desejo-b');
const houseShell=$('.house-shell'), houseCopy=$('.copy-casa'), table=$('.table-plane'), windowEl=$('.window'), lamp=$('.lamp');
const cue=$('.scroll-cue');

const offsets=[-62,-44,-28,-10,7,24,41,58,76];
let metrics=null,ticking=false;

function measure(){
  metrics={
    p0:presenca.offsetTop,
    p1:desejo.offsetTop,
    p2:casa.offsetTop,
    p3:casa.offsetTop+casa.offsetHeight,
    vh:innerHeight,
    vw:innerWidth,
    mobile:innerWidth<=760
  };
}

function sceneProgress(start,end,y){return clamp((y-start)/(end-start));}

function render(){
  ticking=false;
  if(!metrics)measure();
  const {p0,p1,p2,p3,vh,mobile}=metrics;
  const y=scrollY;
  const hero=sceneProgress(p0,p1,y);
  const desire=sceneProgress(p1,p2,y);
  const house=sceneProgress(p2,p3-vh,y);

  // One object, one owner, one timeline.
  let x=0, yp=mobile?62:56, scale=1, rot=0, opacity=1;

  // PRESENÇA: approach, brief ingredient opening, recomposition.
  const arrive=smooth(range(hero,0,.18));
  const inspect=smooth(range(hero,.24,.48))*(1-smooth(range(hero,.56,.74)));
  const moveRight=smooth(range(hero,.58,.92));
  x=mix(0,mobile?4:20,moveRight);
  yp=mix(mobile?64:58,mobile?61:54,arrive);
  scale=mix(.78,1,arrive)*mix(1,mobile?1.03:1.08,inspect);
  layers.forEach((el,i)=>{
    const amp=mobile?.48:.66;
    const dy=offsets[i]*inspect*amp;
    const dx=((i%2)?1:-1)*Math.abs(offsets[i])*(mobile?.06:.11)*inspect;
    const r=(i-4)*(mobile?.12:.22)*inspect;
    el.style.transform=`translate3d(${dx}px,${dy}px,0) rotate(${r}deg)`;
  });

  const heroExit=smooth(range(hero,.62,.94));
  heroTitle.style.opacity=String(1-.72*heroExit);
  heroTag.style.opacity=String((1-smooth(range(hero,.18,.34)))*(1-.65*heroExit));
  heroEye.style.opacity=String(.66*(1-smooth(range(hero,.72,.96))));

  // DESEJO: same burger continues across the next scene; no handoff.
  if(y>=p1){
    const settle=smooth(range(desire,0,.24));
    const breathe=smooth(range(desire,.20,.54));
    const prepareTable=smooth(range(desire,.62,.96));
    x=mix(mobile?4:20,mobile?0:24,settle);
    yp=mix(mobile?61:54,mobile?67:52,settle);
    yp=mix(yp,mobile?73:66,prepareTable);
    scale=mix(scale,mobile?.92:1.03,settle);
    scale=mix(scale,mobile?.74:.63,prepareTable);
    rot=mix(0,mobile?0:-2,prepareTable);
    const drift=Math.sin(breathe*Math.PI)* (mobile?4:8);
    x+=drift/10;

    const a=1-smooth(range(desire,.33,.46));
    const b=smooth(range(desire,.42,.54))*(1-smooth(range(desire,.72,.84)));
    desireA.style.opacity=String(a);
    desireA.style.transform=`translateY(${mix(0,-18,1-a)}px)`;
    desireB.style.opacity=String(b);
    desireB.style.transform=`translateY(${mix(18,0,b)}px)`;
  } else {
    desireA.style.opacity='1'; desireB.style.opacity='0';
  }

  // CASA: same burger lands on the table; environment reveals around it.
  if(y>=p2){
    const land=smooth(range(house,0,.18));
    const reveal=smooth(range(house,.06,.30));
    x=mix(mobile?0:24,mobile?-2:17,land);
    yp=mix(mobile?73:66,mobile?69:69,land);
    scale=mix(mobile?.74:.63,mobile?.66:.54,land);
    rot=mix(mobile?0:-2,0,land);
    houseShell.style.opacity=String(reveal);
    houseShell.style.transform=`scale(${mix(.985,1,reveal)})`;
    table.style.transform=`scaleY(${mix(.88,1,reveal)})`;
    windowEl.style.opacity=String(mix(.18,1,reveal));
    lamp.style.opacity=String(mix(.2,1,reveal));
    houseCopy.style.opacity=String(smooth(range(house,.18,.36))*(1-smooth(range(house,.78,.94))));
    const push=smooth(range(house,.58,.90));
    x=mix(x,mobile?12:27,push);
    scale=mix(scale,mobile?.61:.49,push);
    opacity=1-smooth(range(house,.90,1));
  } else {
    houseShell.style.opacity='0';
    houseCopy.style.opacity='0';
  }

  burger.style.transform=`translate3d(calc(-50% + ${x}vw),-50%,0) translateY(${yp-50}vh) scale(${scale}) rotate(${rot}deg)`;
  burger.style.opacity=String(opacity);

  const shadowScale=scale*(mobile?1.08:.9);
  shadow.style.transform=`translate3d(calc(-50% + ${x*.85}vw),-50%,0) translateY(${(yp+(mobile?18:20))-50}vh) scale(${shadowScale})`;
  shadow.style.opacity=String(opacity*mix(.38,.72,smooth(range(hero,.04,.24))));

  cue.style.opacity=String(1-smooth(range(y,0,vh*.8)));
}

function request(){if(!ticking){ticking=true;requestAnimationFrame(render)}}
addEventListener('scroll',request,{passive:true});
addEventListener('resize',()=>{measure();request()});
measure();render();
})();