/* Hasta site extras. Source: lightspeed/site-extras.js. Loaded by the store-wide Custom JavaScript slot.
   1. /shop-pairs: "More from Hasta" merch row under the twelve pairs.
   2. Everywhere: hide the inventory-bin categories (Adult Sole, Kid Strap) from the catalog grid and footer.
   Waits for Instant Site's Vue app to mount before touching tiles (inserting earlier breaks hydration). */
(function(){
  var MERCH=[
    {n:'Hasta Air Freshener',m:'$6.99',h:'/products/hasta-air-freshener',i:'https://d2j6dbq0eux0bg.cloudfront.net/images/142623305/products/871125111/6373581719.jpg'},
    {n:'Hasta Stickers',m:'18 designs &middot; from $3',h:'/products/stickers',i:'https://d2j6dbq0eux0bg.cloudfront.net/images/142623305/products/871054959/6373584136.jpg'},
    {n:'Hasta Tote Bag',m:'$19.99',h:'/products/hasta-tote-bags-874635836',i:'https://d2j6dbq0eux0bg.cloudfront.net/images/142623305/products/874635836/6368191141.jpg'},
    {n:'Hasta T-Shirts',m:'From $24.99',h:'/products/t-shirts',i:'https://d2j6dbq0eux0bg.cloudfront.net/images/142623305/products/874635877/6368223365.jpg'},
    {n:'Hasta Gift Card',m:'Any amount &middot; mailed',h:'/products/hasta-gift-card',i:'https://d2j6dbq0eux0bg.cloudfront.net/images/142623305/products/877908455/6409394436.png'}
  ];
  // Hidden categories: the two inventory bins, plus an empty duplicate "Tote Bag" (the totes live in "Hasta Tote Bags").
  var BIN_CATS=['208164304','208164334','208164089','208661035'], BIN_SLUGS=['adult-sole','kid-strap','tote-bag','hasta-fans'];  // 208661035 = Hasta Fans, hidden while priced $0.00 (remove when Zach prices it)
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
    ['Tote Bags','/products/hasta-tote-bags'],['Gift Cards','/products/hasta-gift-card'],['Shop all','/shop-pairs']
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
  // Retail: Sole - Adult $40, Sole - Kids $30, both strap bins $0 (Zach 2026-11-14). Change both together.
  var PRICE={Adult:40,Kids:30};
  var GIFT_ID=877908455; // Hasta Gift Card: one $1.00 variant "Any amount"; the amount is the quantity (see section 10)
  // Pre-sale (Zach 2026-11-14). Remove this line's text (and the wheel's .hf-presale) once pairs ship normally.
  var PRESALE='<p class="hf-presale"><b>Pre-sale</b> Flip flops ship around the first week of December.</p>';
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
  '.hfq__s--mw{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.05;height:auto;padding:6px 8px;min-width:52px}.hfq__s--mw span,.hfq__s--mw small{font-size:.82rem;font-weight:700;line-height:1.15}.hfq__s--mw small{opacity:.75}'+
  '.hfq__hint{text-transform:none;letter-spacing:0;font-weight:600;margin-left:4px}'+
  '.hfq__s:hover{border-color:#13C2BB}.hfq__s.is-on{background:#F607B0;border-color:#F607B0;color:#0E0E11}'+
  '.hfq__msg{min-height:1.3em;margin:12px 0 0;font-size:.9rem;color:#B00060;font-weight:700}'+
  '.hf-presale{margin:10px 0;padding:9px 12px;border-radius:10px;background:#FDE7F6;border-left:4px solid #F607B0;color:#0E0E11;font-size:.88rem;line-height:1.4}.hf-presale b{color:#C4008A;margin-right:6px;text-transform:uppercase;letter-spacing:.04em;font-size:.8rem}'+
  'html:not(.hf-has-pairs) .hfb__foot .hf-presale,html:not(.hf-has-pairs) .hf-presale--page{display:none!important}'+
  '.ec-store .hf-presale--page,div.hf-presale--page{display:block;box-sizing:border-box;width:100%;margin:0 0 22px;padding:12px 16px;border-radius:10px;background:#FDE7F6;border-left:4px solid #F607B0;color:#0E0E11;font-size:1rem;line-height:1.45}.hf-presale--page b{color:#C4008A!important;margin-right:6px;text-transform:uppercase;letter-spacing:.04em;font-size:.82rem;font-weight:900}'+
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
      '<div class="hfb__foot">'+PRESALE+'<div class="hfb__sub"><span>Subtotal</span><span class="hfb__subv">$0.00</span></div><p class="hfb__fine">Shipping and tax are calculated at checkout.</p>'+
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
    other.forEach(function(it){count+=(it.product.id===GIFT_ID?1:it.quantity);var gift=it.product.id===GIFT_ID;var idx=items.indexOf(it),o=it.options||{},opts=gift?'Mailed gift card &middot; '+money(it.quantity*(it.product.price||1)):Object.keys(o).map(function(k){return esc(k==='Sticker Number'?'Design':k)+': '+esc(o[k])}).join(' &middot; '),stk=window.HF_STICKER_PHOTO&&window.HF_STICKER_PHOTO(it);
      rows.push('<div class="hfb__item"><div class="hfb__img">'+(function(){var m=it.product.mediaItem||{},u=stk||m.image160pxUrl||m.image400pxUrl||it.product.imageUrl;return u?'<img alt="" src="'+esc(u)+'">':''})()+'</div><div class="hfb__meta"><div class="hfb__name">'+esc(it.product.name)+'</div><div class="hfb__opts">'+opts+'</div>'+(gift?'':step(it.quantity,'l-','l+','data-i="'+idx+'"',0))+'</div><div class="hfb__price">'+money((it.product.price||0)*it.quantity)+'<button type="button" class="hfb__rm" data-act="lrm" data-i="'+idx+'">Remove</button></div></div>')});
    var pairCount=pairs.reduce(function(a,p){return a+p.qty},0);
    return {pairs:pairCount,html:rows.length?rows.join(''):'<p class="hfb__empty">Your bag is empty.</p>',sub:items.reduce(function(a,it){return a+(it.product.price||0)*it.quantity},0),count:count,empty:!items.length};
  }
  var lastCount=null;
  function render(cart){
    var r=rowsFor(cart);lastCount=r.count;badge();document.documentElement.classList.toggle('hf-has-pairs',r.pairs>0);
    if(drawer){drawer.querySelector('.hfb__list').innerHTML=r.html;drawer.querySelector('.hfb__subv').textContent=money(r.sub);drawer.querySelector('[data-act=checkout]').disabled=r.empty}
    var pl=document.getElementById('hf-cartlist');if(pl)pl.querySelector('.hfc__list').innerHTML=r.html;
  }
  // Header bag count = pairs + merch (a pair is two bin lines underneath).
  function badge(){if(lastCount===null)return;Array.prototype.forEach.call(document.querySelectorAll('.ins-header__icon--cart'),function(a){if(a.getAttribute('data-hf-count')!==String(lastCount))a.setAttribute('data-hf-count',lastCount)})}
  // Bag page: Ecwid lists every sole and strap separately (and collapses 4+ lines into a thumbnail strip).
  // Show the same pair list as the drawer instead; Ecwid's totals, gift card and checkout stay.
  // Pre-sale notice on the bag/checkout pages whenever the bag holds a pair (Zach 2026-11-14).
  function presalePage(){if(!/\/products\/(cart|checkout)/.test(location.pathname))return;var c=document.querySelector('.ec-store .ec-cart');if(!c)return;
    var prev=c.previousElementSibling;if(prev&&prev.classList.contains('hf-presale--page'))return;
    var old=document.querySelector('.hf-presale--page');if(old)old.remove();
    var d=document.createElement('div');d.className='hf-presale hf-presale--page';d.setAttribute('role','note');d.innerHTML='<b>Pre-sale</b> Flip flops ship around the first week of December.';
    c.parentNode.insertBefore(d,c)}
  function cartPage(){
    if(!onCartPage()){document.documentElement.classList.remove('hf-cartlist-on');return}
    var native=document.querySelector('.ec-store__cart-page .ec-cart__products');if(!native)return;
    var pl=document.getElementById('hf-cartlist');
    if(!pl||pl.nextElementSibling!==native){if(pl)pl.remove();pl=document.createElement('div');pl.id='hf-cartlist';pl.innerHTML='<div class="hfc__list"></div>';native.parentNode.insertBefore(pl,native);bindList(pl.querySelector('.hfc__list'));if(ecwid())cartGet(render)}
    document.documentElement.classList.add('hf-cartlist-on');
  }
  // Checkout (Zach 2026-11-08): only one way to get an order (pickup at Main Outlet), so don't make people choose it.
  // On the delivery step, if Main Outlet is the only option and already selected, continue automatically (once per
  // visit to the step, so "Change method" still works). The empty "Shipping/Pickup options" previews are hidden.
  var autoKey='hfAutoPickup';
  function pickupSkip(){
    if(!/\/products\/checkout\/delivery/.test(location.pathname)){if(!/\/products\/checkout/.test(location.pathname))try{sessionStorage.removeItem(autoKey)}catch(e){}return}
    var step=document.querySelector('.ec-cart-step--delivery.ec-cart-step--current');if(!step)return;
    var radios=[].filter.call(step.querySelectorAll('input[type=radio]'),function(r){return r.offsetParent});
    if(radios.length!==1||!radios[0].checked||!/Main Outlet/i.test(step.textContent))return;
    try{if(sessionStorage.getItem(autoKey))return;sessionStorage.setItem(autoKey,'1')}catch(e){return}
    var btn=[].find.call(step.querySelectorAll('button'),function(b){return b.offsetParent&&/Continue/i.test(b.textContent)});
    if(btn)btn.click();
  }
  // Ecwid's own order summaries (checkout sidebar, confirmation): one "Custom pair" line per sole, its strap folded in.
  function summary(){
    var items=[].filter.call(document.querySelectorAll('.ec-cart-item:not(.ec-cart-item--summary)'),function(i){return !i.closest('#hf-cartlist')});
    if(!items.length)return;
    var title=function(i){return ((i.querySelector('.ec-cart-item__title')||{}).textContent||'').trim()};
    var opt=function(i,k){var m=new RegExp((k==='Color'?'Colou?r':k)+':\\s*([^:]+?)(?=\\s*(?:Colou?r|Size):|$)').exec(((i.querySelector('.ec-cart-item__options')||{}).textContent||'').replace(/\s+/g,' ').trim());return m?m[1].trim():''};
    var straps=items.filter(function(i){return /^Strap - (Adult|Kids)$/.test(title(i))});
    items.forEach(function(i){
      var t=title(i);
      if(/^Strap - (Adult|Kids)$/.test(t)){i.style.display='none';return}
      if(!/^Sole - (Adult|Kids)$/.test(t)||i.dataset.hfPair)return;
      var size=opt(i,'Size'),sole=opt(i,'Color'),st=null;
      for(var k=0;k<straps.length;k++)if(!straps[k].dataset.hfUsed&&opt(straps[k],'Size')===size){st=straps[k];st.dataset.hfUsed='1';break}
      var tl=i.querySelector('.ec-cart-item__title'),op=i.querySelector('.ec-cart-item__options');
      if(tl)tl.textContent='Custom pair';
      if(op)op.textContent=sole+' sole · '+(st?opt(st,'Color'):'?')+' strap · '+sizeLabel(size);
      var img=i.querySelector('.ec-cart-item__picture img, img');if(img&&st){var u=photo(sole,opt(st,'Color'));if(img.getAttribute('src')!==u){img.setAttribute('src',u);img.removeAttribute('srcset')}}
      i.dataset.hfPair='1';
    });
  }
  // Ecwid counts sole + strap as two items. Show pairs + merch (lastCount) everywhere Ecwid prints a count:
  // checkout summary "5 items", Account "5 items ($84.79)", store footer "Shopping Bag (5)".
  function counts(){
    if(lastCount===null)return;var n=lastCount,word=n===1?' item':' items';
    [].forEach.call(document.querySelectorAll('.ec-cart-item-sum__count-label, .ec-cart-item-sum--items'),function(e){
      if(e.children.length)return;var v=e.textContent,w=v.replace(/^(\s*)\d+ items?/,'$1'+n+word);if(w!==v)e.textContent=w});
    [].forEach.call(document.querySelectorAll('.footer__link--shopping-cart'),function(a){
      [].forEach.call(a.childNodes,function(t){if(t.nodeType===3&&/\(\d+\)/.test(t.nodeValue)){var w=t.nodeValue.replace(/\(\d+\)/,'('+n+')');if(w!==t.nodeValue)t.nodeValue=w}})});
  }
  // (2026-11-14) Shipping is live now, so the delivery row and its "Change" link stay visible. pickupSkip() only fires when Main Outlet pickup is the ONLY option.
  setInterval(function(){css();badge();cartPage();presalePage();pickupSkip();summary();counts()},500);
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
      PRESALE+'<button type="button" class="hfb__btn hfb__btn--go hfq__add" disabled>Pick a size</button>'+
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
      p.textContent='Adult sizes are men\u2019s sizes 5 through 12, and every size button shows both: M10 / W9 means men\u2019s 10 or women\u2019s 9. Women, pick the adult size one number above your usual size (a women\u2019s 9 is an Adult 10). Kids sizes are 11, 12, 13, 1, 2 and 3. Kids 11 and Adult 11 are different shoes, so sizes always show their group. They fit true to size; if you are between sizes we suggest sizing up.'}})}
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


