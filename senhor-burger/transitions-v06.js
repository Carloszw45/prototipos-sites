(()=>{
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const clamp=v=>Math.max(0,Math.min(1,v));
  const range=(p,a,b)=>clamp((p-a)/(b-a));
  const mix=(a,b,t)=>a+(b-a)*t;
  const smooth=t=>t*t*(3-2*t);
  const smoother=t=>t*t*t*(t*(t*6-15)+10);
  const prog=el=>{const r=el.getBoundingClientRect(),d=el.offsetHeight-innerHeight;return d<=0?0:clamp(-r.top/d)};

  const hero=$('#hero'), heroStage=$('#heroStage'), heroBurger=$('#heroBurger');
  const products=$('#produtos'), productsStage=$('#productsStage'), productStack=$('#productStack'), productLayers=$$('#productStack .mb'), pcs=$$('.p-copy'), productNo=$('.product-no'), menuLink=$('.menu-link');
  const house=$('#casa'), houseStage=$('#houseStage'), housePhoto=$('#housePhoto'), houseWindow=$('#houseWindow'), houseLight=$('.window-light'), houseCopy=$('.house-copy');
  const proof=$('#prova'), proofStage=$('#proofStage'), rating=$('#rating'), four=$('.rating .four'), comma=$('.rating .comma'), seven=$('.rating .seven'), star=$('.rating sup'), ratingSub=$('.rating-sub'), reviews=$('.reviews');
  const location=$('#local'), locationStage=$('#locationStage'), route=$('#route'), pin=$('#pin'), locTitle=$('.loc-title'), locMeta=$('.loc-meta'), routeLabel=$('.route-label'), routeMap=$('.route-map');
  const order=$('#pedido'), orderStage=$('#orderStage'), orderTitle=$('.order-title'), returnBurger=$('#returnBurger'), orderLinks=$('.order-links');

  document.title='Senhor Burger — Protótipo v0.6';
  const footerVersion=$('.footer span'); if(footerVersion) footerVersion.textContent='Protótipo de experiência v0.6';

  const style=document.createElement('style');
  style.textContent=`
    .sb-bridge{position:fixed;pointer-events:none;z-index:45;will-change:transform,opacity,left,top,width,height,background,border-radius}
    .sb-burger-bridge{width:min(48vw,560px);aspect-ratio:1.15/1;left:50%;top:55%;transform-origin:center}
    .sb-window-bridge{background:#eadfce;border:1px solid rgba(238,207,163,.3);box-shadow:0 0 70px rgba(255,170,89,.12);opacity:0}
    .sb-seven-bridge{font-weight:950;line-height:.7;letter-spacing:-.095em;color:#17110e;opacity:0;transform-origin:center center}
    .sb-table-glow{position:fixed;pointer-events:none;z-index:29;height:18vh;border-radius:50% 50% 0 0;background:linear-gradient(#4e2c1c,#1c110c);opacity:0;will-change:transform,opacity,left,top,width,height}
    @media(max-width:760px){.sb-burger-bridge{width:min(94vw,510px);top:60%}}
  `;
  document.head.appendChild(style);

  // 1) Hero -> Produtos: o mesmo burger cruza a dobra; sem zoom até “estourar” a tela.
  const heroBridge=heroBurger.cloneNode(true);
  heroBridge.removeAttribute('id');
  heroBridge.classList.add('sb-bridge','sb-burger-bridge');
  heroBridge.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
  document.body.appendChild(heroBridge);

  // 2) Produtos -> Casa: uma sombra/mesa nasce sob o burger e continua na cena seguinte.
  const tableBridge=document.createElement('div');
  tableBridge.className='sb-table-glow';
  document.body.appendChild(tableBridge);

  // 3) Casa -> Prova: a janela clara é quem ocupa a tela.
  const windowBridge=document.createElement('div');
  windowBridge.className='sb-bridge sb-window-bridge';
  document.body.appendChild(windowBridge);

  // 4) Prova -> Localização: o 7 vira gesto/linha; não vira tela preta.
  const sevenBridge=seven.cloneNode(true);
  sevenBridge.className='sb-bridge sb-seven-bridge';
  sevenBridge.removeAttribute('style');
  document.body.appendChild(sevenBridge);

  let ticking=false;

  function heroToProducts(){
    const hp=prog(hero), pp=prog(products), mobile=innerWidth<=760;
    const out=smoother(range(hp,.86,1));
    const inP=smoother(range(pp,0,.14));

    // V0.3 permanece visualmente intacta até os últimos 14% da cena.
    if(hp>.855){
      const startX=mobile?-3:18, startY=mobile?-6:-7;
      const endX=mobile?18:22, endY=mobile?7:-2;
      const scale=mix(1.02,mobile?.95:.92,out);
      heroBurger.style.opacity=1-out;
      heroStage.style.background=`rgb(${Math.round(mix(12,124,out))},${Math.round(mix(9,37,out))},${Math.round(mix(7,29,out))})`;
      heroBridge.style.opacity=out*(1-inP);
      heroBridge.style.transform=`translate3d(calc(-50% + ${mix(startX,endX,out)}vw),calc(-50% + ${mix(startY,endY,out)}vh),0) scale(${scale})`;
    } else {
      heroBridge.style.opacity=0;
      heroStage.style.background='';
    }

    if(pp<.18){
      productStack.style.opacity=smoother(range(pp,.06,.18));
      pcs.forEach(el=>el.style.opacity='0');
      productNo.style.opacity=smoother(range(pp,.10,.20));
      menuLink.style.opacity=smoother(range(pp,.12,.22));
    } else {
      productStack.style.opacity='';
      productNo.style.opacity='';
      menuLink.style.opacity='';
    }
  }

  function productsToHouse(){
    const pp=prog(products), hp=prog(house), mobile=innerWidth<=760;
    const out=smoother(range(pp,.82,1));
    const land=smoother(range(hp,0,.20));

    if(pp>.81){
      pcs.forEach(el=>el.style.opacity='0');
      productNo.style.opacity=1-out;
      menuLink.style.opacity=1-out;

      // O burger é “colocado” para baixo, sem zoom agressivo.
      const x=mix(mobile?-4:-10,mobile?-11:-20,out);
      const y=mix(mobile?2:-3,mobile?18:16,out);
      const sc=mix(mobile?1.02:1.04,mobile?.72:.64,out);
      productStack.style.transform=`translateY(-50%) translate3d(${x}vw,${y}vh,0) scale(${sc})`;

      // O vermelho do produto perde saturação e converge para o marrom da casa.
      productsStage.style.background=`rgb(${Math.round(mix(124,40,out))},${Math.round(mix(37,26,out))},${Math.round(mix(29,18,out))})`;

      // A “mesa” nasce exatamente sob o produto e continua para a casa.
      tableBridge.style.opacity=smooth(range(out,.18,.88))*(1-land);
      tableBridge.style.left=mobile?'8vw':'39vw';
      tableBridge.style.top=mobile?'73vh':'68vh';
      tableBridge.style.width=mobile?'84vw':'48vw';
      tableBridge.style.transform=`scaleX(${mix(.25,1,out)}) translateY(${mix(14,0,out)}px)`;
    } else {
      tableBridge.style.opacity=0;
      productsStage.style.background='';
    }

    if(hp<.22){
      housePhoto.style.opacity=smoother(range(hp,.02,.18));
      houseCopy.style.opacity='0';
      tableBridge.style.opacity=(1-land)*.86;
      tableBridge.style.left=mobile?'6vw':'7vw';
      tableBridge.style.top=mobile?'63vh':'69vh';
      tableBridge.style.width=mobile?'88vw':'55vw';
      tableBridge.style.transform=`scaleX(${mix(.82,1,land)})`;
    }
  }

  function houseToProof(){
    const hp=prog(house), pp=prog(proof);
    const t=smoother(range(hp,.76,1));

    if(hp>.75){
      // Anula o zoom bruto da v0.3 e usa a geometria real da janela como origem.
      houseWindow.style.transform='none';
      houseCopy.style.opacity=1-smooth(range(hp,.72,.84));
      const r=houseWindow.getBoundingClientRect();
      const L=mix(r.left,0,t), T=mix(r.top,0,t), W=mix(r.width,innerWidth,t), H=mix(r.height,innerHeight,t);
      windowBridge.style.opacity=smooth(range(t,.04,.98));
      windowBridge.style.left=`${L}px`; windowBridge.style.top=`${T}px`; windowBridge.style.width=`${W}px`; windowBridge.style.height=`${H}px`;
      windowBridge.style.borderRadius=`${mix(2,0,t)}px`;
      windowBridge.style.boxShadow=`0 0 ${mix(70,0,t)}px rgba(255,170,89,${mix(.12,0,t)})`;
      houseWindow.style.opacity=1-smooth(range(t,.04,.35));
      housePhoto.style.filter=`saturate(${mix(1,.78,t)}) brightness(${mix(1,.94,t)})`;
    } else {
      windowBridge.style.opacity=0;
      houseWindow.style.opacity='';
      housePhoto.style.filter='';
    }

    if(pp<.16){
      const reveal=smoother(range(pp,.04,.16));
      rating.style.opacity=reveal;
      rating.style.transform=`translateY(-50%) scale(${mix(.96,1,reveal)})`;
      ratingSub.style.opacity=reveal;
      reviews.style.opacity=0;
      windowBridge.style.opacity=1-reveal;
    }
  }

  function proofToLocation(){
    const pp=prog(proof), lp=prog(location), mobile=innerWidth<=760;
    const prep=smoother(range(pp,.78,.90));
    const travel=smoother(range(pp,.90,1));

    if(pp>.77){
      reviews.style.opacity=1-smooth(range(pp,.74,.84));
      ratingSub.style.opacity=1-smooth(range(pp,.76,.86));
      four.style.opacity=1-prep;
      comma.style.opacity=1-prep;
      star.style.opacity=1-prep;

      // Fundo escurece por continuidade tonal, não por objeto cobrindo a tela.
      const d=smoother(range(pp,.86,1));
      proofStage.style.background=`rgb(${Math.round(mix(234,21,d))},${Math.round(mix(223,17,d))},${Math.round(mix(206,15,d))})`;

      const r=seven.getBoundingClientRect();
      sevenBridge.style.opacity=prep*(1-smooth(range(travel,.72,1)));
      sevenBridge.style.left=`${r.left}px`; sevenBridge.style.top=`${r.top}px`;
      sevenBridge.style.fontSize=getComputedStyle(seven).fontSize;
      sevenBridge.style.width=`${Math.max(r.width,1)}px`; sevenBridge.style.height=`${Math.max(r.height,1)}px`;
      seven.style.opacity=1-prep;

      // O 7 cruza para a área onde a rota nasce e vira um gesto vermelho menor.
      const dx=mobile?mix(0,innerWidth*.10,travel):mix(0,innerWidth*.27,travel);
      const dy=mobile?mix(0,innerHeight*.30,travel):mix(0,innerHeight*.12,travel);
      sevenBridge.style.color=`rgb(${Math.round(mix(23,182,travel))},${Math.round(mix(17,58,travel))},${Math.round(mix(14,49,travel))})`;
      sevenBridge.style.transform=`translate3d(${dx}px,${dy}px,0) rotate(${mix(0,-26,travel)}deg) scale(${mix(1,.34,travel)})`;
    } else {
      sevenBridge.style.opacity=0;
      proofStage.style.background='';
      seven.style.opacity='';
    }

    if(lp<.16){
      const reveal=smoother(range(lp,.03,.16));
      locTitle.style.opacity=reveal;
      locTitle.style.transform=`translateY(-50%) translateX(${mix(-3,0,reveal)}vw)`;
      locMeta.style.opacity=reveal;
      routeMap.style.opacity=.84*reveal;
      routeLabel.style.opacity=0;
      sevenBridge.style.opacity=(1-reveal)*.5;
    }
  }

  function locationToOrder(){
    const lp=prog(location), op=prog(order);
    const draw=smoother(range(lp,.14,.60));
    const finish=smoother(range(lp,.56,.72));
    const exit=smoother(range(lp,.80,1));

    route.style.strokeDashoffset=880*(1-draw);
    pin.style.opacity=finish*(1-exit);
    pin.style.transform=`scale(${mix(.01,1,finish)*mix(1,1.35,exit)})`;
    routeLabel.style.opacity=finish*(1-exit);

    // Em vez do pin explodir, a própria cena muda de temperatura até o vermelho do pedido.
    if(lp>.79){
      locationStage.style.background=`rgb(${Math.round(mix(21,142,exit))},${Math.round(mix(17,33,exit))},${Math.round(mix(15,27,exit))})`;
      locTitle.style.opacity=1-smooth(range(exit,.08,.72));
      locMeta.style.opacity=1-smooth(range(exit,.08,.72));
      routeMap.style.opacity=mix(.84,.10,exit);
    } else {
      locationStage.style.background='';
    }

    if(op<.18){
      const reveal=smoother(range(op,.05,.18));
      orderStage.style.opacity=1;
      orderTitle.style.opacity=reveal;
      orderTitle.style.transform=`translateY(-50%) translateX(${mix(-3,0,reveal)}vw)`;
      returnBurger.style.opacity=0;
      orderLinks.style.opacity=.68*reveal;
    }
  }

  function orderFinish(){
    const op=prog(order);
    if(op>=.16){
      const b=smoother(range(op,.16,.50));
      returnBurger.style.opacity=b;
      returnBurger.style.transform=`translateY(-50%) translateX(${mix(6,0,b)}vw) scale(${mix(.68,.88,b)})`;
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