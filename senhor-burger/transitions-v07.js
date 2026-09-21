(()=>{
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const clamp=v=>Math.max(0,Math.min(1,v));
  const range=(p,a,b)=>clamp((p-a)/(b-a));
  const mix=(a,b,t)=>a+(b-a)*t;
  const smooth=t=>t*t*(3-2*t);
  const smoother=t=>t*t*t*(t*(t*6-15)+10);
  const prog=el=>{const r=el.getBoundingClientRect(),d=el.offsetHeight-innerHeight;return d<=0?0:clamp(-r.top/d)};
  const seam=el=>clamp((innerHeight-el.getBoundingClientRect().bottom)/innerHeight);
  const entering=el=>clamp((innerHeight-el.getBoundingClientRect().top)/innerHeight);

  const hero=$('#hero'),heroStage=$('#heroStage'),heroBurger=$('#heroBurger'),heroTitle=$('.title'),heroKicker=$('.kicker'),hint=$('.hint');
  const products=$('#produtos'),productsStage=$('#productsStage'),productStack=$('#productStack'),productLayers=$$('#productStack .mb'),productCopy=$('.product-copy'),productNo=$('.product-no'),menuLink=$('.menu-link');
  const house=$('#casa'),houseStage=$('#houseStage'),housePhoto=$('#housePhoto'),houseWindow=$('#houseWindow'),houseCopy=$('.house-copy');
  const proof=$('#prova'),proofStage=$('#proofStage'),rating=$('#rating'),four=$('.rating .four'),comma=$('.rating .comma'),seven=$('.rating .seven'),star=$('.rating sup'),ratingSub=$('.rating-sub'),reviews=$('.reviews');
  const location=$('#local'),locationStage=$('#locationStage'),routeMap=$('.route-map'),route=$('#route'),pin=$('#pin'),locTitle=$('.loc-title'),locMeta=$('.loc-meta'),routeLabel=$('.route-label');
  const order=$('#pedido'),orderTitle=$('.order-title'),returnBurger=$('#returnBurger'),orderLinks=$('.order-links'),ctaLine=$('.order-title a i');

  document.title='Senhor Burger — Protótipo v0.8';
  const footerVersion=$('.footer span');if(footerVersion)footerVersion.textContent='Protótipo de experiência v0.8';

  const css=document.createElement('style');
  css.textContent=`
    .sb13-fixed{position:fixed!important;right:auto!important;bottom:auto!important;pointer-events:none;z-index:46;will-change:transform,opacity,left,top,width,height,filter}
    .sb13-hero{width:min(48vw,560px);aspect-ratio:1.15/1;transform-origin:center}
    .sb13-product{width:min(45vw,590px);aspect-ratio:1.05/1;transform-origin:center}
    .sb13-light{position:fixed;z-index:45;inset:0;pointer-events:none;opacity:0;background:transparent;will-change:opacity,background}
    .sb13-star{position:fixed;z-index:48;pointer-events:none;font-weight:900;line-height:1;opacity:0;transform-origin:center;will-change:left,top,transform,opacity,color}
    .sb13-map{position:fixed!important;right:auto!important;top:auto!important;z-index:44;pointer-events:none;opacity:0;will-change:opacity,transform}
    @media(max-width:760px){.sb13-hero{width:min(94vw,510px)}.sb13-product{width:92vw}}
  `;
  document.head.appendChild(css);

  const clone=(el,cls)=>{const c=el.cloneNode(true);c.removeAttribute('id');c.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));c.classList.add('sb13-fixed',cls);document.body.appendChild(c);return c};
  const heroBridge=clone(heroBurger,'sb13-hero');
  const productBridge=clone(productStack,'sb13-product');
  productBridge.querySelector('.product-no')?.remove();
  productBridge.querySelectorAll('.mb').forEach(x=>{x.style.opacity='1';x.style.transform='none'});
  const lightBridge=document.createElement('div');lightBridge.className='sb13-light';document.body.appendChild(lightBridge);
  const starBridge=document.createElement('div');starBridge.className='sb13-star';starBridge.textContent='★';document.body.appendChild(starBridge);
  const mapBridge=routeMap.cloneNode(true);mapBridge.removeAttribute('aria-hidden');mapBridge.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));mapBridge.classList.add('sb13-map');
  const mbRoute=mapBridge.querySelector('.route'),mbPin=mapBridge.querySelector('.pin');
  if(mbRoute){mbRoute.style.strokeDashoffset='0';mbRoute.style.strokeWidth='5';mbRoute.style.stroke='#b63a31'}
  if(mbPin){mbPin.style.transform='scale(1)';mbPin.style.opacity='1'}
  document.body.appendChild(mapBridge);

  const productPos=()=>innerWidth<=760?{x:.73*innerWidth,y:.66*innerHeight,s:.92}:{x:.725*innerWidth,y:.50*innerHeight,s:1.00};
  const tablePos=()=>innerWidth<=760?{x:.30*innerWidth,y:.67*innerHeight,s:.56}:{x:.25*innerWidth,y:.68*innerHeight,s:.54};
  const pinPos=()=>{if(innerWidth<=760){const l=.10*innerWidth,t=.44*innerHeight,w=.92*innerWidth,h=.50*innerHeight;return{x:l+w*655/700,y:t+h*148/540}}const w=.46*innerWidth,h=.72*innerHeight,l=.51*innerWidth,t=.14*innerHeight;return{x:l+w*655/700,y:t+h*148/540}};
  const place=(el,x,y,s=1)=>{el.style.left=`${x}px`;el.style.top=`${y}px`;el.style.transform=`translate(-50%,-50%) scale(${s})`};
  const resetInline=()=>{
    productStack.style.opacity='';productCopy.style.opacity='';menuLink.style.opacity='';seven.style.opacity='';pin.style.opacity='';
    if(ctaLine){ctaLine.style.transform='';ctaLine.style.transformOrigin=''}
    heroBridge.style.opacity='0';productBridge.style.opacity='0';lightBridge.style.opacity='0';starBridge.style.opacity='0';mapBridge.style.opacity='0';
    heroTitle.style.opacity='';heroKicker.style.opacity='';houseStage.style.background='';proofStage.style.background='';locationStage.style.background='';
    route.style.strokeWidth='5';route.style.stroke='#b63a31';
  };

  let ticking=false;
  function render(){
    ticking=false;resetInline();
    const hp=prog(hero),pp=prog(products),ap=prog(house),rp=prog(proof),lp=prog(location),op=prog(order);
    const hs=seam(hero),ps=seam(products),as=seam(house),rs=seam(proof),ls=seam(location);
    const pe=entering(products),he=entering(house),re=entering(proof),le=entering(location),oe=entering(order);
    const mobile=innerWidth<=760;

    if(hp>.80 && hs===0){
      const t=smoother(range(hp,.80,1)),p=productPos();
      const sx=.50,sy=mobile?.60:.55;
      const x=mix(sx*innerWidth,p.x,t),y=mix(sy*innerHeight,p.y,t),sc=mix(1.00,p.s,t);
      heroBurger.style.transform=`translate3d(calc(-50% + ${x-innerWidth*.5}px),calc(-50% + ${y-innerHeight*.55}px),0) scale(${sc})`;
      heroTitle.style.opacity=String(.45*(1-smooth(range(hp,.83,.98))));
      heroKicker.style.opacity=String(1-smooth(range(hp,.84,.98)));hint.style.opacity='0';
      heroStage.style.background=`rgb(${Math.round(mix(12,124,t))},${Math.round(mix(9,37,t))},${Math.round(mix(7,29,t))})`;
    }
    if(hs>0 && hs<1){
      const t=smoother(hs),p=productPos();
      place(heroBridge,p.x,p.y,p.s);heroBridge.style.opacity=String(1-smooth(range(t,.72,.97)));
      heroBurger.style.opacity='0';productStack.style.opacity=String(smooth(range(t,.76,.98)));heroStage.style.background='#7c251d';
    }
    if(pe>.99 && pp<.055){
      const t=smoother(range(pp,0,.055)),p=productPos();place(heroBridge,p.x,p.y,p.s);
      heroBridge.style.opacity=String(1-t);productStack.style.opacity=String(t);
    }

    if(pp>.80 && ps===0){
      const t=smoother(range(pp,.80,1)),a=productPos(),b={x:mix(a.x,innerWidth*(mobile?.58:.61),t),y:mix(a.y,innerHeight*(mobile?.68:.61),t),s:mix(a.s,mobile?.72:.70,t)};
      productLayers.forEach(x=>{x.style.opacity='1';x.style.transform='none'});
      productCopy.style.opacity=String(1-smooth(range(pp,.82,.96)));productNo.style.opacity=String(1-t);menuLink.style.opacity=String(1-t);
      productStack.style.transform=`translate(-50%,-50%) scale(${b.s})`;productStack.style.left=`${b.x}px`;productStack.style.top=`${b.y}px`;productStack.style.right='auto';
      productsStage.style.background=`rgb(${Math.round(mix(124,40,t))},${Math.round(mix(37,26,t))},${Math.round(mix(29,18,t))})`;
    }
    if(ps>0 && ps<1){
      const t=smoother(ps),a={x:innerWidth*(mobile?.58:.61),y:innerHeight*(mobile?.68:.61),s:mobile?.72:.70},b=tablePos();
      place(productBridge,mix(a.x,b.x,t),mix(a.y,b.y,t),mix(a.s,b.s,t));productBridge.style.opacity='1';productStack.style.opacity='0';
      housePhoto.style.opacity=String(smooth(range(he,.20,.90)));productsStage.style.background='#281a12';
    }
    if(he>.99 && ap<.14){
      const t=smoother(range(ap,0,.14)),b=tablePos();place(productBridge,b.x,mix(b.y,b.y+innerHeight*.015,t),mix(b.s,b.s*.90,t));
      productBridge.style.opacity=String(1-smooth(range(ap,.08,.14)));housePhoto.style.opacity=String(smooth(range(ap,0,.10)));houseCopy.style.opacity=String(smooth(range(ap,.08,.16)));
    }

    if(ap>.74 && as===0){
      const t=smoother(range(ap,.74,1));houseWindow.style.transform='none';
      const wr=houseWindow.getBoundingClientRect(),cx=wr.left+wr.width/2,cy=wr.top+wr.height/2,diag=Math.hypot(innerWidth,innerHeight),rad=mix(55,diag*.34,t),alpha=smooth(range(t,.08,1))*.40;
      lightBridge.style.opacity='1';lightBridge.style.background=`radial-gradient(circle ${rad}px at ${cx}px ${cy}px,rgba(234,223,206,${alpha}) 0%,rgba(234,223,206,${alpha*.58}) 40%,rgba(234,223,206,0) 100%)`;
      houseCopy.style.opacity=String(1-smooth(range(ap,.72,.86)));housePhoto.style.filter=`saturate(${mix(1,.86,t)}) brightness(${mix(1,1.06,t)})`;houseStage.style.background=`rgb(${Math.round(mix(40,234,t))},${Math.round(mix(26,223,t))},${Math.round(mix(18,206,t))})`;
    }
    if(as>0 && as<1){
      const t=smoother(as),wr=houseWindow.getBoundingClientRect(),cx=wr.left+wr.width/2,cy=wr.top+wr.height/2,diag=Math.hypot(innerWidth,innerHeight),rad=mix(diag*.34,diag*.46,t);
      lightBridge.style.opacity=String(1-smooth(range(t,.20,.90)));lightBridge.style.background=`radial-gradient(circle ${rad}px at ${cx}px ${cy}px,rgba(234,223,206,.40) 0%,rgba(234,223,206,.20) 48%,rgba(234,223,206,0) 100%)`;
      houseWindow.style.transform='none';housePhoto.style.opacity=String(1-smooth(range(t,.30,.96)));houseStage.style.background='#eadfce';
    }
    if(re>.99 && rp<.10){
      const t=smoother(range(rp,0,.10));lightBridge.style.opacity=String(1-t);lightBridge.style.background='#eadfce';
      rating.style.opacity=String(.18+.82*smooth(range(rp,0,.065)));ratingSub.style.opacity=String(smooth(range(rp,.01,.075)));
    }

    if(rp>.80 && rs===0){
      seven.style.transform='none';
      const fade=smooth(range(rp,.87,.985));reviews.style.opacity=String(1-smooth(range(rp,.84,.94)));ratingSub.style.opacity=String(1-smooth(range(rp,.88,.96)));
      four.style.opacity=String(1-fade*.72);comma.style.opacity=String(1-fade*.72);seven.style.opacity=String(1-fade*.72);star.style.opacity='1';
      const dark=smoother(range(rp,.90,1));proofStage.style.background=`rgb(${Math.round(mix(234,21,dark))},${Math.round(mix(223,17,dark))},${Math.round(mix(206,15,dark))})`;
    }
    if(rs>0 && rs<1){
      const t=smoother(rs),target=pinPos(),sr=star.getBoundingClientRect(),sx=sr.left+sr.width/2,sy=sr.top+sr.height/2;
      seven.style.transform='none';four.style.opacity=String(1-t);comma.style.opacity=String(1-t);seven.style.opacity=String(1-t);star.style.opacity='0';
      starBridge.style.opacity='1';starBridge.style.fontSize=getComputedStyle(star).fontSize;starBridge.style.left=`${mix(sx,target.x,t)}px`;starBridge.style.top=`${mix(sy,target.y,t)}px`;starBridge.style.transform=`translate(-50%,-50%) scale(${mix(1,.70,t)}) rotate(${mix(0,12,t)}deg)`;starBridge.style.color=`rgb(${Math.round(mix(23,182,t))},${Math.round(mix(17,58,t))},${Math.round(mix(14,49,t))})`;
      proofStage.style.background='#15110f';
      locTitle.style.opacity=String(.88*smooth(range(le,.46,.96)));locMeta.style.opacity=String(.72*smooth(range(le,.58,.98)));routeMap.style.opacity=String(.50*smooth(range(le,.52,.98)));
    }
    if(le>.99 && lp<.085){
      const t=smoother(range(lp,0,.085)),target=pinPos();starBridge.style.opacity=String(1-t);starBridge.style.fontSize=getComputedStyle(star).fontSize;starBridge.style.left=`${target.x}px`;starBridge.style.top=`${target.y}px`;starBridge.style.transform='translate(-50%,-50%) scale(.70) rotate(12deg)';starBridge.style.color='#b63a31';
      pin.style.opacity=String(t);pin.style.transform=`scale(${t})`;locTitle.style.opacity=String(smooth(range(lp,0,.065)));locMeta.style.opacity=String(smooth(range(lp,.01,.075)));routeMap.style.opacity=String(.84*smooth(range(lp,0,.07)));
    }

    if(lp>.80 && ls===0){
      const t=smoother(range(lp,.80,1));pin.style.transform='scale(1)';pin.style.opacity='1';
      locationStage.style.background=`rgb(${Math.round(mix(21,142,t))},${Math.round(mix(17,33,t))},${Math.round(mix(15,27,t))})`;locTitle.style.opacity=String(1-smooth(range(t,.30,.95)));locMeta.style.opacity=String(1-smooth(range(t,.36,.95)));routeLabel.style.opacity=String(1-smooth(range(t,.15,.82)));routeMap.style.opacity=String(mix(.84,.64,t));
    }
    if(ls>0 && ls<1){
      const t=smoother(ls),r=routeMap.getBoundingClientRect();
      mapBridge.style.left=`${r.left}px`;mapBridge.style.top=`${r.top}px`;mapBridge.style.width=`${r.width}px`;mapBridge.style.height=`${r.height}px`;mapBridge.style.opacity=String(.64*(1-smooth(range(t,.35,.98))));mapBridge.style.transform=`translate3d(${mix(0,-innerWidth*.015,t)}px,${mix(0,-innerHeight*.018,t)}px,0) scale(${mix(1,.98,t)})`;
      locationStage.style.background='#8e211b';orderTitle.style.opacity=String(.45*smooth(range(oe,.62,.98)));orderLinks.style.opacity=String(.30*smooth(range(oe,.72,.99)));
    }
    if(oe>.99 && op<.11){
      const t=smoother(range(op,0,.11));
      orderTitle.style.opacity=String(smooth(range(op,0,.075)));orderTitle.style.transform=mobile?`translateX(${mix(-2,0,t)}vw)`:`translateY(-50%) translateX(${mix(-2,0,t)}vw)`;orderLinks.style.opacity=String(.68*smooth(range(op,.015,.09)));returnBurger.style.opacity='0';
      if(ctaLine){ctaLine.style.transform=`scaleX(${smooth(range(op,.025,.10))})`;ctaLine.style.transformOrigin='left center'}
    }
    if(op>=.11){
      const t=smoother(range(op,.11,.46));returnBurger.style.opacity=String(t);returnBurger.style.transform=`translateY(-50%) translateX(${mix(5,0,t)}vw) scale(${mix(.70,.88,t)})`;
      if(ctaLine){ctaLine.style.transform='scaleX(1)';ctaLine.style.transformOrigin='left center'}
    }
  }

  function req(){if(!ticking){ticking=true;requestAnimationFrame(render)}}
  addEventListener('scroll',req,{passive:true});addEventListener('resize',req);req();
})();