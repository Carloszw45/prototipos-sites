(()=>{
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const clamp=v=>Math.max(0,Math.min(1,v));
const range=(v,a,b)=>clamp((v-a)/(b-a));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=t=>t*t*(3-2*t);
const smoother=t=>t*t*t*(t*(t*6-15)+10);
const progress=el=>{const r=el.getBoundingClientRect(),d=el.offsetHeight-innerHeight;return d<=0?0:clamp(-r.top/d)};
const entering=el=>clamp((innerHeight-el.getBoundingClientRect().top)/innerHeight);
const mobile=()=>innerWidth<=760;
const setOpacity=(el,v)=>{el.style.opacity=String(clamp(v))};
const rectCenter=r=>({x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height});
const setFixedBox=(el,x,y,w,h,scale=1)=>{el.style.left=`${x}px`;el.style.top=`${y}px`;el.style.width=`${w}px`;el.style.height=`${h}px`;el.style.transform=`translate(-50%,-50%) scale(${scale})`};
const color=(a,b,t)=>`rgb(${Math.round(mix(a[0],b[0],t))},${Math.round(mix(a[1],b[1],t))},${Math.round(mix(a[2],b[2],t))})`;

const houseRect=()=>mobile()?{left:20,top:.16*innerHeight,width:innerWidth-40,height:.58*innerHeight}:{left:.07*innerWidth,top:.15*innerHeight,width:.56*innerWidth,height:.70*innerHeight};
const mapRect=()=>mobile()?{left:.10*innerWidth,top:.44*innerHeight,width:.92*innerWidth,height:.50*innerHeight}:{left:.51*innerWidth,top:.14*innerHeight,width:.46*innerWidth,height:.72*innerHeight};
const ratingBox=()=>mobile()?{left:15,top:.42*innerHeight,width:.64*innerWidth,height:.28*innerHeight}:{left:.045*innerWidth,top:.50*innerHeight,width:.52*innerWidth,height:.48*innerHeight};

const hero=$('#hero'), heroStage=$('#heroStage'), heroBurger=$('#heroBurger'), heroLayers=$$('#heroBurger .layer'), heroTitle=$('.title'), heroKicker=$('.kicker'), heroA=$('.a'), heroB=$('.b'), heroC=$('.c'), hint=$('.hint');
const products=$('#produtos'), productsStage=$('#productsStage'), productStack=$('#productStack'), productLayers=$$('#productStack .layer, #productStack .mb'), pcs=$$('.p-copy'), productNo=$('.product-no'), menuLink=$('.menu-link');
const house=$('#casa'), houseStage=$('#houseStage'), housePhoto=$('#housePhoto'), houseWindow=$('#houseWindow'), houseCopy=$('.house-copy');
const proof=$('#prova'), proofStage=$('#proofStage'), rating=$('#rating'), four=$('.rating .four'), comma=$('.rating .comma'), seven=$('.rating .seven'), star=$('.rating sup'), ratingSub=$('.rating-sub'), reviews=$('.reviews'), rvs=$$('.review');
const location=$('#local'), locationStage=$('#locationStage'), routeMap=$('.route-map'), route=$('#route'), pin=$('#pin'), locTitle=$('.loc-title'), locMeta=$('.loc-meta'), routeLabel=$('.route-label');
const order=$('#pedido'), orderStage=$('#orderStage'), orderTitle=$('.order-title'), returnBurger=$('#returnBurger'), orderLinks=$('.order-links'), ctaLine=$('.order-title a i');
const bridgeBurger=$('#bridgeBurger'), bridgeProduct=$('#bridgeProduct'), bridgeLight=$('#bridgeLight'), bridgeStar=$('#bridgeStar'), bridgeMap=$('#bridgeMap');

const heroBurgerVisual=heroBurger.querySelector('.burger');
bridgeBurger.appendChild(heroBurgerVisual.cloneNode(true));
bridgeProduct.appendChild(heroBurgerVisual.cloneNode(true));
const bridgeHouse=housePhoto.cloneNode(true);bridgeHouse.removeAttribute('id');bridgeHouse.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));bridgeHouse.classList.add('bridge');bridgeHouse.style.zIndex='46';document.querySelector('.transition-layer').appendChild(bridgeHouse);
const bridgeRating=rating.cloneNode(true);bridgeRating.removeAttribute('id');bridgeRating.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));bridgeRating.classList.add('bridge');bridgeRating.style.zIndex='47';bridgeRating.style.color='var(--ink)';document.querySelector('.transition-layer').appendChild(bridgeRating);
const bridgeLocTitle=locTitle.cloneNode(true);bridgeLocTitle.classList.add('bridge');bridgeLocTitle.style.zIndex='47';document.querySelector('.transition-layer').appendChild(bridgeLocTitle);
const bridgeOrderTitle=orderTitle.cloneNode(true);bridgeOrderTitle.classList.add('bridge');bridgeOrderTitle.style.zIndex='47';document.querySelector('.transition-layer').appendChild(bridgeOrderTitle);
const bridgeMapRoute=bridgeMap.querySelector('.route'), bridgeMapPin=bridgeMap.querySelector('.pin');

