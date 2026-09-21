(()=>{
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const clamp=v=>Math.max(0,Math.min(1,v));
  const range=(p,a,b)=>clamp((p-a)/(b-a));
  const mix=(a,b,t)=>a+(b-a)*t;
  const smooth=t=>t*t*(3-2*t);
  const smoother=t=>t*t*t*(t*(t*6-15)+10);
  const prog=el=>{const r=el.getBoundingClientRect(),d=el.offsetHeight-innerHeight;return d<=0?0:clamp(-r.top/d)};

  const hero=$('#hero'), heroStage=$('#heroStage'), heroBurger=$('#heroBurger');
  const products=$('#produtos'), productsStage=$('#productsStage'), productStack=$('#productStack');
  const productLayers=$$('#productStack .mb'), productCopies=$$('.p-copy'), productNo=$('.product-no'), menuLink=$('.menu-link');
  const house=$('#casa'), houseStage=$('#houseStage'), housePhoto=$('#housePhoto'), houseWindow=$('#houseWindow'), houseLight=$('.window-light'), houseCopy=$('.house-copy');
  const proof=$('#prova'), proofStage=$('#proofStage'), rating=$('#rating'), four=$('.rating .four'), comma=$('.rating .comma'), seven=$('.rating .seven'), star=$('.rating sup'), ratingSub=$('.rating-sub'), reviews=$('.reviews'), reviewEls=$$('.review');
  const location=$('#local'), locationStage=$('#locationStage'), route=$('#route'), pin=$('#pin'), locTitle=$('.loc-title'), locMeta=$('.loc-meta'), routeLabel=$('.route-label'), routeMap=$('.route-map');
  const order=$('#pedido'), orderTitle=$('.order-title'), returnBurger=$('#returnBurger'), orderLinks=$('.order-links');

  document.title='Senhor Burger — Protótipo v0.5';
  const footerVersion=$('.footer span'); if(footerVersion) footerVersion.textContent='Protótipo de experiência v0.5';

  const style=document.createElement('style');
  style.textContent=`
    .handoff{position:absolute;pointer-events:none;will-change:transform,opacity;z-index:30}
    .hero-handoff{left:50%;top:55%;width:min(48vw,560px);aspect-ratio:1.15/1;transform-origin:center}
    .house-handoff{left:50%;top:50%;width:min(45vw,590px);aspect-ratio:1.05/1;transform-origin:center}
    #houseWindow{will-change:transform,opacity,border-color,box-shadow}
    #houseWindow .window-light{will-change:opacity}
    .route-map .pin{fill:#b63a31!important;transform-box:fill-box;transform-origin:center!important;will-change:transform,opacity}
    #proofStage{will-change:background}
    @media(max-width:760px){.hero-handoff{width:min(94vw,510px);top:60%}.house-handoff{width:92vw}}
  `;
  document.head.appendChild(style);

  // Handoff 1: o mesmo burger do hero continua dentro da cena de produtos.
  const heroHandoff=heroBurger.cloneNode(true);
  heroHandoff.removeAttribute('id');
  heroHandoff.classList.add('handoff','hero-handoff');
  heroHandoff.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
  productsStage.appendChild(heroHandoff);

  // Handoff 2: o último burger entra fisicamente na casa e pousa sobre a mesa.
  const houseHandoff=productStack.cloneNode(true);
  houseHandoff.removeAttribute('id');
  houseHandoff.classList.add('handoff','house-handoff');
  houseHandoff.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
  houseHandoff.querySelector('.product-no')?.remove();
  houseStage.appendChild(houseHandoff);

  let ticking=false;

  function heroToProducts(){
    const hp=prog(hero), pp=prog(products), mobile=innerWidth<=760;
    const exit=smoother(range(hp,.82,1));

    // Mantém a coreografia da v0.3 e só refina o fechamento: o burger ocupa a câmera.
    if(hp>.80){
      const scale=mix(mobile?5.9:5.2,mobile?8.8:8.1,exit);
      const x=mix(mobile?-3:18,0,exit);
      const y=mix(mobile?-1:-5,0,exit);
      heroBurger.style.transform=`translate3d(calc(-50% + ${x}vw),calc(-50% + ${y}vh),0) scale(${scale})`;
      heroStage.style.filter=`saturate(${mix(1,.88,exit)}) brightness(${mix(1,.82,exit)})`;
    } else heroStage.style.filter='';

    // A cena seguinte começa exatamente com esse mesmo objeto gigante e o recolhe para a composição da v0.3.
    const enter=smoother(range(pp,0,.18));
    const handScale=mix(mobile?8.8:8.1,mobile?.96:1,enter);
    const hx=mix(0,mobile?20:24,enter);
    const hy=mix(0,mobile?9:-2,enter);
    heroHandoff.style.opacity=pp<.22?1-smooth(range(pp,.13,.22)):0;
    heroHandoff.style.transform=`translate3d(calc(-50% + ${hx}vw),calc(-50% + ${hy}vh),0) scale(${handScale})`;

    if(pp<.20){
      productStack.style.opacity=smooth(range(pp,.10,.20));
      productCopies.forEach(el=>el.style.opacity='0');
      productNo.style.opacity=smooth(range(pp,.14,.22));
      menuLink.style.opacity=smooth(range(pp,.16,.24));
    } else {
      productStack.style.opacity='';
      menuLink.style.opacity='';
    }
  }

  function productsToHouse(){
    const pp=prog(products), hp=prog(house), mobile=innerWidth<=760;
    const exit=smoother(range(pp,.80,1));

    if(pp>.79){
      productCopies.forEach(el=>el.style.opacity='0');
      productNo.style.opacity=1-exit;
      menuLink.style.opacity=1-exit;
      productLayers.forEach(el=>{el.style.opacity='1';});
      const scale=mix(mobile?1.05:1.06,mobile?4.8:4.2,exit);
      const x=mix(mobile?-4:-10,0,exit);
      const y=mix(mobile?2:-3,0,exit);
      productStack.style.transform=`translateY(-50%) translate3d(${x}vw,${y}vh,0) scale(${scale})`;
      productsStage.style.background=`rgb(${Math.round(mix(124,40,exit))},${Math.round(mix(37,26,exit))},${Math.round(mix(29,18,exit))})`;
    }

    // O burger não some: ele atravessa o corte e pousa na mesa da casa.
    const land=smoother(range(hp,0,.24));
    const fade=smooth(range(hp,.24,.38));
    const hs=mix(mobile?4.8:4.2,mobile?.42:.34,land);
    const hx=mix(0,mobile?-10:-22,land);
    const hy=mix(0,mobile?21:20,land);
    houseHandoff.style.opacity=hp<.4?1-fade:0;
    houseHandoff.style.transform=`translate3d(calc(-50% + ${hx}vw),calc(-50% + ${hy}vh),0) scale(${hs})`;

    if(hp<.20){
      housePhoto.style.opacity=smooth(range(hp,.04,.20));
      houseCopy.style.opacity='0';
    }
  }

  function houseToProof(){
    const hp=prog(house), pp=prog(proof), mobile=innerWidth<=760;
    const focus=smoother(range(hp,.68,1));

    if(hp>.66){
      houseCopy.style.opacity=1-smooth(range(hp,.66,.80));
      // A própria janela da foto se aproxima; sua luz vira o papel da próxima cena.
      const scale=mix(1,mobile?10.8:9.2,focus);
      const tx=mix(0,mobile?-10:-22,focus);
      const ty=mix(0,mobile?4:5,focus);
      houseWindow.style.transform=`translate3d(${tx}vw,${ty}vh,0) scale(${scale})`;
      houseWindow.style.borderColor=`rgba(238,207,163,${mix(.3,0,focus)})`;
      houseWindow.style.boxShadow=`0 0 ${mix(70,0,focus)}px rgba(255,170,89,${mix(.12,0,focus)})`;
      houseLight.style.opacity=mix(.05,1,focus);
      housePhoto.style.filter=`saturate(${mix(1,.72,focus)}) brightness(${mix(1,.92,focus)})`;
    }

    // Só depois da luz ocupar a tela é que a prova social ganha presença.
    if(pp<.14){
      const reveal=smoother(range(pp,.04,.14));
      rating.style.opacity=reveal;
      rating.style.transform=`translateY(-50%) scale(${mix(.94,1,reveal)})`;
      reviews.style.opacity=0;
      ratingSub.style.opacity=reveal;
    }
  }

  function proofToLocation(){
    const pp=prog(proof), lp=prog(location);
    const prepare=smoother(range(pp,.76,.88));
    const dive=smoother(range(pp,.88,1));

    if(pp>.74){
      reviews.style.opacity=1-smooth(range(pp,.74,.84));
      ratingSub.style.opacity=1-smooth(range(pp,.76,.86));
      four.style.opacity=1-prepare;
      comma.style.opacity=1-prepare;
      star.style.opacity=1-prepare;
      // Primeiro isolamos o 7, depois a câmera entra na tinta do próprio algarismo.
      seven.style.transform=`translate3d(${mix(0,4,prepare)}vw,0,0) scale(${mix(1,1.16,prepare)*mix(1,18,dive)})`;
      seven.style.filter=`blur(${mix(0,1.2,dive)}px)`;
      proofStage.style.background=`rgb(${Math.round(mix(234,21,dive))},${Math.round(mix(223,17,dive))},${Math.round(mix(206,15,dive))})`;
    } else {
      seven.style.filter='';
      proofStage.style.background='';
    }

    // A localização só aparece depois do mergulho na tipografia terminar.
    if(lp<.13){
      const reveal=smoother(range(lp,.03,.13));
      locTitle.style.opacity=reveal;
      locTitle.style.transform=`translateY(-50%) translateX(${mix(-3,0,reveal)}vw)`;
      locMeta.style.opacity=reveal;
      routeMap.style.opacity=.84*reveal;
      routeLabel.style.opacity=0;
    }
  }

  function locationToOrder(){
    const lp=prog(location), op=prog(order);
    const draw=smoother(range(lp,.14,.58));
    const settle=smoother(range(lp,.56,.70));
    const exit=smoother(range(lp,.72,1));

    route.style.strokeDashoffset=880*(1-draw);
    pin.style.opacity=settle;
    pin.style.transform=`scale(${mix(.01,1,settle)*mix(1,95,exit)})`;
    routeLabel.style.opacity=settle*(1-exit);
    locTitle.style.opacity=1-smooth(range(lp,.74,.88));
    locMeta.style.opacity=1-smooth(range(lp,.74,.88));
    route.style.opacity=1-smooth(range(lp,.76,.94));
    routeMap.style.opacity=mix(.84,1,exit);

    // O ponto final da rota, já existente, torna-se o vermelho da cena de pedido.
    if(op<.18){
      const reveal=smoother(range(op,.06,.18));
      orderTitle.style.opacity=reveal;
      orderTitle.style.transform=`translateY(-50%) translateX(${mix(-3,0,reveal)}vw)`;
      returnBurger.style.opacity='0';
      orderLinks.style.opacity=.68*reveal;
    }
  }

  function orderFinish(){
    const op=prog(order);
    // Depois da entrada, devolvemos a animação de fechamento da v0.3 com uma entrada mais calma do burger.
    if(op>=.16){
      const b=smoother(range(op,.16,.46));
      returnBurger.style.opacity=b;
      returnBurger.style.transform=`translateY(-50%) translateX(${mix(7,0,b)}vw) scale(${mix(.62,.88,b)})`;
    }
  }

  function render(){
    ticking=false;
    heroToProducts();
    productsToHouse();
    houseToProof();
    proofToLocation();
    locationToOrder();
    orderFinish();
  }
  function request(){if(!ticking){ticking=true;requestAnimationFrame(render)}}
  addEventListener('scroll',request,{passive:true});
  addEventListener('resize',request);
  request();
})();