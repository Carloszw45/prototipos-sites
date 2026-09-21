(()=>{
  'use strict';
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const clamp=v=>Math.max(0,Math.min(1,v));
  const range=(p,a,b)=>clamp((p-a)/(b-a));
  const mix=(a,b,t)=>a+(b-a)*t;
  const smooth=t=>t*t*(3-2*t);
  const smoother=t=>t*t*t*(t*(t*6-15)+10);
  const prog=el=>{const r=el.getBoundingClientRect(),d=el.offsetHeight-innerHeight;return d<=0?0:clamp(-r.top/d)};
  const seam=el=>clamp((innerHeight-el.getBoundingClientRect().bottom)/innerHeight);
  const entering=el=>clamp((innerHeight-el.getBoundingClientRect().top)/innerHeight);

  const hero=$('#hero'),heroStage=$('#heroStage'),heroBurger=$('#heroBurger'),heroLayers=$$('#heroBurger .layer'),heroTitle=$('.title'),heroKicker=$('.kicker'),heroA=$('.a'),heroB=$('.b'),heroC=$('.c'),hint=$('.hint');
  const products=$('#produtos'),productsStage=$('#productsStage'),productStack=$('#productStack'),productLayers=$$('#productStack .mb'),pcs=$$('.p-copy'),productNo=$('.product-no'),menuLink=$('.menu-link');
  const house=$('#casa'),houseStage=$('#houseStage'),housePhoto=$('#housePhoto'),houseWindow=$('#houseWindow'),houseLight=$('.window-light'),houseCopy=$('.house-copy');
  const proof=$('#prova'),proofStage=$('#proofStage'),rating=$('#rating'),four=$('.rating .four'),comma=$('.rating .comma'),seven=$('.rating .seven'),star=$('.rating sup'),ratingSub=$('.rating-sub'),reviews=$('.reviews'),rvs=$$('.review');
  const location=$('#local'),locationStage=$('#locationStage'),routeMap=$('.route-map'),route=$('#route'),pin=$('#pin'),locTitle=$('.loc-title'),locMeta=$('.loc-meta'),routeLabel=$('.route-label');
  const order=$('#pedido'),orderTitle=$('.order-title'),returnBurger=$('#returnBurger'),orderLinks=$('.order-links'),ctaLine=$('.order-title a i');

  const heroOff=[-58,-42,-24,-6,14,31,49,67,84];
  const clone=(el,cls)=>{const c=el.cloneNode(true);c.removeAttribute('id');c.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));c.classList.add('sb9-fixed',cls);document.body.appendChild(c);return c};
  const heroBridge=clone(heroBurger,'sb9-hero');
  const ratingBridge=clone(rating,'sb9-rating');
  const ratingBridgeStar=ratingBridge.querySelector('sup');if(ratingBridgeStar)ratingBridgeStar.style.opacity='0';
  const productBridge=clone(productStack,'sb9-product');
  productBridge.querySelector('.product-no')?.remove();
  productBridge.querySelectorAll('.mb').forEach(x=>{x.style.opacity='1';x.style.transform='none'});
  const lightBridge=document.createElement('div');lightBridge.className='sb9-light';document.body.appendChild(lightBridge);
  const starBridge=document.createElement('div');starBridge.className='sb9-star';starBridge.textContent='★';document.body.appendChild(starBridge);
  const locTitleBridge=clone(locTitle,'sb9-loc-title');
  const orderTitleBridge=clone(orderTitle,'sb9-order-title');
  const mapBridge=routeMap.cloneNode(true);mapBridge.removeAttribute('aria-hidden');mapBridge.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));mapBridge.classList.add('sb9-map');
  const mbRoute=mapBridge.querySelector('.route'),mbPin=mapBridge.querySelector('.pin');
  if(mbRoute){mbRoute.style.strokeDashoffset='0';mbRoute.style.strokeWidth='5';mbRoute.style.stroke='#b63a31'}
  if(mbPin){mbPin.style.transform='scale(1)';mbPin.style.opacity='1'}
  document.body.appendChild(mapBridge);

  const mobile=()=>innerWidth<=760;
  const productPos=()=>mobile()?{x:.69*innerWidth,y:.66*innerHeight,s:.82}:{x:.725*innerWidth,y:.50*innerHeight,s:.92};
  const tablePos=()=>mobile()?{x:.30*innerWidth,y:.67*innerHeight,s:.56}:{x:.25*innerWidth,y:.68*innerHeight,s:.54};
  const pinPos=()=>{if(mobile()){const l=.10*innerWidth,t=.44*innerHeight,w=.92*innerWidth,h=.50*innerHeight;return{x:l+w*655/700,y:t+h*148/540}}const w=.46*innerWidth,h=.72*innerHeight,l=.51*innerWidth,t=.14*innerHeight;return{x:l+w*655/700,y:t+h*148/540}};
  const place=(el,x,y,s=1)=>{el.style.left=`${x}px`;el.style.top=`${y}px`;el.style.transform=`translate(-50%,-50%) scale(${s})`};

  function renderHero(p){
    heroStage.style.setProperty('--p',p.toFixed(4));
    const intro=smooth(range(p,0,.12)),move=smooth(range(p,.12,.28)),split=smooth(range(p,.28,.50)),detail=smooth(range(p,.50,.66)),join=smooth(range(p,.66,.80));
    const m=mobile(),x=m?mix(0,-3,move):mix(0,18,move),y=m?mix(4,-6,move):mix(3,-7,move);
    const scale=mix(.72,1,intro)*mix(1,m?1.16:1.27,detail*(1-join));
    heroBurger.style.opacity=String(intro);heroBurger.style.transform=`translate3d(calc(-50% + ${x}vw),calc(-50% + ${y}vh),0) scale(${scale})`;
    const sep=split*(1-join);heroLayers.forEach((el,i)=>{const xx=sep*(m?.14:(i%2?.28:-.2))*Math.abs(heroOff[i]),yy=sep*heroOff[i]*(m?.62:.58),rot=sep*((i-4)*(m?.25:.4));el.style.transform=`translate3d(${xx}px,${yy}px,0) rotate(${rot}deg)`});
    const ai=smooth(range(p,.10,.18))*(1-smooth(range(p,.26,.34))),bi=smooth(range(p,.30,.38))*(1-smooth(range(p,.48,.56))),ci=smooth(range(p,.52,.59))*(1-smooth(range(p,.68,.76)));
    heroA.style.opacity=String(ai);heroB.style.opacity=String(bi);heroC.style.opacity=String(ci);heroA.style.transform=`translateY(${mix(26,0,ai)}px)`;heroB.style.transform=`translateY(${mix(30,0,bi)}px)`;heroC.style.transform=`translateY(${mix(24,0,ci)}px)`;hint.style.opacity=String(1-smooth(range(p,.03,.14)));
    heroTitle.style.opacity='';heroKicker.style.opacity='';heroStage.style.background='radial-gradient(circle at 50% 58%,rgba(164,42,33,.18),transparent 32%),linear-gradient(#100c09,#0b0806)';
    if(p>.80){
      const t=smoother(range(p,.80,1)),dest=productPos(),sx=.5*innerWidth,sy=(m?.60:.55)*innerHeight;
      heroBurger.style.transform=`translate3d(calc(-50% + ${mix(sx,dest.x,t)-.5*innerWidth}px),calc(-50% + ${mix(sy,dest.y,t)-.55*innerHeight}px),0) scale(${mix(1,dest.s,t)})`;
      heroTitle.style.opacity=String(.45*(1-smooth(range(p,.83,.98))));heroKicker.style.opacity=String(1-smooth(range(p,.84,.98)));hint.style.opacity='0';
      heroStage.style.background=`rgb(${Math.round(mix(12,124,t))},${Math.round(mix(9,37,t))},${Math.round(mix(7,29,t))})`;
    }
  }

  function renderProducts(p){
    const m=mobile(),intro=smooth(range(p,0,.13)),s2=smooth(range(p,.32,.43)),s3=smooth(range(p,.60,.71)),out=smooth(range(p,.82,.94));
    productsStage.style.background='#7c251d';productStack.style.opacity='1';productStack.style.left='';productStack.style.top='';productStack.style.right='';productNo.style.opacity='.60';menuLink.style.opacity='1';
    pcs[0].style.opacity=String(intro*(1-smooth(range(p,.27,.37))));pcs[1].style.opacity=String(s2*(1-smooth(range(p,.54,.64))));pcs[2].style.opacity=String(s3*(1-smooth(range(p,.80,.90))));
    pcs[0].style.transform=`translateY(${mix(24,0,intro)}px)`;pcs[1].style.transform=`translateY(${mix(26,0,s2)}px)`;pcs[2].style.transform=`translateY(${mix(26,0,s3)}px)`;
    const drift=m?mix(0,-4,p):mix(0,-9,p),base=m?.90:1,sc=base*mix(.88,1.04,smooth(range(p,.08,.68)));
    productStack.style.transform=`translateY(-50%) translate3d(${drift}vw,${mix(0,m?2:-2,p)}vh,0) scale(${sc})`;
    const separate=smooth(range(p,.36,.47))*(1-smooth(range(p,.57,.69))),offs=[-24,-16,-10,-4,4,10,17];
    productLayers.forEach((el,i)=>{el.style.opacity='1';el.style.transform=`translateY(${offs[i]*separate}px)`});
    productNo.textContent='CARDÁPIO ARTESANAL';
    if(p>.80){
      const t=smoother(range(p,.80,1)),a=productPos(),b={x:innerWidth*(m?.58:.61),y:innerHeight*(m?.68:.61),s:m?.72:.70};
      productLayers.forEach(el=>el.style.transform='none');pcs.forEach(el=>el.style.opacity=String((1-out)*parseFloat(el.style.opacity||'1')));productNo.style.opacity=String(.6*(1-t));menuLink.style.opacity=String(1-t);
      productStack.style.transform=`translate(-50%,-50%) scale(${mix(a.s,b.s,t)})`;productStack.style.left=`${mix(a.x,b.x,t)}px`;productStack.style.top=`${mix(a.y,b.y,t)}px`;productStack.style.right='auto';
      productsStage.style.background=`rgb(${Math.round(mix(124,40,t))},${Math.round(mix(37,26,t))},${Math.round(mix(29,18,t))})`;
    }
  }

  function renderHouse(p){
    const m=mobile(),enter=smooth(range(p,0,.16)),focus=smooth(range(p,.18,.62));
    houseStage.style.background='';housePhoto.style.opacity=String(enter);housePhoto.style.transform=`translate3d(${mix(m?-8:10,0,enter)}vw,0,0) scale(${mix(.82,1,enter)*mix(1,m?1.06:1.12,focus)})`;housePhoto.style.filter='';
    houseCopy.style.opacity=String(enter*(1-smooth(range(p,.70,.84))));houseWindow.style.transform='none';houseLight.style.opacity='.05';
  }

  function renderProof(p){
    const enter=smooth(range(p,0,.16)),r1=smooth(range(p,.20,.32))*(1-smooth(range(p,.48,.58))),r2=smooth(range(p,.52,.64))*(1-smooth(range(p,.78,.86)));
    proofStage.style.background='#eadfce';rating.style.position='';rating.style.zIndex='';rating.style.left='';rating.style.top='';rating.style.opacity=String(enter);rating.style.transform=`translateY(-50%) scale(${mix(.86,1,enter)})`;
    rvs[0].style.opacity=String(r1);rvs[1].style.opacity=String(r2);rvs[0].style.transform=`translateY(calc(-50% + ${mix(28,0,smooth(range(p,.20,.32)))}px))`;rvs[1].style.transform=`translateY(calc(-50% + ${mix(28,0,smooth(range(p,.52,.64)))}px))`;
    four.style.opacity='1';comma.style.opacity='1';seven.style.opacity='1';star.style.opacity='1';seven.style.transform='none';ratingSub.style.opacity=String(enter);reviews.style.opacity='1';
    if(p>.80){const t=smooth(range(p,.80,.96));reviews.style.opacity=String(1-t);ratingSub.style.opacity=String(1-smooth(range(p,.86,.97)))}
  }

  function renderLocation(p){
    const enter=smooth(range(p,0,.12)),draw=smooth(range(p,.16,.58)),finish=smooth(range(p,.58,.72));
    location.style.background='#15110f';locationStage.style.background='#15110f';locTitle.style.opacity=String(enter);locTitle.style.transform=`translateY(-50%) translateX(${mix(-4,0,enter)}vw)`;locMeta.style.opacity=String(enter);routeLabel.style.opacity=String(finish);routeMap.style.opacity='.84';
    route.style.strokeDashoffset=String(880*(1-draw));route.style.strokeWidth='5';route.style.stroke='#b63a31';route.style.opacity='1';pin.style.opacity='1';pin.style.transform=`scale(${finish})`;
    if(p>.68){const t=smoother(range(p,.68,1));locationStage.style.background=`rgb(${Math.round(mix(21,142,t))},${Math.round(mix(17,33,t))},${Math.round(mix(15,27,t))})`;locTitle.style.opacity=String(1-smooth(range(t,.30,.95)));locMeta.style.opacity=String(1-smooth(range(t,.36,.95)));routeLabel.style.opacity=String(finish*(1-smooth(range(t,.15,.82))));routeMap.style.opacity=String(mix(.84,.64,t))}
  }

  function renderOrder(p){
    const enter=smooth(range(p,0,.18)),burger=smooth(range(p,.12,.46)),settle=smooth(range(p,.46,.68));
    orderTitle.style.opacity=String(enter);orderTitle.style.transform=mobile()?`translateX(${mix(-3,0,enter)}vw)`:`translateY(-50%) translateX(${mix(-3,0,enter)}vw)`;returnBurger.style.opacity=String(burger);returnBurger.style.transform=`translateY(-50%) translateX(${mix(7,0,burger)}vw) scale(${mix(.62,.88,burger)*mix(1,1.04,settle)})`;orderLinks.style.opacity=String(.68*enter);if(ctaLine){ctaLine.style.transform=`scaleX(${smooth(range(p,.04,.16))})`;ctaLine.style.transformOrigin='left center'}
  }

  function resetBridges(){
    heroBridge.style.opacity='0';ratingBridge.style.opacity='0';productBridge.style.opacity='0';lightBridge.style.opacity='0';lightBridge.style.background='transparent';starBridge.style.opacity='0';locTitleBridge.style.opacity='0';orderTitleBridge.style.opacity='0';mapBridge.style.opacity='0';
  }

  function renderTransitions(hp,pp,ap,rp,lp,op){
    const hs=seam(hero),ps=seam(products),as=seam(house),rs=seam(proof),ls=seam(location),he=entering(house),re=entering(proof),le=entering(location),oe=entering(order),m=mobile();
    if(hs>0&&hs<1){const p=productPos();place(heroBridge,p.x,p.y,p.s);heroBridge.style.opacity='1';heroBurger.style.opacity='0';productStack.style.opacity='0';heroStage.style.background='#7c251d'}
    if(ps>0&&ps<1){const t=smoother(ps),a={x:innerWidth*(m?.58:.61),y:innerHeight*(m?.68:.61),s:m?.72:.70},b=tablePos();place(productBridge,mix(a.x,b.x,t),mix(a.y,b.y,t),mix(a.s,b.s,t));productBridge.style.opacity='1';productStack.style.opacity='0';housePhoto.style.opacity=String(smooth(range(he,.18,.90)));productsStage.style.background='#281a12'}
    if(he>.99&&ap<.14){const t=smoother(range(ap,0,.14)),b=tablePos();place(productBridge,b.x,mix(b.y,b.y+innerHeight*.015,t),mix(b.s,b.s*.90,t));productBridge.style.opacity=String(1-smooth(range(ap,.08,.14)));housePhoto.style.opacity=String(mix(.72,1,smooth(range(ap,0,.10))));houseCopy.style.opacity=String(smooth(range(ap,.08,.16)))}
    if(ap>.74&&as===0){const t=smoother(range(ap,.74,1)),wr=houseWindow.getBoundingClientRect(),cx=wr.left+wr.width/2,cy=wr.top+wr.height/2,diag=Math.hypot(innerWidth,innerHeight),rad=mix(55,diag*.42,t),alpha=smooth(range(t,.08,1))*.58;lightBridge.style.opacity='1';lightBridge.style.background=`radial-gradient(circle ${rad}px at ${cx}px ${cy}px,rgba(234,223,206,${alpha}) 0%,rgba(234,223,206,${alpha*.70}) 46%,rgba(234,223,206,0) 100%)`;housePhoto.style.filter=`saturate(${mix(1,.82,t)}) brightness(${mix(1,1.10,t)})`;houseStage.style.background=`rgb(${Math.round(mix(40,234,t))},${Math.round(mix(26,223,t))},${Math.round(mix(18,206,t))})`}
    if(as>0&&as<1){const t=smoother(as);lightBridge.style.opacity='1';lightBridge.style.background=`rgba(234,223,206,${mix(.58,.98,t)})`;housePhoto.style.opacity=String(1-smooth(range(t,.20,.88)));houseStage.style.background='#eadfce';rating.style.opacity=String(.62*smooth(range(re,.30,.82)));ratingSub.style.opacity=String(.36*smooth(range(re,.48,.90)))}
    if(re>.99&&rp<.10){const t=smoother(range(rp,0,.10));lightBridge.style.opacity=String(1-t);lightBridge.style.background='#eadfce';rating.style.opacity=String(.22+.78*smooth(range(rp,0,.065)));ratingSub.style.opacity=String(smooth(range(rp,.01,.075)))}
    if(rs>0&&rs<1){
      location.style.background='#eadfce';locationStage.style.background='transparent';
      const t=smoother(rs),target=pinPos(),sr=star.getBoundingClientRect(),sx=sr.left+sr.width/2,sy=sr.top+sr.height/2,x=mix(sx,target.x,t),y=mix(sy,target.y,t);
      const bgR=Math.round(mix(234,21,t)),bgG=Math.round(mix(223,17,t)),bgB=Math.round(mix(206,15,t));
      lightBridge.style.opacity='1';lightBridge.style.background=`rgb(${bgR},${bgG},${bgB})`;
      rating.style.opacity='0';
      ratingBridge.style.opacity=String(1-smooth(range(t,.14,.56)));ratingBridge.style.transform=`translateY(-50%) translateX(${mix(0,-2.5,t)}vw) scale(${mix(1,.94,t)})`;
      star.style.opacity='0';four.style.opacity='1';comma.style.opacity='1';seven.style.opacity='1';
      starBridge.style.opacity='1';starBridge.style.fontSize=getComputedStyle(star).fontSize;starBridge.style.left=`${x}px`;starBridge.style.top=`${y}px`;starBridge.style.transform=`translate(-50%,-50%) scale(${mix(1,.70,t)}) rotate(${mix(0,12,t)}deg)`;starBridge.style.color=`rgb(${Math.round(mix(23,182,t))},${Math.round(mix(17,58,t))},${Math.round(mix(14,49,t))})`;
      const mw=m?.92*innerWidth:.46*innerWidth,mh=m?.50*innerHeight:.72*innerHeight,ml=m?.10*innerWidth:.51*innerWidth,mt=m?.44*innerHeight:.14*innerHeight;
      mapBridge.style.left=`${ml}px`;mapBridge.style.top=`${mt}px`;mapBridge.style.width=`${mw}px`;mapBridge.style.height=`${mh}px`;mapBridge.style.opacity=String(.46*smooth(range(t,.38,.84)));mapBridge.style.transform='none';
      if(mbRoute)mbRoute.style.opacity='0';if(mbPin)mbPin.style.opacity='0';
      const lt=smooth(range(t,.50,.84));locTitleBridge.style.opacity=String(.92*lt);locTitleBridge.style.transform=m?`translateY(-50%) translateX(${mix(-2,0,lt)}vw)`:`translateY(-50%) translateX(${mix(-3,0,lt)}vw)`;
    }
    if(le>.99&&lp<.11){
      const t=smoother(range(lp,0,.11)),target=pinPos();lightBridge.style.opacity=String(1-t);lightBridge.style.background='#15110f';
      starBridge.style.opacity=String(1-smooth(range(t,.05,.72)));starBridge.style.fontSize=getComputedStyle(star).fontSize;starBridge.style.left=`${target.x}px`;starBridge.style.top=`${target.y}px`;starBridge.style.transform='translate(-50%,-50%) scale(.70) rotate(12deg)';starBridge.style.color='#b63a31';
      locTitleBridge.style.opacity=String(1-t);
      const mw=m?.92*innerWidth:.46*innerWidth,mh=m?.50*innerHeight:.72*innerHeight,ml=m?.10*innerWidth:.51*innerWidth,mt=m?.44*innerHeight:.14*innerHeight;mapBridge.style.left=`${ml}px`;mapBridge.style.top=`${mt}px`;mapBridge.style.width=`${mw}px`;mapBridge.style.height=`${mh}px`;mapBridge.style.opacity=String(.42*(1-t));mapBridge.style.transform='none';if(mbRoute)mbRoute.style.opacity='0';if(mbPin)mbPin.style.opacity='0';
      pin.style.opacity=String(t);pin.style.transform=`scale(${t})`;
    }
    if(ls>0&&ls<1){
      const t=smoother(ls),r=routeMap.getBoundingClientRect();mapBridge.style.left=`${r.left}px`;mapBridge.style.top=`${r.top}px`;mapBridge.style.width=`${r.width}px`;mapBridge.style.height=`${r.height}px`;mapBridge.style.opacity=String(.64*(1-smooth(range(t,.24,.92))));mapBridge.style.transform=`translate3d(${mix(0,-innerWidth*.015,t)}px,${mix(0,-innerHeight*.018,t)}px,0) scale(${mix(1,.98,t)})`;if(mbRoute)mbRoute.style.opacity='1';if(mbPin)mbPin.style.opacity='1';
      locationStage.style.background='#8e211b';
      const ot=smooth(range(t,.30,.82));orderTitleBridge.style.opacity=String(.88*ot);orderTitleBridge.style.transform=m?`translateX(${mix(-2,0,ot)}vw)`:`translateY(-50%) translateX(${mix(-2,0,ot)}vw)`;
    }
    if(oe>.99&&op<.12){const t=smoother(range(op,0,.10)),same=m?'translateX(0)':'translateY(-50%) translateX(0)';orderTitleBridge.style.opacity=String(1-t);orderTitleBridge.style.transform=same;orderTitle.style.opacity=String(t);orderTitle.style.transform=same;orderLinks.style.opacity=String(.68*smooth(range(op,.02,.10)));returnBurger.style.opacity='0'}
  }

  let ticking=false;
  function render(){
    ticking=false;resetBridges();
    const hp=prog(hero),pp=prog(products),ap=prog(house),rp=prog(proof),lp=prog(location),op=prog(order);
    renderHero(hp);renderProducts(pp);renderHouse(ap);renderProof(rp);renderLocation(lp);renderOrder(op);renderTransitions(hp,pp,ap,rp,lp,op);
  }
  const req=()=>{if(!ticking){ticking=true;requestAnimationFrame(render)}};
  addEventListener('scroll',req,{passive:true});addEventListener('resize',req);render();
})();