const heroOff=[-58,-42,-24,-6,14,31,49,67,84];

function resetFrame(){
  [bridgeBurger,bridgeProduct,bridgeLight,bridgeStar,bridgeMap,bridgeHouse,bridgeRating,bridgeLocTitle,bridgeOrderTitle].forEach(el=>{setOpacity(el,0);el.style.filter='';el.style.clipPath='';});
  bridgeLight.style.background='transparent';
  heroStage.style.background='radial-gradient(circle at 50% 58%,rgba(164,42,33,.18),transparent 32%),linear-gradient(#100c09,#0b0806)';
  productsStage.style.background='#7c251d';houseStage.style.background='var(--house)';proofStage.style.background='var(--paper)';locationStage.style.background='#15110f';orderStage.style.background='radial-gradient(circle at 70% 45%,rgba(255,180,100,.14),transparent 26%),var(--red2)';
  heroBurger.style.visibility='visible';productStack.style.visibility='visible';housePhoto.style.visibility='visible';rating.style.visibility='visible';star.style.visibility='visible';routeMap.style.visibility='visible';locTitle.style.visibility='visible';orderTitle.style.visibility='visible';rating.style.color='var(--ink)';
  route.style.strokeWidth='5';route.style.stroke='#b63a31';route.style.opacity='1';
}

function renderHero(p){
  const m=mobile(),intro=smooth(range(p,0,.11)),move=smooth(range(p,.12,.28)),split=smooth(range(p,.28,.49)),detail=smooth(range(p,.50,.65)),join=smooth(range(p,.65,.79));
  const x=m?mix(0,-1,move):mix(0,18,move),y=m?mix(5,-2,move):mix(3,-7,move);
  const sc=mix(.72,1,intro)*mix(1,m?1.06:1.25,detail*(1-join));
  setOpacity(heroBurger,intro);heroBurger.style.transform=`translate3d(calc(-50% + ${x}vw),calc(-50% + ${y}vh),0) scale(${sc})`;
  const sep=split*(1-join);heroLayers.forEach((el,i)=>{const xx=sep*(m?.09:(i%2?.26:-.19))*Math.abs(heroOff[i]),yy=sep*heroOff[i]*(m?.48:.54),rot=sep*((i-4)*(m?.14:.34));el.style.transform=`translate3d(${xx}px,${yy}px,0) rotate(${rot}deg)`});
  const ai=m?smooth(range(p,.12,.18))*(1-smooth(range(p,.24,.30))):smooth(range(p,.10,.18))*(1-smooth(range(p,.26,.34)));
  const bi=m?smooth(range(p,.32,.38))*(1-smooth(range(p,.46,.52))):smooth(range(p,.31,.39))*(1-smooth(range(p,.47,.55)));
  const ci=m?smooth(range(p,.54,.60))*(1-smooth(range(p,.68,.74))):smooth(range(p,.52,.60))*(1-smooth(range(p,.68,.76)));
  setOpacity(heroA,ai);setOpacity(heroB,bi);setOpacity(heroC,ci);
  const lift=m?16:24;heroA.style.transform=`translateY(${mix(lift,0,ai)}px)`;heroB.style.transform=`translateY(${mix(lift,0,bi)}px)`;heroC.style.transform=`translateY(${mix(lift,0,ci)}px)`;
  setOpacity(hint,1-smooth(range(p,.02,m?.10:.14)));
  if(m){
    const dim=smooth(range(p,.08,.18)),exit=smooth(range(p,.72,.94));
    heroTitle.style.opacity=String(mix(mix(.92,.28,dim),.16,exit));heroKicker.style.opacity=String(1-smooth(range(p,.06,.16)));
  }else{
    heroTitle.style.opacity=String(mix(.95,.42,smooth(range(p,.72,.94))));heroKicker.style.opacity=String(1-smooth(range(p,.76,.95)));
  }
}

