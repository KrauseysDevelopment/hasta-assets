/* Hasta site extras. Source: lightspeed/site-extras.js. Loaded by the store-wide Custom JavaScript slot.
   1. /shop-pairs: "More from Hasta" merch row under the twelve pairs.
   2. Everywhere: hide the inventory-bin categories (Adult Sole, Kid Strap) from the catalog grid and footer.
   Waits for Instant Site's Vue app to mount before touching tiles (inserting earlier breaks hydration). */
(function(){
  var MERCH=[
    {n:'Hasta Air Freshener',m:'$6.99',h:'/products/hasta-air-freshener',i:'https://d2j6dbq0eux0bg.cloudfront.net/images/142623305/products/871125111/6373581719.jpg'},
    {n:'Hasta Stickers',m:'$3.00',h:'/products/hasta-stickers',i:'https://d2j6dbq0eux0bg.cloudfront.net/images/142623305/products/871054959/6373584136.jpg'},
    {n:'Hasta Tote Bag',m:'$19.99',h:'/products/hasta-tote-bags-874635836',i:'https://d2j6dbq0eux0bg.cloudfront.net/images/142623305/products/874635836/6368191141.jpg'},
    {n:'Hasta T-Shirts',m:'From $24.99 &middot; 3 designs',h:'/products/t-shirts',i:'https://d2j6dbq0eux0bg.cloudfront.net/images/142623305/products/874635877/6368223365.jpg'}
  ];
  // Hidden categories: the two inventory bins, plus an empty duplicate "Tote Bag" (the totes live in "Hasta Tote Bags").
  var BIN_CATS=['208164304','208164334','208164089'], BIN_SLUGS=['adult-sole','kid-strap','tote-bag'];
  var CSS=BIN_CATS.map(function(c){return '.grid-category--id-'+c}).join(',')+'{display:none!important}'+
    '#hf-merch{margin:56px auto 0}#hf-merch .hfm-head{text-align:center;margin:0 20px 6px}'+
    '#hf-merch .hfm-eyebrow{margin:0 0 8px;font-size:.74rem;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#13C2BB}'+
    '#hf-merch .hfm-title{margin:0;font-size:clamp(1.6rem,3.6vw,2.4rem);font-weight:900;line-height:1.1;color:#0E0E11}'+
    '#hf-merch .hfp-grid{margin-top:26px}#hf-merch .hfp-img{background:#F4F2EF}#hf-merch .hfp-img img{object-fit:contain}';
  function ready(){var r=document.getElementById('ec-instantsite-website');return !r||!!r.__vue_app__}
  function css(){if(document.getElementById('hf-extras-css'))return;var s=document.createElement('style');s.id='hf-extras-css';s.textContent=CSS;document.head.appendChild(s)}
  function footer(){
    var links=document.querySelectorAll('[id^="tile-footer"] a');
    for(var k=0;k<links.length;k++){var h=(links[k].getAttribute('href')||'').split('?')[0];
      for(var j=0;j<BIN_SLUGS.length;j++){if(/\/products\//.test(h)&&h.slice(-BIN_SLUGS[j].length-1)==='/'+BIN_SLUGS[j]){var li=links[k].closest('li')||links[k];li.style.display='none'}}}
  }
  function merch(){
    if(location.pathname.replace(/\/+$/,'')!=='/shop-pairs')return;
    var root=document.getElementById('hf-pairs');if(!root||document.getElementById('hf-merch'))return;
    var foot=root.querySelector('.hfp-foot');
    var html='<div class="hfm-head"><p class="hfm-eyebrow">Not just flip flops</p><h2 class="hfm-title">More from Hasta</h2></div><div class="hfp-grid">';
    MERCH.forEach(function(p){html+='<a class="hfp-card" href="'+p.h+'"><span class="hfp-img"><img src="'+p.i+'" alt="'+p.n+'" loading="lazy" width="500" height="500"></span><span class="hfp-name">'+p.n+'</span><span class="hfp-meta">'+p.m+'</span><span class="hfp-go">Shop &rarr;</span></a>'});
    html+='</div>';
    var d=document.createElement('section');d.id='hf-merch';d.innerHTML=html;
    foot?root.insertBefore(d,foot):root.appendChild(d);
  }
  /* 3. Header "Shop" dropdown (desktop hover/focus) + the same links under Shop in the mobile menu. */
  var SHOP=[
    ['Flip flop favorites','/shop-pairs'],['Build your own pair','/#wheel'],
    ['T-Shirts','/products/t-shirts'],['Stickers','/products/stickers'],['Air Fresheners','/products/air-fresheners'],
    ['Tote Bags','/products/hasta-tote-bags'],['Hasta Fans','/products/hasta-fans'],['Shop all','/products']
  ];
  function menuHtml(cls){return SHOP.map(function(s){return '<a class="'+cls+'" href="'+s[1]+'">'+s[0]+'</a>'}).join('')}
  var dd,ddHost,ddT;
  function ddPanel(){
    if(dd&&document.body.contains(dd))return dd;
    dd=document.createElement('div');dd.className='hf-dd';dd.id='hf-shop-dd';dd.setAttribute('role','menu');dd.innerHTML=menuHtml('hf-dd__a');
    dd.addEventListener('mouseenter',ddOpen);dd.addEventListener('mouseleave',ddCloseSoon);
    dd.addEventListener('focusin',ddOpen);dd.addEventListener('focusout',ddCloseSoon);
    document.body.appendChild(dd);return dd;
  }
  function ddOpen(){
    clearTimeout(ddT);if(!ddHost||!ddHost.isConnected)return;
    var p=ddPanel(),r=ddHost.getBoundingClientRect();
    if(r.width===0)return;
    p.style.top=(r.bottom+8)+'px';p.style.left=Math.max(12,Math.min(innerWidth-p.offsetWidth-12,r.left+r.width/2-p.offsetWidth/2))+'px';
    p.classList.add('is-open');ddHost.classList.add('is-open');
  }
  function ddClose(){if(dd)dd.classList.remove('is-open');if(ddHost)ddHost.classList.remove('is-open')}
  function ddCloseSoon(){clearTimeout(ddT);ddT=setTimeout(ddClose,180)}
  function dropdown(){
    var links=document.querySelectorAll('.ins-header__menu-link-title');
    for(var k=0;k<links.length;k++){
      if(links[k].textContent.trim()!=='Shop')continue;
      var host=links[k].parentElement;if(host.classList.contains('hf-has-dd'))continue;
      host.classList.add('hf-has-dd');host.setAttribute('aria-haspopup','true');
      host.addEventListener('mouseenter',function(){ddHost=this;ddOpen()});
      host.addEventListener('mouseleave',ddCloseSoon);
      host.addEventListener('focusin',function(){ddHost=this;ddOpen()});
      host.addEventListener('focusout',ddCloseSoon);
    }
  }
  function mobileSub(){
    var links=document.querySelectorAll('.ins-header__sidebar-menu-link-title');
    for(var k=0;k<links.length;k++){
      if(links[k].textContent.trim()!=='Shop')continue;
      var host=links[k].parentElement;if(host.querySelector('.hf-msub'))continue;
      var d=document.createElement('div');d.className='hf-msub';d.innerHTML=menuHtml('hf-msub__a');host.appendChild(d);
    }
  }
  /* 4. No stock counts or outlet inventory on the storefront (Nick 2026-11-01). Stock text hidden by CSS;
        the "Outlet inventory" accordion has no unique class, so it is hidden by its title. */
  CSS+='.details-product-purchase__place,.product-details__product-stock,.grid-product__label--stock{display:none!important}';
  /* 5. Site Style adds a flip-flop size hint ("Adult 5–12 · Kids …") under every Size picker. Flip flops are sized
        on the wheel now, so on product pages that hint only ever lands on T-shirts. Turn it off. */
  CSS+='.ec-store__product-page .details-product-option--Size .product-details-module__content::after{content:none!important;display:none!important}';
  function noOutlet(){
    var t=document.querySelectorAll('.collapsible-section__title');
    for(var k=0;k<t.length;k++){if(/outlet inventory|pickup availability/i.test(t[k].textContent)){var s=t[k].closest('.collapsible-section');var w=s&&s.parentElement&&s.parentElement.children.length===1?s.parentElement:s;if(w)w.style.display='none'}}
  }
  addEventListener('scroll',ddClose,{passive:true});addEventListener('resize',ddClose);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')ddClose()});
  CSS+='.hf-has-dd>.ins-header__menu-link-title::after{content:"";display:inline-block;width:6px;height:6px;margin:0 0 3px 7px;border:solid currentColor;border-width:0 2px 2px 0;transform:rotate(45deg);transition:transform .15s}'+
    '.hf-has-dd.is-open>.ins-header__menu-link-title::after{transform:rotate(-135deg);margin-bottom:-1px}'+
    '.hf-dd{position:fixed;top:0;left:0;min-width:220px;padding:10px;background:#fff;border-radius:14px;box-shadow:0 16px 40px rgba(14,14,17,.18);border-top:4px solid #F607B0;'+
    'display:flex;flex-direction:column;opacity:0;visibility:hidden;transform:translateY(6px);transition:opacity .15s,transform .15s,visibility .15s;z-index:100000;text-align:left;font-family:inherit}'+
    '.hf-dd::before{content:"";position:absolute;left:0;right:0;top:-14px;height:14px}'+
    '.hf-dd.is-open{opacity:1;visibility:visible;transform:none}'+
    '.hf-dd__a,.hf-dd__a:visited{display:block;padding:9px 12px;border-radius:9px;color:#0E0E11!important;font-weight:700;font-size:.95rem;text-decoration:none;white-space:nowrap;line-height:1.2}'+
    '.hf-dd__a:hover,.hf-dd__a:focus{background:#FDE7F6;color:#C4008A!important;outline:none}'+
    '.hf-dd__a:nth-child(3){border-top:1px solid rgba(14,14,17,.08);margin-top:4px;padding-top:13px}'+
    '.hf-msub{display:flex;flex-direction:column;margin:2px 0 6px 14px;padding-left:12px;border-left:3px solid #F607B0}'+
    '.hf-msub__a,.hf-msub__a:visited{display:block;padding:7px 0;font-size:.92em;font-weight:600;color:inherit!important;text-decoration:none;opacity:.9}'+
    '.hf-msub__a:hover{opacity:1;text-decoration:underline}'+
    '.hf-dd__a:last-child{border-top:1px solid rgba(14,14,17,.08);margin-top:4px;padding-top:13px;color:#0B8F89!important}';
  function go(){css();if(!ready())return;footer();merch();dropdown();mobileSub();noOutlet()}
  go();document.readyState==='loading'&&document.addEventListener('DOMContentLoaded',go);setInterval(go,1000);
})();

/* ===================================================================================================
   6. Bag drawer + "Build this pair" quick-add (Nick 2026-11-01).
   - window.HastaBag.open(): right-hand slide-out bag. Opens by itself whenever the bag count goes up
     anywhere on the site (wheel, quick-add, merch Add to Bag), so customers never have to click the bag icon.
   - window.HastaCart.addPair(sole, strap, size, cb): same rules as the wheel (sole + strap inventory bins,
     options Color + Size, HASTA COLOR SELECTIONS in the order comments, never half a pair in the bag).
   - Favorite cards (?sole=&strap= links) open a quick-add panel: photo, size, Add to Bag. "Customize on the
     wheel" keeps the old jump to the wheel.
   Keep BINS / sizes / comment format in step with lightspeed/hasta-wheel-section.html.
   =================================================================================================== */
(function(){
  var BINS={soleAdult:867834595,soleKids:867833894,strapAdult:867833676,strapKids:867833936};
  var OPT_COLOR=['Color','Colour'], OPT_SIZE='Size', HEADING='HASTA COLOR SELECTIONS', LINES_KEY='hastaOrderLines';
  var ADULT=['5','6','7','8','9','10','11','12'], KIDS=['11','12','13','1','2','3'];
  var ALIAS={'Grey / Tan':'Tan'}, SLUG={'Tan':'grey-tan'};
  // Pair prices (Zach, 2026-11-01). The cart charges whatever Retail says; these are only for display.
  // Retail: Sole - Adult $30, Sole - Kids $25, both strap bins $0. Change both together.
  var PRICE={Adult:30,Kids:25};
  // Adult sizes are men's; women's = men's - 1 per Zach ("Mens 10/Womens 9"). Keep in step with HF.womens in the wheel.
  var WOMENS={5:4,6:5,7:6,8:7,9:8,10:9,11:10,12:11};
  function sizeLabel(size){var m=/^Adult (\d+)$/.exec(size||'');return m&&WOMENS[m[1]]!=null?size+' (M'+m[1]+' / W'+WOMENS[m[1]]+')':size}
  function shortSize(size){var m=/^Adult (\d+)$/.exec(size||'');return m&&WOMENS[m[1]]!=null?'M'+m[1]+' / W'+WOMENS[m[1]]:size}
  var PHOTO='https://cdn.jsdelivr.net/gh/KrauseysDevelopment/hasta-assets@f1e48a4fd6661d55ea06467f7096fb5511c1f87c/combos/';
  var BIN_IDS=[BINS.soleAdult,BINS.soleKids,BINS.strapAdult,BINS.strapKids];
  function slug(n){return SLUG[n]||n.toLowerCase().replace(/[^a-z]+/g,'-').replace(/^-|-$/g,'')}
  function photo(sole,strap){return PHOTO+slug(sole)+'--'+slug(strap)+'.jpg'}
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function money(n){return '$'+(Math.round((+n||0)*100)/100).toFixed(2)}
  function ecwid(){return typeof Ecwid!=='undefined'&&Ecwid.Cart}
  function onCartPage(){return /\/cart|checkout/i.test(location.pathname+location.hash)}

  /* ---------- bag plumbing (mirrors the wheel) ---------- */
  function cartGet(cb){Ecwid.Cart.get(cb)}
  function sameLine(it,id,o){if(it.product.id!==id)return false;var x=it.options||{};for(var k in o)if(x[k]!==o[k])return false;return true}
  function qtyOf(c,id,o){var n=0;(c.items||[]).forEach(function(it){if(sameLine(it,id,o))n+=it.quantity});return n}
  // removeN: take n of a line back out (Ecwid has no set-quantity call, so remove the line and re-add the rest).
  function removeN(id,o,n,done){cartGet(function(c){var it=c.items||[],i=it.length;while(i--)if(sameLine(it[i],id,o))break;if(i<0){done();return}var left=it[i].quantity-n,opts=it[i].options||o;Ecwid.Cart.removeProduct(i,function(){if(left>0)Ecwid.Cart.addProduct({id:id,quantity:left,options:opts,callback:function(){done()}});else done()})})}
  function removeOne(id,o,done){removeN(id,o,1,done)}
  // addN: add n of exactly this line and confirm exactly n landed. Out of stock adds nothing (or fewer);
  // an unknown option value makes Ecwid add the default variant instead. Undo anything that isn't exactly right.
  function addN(id,o,n,done){cartGet(function(b){var q0=qtyOf(b,id,o),t0=qtyOf(b,id,{});Ecwid.Cart.addProduct({id:id,quantity:n,options:o,callback:function(ok){cartGet(function(a){
    var d=qtyOf(a,id,o)-q0;if(ok&&d===n){done(true);return}
    if(d>0){removeN(id,o,d,function(){done(false)});return}
    if(qtyOf(a,id,{})<=t0){done(false);return}
    var it=a.items||[],i=it.length;while(i--)if(sameLine(it[i],id,{})&&!sameLine(it[i],id,o))break;removeN(id,it[i].options||{},qtyOf(a,id,{})-t0,function(){done(false)})})}})})}
  function addColor(id,color,size,n,cb){var i=0;(function next(){var o={};o[OPT_COLOR[i]]=color;o[OPT_SIZE]=size;addN(id,o,n,function(ok){if(ok){cb(true,o);return}if(++i<OPT_COLOR.length){next();return}cb(false,o)})})()}
  // Kept in localStorage (all tabs share one bag), and rebuilt from the bag itself on every change (syncFromCart).
  function readLines(){try{return JSON.parse(localStorage.getItem(LINES_KEY)||sessionStorage.getItem(LINES_KEY)||'[]')}catch(e){return[]}}
  function writeComments(lines){try{localStorage.setItem(LINES_KEY,JSON.stringify(lines));sessionStorage.removeItem(LINES_KEY)}catch(e){}
    if(!lines.length){Ecwid.Cart.setOrderComments('');return}
    Ecwid.Cart.setOrderComments(HEADING+'\n'+lines.map(function(l,i){return (i+1)+'. Sole: '+l.sole+'  |  Strap: '+l.strap+'  |  Size: '+l.size+((l.qty||1)>1?'  |  Qty: '+l.qty:'')}).join('\n'))}
  // One line per distinct pair, with a quantity (same format the wheel writes).
  function bumpLine(sole,strap,size,d){var l=readLines(),i;for(i=0;i<l.length;i++)if(l[i].sole===sole&&l[i].strap===strap&&l[i].size===size)break;
    if(i<l.length){l[i].qty=(l[i].qty||1)+d;if(l[i].qty<=0)l.splice(i,1)}else if(d>0)l.push({sole:sole,strap:strap,size:size,qty:d});writeComments(l)}
  var busy=false;
  function addPair(sole,strap,size,cb,n){
    n=n||1;
    if(!ecwid()){cb(false,'The store is still loading. Try again in a moment.');return}
    if(busy){return}busy=true;
    var kids=size.indexOf('Kids')===0, sid=kids?BINS.soleKids:BINS.soleAdult, tid=kids?BINS.strapKids:BINS.strapAdult;
    var short=function(what){return 'Sorry, we don’t have '+(n>1?n+' of the ':'the ')+what+' in '+size+'. Try '+(n>1?'fewer or ':'')+'another size.'};
    addColor(sid,sole,size,n,function(ok,so){
      if(!ok){busy=false;cb(false,short(sole+' sole'));return}
      addColor(tid,strap,size,n,function(ok2){
        if(ok2){bumpLine(sole,strap,size,n);busy=false;sync();cb(true);return}
        removeN(sid,so,n,function(){busy=false;cb(false,short(strap+' strap'))});
      });
    });
  }
  window.HastaCart={addPair:addPair,sync:function(){sync()}};

  /* ---------- styles ---------- */
  var CSS=
  '.hfb-scrim{position:fixed;inset:0;background:rgba(14,14,17,.42);opacity:0;visibility:hidden;transition:opacity .2s,visibility .2s;z-index:100001}'+
  '.hfb-scrim.is-open{opacity:1;visibility:visible}'+
  '.hfb{position:fixed;top:0;right:0;bottom:0;width:min(420px,100vw);background:#fff;z-index:100002;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .28s cubic-bezier(.2,.8,.2,1);box-shadow:-18px 0 40px rgba(14,14,17,.18);font-family:inherit;color:#0E0E11}'+
  '.hfb.is-open{transform:none}'+
  '.hfb__head{display:flex;align-items:center;justify-content:space-between;padding:20px 22px;border-bottom:4px solid #F607B0}'+
  '.hfb__title{margin:0;font-size:1.35rem;font-weight:900}'+
  '.hfb__x{border:0;background:none;font-size:28px;line-height:1;cursor:pointer;color:#0E0E11;padding:4px 8px}'+
  '.hfb__note{margin:0;padding:10px 22px;background:#E7FAF8;color:#0B6E69;font-size:.9rem;font-weight:700}'+
  '.hfb__list{flex:1;overflow:auto;padding:8px 22px}'+
  '.hfb__item{display:flex;gap:14px;padding:14px 0;border-bottom:1px solid rgba(14,14,17,.08)}'+
  '.hfb__img{flex:0 0 72px;height:72px;border-radius:12px;background:#F4F2EF;overflow:hidden}.hfb__img img{width:100%;height:100%;object-fit:cover;display:block}'+
  '.hfb__meta{flex:1;min-width:0}.hfb__name{font-weight:800;line-height:1.25}.hfb__opts{font-size:.86rem;color:#6B6875;margin-top:3px}'+
  '.hfb__price{font-weight:800;white-space:nowrap;text-align:right}'+
  '.hfb__rm{display:block;margin-top:6px;border:0;background:none;padding:0;font:inherit;font-size:.8rem;font-weight:700;color:#6B6875;text-decoration:underline;cursor:pointer}.hfb__rm:hover{color:#B00060}'+
  '.hfb__step{display:inline-flex;align-items:center;margin-top:8px;border:2px solid rgba(14,14,17,.12);border-radius:999px;overflow:hidden}'+
  '.hfb__step button{width:32px;height:30px;border:0;background:#fff;font-size:1.1rem;font-weight:800;cursor:pointer;color:#0E0E11;font-family:inherit}.hfb__step button:hover:not([disabled]){background:#FDE7F6}.hfb__step button[disabled]{opacity:.35;cursor:default}'+
  '.hfb__step span{min-width:26px;text-align:center;font-weight:800}'+
  '.ins-header__icon--cart[data-hf-count]::after{content:attr(data-hf-count)!important}'+
  'html.hf-cartlist-on .ec-store__cart-page .ec-cart__products{display:none!important}'+
  '.hfb__img img{width:100%!important;height:100%!important;max-width:none!important;object-fit:cover!important;display:block!important}'+
  '.hfb__step{display:inline-flex!important;align-items:center!important;border:2px solid rgba(14,14,17,.14)!important;border-radius:999px!important;overflow:hidden!important;background:#fff!important}'+
  '.hfb__step button{width:34px!important;height:32px!important;min-width:0!important;padding:0!important;margin:0!important;border:0!important;border-radius:0!important;background:#fff!important;color:#0E0E11!important;font-size:1.15rem!important;font-weight:800!important;line-height:1!important;box-shadow:none!important}'+
  '.hfb__step button:hover:not([disabled]){background:#FDE7F6!important}.hfb__step button[disabled]{opacity:.35!important}'+
  '.hfb__step span{min-width:28px;text-align:center;font-weight:800;font-size:.95rem}'+
  '.hfb__rm{font-size:.8rem!important;color:#6B6875!important;background:none!important;border:0!important;padding:0!important;text-decoration:underline!important}'+
  '#hf-cartlist .hfb__name{font-size:1.02rem}#hf-cartlist .hfb__opts{font-size:.9rem}#hf-cartlist .hfb__price{font-size:1rem}'+
  '#hf-cartlist{margin:0 0 18px;border-top:1px solid rgba(14,14,17,.12)}#hf-cartlist .hfb__item{padding:16px 0}#hf-cartlist .hfb__img{flex-basis:88px;height:88px}#hf-cartlist .hfb__note{margin:12px 0 0;border-radius:10px}'+
  '.hfb__empty{padding:40px 0;text-align:center;color:#6B6875}'+
  '.hfb__foot{padding:18px 22px 22px;border-top:1px solid rgba(14,14,17,.08)}'+
  '.hfb__sub{display:flex;justify-content:space-between;font-weight:800;font-size:1.05rem;margin-bottom:6px}'+
  '.hfb__fine{font-size:.82rem;color:#6B6875;margin:0 0 14px}'+
  '.hfb__btn{display:block;width:100%;border:0;border-radius:999px;padding:15px;font-weight:800;font-size:1rem;cursor:pointer;font-family:inherit}'+
  '.hfb__btn--go{background:#F607B0;color:#0E0E11}.hfb__btn--go:hover{background:#13C2BB}'+
  '.hfb__btn--ghost{background:none;color:#0E0E11;margin-top:8px;text-decoration:underline}'+
  /* quick-add panel */
  '.hfq{position:fixed;left:50%;top:50%;width:min(460px,calc(100vw - 32px));max-height:calc(100vh - 32px);overflow:auto;background:#fff;border-radius:22px;z-index:100002;transform:translate(-50%,-46%);opacity:0;visibility:hidden;transition:opacity .2s,transform .2s,visibility .2s;box-shadow:0 30px 60px rgba(14,14,17,.25);font-family:inherit;color:#0E0E11}'+
  '.hfq.is-open{opacity:1;visibility:visible;transform:translate(-50%,-50%)}'+
  '.hfq__img{position:relative;height:min(240px,32vh);background:#F7F7F7}.hfq__img img{width:100%;height:100%;object-fit:contain;display:block}'+
  '.hfq__x{position:absolute;top:10px;right:10px;width:40px;height:40px;border-radius:50%;border:0;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,.15);font-size:24px;cursor:pointer}'+
  '.hfq__body{padding:18px 22px 22px}.hfq__name{margin:0;font-size:1.4rem;font-weight:900}.hfq__price{margin:4px 0 14px;font-weight:800;color:#C4008A}'+
  '.hfq__lbl{font-size:.74rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#6B6875;margin:12px 0 8px}'+
  '.hfq__sizes{display:flex;flex-wrap:wrap;gap:8px}'+
  '.hfq__s{min-width:46px;height:44px;border-radius:12px;border:2px solid rgba(14,14,17,.12);background:#fff;font-weight:800;font-size:.95rem;cursor:pointer;font-family:inherit;color:#0E0E11}'+
  '.hfq__s--mw{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.05;height:auto;padding:6px 8px;min-width:52px}.hfq__s--mw small{font-size:.7rem;font-weight:600;opacity:.75}'+
  '.hfq__hint{text-transform:none;letter-spacing:0;font-weight:600;margin-left:4px}'+
  '.hfq__s:hover{border-color:#13C2BB}.hfq__s.is-on{background:#F607B0;border-color:#F607B0;color:#0E0E11}'+
  '.hfq__msg{min-height:1.3em;margin:12px 0 0;font-size:.9rem;color:#B00060;font-weight:700}'+
  '.hfq__add{margin-top:10px}.hfq__add[disabled]{opacity:.5;cursor:not-allowed}'+
  '.hfq__wheel{display:block;text-align:center;margin-top:12px;font-weight:700;color:#0B8F89;text-decoration:none}.hfq__wheel:hover{text-decoration:underline}'+
  '@media (prefers-reduced-motion:reduce){.hfb,.hfq,.hfb-scrim{transition:none}}';
  function css(){if(document.getElementById('hf-bag-css'))return;var s=document.createElement('style');s.id='hf-bag-css';s.textContent=CSS;document.head.appendChild(s)}

  /* ---------- drawer ---------- */
  var drawer,scrim,lastFocus,lastQty=null,openT;
  function build(){
    if(drawer&&document.body.contains(drawer))return;
    scrim=document.createElement('div');scrim.className='hfb-scrim';scrim.addEventListener('click',close);
    drawer=document.createElement('aside');drawer.className='hfb';drawer.setAttribute('role','dialog');drawer.setAttribute('aria-modal','true');drawer.setAttribute('aria-label','Your bag');drawer.tabIndex=-1;
    drawer.innerHTML='<div class="hfb__head"><h2 class="hfb__title">Your Bag</h2><button type="button" class="hfb__x" aria-label="Close bag">&times;</button></div>'+
      '<p class="hfb__note" hidden></p><div class="hfb__list"></div>'+
      '<div class="hfb__foot"><div class="hfb__sub"><span>Subtotal</span><span class="hfb__subv">$0.00</span></div><p class="hfb__fine">Shipping and tax are calculated at checkout.</p>'+
      '<button type="button" class="hfb__btn hfb__btn--go" data-act="checkout">Checkout</button><button type="button" class="hfb__btn hfb__btn--ghost" data-act="keep">Keep shopping</button></div>';
    drawer.querySelector('.hfb__x').addEventListener('click',close);
    drawer.querySelector('[data-act=keep]').addEventListener('click',close);
    drawer.querySelector('[data-act=checkout]').addEventListener('click',function(){close();if(window.Ecwid&&Ecwid.openPage)Ecwid.openPage('cart');else location.href='/products/cart'});
    bindList(drawer.querySelector('.hfb__list'));
    document.body.appendChild(scrim);document.body.appendChild(drawer);
  }
  // Take n of a pair back out (n soles + n straps) and update its line in the color notes.
  function removePair(sole,strap,size,n,done){
    cartGet(function(c){
      var find=function(id,color){var it=c.items||[];for(var i=0;i<it.length;i++){var o=it[i].options||{};if(it[i].product.id===id&&(o.Color||o.Colour)===color&&o.Size===size)return it[i].options}return null};
      var kids=size.indexOf('Kids')===0,sid=kids?BINS.soleKids:BINS.soleAdult,tid=kids?BINS.strapKids:BINS.strapAdult,so=find(sid,sole),st=find(tid,strap);
      busy=true;
      var fin=function(){bumpLine(sole,strap,size,-n);busy=false;sync();done()};
      var rmStrap=function(){st?removeN(tid,st,n,fin):fin()};
      so?removeN(sid,so,n,rmStrap):rmStrap();
    });
  }
  function isBin(id){return BIN_IDS.indexOf(id)>=0}
  function colorOf(it){var o=it.options||{};return o.Color||o.Colour||''}
  // Click handling shared by the drawer list and the bag-page list.
  function bindList(el){
    el.addEventListener('click',function(e){
      var b=e.target.closest&&e.target.closest('[data-act]');if(!b||!ecwid()||b.disabled||busy)return;
      var d=b.dataset,act=d.act,again=function(msg){note(msg);cartGet(render)};
      Array.prototype.forEach.call(el.querySelectorAll('button'),function(x){x.disabled=true});
      if(act==='p+'){addPair(d.sole,d.strap,d.size,function(ok,msg){again(ok?'':msg)},1);return}
      if(act==='p-'||act==='prm'){removePair(d.sole,d.strap,d.size,act==='prm'?+d.q:1,function(){again('')});return}
      cartGet(function(c){var it=(c.items||[])[+d.i];if(!it){again('');return}
        var q=it.quantity,opts=it.options||{},id=it.product.id;
        if(act==='l+'){Ecwid.Cart.addProduct({id:id,quantity:1,options:opts,callback:function(ok){again(ok?'':'Sorry, no more of that one in stock.')}});return}
        Ecwid.Cart.removeProduct(+d.i,function(){
          if(act==='l-'&&q>1)Ecwid.Cart.addProduct({id:id,quantity:q-1,options:opts,callback:function(){again('')}});else again('')});
      });
    });
  }
  // Pair up sole and strap bin lines: by the saved color notes first (so two pairs in one size can't cross),
  // then any leftovers by size. Identical pairs are merged. Mutates soleQ/strapQ down to the unpaired rest.
  function matchPairs(soleQ,strapQ,soleP,strapP){
    var key=function(c,z){return c+'|'+z},by={},pairs=[];
    var take=function(sole,strap,size,want){var a=key(sole,size),b=key(strap,size),n=Math.min(want,soleQ[a]||0,strapQ[b]||0);if(n<=0)return;
      soleQ[a]-=n;strapQ[b]-=n;var k=a+'|'+strap;
      if(by[k])by[k].qty+=n;else pairs.push(by[k]={sole:sole,strap:strap,size:size,qty:n,unit:((soleP||{})[a]||0)+((strapP||{})[b]||0)})};
    readLines().forEach(function(l){take(l.sole,l.strap,l.size,l.qty||1)});
    Object.keys(soleQ).forEach(function(a){var p=a.split('|');Object.keys(strapQ).forEach(function(b){if(b.split('|')[1]===p[1]&&soleQ[a]>0)take(p[0],b.split('|')[0],p[1],soleQ[a])})});
    return pairs;
  }
  // Make the color notes match what is actually in the bag (every tab, every add or remove).
  function syncFromCart(cart){
    var soleQ={},strapQ={};(cart.items||[]).forEach(function(it){var id=it.product.id,o=it.options||{},k=colorOf(it)+'|'+o.Size;
      if(id===BINS.soleAdult||id===BINS.soleKids)soleQ[k]=(soleQ[k]||0)+it.quantity;else if(id===BINS.strapAdult||id===BINS.strapKids)strapQ[k]=(strapQ[k]||0)+it.quantity});
    var lines=matchPairs(soleQ,strapQ).map(function(p){return {sole:p.sole,strap:p.strap,size:p.size,qty:p.qty}});
    if(JSON.stringify(lines)!==JSON.stringify(readLines())||(cart.orderComments||'').indexOf(HEADING)<0&&lines.length)writeComments(lines);
  }
  function sync(){if(ecwid())cartGet(syncFromCart)}
  // Bag contents as customers think of them: one "Custom pair" line per pair (its sole + strap), merch as is.
  // Pairs are matched by the saved color notes first, so two different pairs in the same size can't cross.
  function rowsFor(cart){
    var items=(cart&&cart.items)||[],rows=[],count=0;
    var soleQ={},strapQ={},soleP={},strapP={},other=[],key=function(c,z){return c+'|'+z};
    items.forEach(function(it){var id=it.product.id,o=it.options||{},k=key(colorOf(it),o.Size);
      if(id===BINS.soleAdult||id===BINS.soleKids){soleQ[k]=(soleQ[k]||0)+it.quantity;soleP[k]=it.product.price||0}
      else if(id===BINS.strapAdult||id===BINS.strapKids){strapQ[k]=(strapQ[k]||0)+it.quantity;strapP[k]=it.product.price||0}
      else other.push(it)});
    var pairs=matchPairs(soleQ,strapQ,soleP,strapP);
    var step=function(q,minus,plus,attrs,max){return '<div class="hfb__step" role="group" aria-label="Quantity"><button type="button" data-act="'+minus+'" '+attrs+' aria-label="One fewer">&minus;</button><span aria-live="polite">'+q+'</span><button type="button" data-act="'+plus+'" '+attrs+' aria-label="One more"'+(max&&q>=max?' disabled':'')+'>+</button></div>'};
    pairs.forEach(function(p){count+=p.qty;var at='data-sole="'+esc(p.sole)+'" data-strap="'+esc(p.strap)+'" data-size="'+esc(p.size)+'" data-q="'+p.qty+'"';
      rows.push('<div class="hfb__item"><div class="hfb__img"><img alt="" src="'+esc(photo(p.sole,p.strap))+'"></div><div class="hfb__meta"><div class="hfb__name">Custom pair</div><div class="hfb__opts">'+esc(p.sole)+' sole &middot; '+esc(p.strap)+' strap<br>'+esc(sizeLabel(p.size))+'</div>'+step(p.qty,'p-','p+',at,10)+'</div><div class="hfb__price">'+money(p.unit*p.qty)+'<button type="button" class="hfb__rm" data-act="prm" '+at+'>Remove</button></div></div>')});
    Object.keys(soleQ).forEach(function(a){if(soleQ[a]>0){count+=soleQ[a];var p=a.split('|');rows.push('<div class="hfb__item"><div class="hfb__img"></div><div class="hfb__meta"><div class="hfb__name">Sole only</div><div class="hfb__opts">'+esc(p[0])+' &middot; '+esc(p[1])+(soleQ[a]>1?' &middot; Qty '+soleQ[a]:'')+'</div></div><div class="hfb__price">'+money((soleP[a]||0)*soleQ[a])+'</div></div>')}});
    Object.keys(strapQ).forEach(function(b){if(strapQ[b]>0){var p=b.split('|');rows.push('<div class="hfb__item"><div class="hfb__img"></div><div class="hfb__meta"><div class="hfb__name">Strap only</div><div class="hfb__opts">'+esc(p[0])+' &middot; '+esc(p[1])+'</div></div><div class="hfb__price">'+money((strapP[b]||0)*strapQ[b])+'</div></div>')}});
    other.forEach(function(it){count+=it.quantity;var idx=items.indexOf(it),o=it.options||{},opts=Object.keys(o).map(function(k){return esc(k)+': '+esc(o[k])}).join(' &middot; ');
      rows.push('<div class="hfb__item"><div class="hfb__img">'+(function(){var m=it.product.mediaItem||{},u=m.image160pxUrl||m.image400pxUrl||it.product.imageUrl;return u?'<img alt="" src="'+esc(u)+'">':''})()+'</div><div class="hfb__meta"><div class="hfb__name">'+esc(it.product.name)+'</div><div class="hfb__opts">'+opts+'</div>'+step(it.quantity,'l-','l+','data-i="'+idx+'"',0)+'</div><div class="hfb__price">'+money((it.product.price||0)*it.quantity)+'<button type="button" class="hfb__rm" data-act="lrm" data-i="'+idx+'">Remove</button></div></div>')});
    return {html:rows.length?rows.join(''):'<p class="hfb__empty">Your bag is empty.</p>',sub:items.reduce(function(a,it){return a+(it.product.price||0)*it.quantity},0),count:count,empty:!items.length};
  }
  var lastCount=null;
  function render(cart){
    var r=rowsFor(cart);lastCount=r.count;badge();
    if(drawer){drawer.querySelector('.hfb__list').innerHTML=r.html;drawer.querySelector('.hfb__subv').textContent=money(r.sub);drawer.querySelector('[data-act=checkout]').disabled=r.empty}
    var pl=document.getElementById('hf-cartlist');if(pl)pl.querySelector('.hfc__list').innerHTML=r.html;
  }
  // Header bag count = pairs + merch (a pair is two bin lines underneath).
  function badge(){if(lastCount===null)return;Array.prototype.forEach.call(document.querySelectorAll('.ins-header__icon--cart'),function(a){if(a.getAttribute('data-hf-count')!==String(lastCount))a.setAttribute('data-hf-count',lastCount)})}
  // Bag page: Ecwid lists every sole and strap separately (and collapses 4+ lines into a thumbnail strip).
  // Show the same pair list as the drawer instead; Ecwid's totals, gift card and checkout stay.
  function cartPage(){
    if(!onCartPage()){document.documentElement.classList.remove('hf-cartlist-on');return}
    var native=document.querySelector('.ec-store__cart-page .ec-cart__products');if(!native)return;
    var pl=document.getElementById('hf-cartlist');
    if(!pl||pl.nextElementSibling!==native){if(pl)pl.remove();pl=document.createElement('div');pl.id='hf-cartlist';pl.innerHTML='<div class="hfc__list"></div>';native.parentNode.insertBefore(pl,native);bindList(pl.querySelector('.hfc__list'));if(ecwid())cartGet(render)}
    document.documentElement.classList.add('hf-cartlist-on');
  }
  setInterval(function(){css();badge();cartPage()},700);
  function note(msg){if(drawer){var n=drawer.querySelector('.hfb__note');if(msg){n.textContent=msg;n.hidden=false}else n.hidden=true}var pl=document.getElementById('hf-cartlist');if(pl&&msg){var m=pl.querySelector('.hfc__msg');if(!m){m=document.createElement('p');m.className='hfb__note hfc__msg';pl.insertBefore(m,pl.firstChild)}m.textContent=msg}}
  function open(note){
    if(onCartPage())return;css();build();
    var n=drawer.querySelector('.hfb__note');if(note){n.textContent=note;n.hidden=false}else n.hidden=true;
    if(ecwid())cartGet(render);
    lastFocus=document.activeElement;scrim.classList.add('is-open');drawer.classList.add('is-open');
    setTimeout(function(){drawer.focus()},50);
  }
  function close(){if(!drawer)return;drawer.classList.remove('is-open');scrim.classList.remove('is-open');if(lastFocus&&lastFocus.focus)try{lastFocus.focus()}catch(e){}}
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(qp&&qp.classList.contains('is-open'))qClose();else close()}});
  window.HastaBag={open:open,close:close};

  // Open on any add, anywhere. Debounced so a pair (two adds) opens once; skipped while a pair is mid-flight.
  function watch(){
    if(!ecwid()||!Ecwid.OnCartChanged){setTimeout(watch,400);return}
    Ecwid.OnCartChanged.add(function(c){
      var q=c?c.productsQuantity:0;
      cartGet(function(c){render(c);if(!busy&&!window.__hfPairBusy)syncFromCart(c)});
      if(lastQty!==null&&q>lastQty&&!busy&&!window.__hfPairBusy){clearTimeout(openT);openT=setTimeout(function(){if(!busy&&!window.__hfPairBusy)open('Added to your bag')},700)}
      lastQty=q;
    });
    cartGet(function(c){if(lastQty===null)lastQty=c.productsQuantity||0;syncFromCart(c);render(c)});
  }
  watch();

  /* ---------- quick-add for favorite cards ---------- */
  var qp,qState={};
  function qBuild(){
    if(qp&&document.body.contains(qp))return;css();build();
    qp=document.createElement('div');qp.className='hfq';qp.setAttribute('role','dialog');qp.setAttribute('aria-modal','true');qp.tabIndex=-1;
    var sz=function(pre,arr){return arr.map(function(n){var w=pre==='Adult'?WOMENS[n]:null;return '<button type="button" class="hfq__s'+(w!=null?' hfq__s--mw':'')+'" data-size="'+pre+' '+n+'"'+(w!=null?' aria-label="Adult '+n+': men&#39;s '+n+', women&#39;s '+w+'"><span>M'+n+'</span><small>W'+w+'</small>':'>'+n)+'</button>'}).join('')};
    qp.innerHTML='<div class="hfq__img"><img alt=""><button type="button" class="hfq__x" aria-label="Close">&times;</button></div>'+
      '<div class="hfq__body"><h2 class="hfq__name"></h2><p class="hfq__price">Adult $'+PRICE.Adult+' &middot; Kids $'+PRICE.Kids+'</p>'+
      '<p class="hfq__lbl">Adult <span class="hfq__hint">men&#39;s (M) / women&#39;s (W)</span></p><div class="hfq__sizes">'+sz('Adult',ADULT)+'</div>'+
      '<p class="hfq__lbl">Kids</p><div class="hfq__sizes">'+sz('Kids',KIDS)+'</div>'+
      '<p class="hfq__lbl">Quantity</p><div class="hfb__step hfq__qty" role="group" aria-label="Quantity"><button type="button" data-q="-1" aria-label="One fewer">&minus;</button><span aria-live="polite">1</span><button type="button" data-q="1" aria-label="One more">+</button></div>'+
      '<p class="hfq__msg" aria-live="polite"></p>'+
      '<button type="button" class="hfb__btn hfb__btn--go hfq__add" disabled>Pick a size</button>'+
      '<a class="hfq__wheel" href="/">Customize on the wheel &rarr;</a></div>';
    qp.querySelector('.hfq__x').addEventListener('click',qClose);
    Array.prototype.forEach.call(qp.querySelectorAll('.hfq__s'),function(b){b.addEventListener('click',function(){
      qState.size=b.dataset.size;Array.prototype.forEach.call(qp.querySelectorAll('.hfq__s'),function(x){x.classList.toggle('is-on',x===b)});
      qLabel();qp.querySelector('.hfq__msg').textContent=''})});
    Array.prototype.forEach.call(qp.querySelectorAll('.hfq__qty button'),function(b){b.addEventListener('click',function(){qState.qty=Math.max(1,Math.min(10,(qState.qty||1)+(+b.dataset.q)));qLabel()})});
    qp.querySelector('.hfq__add').addEventListener('click',function(){
      var a=this;if(!qState.size)return;a.disabled=true;a.textContent='Adding…';
      var q=qState.qty||1;
      addPair(qState.sole,qState.strap,qState.size,function(ok,msg){
        qLabel();
        if(ok){qClose(true);open('Added: '+(q>1?q+' × ':'')+qState.sole+' / '+qState.strap+', '+qState.size)}else qp.querySelector('.hfq__msg').textContent=msg},q);
    });
    scrim.addEventListener('click',function(){if(qp.classList.contains('is-open'))qClose()});
    document.body.appendChild(qp);
  }
  function qLabel(){var a=qp.querySelector('.hfq__add'),q=qState.qty||1;
    qp.querySelector('.hfq__qty span').textContent=q;
    qp.querySelector('.hfq__qty [data-q="-1"]').disabled=q<=1;qp.querySelector('.hfq__qty [data-q="1"]').disabled=q>=10;
    if(!qState.size){a.disabled=true;a.textContent='Pick a size';return}
    a.disabled=false;a.textContent=(q>1?'Add '+q+' pairs':'Add to Bag')+' · '+shortSize(qState.size)+' · $'+(PRICE[qState.size.split(' ')[0]]*q)}
  function qOpen(sole,strap,title,img,href){
    qBuild();qState={sole:sole,strap:strap,size:null,qty:1};
    qp.querySelector('.hfq__name').textContent=title;qp.setAttribute('aria-label',title);
    var im=qp.querySelector('.hfq__img img');im.src=img||photo(sole,strap);im.alt=title+' flip flops';
    qp.querySelector('.hfq__wheel').href=href;
    Array.prototype.forEach.call(qp.querySelectorAll('.hfq__s'),function(x){x.classList.remove('is-on')});
    qLabel();qp.querySelector('.hfq__msg').textContent='';
    lastFocus=document.activeElement;scrim.classList.add('is-open');qp.classList.add('is-open');setTimeout(function(){qp.focus()},50);
  }
  function qClose(keepScrim){if(!qp)return;qp.classList.remove('is-open');if(keepScrim!==true)scrim.classList.remove('is-open')}
  // Card copy now matches the quick-add behavior.
  function copy(){
    Array.prototype.forEach.call(document.querySelectorAll('#hf-pairs p, [id^="tile-custom-code"] p'),function(p){
      if(/Tap one to load it onto the wheel above/.test(p.textContent))p.textContent='Tap a pair to pick your size and add it to your bag, or spin the wheel above to make your own.';
      if(/Tap a pair to load it onto the wheel, pick your size, and add it to your bag/.test(p.textContent))p.textContent=p.textContent.replace('Tap a pair to load it onto the wheel, pick your size, and add it to your bag','Tap a pair, pick your size, and add it to your bag');});
    Array.prototype.forEach.call(document.querySelectorAll('a.hfp-card[href*="sole="] .hfp-meta'),function(m){var t='$'+PRICE.Adult+' adult \u00b7 $'+PRICE.Kids+' kids';if(m.textContent!==t)m.textContent=t});
    Array.prototype.forEach.call(document.querySelectorAll('a.hfp-card[href*="sole="] .hfp-go'),function(g){if(g.textContent.indexOf('Pick your size')<0)g.innerHTML='Pick your size &rarr;'});
  }
  // FAQ sizing answer (the FAQ page is an editor section; patched here so it's live without a publish).
  function faq(){Array.prototype.forEach.call(document.querySelectorAll('details.hf-faq'),function(d){var sm=d.querySelector('summary'),p=d.querySelector('p');
    if(sm&&p&&/What sizes do you carry/.test(sm.textContent)&&!p.dataset.hf){p.dataset.hf='1';
      p.textContent='Adult sizes are men\u2019s sizes 5 through 12, and every size button shows both: M10 / W9 means men\u2019s 10 or women\u2019s 9. Women, pick the adult size one number above your usual size (a women\u2019s 9 is an Adult 10). Kids sizes are 11, 12, 13, 1, 2 and 3. Kids 11 and Adult 11 are different shoes, so sizes always show their group. If you are between sizes we suggest sizing up.'}})}
  copy();faq();setInterval(function(){copy();faq()},1000);
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a.hfp-card');if(!a||e.metaKey||e.ctrlKey||e.shiftKey)return;
    var u;try{u=new URL(a.getAttribute('href'),location.href)}catch(x){return}
    var sole=u.searchParams.get('sole'),strap=u.searchParams.get('strap');if(!sole||!strap)return;
    e.preventDefault();sole=ALIAS[sole]||sole;
    var nm=a.querySelector('.hfp-name'),im=a.querySelector('img');
    qOpen(sole,strap,nm?nm.textContent.trim():sole+' / '+strap,im&&im.src,a.getAttribute('href'));
  },true);
})();
