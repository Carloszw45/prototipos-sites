(()=>{
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const clamp=v=>Math.max(0,Math.min(1,v));
  const range=(p,a,b)=>clamp((p-a)/(b-a));
  const mix=(a,b,t)=>a+(b-a)*t;
  const smooth=t=>t*t*(3-2*t);
  const smoother=t=>t*t*t*(t*(t*6-15)+10);
  const prog=el=>{const r=el.getBoundingClientRect(),d=el.offsetHeight-innerHeight;return d<=0?0:clamp(-r.top/d)};

  const hero=$('#hero'), heroStage=$('#heroStage'), heroBurger=$('#heroBurger');
  const products=$('#produtos'), productsStage=$('#productsStage'), productStack=$('#productStack'), pcs=$$('.p-copy'), productNo=$('.product-no'), menuLink=$('.menu-link');
  const house=$('#casa'), houseStage=$('#houseStage'), housePhoto=$('#housePhoto'), houseWindow=$('#houseWindow'), houseCopy=$('.house-copy');
  const proof=$('#prova'), proofStage=$('#proofStage'), rating=$('#rating'), four=$('.rating .four'), comma=$('.rating .comma'), seven=$('.rating .seven'), star=$('.rating sup'), ratingSub=$('.rating-sub'), reviews=$('.reviews');
  const location=$('#local'), locationStage=$('#locationStage'), route=$('#route'), pin=$('#pin'), locTitle=$('.loc-title'), locMeta=$('.loc-meta'), routeLabel=$('.route-label'), routeMap=$('.route-map');
  const order=$('#pedido'), orderStage=$('#orderStage'), orderTitle=$('.order-title'), returnBurger=$('#returnBurger'), orderLinks=$('.order-links'), ctaLine=$('.order-title a i');

  document.title='Senhor Burger — Protótipo v0.7';
  const footerVersion=$('.footer span'); if(footerVersion) footerVersion.textContent='Protótipo de experiência v0.7';

  const style=document.createElement('style');
  style.textContent=`
    .sb7-bridge{position:fixed;pointer-events:none;z-index:44;will-change:transform,opacity,left,top,width,height,filter}
    .sb7-burger{left:50%;top:55%;width:min(48vw,560px);aspect-ratio:1.15/1;transform-origin:center}
    .sb7-product{left:50%;top:50%;width:min(45vw,590px);aspect-ratio:1.05/1;transform-origin:center}
    .sb7-house{overflow:hidden;border-radius:4px;opacity:0;transform-origin:center;background:#281a12}
    .sb7-house:after{content:"";position:absolute;inset:0;background:#eadfce;opacity:var(--wash,0);pointer-events:none}
    .sb7-star{font-weight:900;line-height:1;color:#17110e;opacity:0;transform-origin:center center;z-index:48}
    .sb7-route-line{position:fixed;height:3px;background:#b63a31;border-radius:999px;transform-origin:left center;opacity:0;z-index:47;pointer-events:none;will-change:transform,opacity,left,top,width}
    @media(max-width:760px){.sb7-burger{width:min(94vw,510px);top:60%}.sb7-product{width:92vw}}
  `;
  document.head.appendChild(style);

  const heroBridge=heroBurger.cloneNode(true);
  heroBridge.removeAttribute('id'); heroBridge.classList.add('sb7-bridge','sb7-burger');
  heroBridge.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
  document.body.appendChild(heroBridge);

  const productBridge=productStack.cloneNode(true);
  productBridge.removeAttribute('id'); productBridge.classList.add('sb7-bridge','sb7-product');
  productBridge.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
  productBridge.querySelector('.product-no')?.remove();
  document.body.appendChild(productBridge);

  const houseBridge=housePhoto.cloneNode(true);
  houseBridge.removeAttribute('id'); houseBridge.classList.add('sb7-bridge','sb7-house');
  houseBridge.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
  document.body.appendChild(houseBridge);

  const starBridge=document.createElement('div');
  starBridge.className='sb7-bridge sb7-star'; starBridge.textContent='★';
  document.body.appendChild(starBridge);

  const routeBridge=document.createElement('div'); routeBridge.className='sb7-route-line';
  document.body.appendChild(routeBridge);

  function pinTarget(){
    const mobile=innerWidth<=760;
    if(mobile){
      const left=.10*innerWidth, top=.44*innerHeight, width=.92*innerWidth, height=.50*innerHeight;
      return {x:left+width*(655/700),y:top+height*(148/540)};
    }
    const width=.46*innerWidth, height=.72*innerHeight, left=.51*innerWidth, top=.14*innerHeight;
    return {x:left+width*(655/700),y:top+height*(148/540)};
  }

  let ticking=false;
  function render(){
    ticking=false;
    const hp=prog(hero), pp=prog(products), ap=prog(house), rp=prog(proof), lp=prog(location), op=prog(order), mobile=innerWidth<=760;

    // Bridges are stateless: every frame starts hidden. This fixes reverse-scroll residue.
    heroBridge.style.opacity='0'; productBridge.style.opacity='0'; houseBridge.style.opacity='0'; starBridge.style.opacity='0'; routeBridge.style.opacity='0';

    // Restore stage backgrounds that our transition layer may have changed on the previous frame.
    heroStage.style.background='radial-gradient(circle at 50% 58%,rgba(164,42,33,.18),transparent 32%),linear-gradient(#100c09,#0b0806)';
    proofStage.style.background='#eadfce'; locationStage.style.background='#15110f'; orderStage.style.opacity='1';

    // V0.3 has aggressive exit effects. Neutralize only those exits; scene interiors remain untouched.
    route.style.strokeWidth='5'; route.style.stroke='#b63a31';

    // 01 HERO -> 02 PRODUTOS
    // Keep the v0.3 hero, but replace the last giant zoom by a controlled approach.
    if(hp>.84){
      const t=smoother(range(hp,.84,1));
      const x=mix(mobile?-3:18,mobile?10:20,t), y=mix(mobile?-6:-7,mobile?4:-1,t), sc=mix(1.08,mobile?1.22:1.28,t);
      heroBurger.style.transform=`translate3d(calc(-50% + ${x}vw),calc(-50% + ${y}vh),0) scale(${sc})`;
      heroStage.style.background=`linear-gradient(rgb(${Math.round(mix(12,124,t))},${Math.round(mix(9,37,t))},${Math.round(mix(7,29,t))}),rgb(${Math.round(mix(11,124,t))},${Math.round(mix(8,37,t))},${Math.round(mix(6,29,t))}))`;
    }
    if(pp<.14){
      const t=smoother(range(pp,0,.14));
      heroBridge.style.opacity=String(1-smooth(range(pp,.09,.14)));
      heroBridge.style.transform=`translate3d(calc(-50% + ${mix(mobile?10:20,mobile?19:23,t)}vw),calc(-50% + ${mix(mobile?4:-1,mobile?8:-2,t)}vh),0) scale(${mix(mobile?1.22:1.28,mobile?.96:1,t)})`;
      productStack.style.opacity=String(smooth(range(pp,.07,.14)));
      if(pp<.10){ pcs.forEach(el=>el.style.opacity='0'); productNo.style.opacity='0'; menuLink.style.opacity='0'; }
    }

    // 02 PRODUTOS -> 03 CASA
    // No explosion/zoom. The last burger lowers toward the table while red warms into brown.
    if(pp>.80){
      const t=smoother(range(pp,.80,1));
      pcs.forEach(el=>el.style.opacity=String(1-smooth(range(pp,.78,.88))));
      productNo.style.opacity=String(1-t); menuLink.style.opacity=String(1-t);
      productStack.style.transform=`translateY(-50%) translate3d(${mix(mobile?-4:-10,mobile?-10:-22,t)}vw,${mix(mobile?2:-3,mobile?18:15,t)}vh,0) scale(${mix(mobile?.94:1.02,mobile?.68:.58,t)})`;
      productsStage.style.background=`rgb(${Math.round(mix(124,40,t))},${Math.round(mix(37,26,t))},${Math.round(mix(29,18,t))})`;
    }
    if(ap<.17){
      const t=smoother(range(ap,0,.17));
      productBridge.style.opacity=String(1-smooth(range(ap,.10,.17)));
      productBridge.style.transform=`translate3d(calc(-50% + ${mix(mobile?-10:-22,mobile?-12:-24,t)}vw),calc(-50% + ${mix(mobile?18:15,mobile?20:18,t)}vh),0) scale(${mix(mobile?.68:.58,mobile?.42:.34,t)})`;
      // Remove the dead zone seen in the video: the house is already forming behind the burger.
      housePhoto.style.opacity=String(smooth(range(ap,0,.10)));
      if(ap<.12) houseCopy.style.opacity='0';
    }

    // 03 CASA -> 04 PROVA
    // Use the whole environment image as the transition object. It expands; the bright window lifts exposure into paper.
    if(ap>.78){
      const t=smoother(range(ap,.78,1));
      const r=housePhoto.getBoundingClientRect();
      const L=mix(r.left,0,t), T=mix(r.top,0,t), W=mix(r.width,innerWidth,t), H=mix(r.height,innerHeight,t);
      houseBridge.style.opacity=String(smooth(range(t,0,.10)));
      houseBridge.style.left=`${L}px`; houseBridge.style.top=`${T}px`; houseBridge.style.width=`${W}px`; houseBridge.style.height=`${H}px`;
      houseBridge.style.filter=`saturate(${mix(1,.55,t)}) brightness(${mix(1,1.22,t)})`;
      houseBridge.style.setProperty('--wash',String(smooth(range(t,.48,1))*.96));
      housePhoto.style.opacity=String(1-smooth(range(t,.05,.30)));
      houseCopy.style.opacity=String(1-smooth(range(ap,.74,.84)));
      // Cancel the v0.3 square-window zoom that caused the white block in the recording.
      houseWindow.style.transform='none';
    }
    if(rp<.14){
      const t=smoother(range(rp,0,.14));
      houseBridge.style.opacity=String(1-t);
      houseBridge.style.left='0px'; houseBridge.style.top='0px'; houseBridge.style.width=`${innerWidth}px`; houseBridge.style.height=`${innerHeight}px`;
      houseBridge.style.filter='saturate(.55) brightness(1.22)'; houseBridge.style.setProperty('--wash','0.96');
      // Proof content starts immediately: no multi-second blank cream screen.
      rating.style.opacity=String(smooth(range(rp,.015,.10)));
      ratingSub.style.opacity=String(smooth(range(rp,.04,.12)));
    }

    // 04 PROVA -> 05 LOCALIZAÇÃO
    // The star becomes the map pin. This avoids the giant '7' seen in the video.
    if(rp>.80){
      const t=smoother(range(rp,.80,1)), target=pinTarget(), sr=star.getBoundingClientRect();
      const sx=sr.left+sr.width/2, sy=sr.top+sr.height/2;
      const fade=smooth(range(rp,.80,.90));
      reviews.style.opacity=String(1-fade); ratingSub.style.opacity=String(1-fade);
      four.style.opacity=String(1-fade); comma.style.opacity=String(1-fade); seven.style.opacity=String(1-fade);
      // Neutralize v0.3's giant seven exit.
      seven.style.transform='none'; star.style.opacity='0';
      starBridge.style.opacity='1'; starBridge.style.fontSize=getComputedStyle(star).fontSize;
      starBridge.style.left=`${mix(sx,target.x,t)}px`; starBridge.style.top=`${mix(sy,target.y,t)}px`;
      starBridge.style.transform=`translate(-50%,-50%) scale(${mix(1,.72,t)}) rotate(${mix(0,18,t)}deg)`;
      starBridge.style.color=`rgb(${Math.round(mix(23,182,t))},${Math.round(mix(17,58,t))},${Math.round(mix(14,49,t))})`;
      proofStage.style.background=`rgb(${Math.round(mix(234,21,t))},${Math.round(mix(223,17,t))},${Math.round(mix(206,15,t))})`;
    }
    if(lp<.14){
      const t=smoother(range(lp,0,.14)), target=pinTarget();
      starBridge.style.opacity=String(1-smooth(range(lp,.06,.14)));
      starBridge.style.fontSize=getComputedStyle(star).fontSize; starBridge.style.left=`${target.x}px`; starBridge.style.top=`${target.y}px`;
      starBridge.style.transform='translate(-50%,-50%) scale(.72) rotate(18deg)'; starBridge.style.color='#b63a31';
      pin.style.opacity=String(smooth(range(lp,.05,.13))); pin.style.transform=`scale(${smooth(range(lp,.05,.13))})`;
      locTitle.style.opacity=String(smooth(range(lp,.025,.12))); locMeta.style.opacity=String(smooth(range(lp,.04,.13))); routeMap.style.opacity=String(.84*smooth(range(lp,.02,.12)));
    }

    // 05 LOCALIZAÇÃO -> 06 PEDIDO
    // Keep route thin. Its endpoint extends as a line while the background inherits the same red.
    if(lp>.78){
      const t=smoother(range(lp,.78,1)), target=pinTarget();
      const len=mix(0,mobile?innerWidth*.56:innerWidth*.48,t), angle=mobile?155:168;
      routeBridge.style.opacity=String(smooth(range(t,.05,.75)));
      routeBridge.style.left=`${target.x}px`; routeBridge.style.top=`${target.y}px`; routeBridge.style.width=`${len}px`;
      routeBridge.style.transform=`rotate(${angle}deg)`;
      locationStage.style.background=`rgb(${Math.round(mix(21,142,t))},${Math.round(mix(17,33,t))},${Math.round(mix(15,27,t))})`;
      locTitle.style.opacity=String(1-smooth(range(t,.20,.80))); locMeta.style.opacity=String(1-smooth(range(t,.20,.80))); routeLabel.style.opacity=String(1-t); routeMap.style.opacity=String(mix(.84,.18,t));
    }
    if(op<.15){
      const t=smoother(range(op,0,.15));
      routeBridge.style.opacity=String(1-t);
      // Order appears only after color continuity is established.
      orderTitle.style.opacity=String(smooth(range(op,.025,.12))); orderTitle.style.transform=`translateY(-50%) translateX(${mix(-2,0,t)}vw)`;
      orderLinks.style.opacity=String(.68*smooth(range(op,.05,.14))); returnBurger.style.opacity='0';
      if(ctaLine) ctaLine.style.transform=`scaleX(${smooth(range(op,.07,.15))})`; if(ctaLine) ctaLine.style.transformOrigin='left center';
    }
    if(op>=.15){
      const t=smoother(range(op,.15,.48));
      returnBurger.style.opacity=String(t); returnBurger.style.transform=`translateY(-50%) translateX(${mix(5,0,t)}vw) scale(${mix(.70,.88,t)})`;
      if(ctaLine){ctaLine.style.transform='scaleX(1)';ctaLine.style.transformOrigin='left center';}
    }
  }

  function request(){if(!ticking){ticking=true;requestAnimationFrame(render)}}
  addEventListener('scroll',request,{passive:true}); addEventListener('resize',request); request();
})();