function renderProducts(p){
  const m=mobile();
  const s1=1-smooth(range(p,.25,.35)),s2=smooth(range(p,.31,.41))*(1-smooth(range(p,.53,.63))),s3=smooth(range(p,.59,.69))*(1-smooth(range(p,.84,.93)));
  setOpacity(pcs[0],s1);setOpacity(pcs[1],s2);setOpacity(pcs[2],s3);
  const in2=smooth(range(p,.31,.41)),out1=smooth(range(p,.25,.35)),in3=smooth(range(p,.59,.69)),copyLift=m?-.03*innerHeight:0;
  pcs[0].style.transform=`translate3d(0,${copyLift+mix(0,-18,out1)}px,0)`;pcs[1].style.transform=`translate3d(0,${copyLift+mix(20,0,in2)-mix(0,14,smooth(range(p,.53,.63)))}px,0)`;pcs[2].style.transform=`translate3d(0,${copyLift+mix(22,0,in3)}px,0)`;
  const drift=m?mix(0,-1.5,smooth(range(p,.08,.82))):mix(0,-2.5,smooth(range(p,.08,.82))),base=m?.86:1,sc=base*mix(.96,1.02,smooth(range(p,.08,.72)));
  productStack.style.right=m?'-9vw':'5vw';productStack.style.left='auto';productStack.style.top=m?'72%':'50%';productStack.style.transform=`translateY(-50%) translate3d(${drift}vw,${mix(0,m?1:-1,p)}vh,0) scale(${sc})`;setOpacity(productStack,1);
  const separate=smooth(range(p,.37,.49))*(1-smooth(range(p,.56,.69))),baseOff=[-24,-18,-11,-5,2,8,14,20,26],amp=m?.58:1;
  productLayers.forEach((el,i)=>{setOpacity(el,1);el.style.transform=`translate3d(0,${(baseOff[i]??0)*amp*separate}px,0)`});
  setOpacity(productNo,.60*(1-smooth(range(p,.84,.96))));setOpacity(menuLink,1-smooth(range(p,.84,.96)));
}

function renderHouse(p){
  const m=mobile(),focus=smooth(range(p,.18,.62));
  setOpacity(housePhoto,1);housePhoto.style.transform=`scale(${mix(1,m?1.045:1.09,focus)})`;housePhoto.style.filter='';houseWindow.style.transform='none';
  setOpacity(houseCopy,smooth(range(p,.04,.16))*(1-smooth(range(p,.70,.84))));
}

function renderProof(p){
  const r1In=smooth(range(p,.16,.28)),r1Out=smooth(range(p,.44,.50)),r2In=smooth(range(p,.50,.62)),r2Out=smooth(range(p,.76,.86)),r1=r1In*(1-r1Out),r2=r2In*(1-r2Out);
  setOpacity(rating,1);rating.style.transform='translateY(-50%) scale(1)';setOpacity(ratingSub,1);
  setOpacity(rvs[0],r1);setOpacity(rvs[1],r2);rvs[0].style.transform=`translateY(calc(-50% + ${mix(26,0,r1In)-mix(0,16,r1Out)}px))`;rvs[1].style.transform=`translateY(calc(-50% + ${mix(26,0,r2In)-mix(0,16,r2Out)}px))`;
  setOpacity(reviews,1);[four,comma,seven,star].forEach(el=>setOpacity(el,1));seven.style.transform='none';if(p>.80){const t=smooth(range(p,.80,.95));setOpacity(reviews,1-t);setOpacity(ratingSub,1-smooth(range(p,.84,.96)));}
}

