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
  var BIN_CATS=['208164304','208164334'], BIN_SLUGS=['adult-sole','kid-strap'];
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
  function dropdown(){
    var links=document.querySelectorAll('.ins-header__menu-link-title');
    for(var k=0;k<links.length;k++){
      if(links[k].textContent.trim()!=='Shop')continue;
      var host=links[k].parentElement;if(host.querySelector('.hf-dd'))continue;
      host.classList.add('hf-has-dd');
      var d=document.createElement('div');d.className='hf-dd';d.setAttribute('role','menu');d.innerHTML=menuHtml('hf-dd__a');
      host.appendChild(d);
    }
  }
  CSS+='.hf-has-dd{position:relative}'+
    '.hf-has-dd>.ins-header__menu-link-title::after{content:"";display:inline-block;width:6px;height:6px;margin:0 0 3px 7px;border:solid currentColor;border-width:0 2px 2px 0;transform:rotate(45deg);transition:transform .15s}'+
    '.hf-has-dd:hover>.ins-header__menu-link-title::after,.hf-has-dd:focus-within>.ins-header__menu-link-title::after{transform:rotate(-135deg);margin-bottom:-1px}'+
    '.hf-dd{position:absolute;top:100%;left:50%;transform:translate(-50%,6px);min-width:220px;padding:10px;background:#fff;border-radius:14px;box-shadow:0 16px 40px rgba(14,14,17,.18);border-top:4px solid #F607B0;'+
    'display:flex;flex-direction:column;opacity:0;visibility:hidden;transition:opacity .15s,transform .15s,visibility .15s;z-index:1000;text-align:left}'+
    '.hf-dd::before{content:"";position:absolute;left:0;right:0;top:-16px;height:16px}'+
    '.hf-has-dd:hover>.hf-dd,.hf-has-dd:focus-within>.hf-dd{opacity:1;visibility:visible;transform:translate(-50%,0)}'+
    '.hf-dd__a,.hf-dd__a:visited{display:block;padding:9px 12px;border-radius:9px;color:#0E0E11!important;font-weight:700;font-size:.95rem;text-decoration:none;white-space:nowrap;line-height:1.2}'+
    '.hf-dd__a:hover,.hf-dd__a:focus{background:#FDE7F6;color:#C4008A!important}'+
    '.hf-dd__a:nth-child(3){border-top:1px solid rgba(14,14,17,.08);margin-top:4px;padding-top:13px}'+
    '.hf-dd__a:last-child{border-top:1px solid rgba(14,14,17,.08);margin-top:4px;padding-top:13px;color:#13C2BB!important}';
  function go(){css();if(!ready())return;footer();merch();dropdown()}
  go();document.readyState==='loading'&&document.addEventListener('DOMContentLoaded',go);setInterval(go,1000);
})();
