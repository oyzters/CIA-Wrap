/*
 * ITSON Wrap - content script (reskin + shell Nivel B).
 * Corre en cada frame de smartweb*.itson.edu.mx.
 * - Reskin (content.css): re-estiliza en su lugar todas las pantallas.
 * - Shell (shell.css): SOLO en la homepage clásica (donde existe el pagelet
 *   #MENU) reconstruye un sidebar + topbar + tarjetas reusando los links
 *   reales de PeopleSoft (clic = original.click(), la navegación no cambia).
 * No hace red (salvo REMOTE_CSS_URL opcional), no lee credenciales; solo usa
 * storage local para recordar on/off.
 */
var REMOTE_CSS_URL = "";

(function () {
  'use strict';
  var api = (typeof browser !== 'undefined') ? browser : chrome;
  var KEY = 'itson_wrap_enabled';
  var TKEY = 'itson_wrap_theme';
  var enabled = true;
  var theme = 'dark';   // default: oscuro (paleta del mockup)

  function themeIcon(){
    return ic(theme === 'dark'
      ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>'
      : '<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/>');
  }
  function applyTheme(){ document.documentElement.classList.toggle('iw-dark', enabled && theme === 'dark'); }
  function paintThemeBtns(){ document.querySelectorAll('[data-theme-toggle]').forEach(function(b){ b.innerHTML = themeIcon(); }); }
  function setTheme(v){ theme = v; saveCache(); try { api.storage.local.set({ itson_wrap_theme: v }); } catch (e) {} applyTheme(); paintThemeBtns(); paintLogos(); }

  // logo (PotroNET) empaquetado en la extension
  var LOGO_DARK = '', LOGO_LIGHT = '';
  try { LOGO_DARK = api.runtime.getURL('assets/logo-dark.png'); LOGO_LIGHT = api.runtime.getURL('assets/logo-light.png'); } catch (e) {}
  function logoSrc(){ return theme === 'dark' ? LOGO_DARK : LOGO_LIGHT; }
  function paintLogos(){}
  // marca: badge con monograma academico + wordmark
  function brandBadge(){ return '<div class="iw-badge">'+ic('<path d="M12 3 2 8l10 5 8-4"/><path d="M6 11v5c0 1.5 2.7 2.6 6 2.6s6-1.1 6-2.6v-5"/>')+'</div>'; }

  /* ---------- iconos ---------- */
  function ic(p){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'; }
  var ICON = {
    student:'<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-5"/>',
    home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.6V21h14V9.6"/><path d="M9.5 21v-6h5v6"/>',
    calendar:'<rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/><path d="m8.5 14.5 2.3 2.3 4.5-4.8"/>',
    clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5l3.4 2"/>',
    wallet:'<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18v3"/><rect x="3" y="7.5" width="18" height="13" rx="2.5"/><circle cx="17" cy="14" r="1.5"/>',
    receipt:'<path d="M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    idcard:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="8.5" cy="11" r="2.3"/><path d="M5.3 16c.7-1.7 5-1.7 5.7 0"/><path d="M14 9.5h4M14 12.5h4M14 15.5h2.5"/>',
    mapPin:'<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    award:'<circle cx="12" cy="9" r="5"/><path d="M8.5 13.4 7 22l5-3 5 3-1.5-8.6"/>',
    clipboard:'<rect x="5" y="4" width="14" height="17" rx="2.5"/><path d="M9 4.5V3.5h6v1"/><path d="M9 11h6M9 15h4"/>',
    trending:'<path d="M3 16.5 9 10l4 3.5L21 5.5"/><path d="M15.5 5.5H21v5.5"/>',
    compare:'<path d="M8 4 4 8l4 4"/><path d="M4 8h13"/><path d="m16 20 4-4-4-4"/><path d="M20 16H7"/>',
    admission:'<circle cx="9" cy="8" r="3.4"/><path d="M3.5 20c.5-3.3 3.6-5.4 5.5-5.4"/><path d="M17.5 8.5v6M14.5 11.5h6"/>',
    docs:'<path d="M8 3h7l5 5v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v5h5"/><path d="M9.5 13.5h6M9.5 16.5h4"/>',
    shieldHeart:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="M12 15s-3-1.9-3-3.9a1.7 1.7 0 0 1 3-1.1 1.7 1.7 0 0 1 3 1.1c0 2-3 3.9-3 3.9z"/>',
    shieldCheck:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m8.5 12 2.4 2.4 4.6-5"/>',
    userX:'<circle cx="9" cy="8" r="3.4"/><path d="M3.5 20c.5-3.3 3.6-5.4 5.5-5.4"/><path d="m15.5 10 5 5M20.5 10l-5 5"/>',
    repeat:'<path d="M17 2.5 21 6l-4 3.5"/><path d="M3 11.5v-1a4 4 0 0 1 4-4h14"/><path d="M7 21.5 3 18l4-3.5"/><path d="M21 12.5v1a4 4 0 0 1-4 4H3"/>',
    community:'<circle cx="9" cy="8" r="3.2"/><path d="M15 5.2a3.2 3.2 0 0 1 0 5.6"/><path d="M3 20c0-3.2 2.7-5 6-5s6 1.8 6 5"/><path d="M17 15.2c2.4 0 4 1.6 4 4.8"/>',
    sliders:'<circle cx="8" cy="6.5" r="2"/><path d="M4 6.5h2M10 6.5h10"/><circle cx="15" cy="12" r="2"/><path d="M4 12h9M17 12h3"/><circle cx="9" cy="17.5" r="2"/><path d="M4 17.5h3M11 17.5h9"/>',
    bars:'<path d="M4 21V11M9.3 21V4M14.6 21v-7M20 21V8"/><path d="M3 21h18"/>',
    wrench:'<path d="M14.6 6.4a4 4 0 0 1-5.2 5.2L4 17l3 3 5.4-5.4a4 4 0 0 0 5.2-5.2l-2.4 2.4-2.6-.6-.6-2.6z"/>',
    lock:'<rect x="4" y="10" width="16" height="10.5" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14v2.5"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/>',
    book:'<path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H19v17H7.5A2.5 2.5 0 0 0 5 21.5z"/><path d="M5 21.5A2.5 2.5 0 0 1 7.5 19H19"/>',
    folder:'<path d="M4 6h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/>'
  };
  // color por categoría (energía tipo dashboard, duotono suave sobre oscuro)
  function colorFor(name){
    var t=(name||'').toLowerCase();
    if(t.indexOf('autoservicio')>=0) return ['#5b9dff','rgba(91,157,255,.15)'];
    if(t.indexOf('inscrip')>=0) return ['#a78bfa','rgba(167,139,250,.16)'];
    if(t.indexOf('finanz')>=0||t.indexOf('pago')>=0||t.indexOf('cuenta')>=0) return ['#2dd4bf','rgba(45,212,191,.15)'];
    if(t.indexOf('datos')>=0||t.indexOf('personal')>=0||t.indexOf('direccion')>=0) return ['#38bdf8','rgba(56,189,248,.15)'];
    if(t.indexOf('registro')>=0||t.indexOf('calific')>=0||t.indexOf('académic')>=0||t.indexOf('academic')>=0) return ['#f59e0b','rgba(245,158,11,.16)'];
    if(t.indexOf('progreso')>=0||t.indexOf('gradua')>=0) return ['#34d399','rgba(52,211,153,.15)'];
    if(t.indexOf('convalida')>=0) return ['#f472b6','rgba(244,114,182,.16)'];
    if(t.indexOf('admisi')>=0) return ['#818cf8','rgba(129,140,248,.15)'];
    if(t.indexOf('trámite')>=0||t.indexOf('tramite')>=0) return ['#fb923c','rgba(251,146,60,.16)'];
    if(t.indexOf('seguro')>=0) return ['#10b981','rgba(16,185,129,.15)'];
    if(t.indexOf('alumnado')>=0||t.indexOf('alumno')>=0||t.indexOf('tutor')>=0) return ['#60a5fa','rgba(96,165,250,.15)'];
    if(t.indexOf('comunidad')>=0) return ['#f472b6','rgba(244,114,182,.15)'];
    if(t.indexOf('informe')>=0) return ['#38bdf8','rgba(56,189,248,.15)'];
    return ['#5b9dff','rgba(91,157,255,.15)'];
  }
  function iconFor(name){
    var t=(name||'').toLowerCase();
    // sub-ítems específicos primero (para que los accesos rápidos no repitan íconos)
    if(/horario/.test(t)) return ICON.clock;
    if(/cita|calendario/.test(t)) return ICON.calendar;
    if(/ficha|recibo|pago web/.test(t)) return ICON.receipt;
    if(/cuenta|adeudo/.test(t)) return ICON.wallet;
    if(/calific|boleta/.test(t)) return ICON.award;
    if(/direccion/.test(t)) return ICON.mapPin;
    if(/tel[ée]fono/.test(t)) return ICON.idcard;
    if(/reporte|progreso/.test(t)) return ICON.trending;
    if(/situaci[óo]n|expediente|actividad|petici[óo]n/.test(t)) return ICON.clipboard;
    // secciones
    if(/autoservicio/.test(t)) return ICON.student;
    if(/inscrip/.test(t)) return ICON.calendar;
    if(/finanz/.test(t)) return ICON.wallet;
    if(/datos|personal|nombre/.test(t)) return ICON.idcard;
    if(/registro|acad[ée]mic/.test(t)) return ICON.award;
    if(/gradua/.test(t)) return ICON.trending;
    if(/convalida/.test(t)) return ICON.compare;
    if(/admisi/.test(t)) return ICON.admission;
    if(/tr[áa]mite|ex[áa]men/.test(t)) return ICON.docs;
    if(/facultativo/.test(t)) return ICON.shieldHeart;
    if(/seguro|accidente/.test(t)) return ICON.shieldCheck;
    if(/alumnado|centro de alum/.test(t)) return ICON.home;
    if(/baja|tutor/.test(t)) return ICON.userX;
    if(/programa|revalida/.test(t)) return ICON.repeat;
    if(/comunidad/.test(t)) return ICON.community;
    if(/sacr|definici|instalaci/.test(t)) return ICON.sliders;
    if(/informe/.test(t)) return ICON.bars;
    if(/peopletools/.test(t)) return ICON.wrench;
    if(/contrase/.test(t)) return ICON.lock;
    if(/personaliza/.test(t)) return ICON.sliders;
    if(/perfil/.test(t)) return ICON.user;
    if(/diccionario/.test(t)) return ICON.book;
    return ICON.folder;
  }

  /* ---------- CSS remoto opcional ---------- */
  function injectRemoteCss(){
    if(!REMOTE_CSS_URL || document.getElementById('itson-wrap-remote')) return;
    var l=document.createElement('link'); l.id='itson-wrap-remote'; l.rel='stylesheet'; l.href=REMOTE_CSS_URL;
    (document.head||document.documentElement).appendChild(l);
  }

  /* ---------- reskin base ---------- */
  function applyReskin(){ document.documentElement.classList.toggle('itson-wrap', enabled); }

  /* ---------- paginas de seccion (frameset) ---------- */
  function frameName(){ try { return window.name || ''; } catch (e) { return ''; } }

  // Rol del frame por su URL (FIJA), no por window.name (PeopleSoft lo muta al navegar).
  //   TOP     = documento superior (frameset)
  //   NAV     = arbol de navegacion  (IScript_PT_NAV_INFRAME)
  //   HDR     = cabecera             (IScript_UniHeader_Frame)
  //   CONTENT = contenido real       (el resto)
  function frameRole(){
    if(window.top === window.self) return 'TOP';
    var u=''; try { u = location.href || ''; } catch (e) {}
    if(u.indexOf('IScript_PT_NAV_INFRAME') >= 0) return 'NAV';
    if(u.indexOf('IScript_UniHeader_Frame') >= 0) return 'HDR';
    return 'CONTENT';
  }

  // cada frame se marca segun su rol para que el CSS lo skinne como sidebar/topbar/contenido
  function applyRoles(){
    // OJO: PeopleSoft reasigna window.name del doc superior al navegar; los roles
    // (y sus reglas de ocultamiento) solo deben aplicar en FRAMES HIJOS reales.
    var r = frameRole(), de = document.documentElement;
    de.classList.toggle('iw-nav', enabled && r === 'NAV');
    de.classList.toggle('iw-hdr', enabled && r === 'HDR');
    de.classList.toggle('iw-content', enabled && r === 'CONTENT');
  }

  // ensancha el sidebar UNA SOLA VEZ por documento (solo el doc superior).
  // OJO: hacerlo en cada mutacion (observer) corrompia la geometria -> aqui es idempotente.
  function tuneFrameset(){
    if (frameRole() !== 'TOP' || !enabled) return;
    var de = document.documentElement;
    if (de.classList.contains('iw-tuned')) return;
    var inner = document.querySelector('frameset[cols]');
    if (!inner) return;
    try { inner.cols = '240,*'; de.classList.add('iw-tuned'); } catch (e) {}
  }

  /* ---------- SHELL nivel B (solo homepage) ---------- */
  // Navega DIRECTO a la URL del link (evita addExtraParam/saveWarning de PeopleSoft,
  // que rompen entre frames de distintos puertos por CSP y document.domain).
  function relay(orig){
    return function(e){
      e.preventDefault();
      var href=''; try{ href = orig.href || orig.getAttribute('href') || ''; }catch(err){}
      if(href && href.indexOf('javascript:')!==0){
        try{ window.top.location.href = href; return; }catch(err){}
        try{ location.href = href; return; }catch(err){}
      }
      try{ orig.click(); }catch(err){}   // ultimo recurso (href javascript:)
    };
  }
  function txt(el){ return (el.textContent||'').replace(/\s+/g,' ').trim(); }
  function norm(s){ return String(s||'').toLowerCase().replace(/\s+/g,' ').trim(); }
  // título de la página abierta (lo pone PeopleSoft en el frameset superior)
  function topTitle(){
    var t=''; try{ t=(window.top.document.title||'').trim(); }catch(e){}
    if(/registry content|navegaci[óo]n base|^$/i.test(t)){
      try{ t=window.top.__iwPageTitle||''; }catch(e){ t=''; }
    }
    return t;
  }
  // las carpetas (IScript_AppHP) se titulan todas "Página de Navegación Base":
  // el frame de contenido conoce el nombre real y se lo pasa a la ruta superior
  function shareTitle(t){
    try{ window.top.__iwPageTitle=t; }catch(e){}
    try{
      var hd=window.top.frames['UniversalHeader'].document, now=hd.querySelector('.iw-crumb-now');
      if(now) now.textContent=t;
      else { var nav=hd.querySelector('.iw-crumbs'); if(nav) nav.insertAdjacentHTML('beforeend','<span class="iw-crumb-sep">/</span><span class="iw-crumb iw-crumb-now" aria-current="page">'+esc(t)+'</span>'); }
    }catch(e){}
  }

  function collectNav(){
    var folders=[], leaves=[], seen={};
    document.querySelectorAll('#MENU a.PSNAVPARENTLINK').forEach(function(a){
      var t=txt(a); if(!t || seen['f'+t]) return; seen['f'+t]=1;
      folders.push({ text:t, desc:a.getAttribute('title')||'', el:a });
    });
    document.querySelectorAll('#MENU a.PTNAVLINK').forEach(function(a){
      var t=txt(a); if(!t || seen['l'+t]) return; seen['l'+t]=1;
      leaves.push({ text:t, desc:a.getAttribute('title')||'', el:a });
    });
    return { folders:folders, leaves:leaves };
  }

  function hideOriginals(){
    var mark=function(el){ if(el) el.classList.add('iw-orig'); };
    var q=function(s){ return document.querySelector(s); };
    var closestTable=function(el){ return el ? el.closest('table') : null; };
    mark(closestTable(q('.globeBar')));                                   // header Oracle
    mark(closestTable(q('a.PSHYPERLINK[href*="PORTAL_HOMEPAGE"]')));      // barra Personalizar
    mark(closestTable(q('.PSSTATICIMAGE')));                              // Powered by
    var menu=document.getElementById('MENU'); if(menu) mark(menu.closest('table')||menu); // pagelet Menú
    // "Ayuda" suelto arriba a la derecha
    document.querySelectorAll('a.SMALL[href*="htmldoc"]').forEach(function(a){ mark(closestTable(a)); });
  }

  function buildShell(){
    if(window.top!==window.self) return;
    if(!document.getElementById('MENU')) return;          // solo homepage clásica
    if(document.getElementById('iw-shell')) return;
    var nav=collectNav();
    if(!nav.folders.length && !nav.leaves.length) return;

    var shell=document.createElement('div'); shell.id='iw-shell';

    /* sidebar */
    var side='<aside id="iw-side"><div id="iw-brand">'+brandBadge()+'<div class="iw-bt"><b>ITSON CIA Wrap</b><span>Autoservicio</span></div></div><nav id="iw-nav">';
    if(nav.folders.length){
      side+='<div class="g">Menú principal</div>';
      nav.folders.forEach(function(f,i){ var col=colorFor(f.text); side+='<a data-k="f'+i+'" style="--c:'+col[0]+'"><span class="iw-ico">'+ic(iconFor(f.text))+'</span><span>'+f.text+'</span></a>'; });
    }
    if(nav.leaves.length){
      side+='<div class="g">Sistema</div>';
      nav.leaves.forEach(function(f,i){ var col=colorFor(f.text); side+='<a data-k="l'+i+'" style="--c:'+col[0]+'"><span class="iw-ico">'+ic(iconFor(f.text))+'</span><span>'+f.text+'</span></a>'; });
    }
    side+='</nav></aside>';

    /* topbar */
    var top='<div id="iw-top">'
      + '<div id="iw-search">'+ic('<circle cx="11" cy="11" r="7"/><path d="m21 21-4-4"/>')+'<input id="iw-q" type="text" placeholder="Buscar en el portal…" autocomplete="off"></div>'
      + '<div class="sp"></div>'
      + '<a class="tl" data-hdr="inicio">'+ic('<path d="M3 9.5 12 3l9 6.5V21H3z"/>')+'<span>Inicio</span></a>'
      + '<a class="tl" data-hdr="favorito">'+ic('<path d="M12 3l2.9 6 6.6.6-5 4.4 1.5 6.5L12 17l-6 3.5L7.5 14l-5-4.4 6.6-.6z"/>')+'<span>Favoritos</span></a>'
      + '<button class="ic" data-theme-toggle title="Tema claro/oscuro">'+themeIcon()+'</button>'
      + '<a class="tl" data-hdr="desconex">'+ic('<path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><path d="M10 17l5-5-5-5M15 12H3"/>')+'<span>Salir</span></a>'
      + '<div class="av">'+ic('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/>')+'</div>'
      + '</div>';

    /* main (hero + tarjetas de carpetas) */
    var main='<main id="iw-main"><p class="eyebrow">Menú principal</p>'
      + '<h1>¿Qué necesitas hacer hoy?</h1>'
      + '<p class="lede">Accede a tu información y actividades de autoservicio: inscripciones, calificaciones, pagos y trámites, todo desde aquí.</p>'
      + '<h2 class="sect">Secciones <span class="c">'+nav.folders.length+'</span></h2><div id="iw-grid">';
    nav.folders.forEach(function(f,i){
      var col=colorFor(f.text);
      main+='<a class="card" data-k="f'+i+'" style="--c:'+col[0]+';--cs:'+col[1]+'"><div class="top"><div class="tile">'+ic(iconFor(f.text))+'</div>'
        + '<div class="iw-cardhd"><h3>'+f.text+'</h3></div>'
        + '<svg class="arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M9 7h8v8"/></svg></div>'
        + (f.desc?'<p class="desc">'+f.desc+'</p>':'') + '</a>';
    });
    main+='</div></main>';

    shell.innerHTML=side+top+main;
    document.body.appendChild(shell);

    /* wiring: cada item nuevo dispara el link real */
    var byKey={};
    nav.folders.forEach(function(f,i){ byKey['f'+i]=f.el; });
    nav.leaves.forEach(function(f,i){ byKey['l'+i]=f.el; });
    shell.querySelectorAll('[data-k]').forEach(function(node){
      var orig=byKey[node.getAttribute('data-k')];
      if(orig) node.addEventListener('click', relay(orig));
    });
    // links del header
    var hdr=document.querySelectorAll('a.headerLinkActive');
    shell.querySelectorAll('[data-hdr]').forEach(function(node){
      var key=node.getAttribute('data-hdr'), match=null;
      hdr.forEach(function(a){ if(txt(a).toLowerCase().indexOf(key)>=0) match=a; });
      if(match) node.addEventListener('click', relay(match));
    });
    // buscador -> reusa el form nativo
    var q=shell.querySelector('#iw-q');
    if(q) q.addEventListener('keydown', function(e){
      if(e.key!=='Enter') return;
      var oi=document.querySelector('input[name="SEARCH_TEXT"]'), go=document.querySelector('a[name="Go"]');
      if(oi && go){ oi.value=q.value; go.click(); }
    });
    // tema
    shell.querySelectorAll('[data-theme-toggle]').forEach(function(b){
      b.addEventListener('click', function(){ setTheme(theme==='dark'?'light':'dark'); });
    });

    hideOriginals();
    document.documentElement.classList.add('iw-shell');
  }

  function removeShell(){
    var s=document.getElementById('iw-shell'); if(s) s.remove();
    document.documentElement.classList.remove('iw-shell');
    document.querySelectorAll('.iw-orig').forEach(function(el){ el.classList.remove('iw-orig'); });
  }

  /* ---------- SIDEBAR del frame NAV (paginas de seccion) ---------- */
  // firma de la navegacion actual: si cambia (otra seccion), reconstruimos
  function navSignature(){
    var sel=document.querySelector('a.PTNAVSELPARENTLINK');
    var n=document.querySelectorAll('a.PSNAVPARENTLINK, a.PTNAVLINK').length;
    return (sel?(sel.getAttribute('name')||''):'') + '#' + n;
  }

  function buildNavSidebar(){
    if(frameRole()!=='NAV' || !enabled) return;  // solo el frame de navegacion (por URL)
    var sig = navSignature();
    var existings = document.querySelectorAll('#iw-navwrap');
    if(existings.length === 1 && existings[0].getAttribute('data-sig') === sig) return; // misma seccion: nada
    existings.forEach(function(e){ e.remove(); });          // limpiar cualquier duplicado antes de reconstruir

    var anchors = document.querySelectorAll('a.PTNAVSELPARENTLINK, a.PSNAVPARENTLINK, a.PTNAVLINK');
    var items=[], seen={};
    anchors.forEach(function(a){
      var t=txt(a); if(!t) return;                       // saltar anclas de solo icono
      var nm=a.getAttribute('name')||t, key=nm+'|'+t;
      if(seen[key]) return; seen[key]=1;
      var row=a.closest('tr');
      items.push({
        text:t, el:a, name:nm,
        indented: !!(row && row.querySelector('td[width="12"]')),
        selected: a.classList.contains('PTNAVSELPARENTLINK')
      });
    });
    if(!items.length) return;

    var current = items.filter(function(i){return i.selected;})[0];
    var children = items.filter(function(i){return i.indented;});
    var others   = items.filter(function(i){return !i.indented && !i.selected;});

    // página abierta = la que coincide con el título del frameset (el árbol de
    // PeopleSoft solo marca la carpeta, no la página dentro de ella)
    var pageTitle = norm(topTitle());
    function itemHtml(it,k){
      var col=colorFor(it.text), here=pageTitle && norm(it.text)===pageTitle;
      return '<a class="iw-item'+(it.selected||here?' on':'')+'"'+(here?' aria-current="page"':'')+' data-k="'+k+'" style="--c:'+col[0]+'">'
        + '<span class="iw-ico">'+ic(iconFor(it.text))+'</span><span>'+it.text+'</span></a>';
    }

    var h='<div class="iw-brand">'+brandBadge()+'<div class="iw-brandtxt"><b>ITSON CIA Wrap</b><span>'
      + (current?current.text:'Portal') + '</span></div>'
      + '<button class="iw-themebtn" data-theme-toggle title="Tema claro/oscuro">'+themeIcon()+'</button></div>';
    h+='<div class="iw-search">'+ic('<circle cx="11" cy="11" r="7"/><path d="m21 21-4-4"/>')
      + '<input id="iw-navq" placeholder="Buscar…" autocomplete="off"></div>';
    h+='<nav class="iw-navlist">';
    var map={};
    if(children.length){ h+='<div class="iw-g">En esta sección</div>';
      children.forEach(function(it,i){ map['c'+i]=it.el; h+=itemHtml(it,'c'+i); }); }
    // dentro de una sección, el resto del portal se pliega: es lo que menos se
    // usa ahí y empujaba la sección actual fuera de la vista
    if(others.length){
      h+='<details class="iw-grp"'+(children.length?'':' open')+'><summary class="iw-g">Portal</summary>';
      others.forEach(function(it,i){ map['o'+i]=it.el; h+=itemHtml(it,'o'+i); });
      h+='</details>';
    }
    h+='</nav>';

    var wrap=document.createElement('div'); wrap.id='iw-navwrap'; wrap.innerHTML=h;
    wrap.setAttribute('data-sig', sig);
    document.body.appendChild(wrap);

    wrap.querySelectorAll('[data-k]').forEach(function(n){
      var o=map[n.getAttribute('data-k')]; if(o) n.addEventListener('click', relay(o));
    });
    wrap.querySelectorAll('[data-theme-toggle]').forEach(function(b){
      b.addEventListener('click', function(){ setTheme(theme==='dark'?'light':'dark'); });
    });
    var q=wrap.querySelector('#iw-navq');
    if(q) q.addEventListener('keydown', function(e){
      if(e.key!=='Enter' || !q.value.trim()) return;
      var form=document.querySelector('form[name="srchnav"]');
      var action=form ? (form.getAttribute('action')||'') : '';
      if(action){ window.top.location.href = action + (action.indexOf('?')<0?'?':'&') + 'SEARCH_TEXT=' + encodeURIComponent(q.value); }
    });

    document.documentElement.classList.add('iw-nav-built');
  }

  function removeNavSidebar(){
    document.querySelectorAll('#iw-navwrap').forEach(function(w){ w.remove(); });
    document.documentElement.classList.remove('iw-nav-built');
  }

  /* ---------- TOPBAR del frame UniversalHeader (paginas de seccion) ---------- */
  function buildHeaderBar(){
    if(frameRole()!=='HDR' || !enabled) return;  // solo el frame de cabecera (por URL)
    if(document.getElementById('iw-topbar')) return;

    var links=[];
    document.querySelectorAll('a.headerLinkActive').forEach(function(a){
      var t=txt(a); if(t) links.push({t:t, el:a});
    });

    var homeI=ic('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.6V21h14V9.6"/><path d="M9.5 21v-6h5v6"/>');
    var starI=ic('<path d="M12 3l2.6 5.5 6 .5-4.5 4 1.3 6-5.4-3.2L6.6 19l1.3-6-4.5-4 6-.5z"/>');
    var outI=ic('<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l5-5-5-5M15 12H3"/>');
    // ruta: Inicio › sección › página. Sale del frameset superior (mismo
    // origen): EOPP.SCLabel trae la sección y el <title> la página.
    var sec='', page=topTitle();
    try{ sec=new URL(window.top.location.href).searchParams.get('EOPP.SCLabel')||''; }catch(e){}
    var h='<nav class="iw-crumbs" aria-label="Ruta"><a class="iw-crumb-home" data-h="home">'+homeI+'</a>';
    if(sec && norm(sec)!==norm(page)) h+='<span class="iw-crumb-sep">/</span><span class="iw-crumb">'+esc(sec)+'</span>';
    if(page) h+='<span class="iw-crumb-sep">/</span><span class="iw-crumb iw-crumb-now" aria-current="page">'+esc(page)+'</span>';
    h+='</nav><div class="iw-sp"></div>';
    var map={};
    links.forEach(function(it,i){
      map[i]=it.el; var tl=it.t.toLowerCase();
      var ico = tl.indexOf('inicio')>=0?homeI : tl.indexOf('favorit')>=0?starI : (tl.indexOf('desconex')>=0||tl.indexOf('salir')>=0)?outI : '';
      var cls = (tl.indexOf('desconex')>=0||tl.indexOf('salir')>=0)?'iw-tl iw-tl-out':'iw-tl';
      h+='<a class="'+cls+'" data-h="'+i+'">'+ico+'<span>'+it.t+'</span></a>';
    });
    h+='<button class="iw-tb-theme" data-theme-toggle title="Tema claro/oscuro">'+themeIcon()+'</button>';

    var bar=document.createElement('div'); bar.id='iw-topbar'; bar.innerHTML=h;
    document.body.appendChild(bar);

    links.forEach(function(it,i){ if(it.t.toLowerCase().indexOf('inicio')>=0) map.home=it.el; });
    bar.querySelectorAll('[data-h]').forEach(function(n){
      var o=map[n.getAttribute('data-h')]; if(o) n.addEventListener('click', relay(o));
    });
    bar.querySelectorAll('[data-theme-toggle]').forEach(function(b){
      b.addEventListener('click', function(){ setTheme(theme==='dark'?'light':'dark'); });
    });

    document.documentElement.classList.add('iw-hdr-built');
  }
  function removeHeaderBar(){
    document.querySelectorAll('#iw-topbar').forEach(function(b){ b.remove(); });
    document.documentElement.classList.remove('iw-hdr-built');
  }

  /* ---------- TILES del contenido (AppHP) -> tarjetas ---------- */
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  // navega a un tile: carpetas -> recargan el frameset (psp); componentes -> abren el componente
  function tileNav(href, isFolder){
    if(!href) return;
    if(isFolder){
      try{
        var u=new URL(href, location.href);
        var pt=u.searchParams.get('pt_fname')||u.searchParams.get('fname')||'';
        var fp=u.searchParams.get('FolderPath')||'';
        if(pt){
          var base=u.origin+u.pathname.replace('/psc/','/psp/');
          window.top.location.href = base+'?pt_fname='+encodeURIComponent(pt)+'&FolderPath='+encodeURIComponent(fp)+'&IsFolder=true';
          return;
        }
      }catch(e){}
    }
    window.top.location.href = href;
  }

  function buildTiles(){
    if(frameRole()!=='CONTENT' || !enabled) return;
    var u=''; try{ u=location.href; }catch(e){}
    if(u.indexOf('IScript_AppHP')<0) return;              // solo paginas de tiles, no componentes con datos
    var nodes=document.querySelectorAll('td.EOPP_SCSECTIONFOLDER, td.EOPP_SCSECTIONCONTENT');
    var sig=String(nodes.length)+'|'+u.slice(-48);
    var ex=document.getElementById('iw-tiles');
    if(ex){ if(ex.getAttribute('data-sig')===sig) return; ex.remove(); }
    var titleEl=document.querySelector('.EOPP_SCPAGETITLESECTION');
    // carpeta sin opciones para este usuario (p. ej. "Convalidaciones"): igual
    // se reconstruye, con un estado vacío, en vez de dejar la página original
    if(!nodes.length && !titleEl) return;

    var pageTitle=txt(titleEl)||'Autoservicio';
    shareTitle(pageTitle);
    var pageDesc=txt(document.querySelector('.EOPP_SCPAGEDESCRSECTION'))||'';

    var cardsHtml='', quick=[];
    [].forEach.call(nodes, function(td){
      var isFolder=td.classList.contains('EOPP_SCSECTIONFOLDER');
      var head=td.querySelector(isFolder?'a.EOPP_SCSECTIONFOLDERLINK':'a.EOPP_SCSECTIONCONTENTLINK');
      if(!head) return;
      var title=txt(head); if(!title) return;
      var desc=txt(td.querySelector('.EOPP_SCADDITIONALTEXT'))||head.getAttribute('title')||'';
      var links='', seen={}, kc=0;
      [].forEach.call(td.querySelectorAll('a.EOPP_SCCHILDCONTENTLINK'), function(a){
        var t=txt(a); if(!t||seen[a.href]) return; seen[a.href]=1; kc++;
        links+='<a class="iw-link" data-h="'+esc(a.href)+'" data-f="0" href="'+esc(a.href)+'"><span class="iw-dot"></span>'+esc(t)+'</a>';
      });
      var more=td.querySelector('a.EOPP_SCMORELINK');
      var moreN=more ? (parseInt((txt(more).match(/\d+/)||[0])[0],10)||0) : 0;
      var totalN=kc+moreN;
      if(more){ links+='<a class="iw-morelink" data-h="'+esc(more.href)+'" data-f="1" href="'+esc(more.href)+'">'+esc(txt(more))+' →</a>'; }
      var col=colorFor(title), iconHtml=ic(iconFor(title));
      // acceso rápido: primer sub-link real de la carpeta, o el componente directo
      if(isFolder){
        var fk=null, kk=td.querySelectorAll('a.EOPP_SCCHILDCONTENTLINK');
        for(var qi=0; qi<kk.length; qi++){ if(txt(kk[qi])){ fk=kk[qi]; break; } }
        if(fk) quick.push({ t:txt(fk), href:fk.href, c:col, ic:ic(iconFor(txt(fk))) });
      } else {
        quick.push({ t:title, href:head.href, c:col, ic:ic(iconFor(title)) });
      }
      cardsHtml+='<div class="card" style="--c:'+col[0]+';--cs:'+col[1]+'">'
        + '<div class="top" data-h="'+esc(head.href)+'" data-f="'+(isFolder?'1':'0')+'">'
        + '<div class="tile">'+ic(iconFor(title))+'</div>'
        + '<div class="iw-cardhd"><h3>'+esc(title)+'</h3>'
        + (totalN?'<span class="iw-count"><i></i>'+totalN+(totalN===1?' acceso':' accesos')+'</span>':'')
        + '</div>'
        + '<svg class="arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M9 7h8v8"></path></svg>'
        + '</div>'
        + (desc?'<p class="desc">'+esc(desc)+'</p>':'')
        + (links?'<div class="iw-links">'+links+'</div>':'')
        + '</div>';
    });
    var quickHtml='';
    quick.slice(0,6).forEach(function(q){
      quickHtml+='<a class="iw-qcard" data-h="'+esc(q.href)+'" data-f="0" href="'+esc(q.href)+'" style="--c:'+q.c[0]+';--cs:'+q.c[1]+'">'
        + '<span class="iw-qi">'+q.ic+'</span>'
        + '<span class="iw-qt"><b>'+esc(q.t)+'</b><em>Acceso directo</em></span>'
        + '<svg class="iw-qa" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></a>';
    });

    var main=document.createElement('main'); main.id='iw-tiles'; main.setAttribute('data-sig',sig);
    main.innerHTML='<p class="eyebrow">Menú principal</p><h1>'+esc(pageTitle)+'</h1>'
      + (pageDesc?'<p class="lede">'+esc(pageDesc)+'</p>':'')
      + (quickHtml?'<div class="iw-qlabel">Accesos rápidos</div><div class="iw-quick">'+quickHtml+'</div>':'')
      + (cardsHtml
          ? '<h2 class="iw-gridlabel">Todas las secciones</h2><div id="iw-grid">'+cardsHtml+'</div>'
          : '<div class="iw-empty">'+ic(ICON.folder)+'<b>No hay opciones disponibles</b>'
            + '<span>Tu cuenta no tiene accesos en esta sección por ahora.</span></div>');
    document.body.appendChild(main);

    main.querySelectorAll('[data-h]').forEach(function(el){
      el.addEventListener('click', function(e){ e.preventDefault(); tileNav(el.getAttribute('data-h'), el.getAttribute('data-f')==='1'); });
    });
    document.documentElement.classList.add('iw-tiles-built');
  }
  function removeTiles(){
    document.querySelectorAll('#iw-tiles').forEach(function(m){ m.remove(); });
    document.documentElement.classList.remove('iw-tiles-built');
  }

  /* ---------- ANCHO COMPLETO en pantallas de componente ---------- */
  // PeopleTools maqueta cada pantalla con tablas cuya primera fila fija el ancho
  // de cada columna en px (p. ej. [0,4,520,8,...,399]) y coloca el contenido con
  // colspan/rowspan. Estirar la tabla reparte el sobrante entre TODAS las
  // columnas: separa etiquetas de campos y manda botones a la orilla. En vez de
  // eso, cada tabla de maquetación recibe una columna de relleno al final y solo
  // se extienden hacia ella las celdas que ya tocaban el borde derecho y traen un
  // bloque (rejilla, caja, línea). Las filas de formulario quedan como estaban.
  // Excepción: si hay una barra lateral (celda con rowspan al borde, como en el
  // Centro de Alumnado) lo que crece es la columna principal, no el relleno.
  // Idempotente (data-iwx): lo re-llama el MutationObserver en cada postback.
  // Al desactivar la extensión, la maqueta vuelve a la original al recargar.
  var EDGE_SLACK = 40;   // px de columnas separadoras que aún cuentan como "borde"
  function isLayoutTable(t){
    if(t.closest('[class*=GRIDROW],[class*=GRIDODDROW],[class*=GRIDEVENROW]')) return false;
    if(t.querySelector(':scope > tbody > tr > td.ssstabactive, :scope > tbody > tr > td.PSACTIVETAB, :scope > tbody > tr > td > img[src*="_TAB"]')) return false;
    var r=t.querySelector(':scope > tbody > tr'); if(!r) return false;
    var cs=[].filter.call(r.children, function(c){ return c.tagName==='TD'; });
    // solo maquetas en px: las de % (barra "Nueva Ventana | Ayuda", width="10%")
    // ya son fluidas, y leer "10%" como 10px las aplastaba a una letra por línea
    return cs.length>=2 && cs.every(function(c){ return /^\d+$/.test((c.getAttribute('width')||'').trim()); });
  }
  // ¿la celda trae un bloque de verdad (rejilla, caja, área de desplazamiento,
  // contenedor ancho) o solo un control suelto envuelto en su tablita?
  function hasBlock(cell){
    if(cell.querySelector('hr, .PSHORIZONTALRULE') || cell.matches('.PSHORIZONTALRULE')) return true;
    return [].some.call(cell.querySelectorAll('table'), function(t){
      return /GRID|GROUPBOX|SCROLLAREA|PSFRAME/.test(t.className) || (parseInt(t.getAttribute('width'),10)||0) >= 300;
    });
  }
  function colWidths(row){
    var ws=[];
    [].forEach.call(row.children, function(c){
      var cs=+c.getAttribute('colspan')||1, w=(parseInt(c.getAttribute('width'),10)||0)/cs;
      for(var i=0;i<cs;i++) ws.push(w);
    });
    return ws;
  }
  // width="0" el navegador lo toma como automático y se traga el sobrante
  function pinWidth(c, w){ c.style.setProperty('width', w+'px', 'important'); c.style.setProperty('min-width', w+'px', 'important'); c.style.setProperty('max-width', w+'px', 'important'); }
  function cellHasContent(td){
    return !!(txt(td) || td.querySelector('input, select, textarea, img, table, a, hr, .PSHORIZONTALRULE'));
  }
  // columnas usadas por alguna celda con contenido (respetando rowspan/colspan)
  function deadColumns(rows, N){
    var used=[], occ=[];
    rows.forEach(function(tr, ri){
      if(ri===0) return;
      occ[ri]=occ[ri]||[];
      var col=0;
      [].forEach.call(tr.children, function(td){
        while(occ[ri][col]) col++;
        var cs=+td.getAttribute('colspan')||1, rs=+td.getAttribute('rowspan')||1;
        for(var r=0;r<rs;r++){ occ[ri+r]=occ[ri+r]||[]; for(var c=0;c<cs;c++) occ[ri+r][col+c]=1; }
        if(cellHasContent(td)) for(var c2=0;c2<cs;c2++) used[col+c2]=true;
        col+=cs;
      });
    });
    return used;
  }
  function expandTable(t){
    var rows=[].slice.call(t.querySelectorAll(':scope > tbody > tr'));
    var head=rows[0];

    var sidebar=rows.slice(1).some(function(tr){
      var l=tr.lastElementChild;
      return l && (+l.getAttribute('rowspan')||1)>1 && hasBlock(l);
    });
    if(sidebar){
      var main=null, mw=0;
      [].forEach.call(head.children, function(c){
        var w=parseInt(c.getAttribute('width'),10)||0; pinWidth(c, w);
        if(w>mw){ mw=w; main=c; }
      });
      if(main){ main.style.setProperty('width','auto','important'); main.style.removeProperty('max-width'); }
      return;
    }

    var widths=colWidths(head), N=widths.length, edge=N, acc=0;
    while(edge>0 && acc+widths[edge-1]<=EDGE_SLACK){ acc+=widths[edge-1]; edge--; }
    // columnas que ninguna celda con contenido toca (márgenes del diseño
    // original, p. ej. 400px vacíos a la izquierda de un formulario): se colapsan
    var used=deadColumns(rows, N);
    var ci=0;
    [].forEach.call(head.children, function(c){
      var cs=+c.getAttribute('colspan')||1, w=parseInt(c.getAttribute('width'),10)||0, live=false;
      for(var k=0;k<cs;k++) if(used[ci+k]) live=true;
      pinWidth(c, live ? w : Math.min(w, 6));
      ci+=cs;
    });
    var fill=document.createElement('td'); fill.className='iw-fill'; head.appendChild(fill);

    // ocupación por rowspan para saber en qué columna termina cada fila
    var occ=[];
    rows.forEach(function(tr, ri){
      if(ri===0) return;
      occ[ri]=occ[ri]||[];
      var col=0, last=null, lastEnd=0;
      [].forEach.call(tr.children, function(td){
        while(occ[ri][col]) col++;
        var cs=+td.getAttribute('colspan')||1, rs=+td.getAttribute('rowspan')||1;
        for(var r=0;r<rs;r++){ occ[ri+r]=occ[ri+r]||[]; for(var c=0;c<cs;c++) occ[ri+r][col+c]=1; }
        col+=cs; last=td; lastEnd=col;
      });
      if(!last || lastEnd<edge) return;
      if(!hasBlock(last)) return;
      for(var c=lastEnd;c<N;c++) if(occ[ri][c]) return;
      var rs=+last.getAttribute('rowspan')||1;
      last.setAttribute('colspan', (+last.getAttribute('colspan')||1)+(N-lastEnd)+1);
      for(var r=0;r<rs;r++) for(var k=lastEnd;k<=N;k++) (occ[ri+r]=occ[ri+r]||[])[k]=1;
    });
  }
  function expandLayout(){
    if(frameRole()!=='CONTENT' || !enabled || !document.querySelector('table.PSPAGECONTAINER')) return;
    [].forEach.call(document.querySelectorAll('table'), function(t){
      if(t.dataset.iwx || !isLayoutTable(t)) return;
      t.dataset.iwx='1';
      try{ expandTable(t); }catch(e){}
      t.style.setProperty('width','100%','important');
    });
    // contenedores con ancho fijo propio (cajas, rejillas): llenan su celda
    [].forEach.call(document.querySelectorAll('table[class*=GRID], table[class*=GROUPBOX], table[class*=SCROLLAREA], table.PSFRAMEWBO, table.PSFRAMENBO, table.PABACKGROUNDINVISIBLE, table.PABACKGROUNDINVISIBLEWBO, table.PSPAGECONTAINER'), function(t){
      if(!t.closest('[class*=GRIDROW]')) t.style.setProperty('width','100%','important');
    });
    [].forEach.call(document.querySelectorAll('table.PSGROUPBOX > tbody > tr > td[width], table.PSGROUPBOXWBO > tbody > tr > td[width]'), function(td){
      if(td.parentElement.children.length===1) td.removeAttribute('width');
    });
  }

  /* ---------- Rejillas anchas y cortas -> ficha etiqueta/valor ---------- */
  // Con el ancho completo, una rejilla de 1-2 filas y 6+ columnas (cada clase en
  // "Mi Horario": Estado, Uni, Calificación...) deja los datos perdidos entre
  // cabeceras lejanas. Se marca cada celda con la etiqueta de su columna y el
  // CSS (.iw-kv) la pinta como pares que se acomodan solos. Las rejillas largas
  // siguen siendo tabla: ahí comparar fila contra fila sí importa.
  var KV_MAX_ROWS = 2, KV_MIN_COLS = 5;
  function kvGrids(){
    if(frameRole()!=='CONTENT' || !enabled) return;
    [].forEach.call(document.querySelectorAll('table[class*="GRID"]'), function(t){
      if(t.dataset.iwkv) return;
      t.dataset.iwkv='0';
      var rows=[].slice.call(t.querySelectorAll(':scope > tbody > tr'));
      var hdr=rows.filter(function(r){ return r.querySelector(':scope > [class*="GRIDCOLUMNHDR"]'); })[0];
      if(!hdr) return;
      var data=rows.filter(function(r){ return r!==hdr && r.querySelector(':scope > [class*="GRIDROW"], :scope > [class*="GRIDODDROW"], :scope > [class*="GRIDEVENROW"]'); });
      var labels=[];
      [].forEach.call(hdr.children, function(c){
        var cs=+c.getAttribute('colspan')||1, l=txt(c);
        for(var i=0;i<cs;i++) labels.push(l);
      });
      if(!data.length || data.length>KV_MAX_ROWS || labels.length<KV_MIN_COLS) return;
      data.forEach(function(r){
        var ci=0;
        [].forEach.call(r.children, function(td){
          td.setAttribute('data-iw-label', labels[ci]||'');
          ci+=+td.getAttribute('colspan')||1;
          if(!txt(td) && !td.querySelector('img, input, select, a')) td.classList.add('iw-kv-empty');
        });
      });
      hdr.classList.add('iw-kv-hdr');
      t.classList.add('iw-kv');
      t.dataset.iwkv='1';
    });
  }

  /* ---------- Listas repetidas sin rejilla -> filas ---------- */
  // Algunas pantallas (el catálogo de "Explorar Catálogo") no usan una rejilla
  // PSLEVEL*GRID sino una tabla de maquetación que repite una fila por registro.
  // Se reconocen por enlaces con índice ($0, $1, $2...) en filas distintas.
  function listRows(){
    if(frameRole()!=='CONTENT' || !enabled) return;
    [].forEach.call(document.querySelectorAll('table.PABACKGROUNDINVISIBLE, table.PABACKGROUNDINVISIBLEWBO'), function(t){
      if(t.dataset.iwrows) return;
      t.dataset.iwrows='0';
      var rows=[].slice.call(t.querySelectorAll(':scope > tbody > tr')), idx={}, first=-1;
      rows.forEach(function(tr, i){
        var a=tr.querySelector(':scope > td a[id*="$"]'), m=a && /\$(\d+)$/.exec(a.id);
        if(!m) return;
        idx[m[1]]=1; tr.classList.add('iw-row'); if(first<0) first=i;
      });
      if(Object.keys(idx).length<3){ [].forEach.call(t.querySelectorAll('tr.iw-row'), function(r){ r.classList.remove('iw-row'); }); return; }
      // la fila con texto justo antes del primer registro es la cabecera
      for(var h=first-1; h>=0; h--){ if(txt(rows[h])){ rows[h].classList.add('iw-row-hdr'); break; } }
      t.classList.add('iw-rows');
      t.dataset.iwrows='1';
    });
  }

  /* ---------- Calendario semanal: bloques por materia ---------- */
  // "Mi Horario Semanal" es una rejilla de horas x días donde cada clase es un
  // <span class="PSLEVEL1GRIDACTIVETAB"> con "C 1183C - 1 / Teoria / horario /
  // aula". Cada materia toma un tono estable (por su código) para que la
  // semana se lea de un vistazo.
  var EV_HUES=[212, 160, 265, 28, 340, 190, 95, 0];
  function calendarize(){
    if(frameRole()!=='CONTENT' || !enabled) return;
    [].forEach.call(document.querySelectorAll('span.PSLEVEL1GRIDACTIVETAB'), function(sp){
      if(sp.dataset.iwev) return;
      sp.dataset.iwev='1';
      var m=/([A-Z]\s?\d{3,4}[A-Z]?)\s*-\s*\d+/.exec(sp.textContent||'');
      if(!m) return;
      var code=m[1].replace(/\s/g,''), h=0;
      for(var i=0;i<code.length;i++) h=(h*31+code.charCodeAt(i))>>>0;
      sp.classList.add('iw-ev');
      sp.style.setProperty('--ev-h', EV_HUES[h%EV_HUES.length]);
      var t=sp.closest('table'); if(t) t.classList.add('iw-cal');
    });
  }

  /* ---------- Centro de Alumnado -> dashboard ---------- */
  // La pantalla más usada y la peor maquetada: cajas de anchos fijos, enlaces
  // regados fuera de su grupo y el dato importante (saldo, clases) enterrado.
  // Se reconstruye moviendo los NODOS ORIGINALES (enlaces, selects, rejillas)
  // a una estructura nueva dentro del mismo <form>: sus javascript: y los
  // valores que PeopleSoft envía en el postback siguen funcionando igual. Lo
  // que no se mueve queda en la maqueta original, que se oculta.
  function boxLabel(t){
    var l=t.querySelector(':scope > tbody > tr > td[class*="GROUPBOX"][class*="LABEL"]');
    return l ? txt(l) : '';
  }
  function buildStudentCenter(){
    if(frameRole()!=='CONTENT' || !enabled) return;
    if(location.href.indexOf('SSS_STUDENT_CENTER')<0 || document.getElementById('iw-dash')) return;
    var form=document.querySelector('form'); if(!form) return;

    var boxes=[].filter.call(document.querySelectorAll('table'), function(t){
      return /GROUPBOX/.test(t.className) && boxLabel(t);
    });
    var tops=boxes.filter(function(t){
      for(var e=t.parentElement; e; e=e.parentElement) if(e.tagName==='TABLE' && boxes.indexOf(e)>=0) return false;
      return true;
    });
    function find(name){ return tops.filter(function(t){ return norm(boxLabel(t)).indexOf(name)>=0; })[0]; }
    var info=find('información académica')||find('informacion academica'), fin=find('finanzas');
    if(!info) return;
    var aside=tops.filter(function(t){ return /SSSGROUPBOXRIGHT/.test(t.className); });
    var extra=tops.filter(function(t){ return t!==info && t!==fin && aside.indexOf(t)<0; });

    function card(title, body, cls){
      var c=document.createElement('section'); c.className='iw-dcard'+(cls?' '+cls:'');
      if(title) c.innerHTML='<h2 class="iw-dcard-h">'+esc(title)+'</h2>';
      if(body) c.appendChild(body);
      return c;
    }
    function frag(){ return document.createElement('div'); }
    function linkByText(re, root){ return [].filter.call((root||document).querySelectorAll('a'), function(a){ return re.test(txt(a)); })[0]; }

    // --- horario de la semana
    var grid=info.querySelector('table[class*="GRID"]');
    var weekLink=linkByText(/horario semanal/i, info);
    var sched=null, nClasses=0;
    if(grid){
      nClasses=grid.querySelectorAll('tr > [class*="GRIDROW"]:last-child, tr > [class*="GRIDODDROW"]:last-child, tr > [class*="GRIDEVENROW"]:last-child').length;
      var sb=frag(); sb.className='iw-dcard-b';
      // leyenda de iconos (Fecha Límite / URL / Cuaderno Evaluación)
      var legend=document.createElement('div'); legend.className='iw-legend';
      [].forEach.call(info.querySelectorAll('img[src*="DEADLINES"], img[src*="LEARNING_MANAGEMENT"], img[src*="VALIDATE"]'), function(img){
        if(grid.contains(img)) return;
        var cell=img.closest('td'); if(!cell || legend.contains(cell)) return;
        var s=document.createElement('span'); while(cell.firstChild) s.appendChild(cell.firstChild);
        // el texto ("Fecha Límite", "URL"...) vive en la celda de al lado
        var nx=cell.nextElementSibling; if(!txt(s) && nx && txt(nx) && !nx.querySelector('img')) while(nx.firstChild) s.appendChild(nx.firstChild);
        legend.appendChild(s);
      });
      if(legend.childNodes.length) sb.appendChild(legend);
      sb.appendChild(grid);
      var glabel=grid.querySelector(':scope > tbody > tr > td[class*="GRIDLABEL"]');
      if(glabel) glabel.parentElement.classList.add('iw-hide');   // repite el título de la tarjeta
      sched=card('Horario de esta semana', sb, 'iw-dcard-sched');
      if(weekLink){ var f=document.createElement('div'); f.className='iw-dcard-f'; f.appendChild(weekLink); sched.appendChild(f); }
    }

    // --- accesos académicos: todos los enlaces sueltos de la caja, agrupados
    //     por el rótulo de grupo que les precede en el documento
    var labels=[].slice.call(info.querySelectorAll('td[class*="GROUPBOX"][class*="LABEL"]')).filter(function(l){ return !l.closest('table').isSameNode(info); });
    var groups=[], cur=null;
    var walker=document.createTreeWalker(info, NodeFilter.SHOW_ELEMENT);
    for(var n=walker.nextNode(); n; n=walker.nextNode()){
      if(labels.indexOf(n)>=0){ cur={ t:txt(n), items:[] }; groups.push(cur); continue; }
      if(n.tagName==='A' && txt(n) && !n.closest('table[class*="GRID"]') && n!==weekLink && !n.querySelector('img')){
        if(!cur){ cur={ t:'General', items:[] }; groups.push(cur); }
        cur.items.push(n);
      }
    }
    var acc=frag(); acc.className='iw-dcard-b iw-acc';
    groups.forEach(function(g){
      if(!g.items.length) return;
      var col=document.createElement('div'); col.className='iw-acc-g';
      col.innerHTML='<h3>'+esc(g.t)+'</h3>';
      var ul=document.createElement('div'); ul.className='iw-acc-l';
      g.items.forEach(function(a){ ul.appendChild(a); });
      col.appendChild(ul); acc.appendChild(col);
    });
    var accCard=card('Accesos académicos', acc, 'iw-dcard-acc');
    var otherSel=info.querySelector('select');
    if(otherSel){
      // el botón "»" va en otra celda: el primero que sigue al select en el documento
      var go=[].filter.call(info.querySelectorAll('a:has(img[src*="PT_NAV_GO"])'), function(a){
        return otherSel.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING;
      })[0];
      var f2=document.createElement('div'); f2.className='iw-dcard-f iw-jump';
      f2.appendChild(otherSel); if(go) f2.appendChild(go);
      accCard.appendChild(f2);
    }

    // --- indicadores
    var finTxt=fin ? txt(fin) : '';
    var debt=(/Debe\s*\$?\s*([\d,]+\.\d{2})/i.exec(finTxt)||[])[1];
    var ret=aside.filter(function(t){ return /retenci/i.test(boxLabel(t)); })[0];
    var overdue=ret ? (/Adeudo\s*Vencido\s*\$?\s*([\d,]+\.\d{2})/i.exec(txt(ret))||[])[1] : null;
    var kpis=document.createElement('div'); kpis.className='iw-kpis';
    function kpi(label, value, sub, tone, target){
      var b=document.createElement(target?'button':'div'); b.type='button'; b.className='iw-kpi'+(tone?' iw-kpi-'+tone:'');
      b.innerHTML='<span class="iw-kpi-l">'+esc(label)+'</span><b class="iw-kpi-v">'+esc(value)+'</b>'+(sub?'<span class="iw-kpi-s">'+esc(sub)+'</span>':'');
      if(target) b.addEventListener('click', function(){ target.click(); });
      kpis.appendChild(b);
    }
    if(debt) kpi('Saldo pendiente', '$'+debt, 'Ver estado de cuenta', parseFloat(debt.replace(/,/g,''))>0?'warn':'ok', linkByText(/consulta cuenta/i, fin));
    if(ret) kpi('Retenciones', overdue ? 'Adeudo vencido' : 'Sin retenciones', overdue ? '$'+overdue : 'Todo en orden', overdue?'danger':'ok', linkByText(/detalles/i, ret));
    if(grid) kpi('Clases esta semana', String(nClasses), 'Ver horario semanal', '', weekLink);

    // --- armado
    var titleEl=document.querySelector('.PAPAGETITLE, .PATRANSACTIONTITLE');
    var who=titleEl ? txt(titleEl).split('-')[0].trim() : '';
    var dash=document.createElement('div'); dash.id='iw-dash';
    dash.innerHTML='<header class="iw-dash-hd">'+(who?'<p class="iw-dash-eyebrow">Hola, '+esc(who)+'</p>':'')+'<h1>Centro de Alumnado</h1></header>';
    if(kpis.childNodes.length) dash.appendChild(kpis);
    var cols=document.createElement('div'); cols.className='iw-dash-cols';
    var main=document.createElement('div'); main.className='iw-dash-main';
    var side=document.createElement('aside'); side.className='iw-dash-side';
    if(sched) main.appendChild(sched);
    if(acc.childNodes.length) main.appendChild(accCard);
    if(fin){ fin.classList.add('iw-dbox'); main.appendChild(fin); }
    if(extra.length){
      var row=document.createElement('div'); row.className='iw-dash-row';
      extra.forEach(function(t){ t.classList.add('iw-dbox'); row.appendChild(t); });
      main.appendChild(row);
    }
    aside.forEach(function(t){ t.classList.add('iw-dbox'); side.appendChild(t); });
    cols.appendChild(main); if(aside.length) cols.appendChild(side);
    dash.appendChild(cols);
    form.appendChild(dash);
    document.documentElement.classList.add('iw-dash-built');
  }

  /* ---------- Títulos usados como aviso ---------- */
  // Algunas pantallas propias de ITSON (Trámites) ponen párrafos enteros con la
  // clase de título: se veían como un letrero gigante en negritas.
  function longTitles(){
    if(frameRole()!=='CONTENT' || !enabled) return;
    [].forEach.call(document.querySelectorAll('.PAPAGETITLE, .PATRANSACTIONTITLE'), function(el){
      if(el.dataset.iwlt) return;
      el.dataset.iwlt='1';
      if(txt(el).length>90) el.classList.add('iw-notice');
    });
  }

  /* ---------- Campos de texto que truncan su valor ---------- */
  // PeopleSoft da a cada campo un ancho en px pensado para 8pt ("7:00AM" en un
  // campo de 40px). Con la tipografía del wrap se cortaba ("7:00A"). El ancho
  // original pasa a ser el mínimo y el campo crece con su contenido.
  function fitInputs(){
    if(frameRole()!=='CONTENT' || !enabled) return;
    [].forEach.call(document.querySelectorAll('input[type="text"], input:not([type])'), function(el){
      if(el.dataset.iwfit || el.closest('#iw-shell, #iw-navwrap, #iw-topbar')) return;
      el.dataset.iwfit='1';
      var w=el.offsetWidth; if(!w) return;
      el.style.setProperty('min-width', w+'px');
      el.classList.add('iw-fit');
    });
  }

  /* ---------- estado ---------- */
  // Los reacomodos (shell, sidebar, ancho completo, fichas) leen tablas enteras:
  // solo corren con el DOM completo. Las clases de estilo, en cambio, se ponen
  // desde document_start para que nunca se pinte el portal original.
  var ready = false;
  function apply(){
    injectRemoteCss();
    applyReskin();
    applyTheme();
    applyRoles();
    if(!ready) return;
    tuneFrameset();
    if(enabled){ buildShell(); buildNavSidebar(); buildHeaderBar(); buildTiles(); expandLayout(); kvGrids(); listRows(); buildStudentCenter(); calendarize(); fitInputs(); longTitles(); }
    else { removeShell(); removeNavSidebar(); removeHeaderBar(); removeTiles(); }
  }

  // Copia sincrónica de la configuración en el localStorage del portal:
  // chrome.storage es asíncrono y esperar su respuesta dejaba ver el portal
  // sin estilo unos milisegundos. La fuente de verdad sigue siendo chrome.storage.
  var CACHE='itson_wrap_cache';
  function saveCache(){ try{ localStorage.setItem(CACHE, JSON.stringify({ e:enabled, t:theme })); }catch(e){} }
  try{ var c=JSON.parse(localStorage.getItem(CACHE)||'null'); if(c){ enabled=c.e!==false; theme=c.t||theme; } }catch(e){}

  // Mientras no esté listo, el documento no se pinta (ver iw-ready en
  // content.css): evita ver la maqueta original reacomodarse. Respaldo por
  // tiempo para no dejar nunca la página en blanco.
  function markReady(){ document.documentElement.classList.add('iw-ready'); }
  function onDomReady(){ if(ready) return; ready=true; apply(); markReady(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', onDomReady);
  else onDomReady();
  setTimeout(markReady, 2500);

  // El on/off se controla desde el popup de la extensión (ya no hay botón flotante).
  function setEnabled(v){ enabled=v; saveCache(); try{ api.storage.local.set({ itson_wrap_enabled:v }); }catch(e){} apply(); }

  apply();
  try{ api.storage.local.get({ itson_wrap_enabled:true, itson_wrap_theme:'dark' }, function(r){ enabled=r.itson_wrap_enabled; theme=r.itson_wrap_theme; saveCache(); apply(); }); }
  catch(e){}

  try{ api.storage.onChanged.addListener(function(ch,area){
    if(area!=='local') return;
    if(ch[KEY]){ enabled=ch[KEY].newValue; saveCache(); apply(); }
    if(ch[TKEY]){ theme=ch[TKEY].newValue; saveCache(); applyTheme(); paintThemeBtns(); }
  }); }catch(e){}

  /* PeopleSoft re-renderiza por postbacks: re-aplicar de forma idempotente */
  var mo=new MutationObserver(function(){
    injectRemoteCss();
    document.documentElement.classList.toggle('itson-wrap', enabled);
    applyRoles();
    if(!ready) return;
    if(enabled && document.getElementById('MENU')){
      if(!document.getElementById('iw-shell')) buildShell();
      else hideOriginals();   // re-ocultar lo que un postback haya re-dibujado
    }
    if(enabled && frameRole()==='NAV') buildNavSidebar();  // se auto-protege por firma
    if(enabled && frameRole()==='HDR') buildHeaderBar();
    if(enabled && frameRole()==='CONTENT'){ buildTiles(); expandLayout(); kvGrids(); listRows(); buildStudentCenter(); calendarize(); fitInputs(); longTitles(); }
    if(document.querySelector('frameset') && document.getElementById('iw-shell')) removeShell(); // nunca el shell fijo sobre un frameset
  });
  try{ mo.observe(document.documentElement, { childList:true, subtree:true }); }catch(e){}

  /* ---- CAPTURA TEMPORAL (debug): Ctrl+Shift+Y copia el DOM del frame enfocado ---- */
  function iwCopyText(s){
    try{
      var ta=document.createElement('textarea'); ta.value=s;
      ta.style.cssText='position:fixed;top:0;left:0;opacity:0;z-index:2147483647';
      document.body.appendChild(ta); ta.focus(); ta.select();
      var ok=document.execCommand('copy'); ta.remove(); return ok;
    }catch(e){ return false; }
  }
  document.addEventListener('keydown', function(e){
    if(!(e.ctrlKey && e.shiftKey && (e.key==='Y'||e.key==='y'))) return;
    e.preventDefault();
    try{
      var c=document.body.cloneNode(true);
      c.querySelectorAll('script,style,noscript,link,img,#iw-shell,#iw-navwrap,#iw-topbar,#itson-wrap-fab,#screenity-ui').forEach(function(el){ el.remove(); });
      c.querySelectorAll('input,textarea,select').forEach(function(el){ el.removeAttribute('value'); try{el.value='';}catch(_){}} );
      var out='### '+(location.href||'')+'\n'+c.innerHTML.slice(0,55000);
      var ok=iwCopyText(out);
      console.log('ITSON CIA Wrap capture: '+(ok?'copiado '+out.length+' chars':'fallo'));
    }catch(err){ console.log('ITSON Wrap capture error', err); }
  }, true);
})();