/* ===================================================================================================
   7. Feedback fixes (Ryan + Zach, 2026-11-07).
   - Footer "Helpful links" had no href: give each its store page. "View All" goes to /shop-pairs (pairs + merch).
   - Copy: one number (330 = 15 soles x 22 straps); no supplier / molded / Pantone / PMS; home "The Fit" card;
     "Pick your sole" (spin buttons are gone). Text lives in editor sections, so it's patched here until a publish.
   - Top scrolling banner on the home page only.
   - Hasta Fans ($0.00) hidden until priced: product card + Add to Bag.
   - Checkout: United States first in every country list, and chosen by default (US-only shipping for now).
   =================================================================================================== */
(function(){
  var FOOT={'Search Products':'/products/search','Account':'/products/account','Track Orders':'/products/account/orders',
    'Favorites':'/products/account/favorites','Shopping Bag':'/products/cart','Gift Cards':'/products/hasta-gift-card','View All':'/shop-pairs'};
  var FANS='874633242';
  var MARQ='Spin the wheel  ✦  15 sole colors  ✦  22 strap colors  ✦  330 combos  ✦  Wear Hasta Run Fasta™  ✦  Made in the Florida sunshine ☀  ✦  ';
  var CSS='html:not(.hf-home) [id^="tile-announcement-bar"]{display:none!important}'+
    'html .ins-tile--announcement-bar .ins-tile__text p::after{content:"'+new Array(9).join(MARQ)+'"}'+
    '@media(prefers-reduced-motion:reduce){html .ins-tile--announcement-bar .ins-tile__text p::after{content:"Spin the wheel  ✦  15 sole colors  ✦  22 strap colors  ✦  330 combos  ✦  Wear Hasta Run Fasta™  ✦  Made in the Florida sunshine ☀"}}'+
    'html .ec-cart--empty .ec-cart__message::after{content:"Your bag is empty.\\A\\A Spin the wheel and build a pair that is yours alone \\2014 15 colors, 330 combinations, made in the Florida sunshine."}'+
    '.grid-product--id-'+FANS+'{display:none!important}'+
    '.ec-store__product-page--'+FANS+' .details-product-purchase__add-to-bag,.ec-store__product-page--'+FANS+' .details-product-purchase__checkout,.ec-store__product-page--'+FANS+' .product-details__product-price{display:none!important}'+
    '.ec-store__product-page--'+FANS+' .product-details__sidebar::after{content:"Coming soon.";display:block;margin-top:14px;font-weight:800;color:#C4008A}';
  function css(){if(document.getElementById('hf-fix-css'))return;var s=document.createElement('style');s.id='hf-fix-css';s.textContent=CSS;document.head.appendChild(s)}
  function home(){document.documentElement.classList.toggle('hf-home',location.pathname.replace(/\/+$/,'')==='')}
  function footer(){
    // Old emailed e-gift card page is off (in-store only since 2026-11-14): every link to it goes to the mailed card product.
    Array.prototype.forEach.call(document.querySelectorAll('a[href$="/products/gift-card"]'),function(a){a.setAttribute('href','/products/hasta-gift-card')});
    Array.prototype.forEach.call(document.querySelectorAll('[id^="tile-footer"] a'),function(a){
      var k=a.textContent.trim(),h=FOOT[k];if(!h)return;
      if(a.getAttribute('href')!==h)a.setAttribute('href',h);
    });
  }
  // Text fixes, matched across line breaks; markup is left alone.
  var W='\\s+';
  function rx(str){return new RegExp(str.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\\ |\s+/g,W).replace(/'/g,"['’]"),'g')}
  var RULES=[
    [rx("Mixed to our supplier's true Pantone palette, from Hot Pink to Navy."),'Bright, bold colors, from Hot Pink to Navy.'],
    [rx('330+ Combinations'),'330 Combinations'],
    [rx('330+ combos'),'330 combos'],
    [rx('Beach-Built Comfort'),'The Fit'],
    [rx('Cushioned footbed, soft no-rub strap. Sand, pool deck, boardwalk.'),'A cushioned footbed and a soft, no-rub strap, in adult and kids sizes. Made for sand, pool decks, boardwalks, and the walk back to the car with wet feet. Fits true to size.'],
    [rx('Spin for your sole, spin for your strap, pick your size.'),'Pick your sole, pick your strap, pick your size.'],
    [rx('more than 225 combinations'),'330 combinations'],
    [rx('Every color is matched to a Pantone reference by our supplier, and we list the PMS number next to each one so you know exactly what you are getting.'),'Every photo on this site is the real product, not a rendering, so what you see is the actual color.'],
    [rx('heat is hard on any molded footwear.'),'heat is hard on any flip flop.'],
    [rx('Fifteen signature colors, matched to true Pantone references by our supplier, plus a'),'Fifteen signature colors, plus a'],
    [rx('screen approximations of Pantone references supplied by our manufacturer.'),'screen approximations.'],
    [rx(' Pantone numbers are listed for each color so you can verify against a chip.'),'']
  ];
  var KEY=/supplier|Pantone|PMS|molded|225|330\+|Beach-Built|Cushioned footbed|Spin for your sole/;
  function copy(){
    var main=document.querySelector('.ins-tiles--main')||document.body;if(!KEY.test(main.textContent))return;
    var w=document.createTreeWalker(main,NodeFilter.SHOW_TEXT,null),n,hits=[];
    while((n=w.nextNode()))if(KEY.test(n.nodeValue))hits.push(n);
    hits.forEach(function(t){var v=t.nodeValue;RULES.forEach(function(r){v=v.replace(r[0],r[1])});if(v!==t.nodeValue)t.nodeValue=v});
  }
  // Checkout country lists: United States on top and selected when nothing is chosen yet.
  function usFirst(){
    if(!/\/products\//.test(location.pathname))return;
    Array.prototype.forEach.call(document.querySelectorAll('select'),function(sel){
      if(sel.options.length<50||sel.dataset.hfUs)return;
      var us=null;for(var i=0;i<sel.options.length;i++){var o=sel.options[i];if(o.value==='US'||/^United States( of America)?$/i.test(o.text.trim())){us=o;break}}
      if(!us)return;sel.dataset.hfUs='1';
      var top=us.cloneNode(true);top.dataset.hfClone='1';
      var first=sel.options[0],ph=first&&(!first.value||/please/i.test(first.text));
      sel.insertBefore(top,ph?first.nextSibling:first);
      // Not auto-selected: Ecwid's visible label doesn't follow a scripted value, so the customer picks it (it's first).
    });
  }
  function go(){css();home();var r=document.getElementById('ec-instantsite-website');if(r&&!r.__vue_app__)return;footer();copy();usFirst()}
  go();document.readyState==='loading'&&document.addEventListener('DOMContentLoaded',go);setInterval(go,700);
})();


/* ===================================================================================================
   8. Zach + Amy, 2026-11-14.
   - Nav "Flip Flops" + ticker text now live in the editor (2026-11-14 publish).
   - Patent pending wheel wording (About + FAQ); quality copy (high quality, long lasting: won't curl or stretch,
     superior fit & finish) on the home band, About, FAQ. The wheel itself carries the instructions box.
   - "Wear Hasta Run Fasta™ (Run in flip flops at your own risk)": logo block on home + About, line in the footer.
   - Palm trees (embroidered-patch art from the shirts) on the dark bands, favorites heading, footer.
   Text lives in editor sections, so it's patched here until a publish. Art: hasta-assets/theme/.
   =================================================================================================== */
(function(){
  var ART='https://cdn.jsdelivr.net/gh/KrauseysDevelopment/hasta-assets@3a274c1961b538b7a75c251b5fa9120855e928d9/theme/';
  var PINK=ART+'palm-pink.png',TEAL=ART+'palm-teal.png',LOGO=ART+'wear-hasta-run-fasta.jpg';
  var TAG='Wear Hasta Run Fasta™',RISK='(Run in flip flops at your own risk)';
  var CSS=
    '.hf-palm{position:absolute;pointer-events:none;user-select:none;z-index:0;height:auto}'+
    '.hf-palm--flip{transform:scaleX(-1)}'+
    '#hf-band,.hfp-hero{position:relative;overflow:hidden}#hf-band>.hf-band__inner,.hfp-hero>*:not(.hf-palm){position:relative;z-index:1}'+
    '#hf-band .hf-palm{width:min(260px,30vw);bottom:-18px;opacity:.9}#hf-band .hf-palm--l{left:-30px}#hf-band .hf-palm--r{right:-30px}'+
    '.hfp-hero .hf-palm{width:min(200px,24vw);bottom:30px;opacity:.95}.hfp-hero .hf-palm--l{left:2%}.hfp-hero .hf-palm--r{right:2%}'+
    '@media(max-width:700px){#hf-band .hf-palm{width:120px;opacity:.35}.hfp-hero .hf-palm{width:90px;opacity:.5;bottom:40px}}'+
    '.hf-palmi{display:inline-block;height:1.6em;width:auto;vertical-align:-.45em;margin:0 .45em}'+
    '.hf-quality{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:-18px 0 30px;padding:0;list-style:none}'+
    '.hf-quality li{font-weight:800;font-size:.9rem;padding:7px 14px;border-radius:999px;border:2px solid #13C2BB;color:#fff}'+
    '.hf-quality li:nth-child(2){border-color:#F607B0}'+
    '.hf-run{background:#fff;padding:46px 20px 40px;text-align:center;position:relative;overflow:hidden}'+
    '.hf-run img.hf-run__logo{display:block;width:min(520px,88vw);height:auto;margin:0 auto 10px}'+
    '.hf-run__tag{margin:0;font-weight:900;font-size:1.35rem;color:#0E0E11;letter-spacing:.01em}'+
    '.hf-run__risk{margin:4px 0 0;font-size:.95rem;color:#5a5664;font-style:italic}'+
    '.hf-run .hf-palm{width:min(170px,20vw);bottom:20px;opacity:1}.hf-run .hf-palm--l{left:4%}.hf-run .hf-palm--r{right:4%}'+
    '@media(max-width:700px){.hf-run .hf-palm{display:none}}'+
    '.hf-foot-run{display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;text-align:center;padding:20px 16px 26px;margin:0;background:#0E0E11;color:#fff}'+
    '.hf-foot-run img{height:54px;width:auto}.hf-foot-run b{display:block;font-size:1.1rem;font-weight:900}.hf-foot-run small{display:block;opacity:.75;font-size:.85rem}';
  function css(){if(document.getElementById('hf-z8-css'))return;var s=document.createElement('style');s.id='hf-z8-css';s.textContent=CSS;document.head.appendChild(s)}
  function img(src,cls,alt){var i=document.createElement('img');i.src=src;i.alt=alt||'';i.className=cls;i.loading='lazy';i.decoding='async';if(!alt)i.setAttribute('aria-hidden','true');return i}
  function palms(host){if(!host||host.querySelector(':scope>.hf-palm'))return;host.appendChild(img(PINK,'hf-palm hf-palm--l'));host.appendChild(img(TEAL,'hf-palm hf-palm--r hf-palm--flip'))}
  function runBlock(){var d=document.createElement('section');d.className='hf-run';d.setAttribute('aria-label',TAG);
    d.appendChild(img(LOGO,'hf-run__logo','Wear Hasta Run Fasta (Run in flip flops at your own risk)'));
    d.insertAdjacentHTML('beforeend','<p class="hf-run__tag">'+TAG+'</p><p class="hf-run__risk">'+RISK+'</p>');palms(d);return d}
  // Nav label "Flip Flops" is set in the editor (Header & Menu), not here: a runtime swap flashed the old label and reflowed the nav on every page load.
  function band(){var b=document.getElementById('hf-band');if(!b)return;palms(b);
    var cards=b.querySelector('.hf-cards');if(cards&&!b.querySelector('.hf-quality'))cards.insertAdjacentHTML('afterend','<ul class="hf-quality"><li>High quality</li><li>Long lasting: won’t curl or stretch</li><li>Superior fit &amp; finish</li></ul>');
    var tile=b.closest('[id^="tile-"]');if(tile&&!document.getElementById('hf-run-home')){var r=runBlock();r.id='hf-run-home';tile.parentNode.insertBefore(r,tile.nextSibling)}}
  function hero(){Array.prototype.forEach.call(document.querySelectorAll('.hfp-hero'),palms);
    Array.prototype.forEach.call(document.querySelectorAll('.hfp-eyebrow'),function(e){if(e.dataset.hfPalm)return;e.dataset.hfPalm='1';
      e.insertBefore(img(PINK,'hf-palmi'),e.firstChild);e.appendChild(img(TEAL,'hf-palmi hf-palm--flip'))})}
  function foot(){var f=document.querySelector('[id^="tile-footer"]');if(!f||f.querySelector('.hf-foot-run'))return;
    var box=f.querySelector('.ins-tile__wrap')||f;var d=document.createElement('div');d.className='hf-foot-run';
    d.appendChild(img(PINK,''));d.insertAdjacentHTML('beforeend','<div><b>'+TAG+'</b><small>'+RISK+'</small></div>');d.appendChild(img(TEAL,'hf-palm--flip'));box.appendChild(d)}
  function about(){var pg=document.querySelector('#tile-custom-code-gRb3gA .hf-page');if(!pg)return;
    Array.prototype.forEach.call(pg.querySelectorAll('p'),function(p){
      if(/patented two-wheel design/.test(p.textContent)&&!p.dataset.hf){p.dataset.hf='1';
        p.textContent='Our Flip Flop Color Selector is a patent pending wheel. Spin the outer clear wheel to match up your favorite colors and create a pair of flip flops. The back wheel is solid white and does not spin. The version on this site is the same idea, just digital: every picture is the actual color combination.'}
      if(/^\s*A cushioned footbed and a soft, no-rub strap/.test(p.textContent)&&!p.dataset.hf){p.dataset.hf='1';
        p.textContent='High quality and long lasting: Hasta flip flops don’t curl and don’t stretch, and the fit and finish are a cut above. A cushioned footbed and a soft, no-rub strap, in adult and kids sizes. Made for sand, pool decks, boardwalks, and the walk back to the car with wet feet. They fit true to size.'}
    });
    var h1=pg.querySelector('.hf-h1');if(h1&&!h1.dataset.hfPalm){h1.dataset.hfPalm='1';h1.appendChild(img(PINK,'hf-palmi'))}
    var tile=pg.closest('[id^="tile-"]');if(tile&&!document.getElementById('hf-run-about')){var r=runBlock();r.id='hf-run-about';tile.parentNode.insertBefore(r,tile.nextSibling)}}
  function faq(){var list=document.querySelectorAll('details.hf-faq');if(!list.length)return;
    Array.prototype.forEach.call(list,function(d){var sm=d.querySelector('summary'),p=d.querySelector('p');if(!sm||!p||p.dataset.hfz)return;
      if(/How does the color wheel work/.test(sm.textContent)){p.dataset.hfz='1';
        p.textContent='Our patent pending flip flop color selector wheel: spin the outer clear wheel to match up your favorite colors and create a pair of flip flops (the back wheel is solid white and does not spin). The wheel on this site works the same way. Tap a sole or a strap, drag the sliders, or tap HASTA for a random pair; the pair under the pointer is your pair, and the photo is the actual color combination. Pick your size, add it to your bag, and your exact colors travel with the order.'}});
    if(!document.getElementById('hf-faq-quality')){var first=list[0],q=document.createElement('details');q.className='hf-faq';q.id='hf-faq-quality';
      q.innerHTML='<summary>Will they curl or stretch?</summary><div><p>No. Hasta flip flops are high quality and long lasting: they don’t curl and they don’t stretch, with a superior fit and finish pair after pair.</p></div>';
      var after=list[1]||first;after.parentNode.insertBefore(q,after.nextSibling)}}
  function bandFit(){var b=document.getElementById('hf-band');if(!b)return;Array.prototype.forEach.call(b.querySelectorAll('.hf-card p'),function(p){
    if(/^A cushioned footbed/.test(p.textContent.trim())&&!p.dataset.hfz){p.dataset.hfz='1';p.textContent='High quality and long lasting: won’t curl, won’t stretch. A cushioned footbed and a soft, no-rub strap, in adult and kids sizes. Fits true to size.'}})}
  function go(){css();var r=document.getElementById('ec-instantsite-website');if(r&&!r.__vue_app__)return;
    band();bandFit();hero();foot();about();faq()}
  go();document.readyState==='loading'&&document.addEventListener('DOMContentLoaded',go);setInterval(go,800);
})();


/* ===================================================================================================
   9. Stickers (Zach 2026-11-14): "when you click on stickers you see all the options", obvious names.
   Retail keeps ONE product "Hasta Stickers" (eCom 871054959) with 18 variants, attribute "Design"
   (renamed from "Sticker Number"; values renamed from "4-Black Dog" etc.), so the POS is unchanged.
   The Stickers category page shows all 18 as cards with their own photo and Add to Bag.
   Photos: hasta-assets/stickers/NN-slug.jpg (square crops of the product shots). Prices from Retail:
   $3, except How to Put On / Large Run Fasta / Life Is Better at $4. If Retail changes, change STK.
   =================================================================================================== */
(function(){
  var PID=871054959,BASE='https://cdn.jsdelivr.net/gh/KrauseysDevelopment/hasta-assets@da9f4fd3a7a8fcad1f1e073e63ce5efce8ee4924/stickers/';
  var STK=[['Support Your Local Flip Flop Dealer','01-support-local',3],['Support Your Local Flip Flop Dealer (Holographic)','02-support-local-holo',3],
    ['Hasta on the Moon','03-hasta-on-the-moon',3],['Black Dog','04-black-dog',3],['Beach Day','05-beach-day',3],['Tattoo Shark','06-tattoo-shark',3],
    ['Hasta Tiki','07-hasta-tiki',3],['Hula Girl','08-hula-girl',3],['Shark Girl','09-shark-girl',3],['Hot Rod','10-hot-rod',3],['Skelly Shark','11-skelly-shark',3],
    ['Lightning Bolt','12-lightning-bolt',3],['Wear Hasta Run Fasta (Small)','13-run-fasta-small',3],['Old School Tattoo Ship','14-tattoo-ship',3],
    ['Old School Tattoo Flip Flops','15-tattoo-flip-flops',3],['How to Put On Flip Flops','16-how-to-put-on',4],['Wear Hasta Run Fasta (Large)','17-run-fasta-large',4],
    ['Life Is Better in Flip Flops','18-life-is-better',4]];
  var BY={};STK.forEach(function(r){BY[r[0]]=r});
  window.HF_STICKER_PHOTO=function(it){if(!it||!it.product||it.product.id!==PID)return null;var o=it.options||{},v=o.Design||o['Sticker Number'];return BY[v]?BASE+BY[v][1]+'.jpg':null};
  var esc=function(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
  var CSS='html.hf-stk .grid-product--id-'+PID+'{display:none!important}'+
    'html.hf-stk .grid__wrap-inner{flex-wrap:wrap}#hf-stk{flex:0 0 100%;max-width:100%;margin:0 0 34px;padding:0;box-sizing:border-box}'+
    'html.hf-stk .grid__products:not(:has(.grid-product:not(.grid-product--id-'+PID+'))){display:none}'+
    '#hf-stk h2{font-size:1.5rem;font-weight:900;margin:0 0 4px}#hf-stk>p{margin:0 0 18px;color:#5a5664}'+
    '.hfs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:16px}'+
    '.hfs-card{background:#fff;border:1px solid #eee;border-radius:14px;overflow:hidden;display:flex;flex-direction:column}'+
    '.hfs-card img{display:block;width:100%;aspect-ratio:1/1;object-fit:cover;background:#f4f4f4}'+
    '.hfs-body{padding:10px 12px 12px;display:flex;flex-direction:column;gap:6px;flex:1}'+
    '.hfs-name{font-weight:800;font-size:.92rem;line-height:1.25;color:#0E0E11}.hfs-price{font-size:.88rem;color:#5a5664}'+
    '.hfs-add{margin-top:auto;border:0;border-radius:999px;background:#0E0E11;color:#fff;font-weight:800;font-size:.85rem;padding:9px 12px;cursor:pointer}'+
    '.hfs-add:hover{background:#C4008A}.hfs-add[disabled]{opacity:.6;cursor:wait}';
  function css(){if(document.getElementById('hf-stk-css'))return;var s=document.createElement('style');s.id='hf-stk-css';s.textContent=CSS;document.head.appendChild(s)}
  function add(name,btn){if(!window.Ecwid||!Ecwid.Cart)return;btn.disabled=true;var t=btn.textContent;btn.textContent='Adding…';
    var tries=['Design','Sticker Number'];
    (function go(i){var o={};o[tries[i]]=name;Ecwid.Cart.addProduct({id:PID,quantity:1,options:o,callback:function(ok){
      if(!ok&&i+1<tries.length)return go(i+1);btn.disabled=false;btn.textContent=ok?'Added ✓':'Try again';setTimeout(function(){btn.textContent=t},1600);
      if(ok&&window.HastaBag)HastaBag.open()}})})(0)}
  function grid(){var onCat=/^\/products\/stickers\/?$/.test(location.pathname);document.documentElement.classList.toggle('hf-stk',onCat);
    var old=document.getElementById('hf-stk');if(!onCat){if(old)old.remove();return}
    if(old)return;var host=document.querySelector('.ec-store .grid__products, .ec-store .grid-product');if(!host)return;
    host=host.closest('.grid__products')||host.parentNode;
    var d=document.createElement('div');d.id='hf-stk';
    d.innerHTML='<h2>Pick your stickers</h2><p>'+STK.length+' designs. Made by Sticker Mule for coolers, boards, bumpers and water bottles.</p><div class="hfs-grid">'+
      STK.map(function(r){return '<div class="hfs-card"><img loading="lazy" alt="'+esc(r[0])+' sticker" src="'+BASE+r[1]+'.jpg"><div class="hfs-body"><div class="hfs-name">'+esc(r[0])+'</div><div class="hfs-price">$'+r[2].toFixed(2)+'</div><button type="button" class="hfs-add" data-name="'+esc(r[0])+'">Add to Bag</button></div></div>'}).join('')+'</div>';
    d.addEventListener('click',function(e){var b=e.target.closest('.hfs-add');if(b)add(b.getAttribute('data-name'),b)});
    host.parentNode.insertBefore(d,host)}
  function label(){if(!/\/products\/hasta-stickers/.test(location.pathname))return;
    Array.prototype.forEach.call(document.querySelectorAll('.product-details-module__title'),function(t){if(t.textContent.trim()==='Sticker Number')t.textContent='Design'})}
  function go(){css();var r=document.getElementById('ec-instantsite-website');if(r&&!r.__vue_app__)return;grid();label()}
  go();document.readyState==='loading'&&document.addEventListener('DOMContentLoaded',go);setInterval(go,700);
})();


/* ===================================================================================================
   10. Gift cards (Zach + Amy 2026-11-14): physical cards only, mailed, any amount.
   Retail product "Hasta Gift Card" (eCom 877908455) has ONE variant, Amount "Any amount", at $1.00, no tax,
   no inventory. The product page swaps Ecwid's price/option/quantity block for an amount box ($1 to $1,000)
   and adds that many $1 units, so a $50 card is quantity 50 = $50.00. The emailed e-gift card is off
   (Retail > Gift cards > Sales channel: In-store only). Amy loads the value on a physical card before mailing.
   Also: the store's own all-products page (/products) gets a flip flops banner, since the pairs aren't
   regular products there.
   =================================================================================================== */
(function(){
  var ID=877908455,MIN=1,MAX=1000,OPT={Amount:'Any amount'};
  var CSS='.ec-store__product-page--'+ID+' .product-details__product-price-row,.ec-store__product-page--'+ID+' .details-product-option--Amount,.ec-store__product-page--'+ID+' .details-product-purchase{display:none!important}'+
    '#hf-gc{margin:18px 0 8px}#hf-gc label{display:block;font-weight:800;margin:0 0 8px;color:#0E0E11}'+
    '#hf-gc .hfg-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}'+
    '#hf-gc .hfg-amt{display:flex;align-items:center;border:2px solid #0E0E11;border-radius:12px;padding:0 12px;height:48px;background:#fff}'+
    '#hf-gc .hfg-amt span{font-weight:900;font-size:1.2rem;margin-right:4px}#hf-gc input{border:0;outline:0;width:110px;font-size:1.2rem;font-weight:800;background:transparent;color:#0E0E11}'+
    '#hf-gc .hfg-chips{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0 0}#hf-gc .hfg-chips button{border:1px solid #ddd;background:#fff;border-radius:999px;padding:6px 12px;font-weight:700;cursor:pointer}#hf-gc .hfg-chips button:hover{border-color:#F607B0;color:#C4008A}'+
    '#hf-gc .hfg-help{margin:8px 0 0;font-size:.85rem;color:#5a5664}#hf-gc .hfg-err{color:#C4008A;font-weight:700}'+
    '#hf-gc .hfg-add{margin-top:14px;width:100%;max-width:360px;height:52px;border:0;border-radius:999px;background:#0E0E11;color:#fff;font-weight:800;font-size:1rem;cursor:pointer}#hf-gc .hfg-add:hover{background:#C4008A}#hf-gc .hfg-add[disabled]{opacity:.5;cursor:not-allowed}'+
    '#hf-ff{display:flex;align-items:center;gap:18px;margin:0 0 28px;padding:18px 20px;border-radius:16px;background:#0E0E11;color:#fff;flex-wrap:wrap}'+
    '#hf-ff img{width:96px;height:96px;object-fit:contain;background:#fff;border-radius:12px}#hf-ff .hff-t{flex:1;min-width:200px}#hf-ff b{display:block;font-size:1.25rem;font-weight:900}#hf-ff small{display:block;opacity:.8;margin-top:4px;font-size:.92rem}'+
    '#hf-ff a{display:inline-block;padding:11px 18px;border-radius:999px;font-weight:800;text-decoration:none;white-space:nowrap}#hf-ff .hff-a{background:#F607B0;color:#0E0E11!important}#hf-ff .hff-b{background:#13C2BB;color:#0E0E11!important}';
  function css(){if(document.getElementById('hf-gc-css'))return;var s=document.createElement('style');s.id='hf-gc-css';s.textContent=CSS;document.head.appendChild(s)}
  function val(i){var n=Math.round(parseFloat(String(i.value).replace(/[^0-9.]/g,'')));return isFinite(n)?n:0}
  function panel(){var page=document.querySelector('.ec-store__product-page--'+ID);if(!page||page.querySelector('#hf-gc'))return;
    var anchor=page.querySelector('.details-product-purchase')||page.querySelector('.product-details__general-info');if(!anchor)return;
    var d=document.createElement('div');d.id='hf-gc';
    d.innerHTML='<label for="hfg-in">Gift card amount</label><div class="hfg-row"><div class="hfg-amt"><span>$</span><input id="hfg-in" type="number" inputmode="numeric" min="'+MIN+'" max="'+MAX+'" step="1" value="50" aria-describedby="hfg-help"></div></div>'+
      '<div class="hfg-chips">'+[25,50,75,100,150].map(function(n){return '<button type="button" data-v="'+n+'">$'+n+'</button>'}).join('')+'</div>'+
      '<p class="hfg-help" id="hfg-help">Any whole-dollar amount from $'+MIN+' to $'+MAX.toLocaleString()+'. Mailed as a physical card; no e-gift cards yet.</p>'+
      '<button type="button" class="hfg-add">Add $50 gift card to bag</button>';
    anchor.parentNode.insertBefore(d,anchor);
    var inp=d.querySelector('input'),btn=d.querySelector('.hfg-add'),help=d.querySelector('.hfg-help');
    function upd(){var n=val(inp),ok=n>=MIN&&n<=MAX;btn.disabled=!ok;btn.textContent=ok?'Add $'+n.toLocaleString()+' gift card to bag':'Enter $'+MIN+' to $'+MAX.toLocaleString();help.classList.toggle('hfg-err',!ok&&inp.value!=='')}
    inp.addEventListener('input',upd);
    d.querySelector('.hfg-chips').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;inp.value=b.getAttribute('data-v');upd();inp.focus()});
    btn.addEventListener('click',function(){var n=val(inp);if(!(n>=MIN&&n<=MAX)||!window.Ecwid||!Ecwid.Cart)return;btn.disabled=true;btn.textContent='Adding…';
      Ecwid.Cart.addProduct({id:ID,quantity:n,options:OPT,callback:function(ok){btn.textContent=ok?'Added ✓':'Sorry, try again';setTimeout(upd,1500);if(ok&&window.HastaBag)HastaBag.open()}})});
    upd()}
  // Checkout summary: "Hasta Gift Card x 50 $50.00" reads fine; just say what it is.
  function summary(){Array.prototype.forEach.call(document.querySelectorAll('.ec-cart-item'),function(i){var t=i.querySelector('.ec-cart-item__title');if(!t||!/^Hasta Gift Card$/.test(t.textContent.trim()))return;
    var o=i.querySelector('.ec-cart-item__options');if(o&&!o.dataset.hfg){o.dataset.hfg='1';o.textContent='Mailed gift card (amount = quantity × $1)'}})}
  function storeHome(){if(!/^\/products\/?$/.test(location.pathname)){var x=document.getElementById('hf-ff');if(x)x.remove();return}
    if(document.getElementById('hf-ff'))return;var host=document.querySelector('.ec-store .grid__wrap, .ec-store .ec-store__content-wrapper, .ec-store');if(!host)return;
    var d=document.createElement('div');d.id='hf-ff';
    d.innerHTML='<img alt="Hot Pink sole with Teal strap" src="https://cdn.jsdelivr.net/gh/KrauseysDevelopment/hasta-assets@f1e48a4fd6661d55ea06467f7096fb5511c1f87c/combos/pink--teal.jpg"><div class="hff-t"><b>Flip flops</b><small>330 sole and strap combos, $40 adult / $30 kids. Pre-sale: ships around the first week of December.</small></div><a class="hff-a" href="/shop-pairs">Shop favorites</a><a class="hff-b" href="/#wheel">Build your own</a>';
    host.insertBefore(d,host.firstChild)}
  function go(){css();var r=document.getElementById('ec-instantsite-website');if(r&&!r.__vue_app__)return;panel();summary();storeHome()}
  go();document.readyState==='loading'&&document.addEventListener('DOMContentLoaded',go);setInterval(go,600);
})();