function renderLocation(p){
  const draw=smooth(range(p,.10,.54)),finish=smooth(range(p,.52,.68));
  setOpacity(locTitle,1);locTitle.style.transform='translateY(-50%)';setOpacity(locMeta,1);setOpacity(routeLabel,finish);setOpacity(routeMap,.84);
  route.style.strokeDashoffset=String(880*(1-draw));pin.style.transform=`scale(${finish})`;setOpacity(pin,finish);
}

function renderOrder(p){
  const burger=smooth(range(p,.10,.42)),settle=smooth(range(p,.42,.64));
  setOpacity(orderTitle,1);orderTitle.style.transform=mobile()?'translateX(0)':'translateY(-50%) translateX(0)';setOpacity(returnBurger,burger);returnBurger.style.transform=`translateY(-50%) translateX(${mix(6,0,burger)}vw) scale(${mix(.65,.88,burger)*mix(1,1.025,settle)})`;setOpacity(orderLinks,.68);if(ctaLine)ctaLine.style.transform='scaleX(1)';
}

function bridgeHeroProducts(e){
  if(e<=0||e>=1)return;
  const t=smoother(e),rawA=rectCenter(heroBurger.getBoundingClientRect()),rawB=rectCenter(productStack.getBoundingClientRect());
  const a={...rawA,y:rawA.y+innerHeight*e},b={...rawB,y:rawB.y-innerHeight*(1-e)};
  const x=mix(a.x,b.x,t),y=mix(a.y,b.y,t),w=mix(a.w,b.w,t),h=mix(a.h,b.h,t);
  heroBurger.style.visibility='hidden';productStack.style.visibility='hidden';setFixedBox(bridgeBurger,x,y,w,h,1);setOpacity(bridgeBurger,1);
  const bg=color([12,9,7],[124,37,29],smooth(range(t,.04,.88)));heroStage.style.background=bg;productsStage.style.background=bg;
  const exit=smooth(range(t,.08,.56));heroTitle.style.opacity=String((+heroTitle.style.opacity||0)*(1-exit));heroKicker.style.opacity=String((+heroKicker.style.opacity||0)*(1-exit));[heroA,heroB,heroC].forEach(el=>setOpacity(el,(+el.style.opacity||0)*(1-exit)));setOpacity(pcs[0],smooth(range(t,.72,.98))*.95);
}

function bridgeProductsHouse(e){
  if(e<=0||e>=1)return;
  const t=smoother(e),rawA=rectCenter(productStack.getBoundingClientRect()),hr=houseRect(),pc={x:hr.left+hr.width/2,y:hr.top+hr.height/2};
  const a={...rawA,y:rawA.y+innerHeight*e};
  const targetScale=mobile()?.56:.48,target={x:hr.left+hr.width*(mobile()?.58:.64),y:hr.top+hr.height*.72,w:a.w*targetScale,h:a.h*targetScale};
  const move=smoother(range(t,.04,.94)),size=smoother(range(t,.18,.94));
  productStack.style.visibility='hidden';housePhoto.style.visibility='hidden';
  const bg=color([124,37,29],[40,26,18],smooth(range(t,.06,.92)));productsStage.style.background=bg;houseStage.style.background=bg;
  const incomingY=pc.y+innerHeight*(1-e);setFixedBox(bridgeHouse,pc.x,incomingY,hr.width,hr.height,1);
  const reveal=smoother(range(t,.12,.74)),clipTop=mix(52,0,reveal),clipSide=mix(mobile()?18:28,0,reveal),clipBottom=mix(8,0,reveal);
  bridgeHouse.style.clipPath=`inset(${clipTop}% ${clipSide}% ${clipBottom}% ${clipSide}% round 4px)`;setOpacity(bridgeHouse,smooth(range(t,.08,.60)));
  setFixedBox(bridgeProduct,mix(a.x,target.x,move),mix(a.y,target.y,move),mix(a.w,target.w,size),mix(a.h,target.h,size),1);
  const fadeStart=mobile()?.92:.88;setOpacity(bridgeProduct,1-smooth(range(e,fadeStart,.995)));
}

function bridgeHouseProof(e){
  if(e<=0||e>=1)return;
  const t=smoother(e),hr=houseRect(),c={x:hr.left+hr.width/2,y:hr.top+hr.height/2};
  housePhoto.style.visibility='hidden';rating.style.visibility='hidden';
  const bg=color([40,26,18],[234,223,206],smooth(range(t,.24,.90)));houseStage.style.background=bg;
  setFixedBox(bridgeHouse,mix(c.x,innerWidth/2,t),mix(c.y,innerHeight/2,t),mix(hr.width,innerWidth,t),mix(hr.height,innerHeight,t),1);setOpacity(bridgeHouse,1-smooth(range(t,.72,.94)));bridgeHouse.style.filter=`saturate(${mix(1,.66,t)}) brightness(${mix(1,1.13,t)})`;
  const lightIn=smooth(range(t,.30,.72)),lightOut=1-smooth(range(t,.90,.99));bridgeLight.style.background='rgba(234,223,206,.82)';setOpacity(bridgeLight,lightIn*lightOut);
  const rr=rating.getBoundingClientRect(),pr=proof.getBoundingClientRect();bridgeRating.style.left=`${rr.left}px`;bridgeRating.style.top=`${rr.top-pr.top}px`;bridgeRating.style.width=`${rr.width}px`;bridgeRating.style.height=`${rr.height}px`;bridgeRating.style.transform='none';bridgeRating.style.fontSize=getComputedStyle(rating).fontSize;bridgeRating.style.color='var(--ink)';setOpacity(bridgeRating,smooth(range(t,.68,.95)));setOpacity(ratingSub,smooth(range(t,.60,.92)));
}

function bridgeProofLocation(e){
  if(e<=0||e>=1)return;
  const t=smoother(range(e,.12,.88)),mr=mapRect(),target={x:mr.left+mr.width*(655/700),y:mr.top+mr.height*(148/540)},rr=rating.getBoundingClientRect(),stableRating={left:rr.left,top:rr.top+innerHeight*e,width:rr.width,height:rr.height};
  rating.style.visibility='hidden';star.style.visibility='hidden';locTitle.style.visibility='hidden';bridgeLight.style.background=color([234,223,206],[21,17,15],t);setOpacity(bridgeLight,1);
  bridgeRating.style.left=`${stableRating.left}px`;bridgeRating.style.top=`${stableRating.top}px`;bridgeRating.style.width=`${stableRating.width}px`;bridgeRating.style.height=`${stableRating.height}px`;bridgeRating.style.transform='none';bridgeRating.style.fontSize=getComputedStyle(rating).fontSize;bridgeRating.style.color=color([23,17,14],[239,227,210],smooth(range(t,.22,.70)));setOpacity(bridgeRating,1-smooth(range(t,.28,.52)));
  const sr=star.getBoundingClientRect(),rawS=rectCenter(sr),s0={...rawS,y:rawS.y+innerHeight*e};setOpacity(bridgeStar,1-smooth(range(t,.90,1)));bridgeStar.style.fontSize=getComputedStyle(star).fontSize;bridgeStar.style.left=`${mix(s0.x,target.x,t)}px`;bridgeStar.style.top=`${mix(s0.y,target.y,t)}px`;bridgeStar.style.transform=`translate(-50%,-50%) scale(${mix(1,.68,t)}) rotate(${mix(0,10,t)}deg)`;bridgeStar.style.color=color([23,17,14],[182,58,49],t);
  bridgeLocTitle.style.position='fixed';bridgeLocTitle.style.left=mobile()?'20px':'6vw';bridgeLocTitle.style.top=mobile()?'30%':'50%';bridgeLocTitle.style.transform='translateY(-50%)';bridgeLocTitle.style.fontSize=getComputedStyle(locTitle).fontSize;setOpacity(bridgeLocTitle,smooth(range(t,.48,.72)));
  bridgeMap.style.left=`${mr.left}px`;bridgeMap.style.top=`${mr.top}px`;bridgeMap.style.width=`${mr.width}px`;bridgeMap.style.height=`${mr.height}px`;bridgeMap.style.transform='none';setOpacity(bridgeMap,.50*smooth(range(t,.40,.70)));
  if(bridgeMapRoute){bridgeMapRoute.style.strokeDashoffset=String(mix(880,500,smooth(range(t,.38,.82))));bridgeMapRoute.style.strokeWidth='5';}if(bridgeMapPin){const ps=smooth(range(t,.62,.90));bridgeMapPin.style.transform=`scale(${ps})`;setOpacity(bridgeMapPin,ps);}setOpacity(locMeta,smooth(range(t,.58,.78)));
}

function bridgeLocationOrder(e){
  if(e<=0||e>=1)return;
  const t=smoother(e),mr=mapRect();routeMap.style.visibility='hidden';locTitle.style.visibility='hidden';orderTitle.style.visibility='hidden';
  bridgeMap.style.left=`${mr.left}px`;bridgeMap.style.top=`${mr.top}px`;bridgeMap.style.width=`${mr.width}px`;bridgeMap.style.height=`${mr.height}px`;bridgeMap.style.transform=`translate3d(${mix(0,-innerWidth*.010,t)}px,${mix(0,-innerHeight*.010,t)}px,0) scale(${mix(1,.99,t)})`;setOpacity(bridgeMap,.84*(1-smooth(range(t,.44,.86))));
  if(bridgeMapRoute){bridgeMapRoute.style.strokeDashoffset='0';bridgeMapRoute.style.strokeWidth='5';}if(bridgeMapPin){bridgeMapPin.style.transform='scale(1)';setOpacity(bridgeMapPin,1);}
  bridgeLight.style.background=color([21,17,15],[142,33,27],t);setOpacity(bridgeLight,smooth(range(t,.02,.98)));
  bridgeLocTitle.style.position='fixed';bridgeLocTitle.style.left=mobile()?'20px':'6vw';bridgeLocTitle.style.top=`${mix(mobile()?30:50,mobile()?22:38,smooth(range(t,.28,.72)))}%`;bridgeLocTitle.style.transform='translateY(-50%)';bridgeLocTitle.style.fontSize=getComputedStyle(locTitle).fontSize;setOpacity(bridgeLocTitle,1-smooth(range(t,.30,.58)));
  bridgeOrderTitle.style.position='fixed';bridgeOrderTitle.style.left=mobile()?'20px':'6vw';bridgeOrderTitle.style.top=`${mix(mobile()?36:62,mobile()?28:50,smooth(range(t,.48,.86)))}%`;bridgeOrderTitle.style.transform=mobile()?'none':'translateY(-50%)';bridgeOrderTitle.style.width=mobile()?'calc(100vw - 40px)':'auto';setOpacity(bridgeOrderTitle,smooth(range(t,.36,.62)));setOpacity(locMeta,1-smooth(range(t,.34,.64)));setOpacity(routeLabel,1-smooth(range(t,.24,.58)));setOpacity(orderLinks,.68*smooth(range(t,.54,.78)));
}

let ticking=false;
function render(){
  ticking=false;resetFrame();
  const hp=progress(hero),pp=progress(products),ap=progress(house),rp=progress(proof),lp=progress(location),op=progress(order);
  renderHero(hp);renderProducts(pp);renderHouse(ap);renderProof(rp);renderLocation(lp);renderOrder(op);
  bridgeHeroProducts(entering(products));bridgeProductsHouse(entering(house));bridgeHouseProof(entering(proof));bridgeProofLocation(entering(location));bridgeLocationOrder(entering(order));
}
function request(){if(!ticking){ticking=true;requestAnimationFrame(render)}}
addEventListener('scroll',request,{passive:true});addEventListener('resize',request);render();
})();