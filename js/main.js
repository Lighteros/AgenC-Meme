/* AgenC — Super Intelligent Beauty
   PLAYBOOK B (dark cinematic) + E (immersive WebGL/Lenis) + D (narrative timeline).
   Hero = official 2D portrait as a lit, textured plane in Three.js (no invented face mesh).
   X is live: https://x.com/AgenCBeauty. CA LIVE on Robinhood Chain. No Telegram. */
import * as THREE from './vendor/three.module.min.js';

// Official CA + RH pair (DexScreener). Chart uses pair URL like sister RH sites (e.g. BTC).
const CA = '0x9d70fb5ff955700ba00e862b629b9b4716860441';
const PAIR = '0xeed3596f42660b34e3ccb6cdde3af71b8b458599c13503f197ae3ffb6f758bf8';
const X_URL = 'https://x.com/AgenCBeauty';
const LINKS = {
  Buy: `https://app.uniswap.org/swap?outputCurrency=${CA}&chain=robinhood`,
  Chart: `https://dexscreener.com/robinhood/${PAIR}`,
  Explorer: `https://robinhoodchain.blockscout.com/token/${CA}`,
};

document.documentElement.classList.add('js');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;

/* ───────── toast + Soon placeholders ───────── */
const toastEl = $('#toast'); let toastT;
const toast = (m) => { toastEl.textContent = m; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 2400); };
const SOON_MSG = {
  Buy: 'Buy on Uniswap · Robinhood Chain',
  Chart: 'DexScreener chart',
  Explorer: 'Blockscout explorer',
  X: 'Official X — @AgenCBeauty',
};
$$('[data-soon]').forEach((el) => {
  const kind = el.dataset.soon;
  const url = kind === 'X' ? X_URL : LINKS[kind];
  el.setAttribute('aria-label', `${kind} — ${url ? 'open' : 'soon'}`);
  if (!el.matches('button')) { el.setAttribute('role', 'button'); el.tabIndex = 0; }
  const go = (e) => {
    e.preventDefault();
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
    else toast(SOON_MSG[kind] || 'Soon');
  };
  el.addEventListener('click', go);
  el.addEventListener('keydown', (e) => { if (!el.matches('button') && (e.key === 'Enter' || e.key === ' ')) go(e); });
});

/* ───────── paint CA + click-to-copy on existing CA surfaces ───────── */
if (CA) {
  $$('.ca-v, .ca-big').forEach((el) => { el.textContent = CA; });
  $$('.spec dd').forEach((el) => {
    const dt = el.previousElementSibling;
    if (dt && /\bCA\b/i.test(dt.textContent || '')) el.textContent = CA;
  });
  $$('.fine').forEach((el) => { el.innerHTML = el.innerHTML.replace(/CA:\s*TBA/g, `CA: ${CA}`); });
  const copyCA = async () => {
    try { await navigator.clipboard.writeText(CA); toast('CA copied'); }
    catch (_) {
      const t = document.createElement('textarea'); t.value = CA; t.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(t); t.select(); try { document.execCommand('copy'); toast('CA copied'); } catch (e) {} t.remove();
    }
  };
  $$('.ca-pill, .ca-block').forEach((el) => {
    el.style.cursor = 'pointer';
    el.title = 'Click to copy CA';
    el.setAttribute('role', 'button');
    el.tabIndex = 0;
    el.addEventListener('click', (e) => { if (e.target.closest('a,button')) return; copyCA(); });
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copyCA(); } });
  });
}

/* ───────── nav, clock ───────── */
const nav = $('#nav');
const onScrollNav = () => nav.classList.toggle('scrolled', scrollY > 40);
addEventListener('scroll', onScrollNav, { passive: true }); onScrollNav();
const clock = $('#hudClock');
if (clock) { const tick = () => (clock.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false })); tick(); setInterval(tick, 1000); }

/* ───────── reveal ───────── */
const io = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
$$('.rv').forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el); });

/* ───────── card tilt + spotlight ───────── */
if (!reduce && matchMedia('(hover:hover)').matches) {
  $$('.lk').forEach((c) => {
    c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width; const y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--mx', `${x * 100}%`); c.style.setProperty('--my', `${y * 100}%`);
      c.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 7}deg) translateY(-4px)`;
    });
    c.addEventListener('pointerleave', () => (c.style.transform = ''));
  });
}

/* ───────── title split ───────── */
$$('[data-split]').forEach((el) => { el.innerHTML = [...el.textContent].map((c) => `<span class="ch">${c}</span>`).join(''); });

/* ───────── loader ───────── */
const loader = $('#loader'); const bar = $('#loaderBar'); const pct = $('#loaderPct');
let loadP = 0; let loaded = false;
const setLoad = (p) => { loadP = Math.max(loadP, p); bar.style.transform = `scaleX(${loadP})`; pct.textContent = String(Math.round(loadP * 100)).padStart(3, '0'); };
const fakeT = setInterval(() => setLoad(Math.min(0.9, loadP + 0.07)), 90);
function finishLoad() {
  if (loaded) return; loaded = true; clearInterval(fakeT); setLoad(1);
  setTimeout(() => { loader.classList.add('done'); introAnim(); }, 260);
}
setTimeout(finishLoad, 3500);

function introAnim() {
  world.introT0 = performance.now();
  if (reduce || !window.gsap) return;
  const { gsap } = window;
  gsap.from('.title .ch', { yPercent: 110, opacity: 0, rotateX: -70, duration: 1.4, ease: 'expo.out', stagger: 0.07, delay: 0.1 });
  gsap.from(['.eyebrow', '.subtitle', '.ticker', '.lede', '.ca-pill', '.cta'], { y: 30, opacity: 0, filter: 'blur(8px)', duration: 1.2, ease: 'expo.out', stagger: 0.08, delay: 0.35 });
}

/* ───────── Lenis + ScrollTrigger ───────── */
const world = { mx: 0, my: 0, tx: 0, ty: 0, heroP: 0, introT0: 0 };
addEventListener('pointermove', (e) => { world.tx = e.clientX / innerWidth * 2 - 1; world.ty = e.clientY / innerHeight * 2 - 1; }, { passive: true });
addEventListener('deviceorientation', (e) => { if (e.gamma == null) return; world.tx = clamp(e.gamma / 30, -1, 1); world.ty = clamp((e.beta - 45) / 30, -1, 1); }, { passive: true });

let lenis;
function initScroll() {
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  }
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href'); if (id.length < 2) return; const t = $(id); if (!t) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(t, { offset: id === '#top' ? 0 : -60 }); else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }));
  if (window.gsap && window.ScrollTrigger) {
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', onUpdate: (s) => (world.heroP = s.progress) });
    gsap.to('#tlFill', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#tl', start: 'top 70%', end: 'bottom 60%', scrub: true } });
    if (!reduce) {
      gsap.to('.hero-copy', { yPercent: -18, opacity: 0.1, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.fromTo('.lore-art .frame', { rotate: -1.2, y: 40 }, { rotate: 0.8, y: -40, ease: 'none', scrollTrigger: { trigger: '.lore', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.to('.marquee-track', { x: '-=200', ease: 'none', scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: true } });
    }
  } else if (lenis) {
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
  }
}
if (document.readyState === 'complete') initScroll(); else addEventListener('load', initScroll);

/* ───────── site-owned tweet media: poster → video; gallery clips autoplay muted on view ───────── */
function mountVideo(box, { muted, controls }) {
  let v = box.querySelector('video');
  if (!v) {
    v = document.createElement('video');
    v.src = box.dataset.src; v.playsInline = true; v.preload = 'metadata'; v.loop = true;
    v.setAttribute('playsinline', ''); v.poster = box.querySelector('img')?.src || '';
    box.appendChild(v);
  }
  v.muted = muted; if (muted) v.setAttribute('muted', ''); else v.removeAttribute('muted');
  if (controls) { v.controls = true; box.classList.add('has-controls'); }
  box.classList.add('is-playing'); box.classList.toggle('is-muted', muted && !controls);
  return v;
}
$$('.vid').forEach((box) => {
  const playWithSound = (e) => {
    e?.preventDefault?.();
    $$('.vid video').forEach((o) => { if (o.parentElement !== box && !o.muted) o.pause(); });
    const v = mountVideo(box, { muted: false, controls: true }); v.play().catch(() => {});
  };
  box.querySelector('.vid-play')?.addEventListener('click', (e) => { e.stopPropagation(); playWithSound(e); });
  box.addEventListener('click', (e) => { if (!box.classList.contains('has-controls')) playWithSound(e); });
});
if (!reduce && 'IntersectionObserver' in window) {
  const vio = new IntersectionObserver((ents) => ents.forEach((e) => {
    const box = e.target; const v = box.querySelector('video');
    if (e.isIntersecting && e.intersectionRatio > 0.55) {
      if (box.classList.contains('has-controls')) return;
      mountVideo(box, { muted: true, controls: false }).play().catch(() => {});
    } else if (v && (v.muted || !e.isIntersecting)) v.pause();
  }), { threshold: [0, 0.55] });
  $$('.vid-auto').forEach((b) => vio.observe(b));
}

/* ───────── official X embeds: widgets.js renders blockquotes; keep dark + re-scan if late ───────── */
const xWidgets = () => window.twttr && window.twttr.widgets;
let xTries = 0;
const xWait = setInterval(() => {
  if (xWidgets()) { clearInterval(xWait); document.documentElement.classList.add('x-ok'); }
  else if (++xTries > 40) { clearInterval(xWait); document.documentElement.classList.add('x-off'); }
}, 250);

/* ───────── Three.js hero v2: official portrait plane, relit; halo rings, god-rays, feathers, bokeh dust ───────── */
const canvas = $('#gl');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (err) { renderer = null; }

if (!renderer) { finishLoad(); }
else {
  document.documentElement.classList.add('gl-ok');
  const small = innerWidth < 700;
  const DPR = Math.min(devicePixelRatio || 1, small ? 1.75 : 2);
  renderer.setPixelRatio(DPR);
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  const rig = new THREE.Group(); scene.add(rig);   // layout (right on desktop, top on mobile)
  const tilt = new THREE.Group(); rig.add(tilt);    // mouse parallax / tilt
  const back = new THREE.Group(); tilt.add(back);   // deeper layer: counter-parallax

  const U = { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() }, uReveal: { value: 0 }, uScroll: { value: 0 } };
  const VS_UV = 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }';
  const NOISE = `
    float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
    float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
      return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }`;

  /* 1 — volumetric god-rays + concentric engraved rings (far back) */
  const raysMat = new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: VS_UV,
    fragmentShader: `
      uniform float uTime; uniform float uReveal; uniform vec2 uMouse; varying vec2 vUv; ${NOISE}
      void main(){
        vec2 p = vUv - .5; p.y -= .06; float r = length(p); float a = atan(p.y, p.x);
        // shafts: angular noise streaks, slowly turning, biased toward cursor
        float n1 = vnoise(vec2(a * 9. + uTime * .05, r * 2. - uTime * .08));
        float n2 = vnoise(vec2(a * 23. - uTime * .03, 1.7));
        float shafts = pow(n1, 3.) * .9 + pow(n2, 6.) * .7 + pow(.5 + .5*sin(a*14. + uTime*.12), 10.) * .35;
        float bias = .7 + .5 * max(dot(normalize(p + 1e-4), normalize(vec2(uMouse.x, -uMouse.y) + 1e-4)), 0.) * length(uMouse);
        float fall = smoothstep(.55, .04, r) * smoothstep(.0, .12, r);
        vec3 gold = vec3(.95,.72,.36);
        // engraved rings with tick marks
        float ring = smoothstep(.006,.0,abs(r-.30))*.55 + smoothstep(.004,.0,abs(r-.335))*.25 + smoothstep(.004,.0,abs(r-.385))*.38 + smoothstep(.003,.0,abs(r-.46))*.26;
        float ticks = step(.82, fract(a / 6.2832 * 72. + uTime*.01)) * smoothstep(.012,.0,abs(r-.36)) * .5;
        float ticks2 = step(.9, fract(a / 6.2832 * 24. - uTime*.006)) * smoothstep(.018,.0,abs(r-.42)) * .35;
        float core = smoothstep(.38,.0,r) * .26;
        vec3 col = gold * (shafts * fall * .62 * bias + ring + ticks + ticks2 + core) + vec3(.82,.14,.23) * smoothstep(.55,.18,r) * .07;
        gl_FragColor = vec4(col * uReveal, 1.);
      }`,
  });
  const rays = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), raysMat);
  rays.position.z = -1.9; back.add(rays);

  /* 2 — the official portrait (texture only, no invented mesh): normal-from-luminance relight */
  const PH = 3.1;
  const texLoader = new THREE.TextureLoader();
  const PT = { ...U, uTex: { value: null }, uTexel: { value: new THREE.Vector2(1 / 500, 1 / 500) } };
  const portraitMat = new THREE.ShaderMaterial({
    uniforms: PT, transparent: true, depthWrite: false,
    vertexShader: `
      uniform float uTime; uniform vec2 uMouse; varying vec2 vUv;
      void main(){
        vUv = uv; vec3 p = position;
        float d = dot(p.xy, p.xy);
        p.z += -d * .045 + sin(uTime*.6) * .015;                     // card curvature + breathing
        p.z += (p.x * uMouse.x - p.y * uMouse.y) * .05;               // leans toward the cursor
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
      }`,
    fragmentShader: `
      uniform sampler2D uTex; uniform vec2 uTexel; uniform float uTime; uniform vec2 uMouse; uniform float uReveal; uniform float uScroll;
      varying vec2 vUv;
      float rbox(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q,0.)) + min(max(q.x,q.y),0.) - r; }
      float L(vec2 uv){ return dot(texture2D(uTex, uv).rgb, vec3(.299,.587,.114)); }
      float eye(vec2 uv, vec2 c){ return smoothstep(.024, .0, length((uv - c) * vec2(1., 2.2))); }
      float flare(vec2 uv, vec2 c){ vec2 d = uv - c; return smoothstep(.0035, .0, abs(d.y)) * smoothstep(.11, .0, abs(d.x)) + smoothstep(.0025, .0, abs(d.x)) * smoothstep(.05, .0, abs(d.y)); }
      void main(){
        vec2 c = vUv - .5;
        // 2.5D parallax: face (centre, brighter) shifts more than edges
        float w = 1. - smoothstep(.0, .62, length(c));
        float depth = w * (.55 + .45 * L(vUv));
        vec2 uv = vUv + uMouse * vec2(-.016, .016) * depth;
        vec3 base = texture2D(uTex, uv).rgb;
        // pseudo normal from the texture's luminance gradient
        vec2 g = vec2(L(uv + vec2(uTexel.x,0.)) - L(uv - vec2(uTexel.x,0.)), L(uv + vec2(0.,uTexel.y)) - L(uv - vec2(0.,uTexel.y)));
        vec3 n = normalize(vec3(-g * 3.2, 1.));
        // key light follows the cursor (warm), fill from below-left (navy)
        vec3 Lk = normalize(vec3(uMouse.x * 1.3 + .35, -uMouse.y * 1.3 + .55, 1.));
        float diff = max(dot(n, Lk), 0.);
        float spec = pow(max(dot(n, normalize(Lk + vec3(0.,0.,1.))), 0.), 36.);
        vec3 col = base * (.56 + .55 * diff) * vec3(1.04, .99, .93);
        col += base * vec3(.12, .16, .3) * max(dot(n, normalize(vec3(-.6, -.7, .6))), 0.) * .5;
        col += vec3(1., .88, .62) * spec * .22 * smoothstep(.15, .6, L(uv));
        // gold rim: contours and plate edge facing away from the key light
        float edge = rbox(c, vec2(.5), .06);
        float plateRim = smoothstep(-.16, -.05, edge) * smoothstep(.0, -.05, edge);
        float away = clamp(.5 - .5 * dot(normalize(c + 1e-4), Lk.xy / max(length(Lk.xy), 1e-3)), 0., 1.);
        float contour = clamp(length(g) * 9., 0., 1.) * max(dot(normalize(g + 1e-5), -Lk.xy), 0.);
        col += vec3(1., .76, .34) * (plateRim * away * .55 + contour * .22 * w);
        // traveling gold sheen
        float sweep = smoothstep(.12, .0, abs(vUv.x + vUv.y*.35 - mod(uTime*.12, 2.4) + .45));
        col += vec3(1., .82, .45) * sweep * .09;
        // red eye glint + cross flare (eye positions on the official portrait)
        vec2 e1 = vec2(.412,.563), e2 = vec2(.598,.563);
        float pulse = .55 + .45 * sin(uTime * 2.1);
        float eg = eye(uv, e1) + eye(uv, e2);
        float ef = (flare(uv, e1) + flare(uv, e2)) * (.35 + .65 * pow(pulse, 3.));
        col += vec3(1., .12, .18) * eg * (.2 + .14 * pulse) + vec3(1., .3, .32) * ef * .55;
        // filmic grade toward navy in shadows
        col = mix(col, col * vec3(.84,.9,1.12), .22 * (1. - L(uv)));
        float a = smoothstep(.0, -.12, edge);
        float vig = smoothstep(.78, .25, length(c * vec2(1., 1.1)));
        col *= mix(.5, 1., vig);
        gl_FragColor = vec4(col, a * uReveal * (1. - uScroll*.6));
      }`,
  });
  const portrait = new THREE.Mesh(new THREE.PlaneGeometry(PH, PH, 64, 64), portraitMat);
  tilt.add(portrait);

  /* 2b — gold aura: a blurred silhouette of the same portrait, glowing behind it */
  const auraMat = new THREE.ShaderMaterial({
    uniforms: PT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: VS_UV,
    fragmentShader: `
      uniform sampler2D uTex; uniform float uTime; uniform float uReveal; varying vec2 vUv;
      void main(){
        vec2 c = vUv - .5; float acc = 0.;
        for (int i = 0; i < 12; i++) { float an = float(i) * .5236; vec2 o = vec2(cos(an), sin(an)) * .03;
          acc += dot(texture2D(uTex, vUv + o).rgb, vec3(.333)); }
        acc /= 12.;
        float m = smoothstep(.62, .2, length(c)) * smoothstep(.08, .5, acc);
        float breathe = .75 + .25 * sin(uTime * .9);
        gl_FragColor = vec4(vec3(1., .72, .32) * m * .45 * breathe * uReveal, 1.);
      }`,
  });
  const aura = new THREE.Mesh(new THREE.PlaneGeometry(PH * 1.22, PH * 1.22), auraMat);
  aura.position.z = -0.35; back.add(aura);

  texLoader.load('/img/agenc-portrait.webp', (t) => {
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true;
    PT.uTex.value = t; PT.uTexel.value.set(1 / (t.image.width || 500), 1 / (t.image.height || 500));
    finishLoad();
  }, undefined, () => {
    texLoader.load('/img/agenc-logo.png', (t) => { PT.uTex.value = t; PT.uTexel.value.set(1 / (t.image.width || 1024), 1 / (t.image.height || 1024)); finishLoad(); }, undefined, finishLoad);
  });

  /* 3 — gold halo above the cap: double ring, travelling sparks, soft bloom */
  const haloMat = new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    vertexShader: VS_UV,
    fragmentShader: `
      uniform float uTime; uniform float uReveal; varying vec2 vUv;
      void main(){
        vec2 p = vUv - .5; float r = length(p) * 2.; float a = atan(p.y, p.x);
        float core = smoothstep(.03, .0, abs(r - .78)) + smoothstep(.012, .0, abs(r - .66)) * .5;
        float glow = smoothstep(.38, .0, abs(r - .76));
        float sh = .7 + .3 * sin(a * 2. + uTime * 1.3);
        float spark = pow(max(cos(a - uTime * 1.4), 0.), 90.) + pow(max(cos(a + uTime * .9 + 2.), 0.), 140.) * .8;
        vec3 col = vec3(1., .88, .56) * core * 1.5 * sh + vec3(.96, .66, .26) * pow(glow, 2.2) * .8 + vec3(1., .95, .8) * spark * smoothstep(.06, .0, abs(r - .78)) * 2.2;
        gl_FragColor = vec4(col * uReveal, 1.);
      }`,
  });
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5), haloMat);
  halo.rotation.x = -1.28; halo.position.set(0.0, PH * 0.5 + 0.04, 0.25);
  tilt.add(halo);

  /* 4 — orbiting 3D gold rings around the portrait (thin tori, additive) */
  const ringMat = (o) => new THREE.MeshBasicMaterial({ color: 0xe2b45a, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false });
  const orbit = new THREE.Group(); tilt.add(orbit);
  const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.006, 6, 220), ringMat(0.5));
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.35, 0.004, 6, 220), ringMat(0.3));
  const ringC = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.003, 6, 200), ringMat(0.22));
  ringA.rotation.set(1.18, 0.18, 0); ringB.rotation.set(1.32, -0.32, 0.4); ringC.rotation.set(0.2, 0.9, 0);
  orbit.add(ringA, ringB, ringC);
  // sparks riding ring A
  const sparkGeo = new THREE.BufferGeometry(); const SPK = 6; const sp = new Float32Array(SPK * 3);
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  const sparkMat = new THREE.PointsMaterial({ color: 0xfff0c8, size: small ? 0.09 : 0.07, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, map: (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
    const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.25, 'rgba(255,220,150,.6)'); gr.addColorStop(1, 'rgba(255,200,120,0)');
    x.fillStyle = gr; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })() });
  const sparks = new THREE.Points(sparkGeo, sparkMat); ringA.add(sparks);

  /* 5 — particles: bokeh gold dust (DOF), wing feathers, faint stars */
  const pointVS = `
    attribute float aSize; attribute float aSeed; uniform float uTime; uniform float uPR; uniform float uFocus;
    varying float vAlpha; varying float vBlur; varying float vSeed;
    void main(){
      vec3 p = position;
      p.y += mod(uTime * (.05 + aSeed*.08) + aSeed*10., 8.) - 4.;
      p.x += sin(uTime*.3 + aSeed*20.) * .18;
      p.z += cos(uTime*.2 + aSeed*13.) * .12;
      vec4 mv = modelViewMatrix * vec4(p, 1.);
      float dist = -mv.z;
      vBlur = clamp(abs(dist - uFocus) / 3.5, 0., 1.);
      gl_PointSize = aSize * uPR * (1. + vBlur * 4.) * (8. / dist);
      vAlpha = (1. - vBlur*.7) * smoothstep(4., 3., abs(p.y));
      vSeed = aSeed;
      gl_Position = projectionMatrix * mv;
    }`;
  const mkGeo = (n, spread, z0, z1, s0, s1) => {
    const g = new THREE.BufferGeometry(); const pos = new Float32Array(n*3), size = new Float32Array(n), seed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      pos[i*3] = (Math.random()*2-1) * spread; pos[i*3+1] = (Math.random()*2-1) * 4; pos[i*3+2] = lerp(z0, z1, Math.random());
      size[i] = lerp(s0, s1, Math.pow(Math.random(), 1.6)); seed[i] = Math.random();
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aSize', new THREE.BufferAttribute(size, 1)); g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    return g;
  };
  const PU = { ...U, uPR: { value: DPR }, uFocus: { value: 7 } };
  const dust = new THREE.Points(mkGeo(small ? 480 : 1100, 6, -3.5, 4, 1.6, 6.5), new THREE.ShaderMaterial({
    uniforms: PU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexShader: pointVS,
    fragmentShader: `
      uniform float uReveal; uniform float uTime; varying float vAlpha; varying float vBlur; varying float vSeed;
      void main(){ float d = length(gl_PointCoord - .5);
        // in focus: crisp point · out of focus: soft disc with a brighter bokeh rim
        float sharp = smoothstep(.5, .0, d); sharp *= sharp;
        float disc = smoothstep(.5, .44, d);
        float rim = smoothstep(.36, .47, d) * disc;
        float a = mix(sharp, disc * .28 + rim * .32, vBlur);
        float tw = .6 + .4 * sin(uTime*2. + vSeed*40.);
        vec3 col = mix(vec3(1., .84, .5), vec3(1., .3, .32), step(.95, vSeed));
        gl_FragColor = vec4(col * a * vAlpha * tw * uReveal * .95, 1.); }`,
  }));
  scene.add(dust);

  // feathers: dark raven shards with gold rims, spilling from behind the shoulders and drifting down
  const FN = small ? 70 : 170;
  const fg = new THREE.BufferGeometry(); const fpos = new Float32Array(FN*3), fsize = new Float32Array(FN), fseed = new Float32Array(FN);
  for (let i = 0; i < FN; i++) {
    const side = i % 2 ? 1 : -1; const r = 1.2 + Math.pow(Math.random(), .7) * 2.8; const ang = (Math.random() * 1.5 - 0.45);
    fpos[i*3] = side * Math.cos(ang) * r; fpos[i*3+1] = Math.sin(ang) * r * 0.85 - 0.35; fpos[i*3+2] = -1.4 + Math.random() * 2.6;
    fsize[i] = 9 + Math.random() * 26; fseed[i] = Math.random();
  }
  fg.setAttribute('position', new THREE.BufferAttribute(fpos, 3)); fg.setAttribute('aSize', new THREE.BufferAttribute(fsize, 1)); fg.setAttribute('aSeed', new THREE.BufferAttribute(fseed, 1));
  const feathers = new THREE.Points(fg, new THREE.ShaderMaterial({
    uniforms: PU, transparent: true, depthWrite: false,
    vertexShader: `
      attribute float aSize; attribute float aSeed; uniform float uTime; uniform float uPR; uniform float uFocus; varying float vSeed; varying float vRot; varying float vBlur;
      void main(){ vec3 p = position; float t = uTime*.12 + aSeed*6.28;
        float fall = mod(uTime*.045 + aSeed*3., 3.);
        p.x += sign(p.x) * (.15 + .22*sin(t) + fall*.12); p.y += sin(t*1.3)*.14 - fall*.9; p.z += sin(t*.7)*.2;
        vec4 mv = modelViewMatrix * vec4(p,1.); float dist = -mv.z;
        vBlur = clamp(abs(dist - uFocus) / 3., 0., 1.);
        gl_PointSize = aSize * uPR * (1. + vBlur*.8) * (7. / dist);
        vSeed = smoothstep(0., .35, fall) * (1. - smoothstep(2.2, 3., fall)); vRot = aSeed*6.28 + uTime*.35*(aSeed-.5) + sin(t*2.)*.4; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `
      uniform float uReveal; varying float vSeed; varying float vRot; varying float vBlur;
      void main(){ vec2 q = gl_PointCoord - .5; float c = cos(vRot), s = sin(vRot); q = mat2(c,-s,s,c) * q;
        float bend = q.x + q.y*q.y*.35;                                   // curved vane
        float e = (bend*bend)/(.011) + (q.y*q.y)/(.22) - 1.;
        float shape = 1. - smoothstep(-.1 - vBlur*.6, .02, e);
        float spine = smoothstep(.018, .0, abs(bend)) * step(abs(q.y), .46);
        float barbs = .5 + .5 * sin((q.y + abs(bend)*.6) * 90.);
        float rim = smoothstep(-.45, .0, e) * shape;
        vec3 col = mix(vec3(.025,.03,.07), vec3(.12,.14,.24), barbs*.4);
        col = mix(col, vec3(.95,.72,.34), rim*.6 + spine*.3);
        float fade = vSeed;                                                  // fade in at spawn, out as they fall
        gl_FragColor = vec4(col, shape * mix(.75, .3, vBlur) * uReveal * fade); }`,
  }));
  tilt.add(feathers);

  const stars = new THREE.Points(mkGeo(small ? 220 : 480, 12, -12, -5, 1, 2.4), new THREE.ShaderMaterial({
    uniforms: PU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexShader: pointVS,
    fragmentShader: `uniform float uReveal; uniform float uTime; varying float vSeed;
      void main(){ float d = length(gl_PointCoord-.5); float a = smoothstep(.5,.0,d);
        gl_FragColor = vec4(vec3(.75,.8,1.) * a * (.35 + .35*sin(uTime + vSeed*50.)) * uReveal, 1.); }`,
  }));
  scene.add(stars);

  /* 6 — front light shafts drifting across (very faint, gives depth in front of her) */
  const shaftMat = new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: VS_UV,
    fragmentShader: `uniform float uTime; uniform float uReveal; varying vec2 vUv; ${NOISE}
      void main(){ float x = vUv.x + vUv.y * .45 + uTime * .01;
        float b = pow(vnoise(vec2(x * 7., uTime*.05)), 4.) * smoothstep(1., .2, vUv.y) * smoothstep(.0, .35, vUv.y);
        gl_FragColor = vec4(vec3(1., .82, .5) * b * .13 * uReveal, 1.); }`,
  });
  const shafts = new THREE.Mesh(new THREE.PlaneGeometry(9, 7), shaftMat);
  shafts.position.z = 0.9; tilt.add(shafts);

  /* layout */
  let vw = 0, vh = 0;
  function resize() {
    const r = canvas.getBoundingClientRect(); vw = r.width; vh = r.height;
    renderer.setSize(vw, vh, false); camera.aspect = vw / vh; camera.updateProjectionMatrix();
    const viewH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z; const viewW = viewH * camera.aspect;
    if (camera.aspect > 1.05) {
      const s = clamp(viewH * 0.72 / PH, 0.5, 1.2);
      rig.scale.setScalar(s); rig.position.set(viewW * 0.22, 0, 0);
    } else {
      const s = clamp(viewW * 0.84 / PH, 0.4, 1.1);
      rig.scale.setScalar(s); rig.position.set(0, viewH * 0.5 - PH * s * 0.5 - viewH * 0.1, 0);
    }
  }
  resize(); addEventListener('resize', resize);

  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe($('#hero'));

  const clockT = new THREE.Clock();
  const sparkPos = sparkGeo.attributes.position;
  function frame() {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const t = clockT.getElapsedTime();
    const k = reduce ? 1 : 0.06;
    world.mx = lerp(world.mx, reduce ? 0 : world.tx, k); world.my = lerp(world.my, reduce ? 0 : world.ty, k);
    const T = reduce ? 0 : t;
    U.uTime.value = T;
    U.uMouse.value.set(world.mx, world.my);
    const since = world.introT0 ? (performance.now() - world.introT0) / 1000 : 0;
    U.uReveal.value = world.introT0 ? (reduce ? 1 : clamp(since / 1.6)) : 0;
    U.uScroll.value = world.heroP;
    PU.uFocus.value = 7 - world.my * 1.2 + world.heroP * 2;          // DOF focus breathes with the cursor/scroll
    // stronger parallax/tilt: plane leans hard toward the cursor, deep layer counter-moves
    tilt.rotation.y = world.mx * 0.34; tilt.rotation.x = world.my * 0.22;
    tilt.position.x = world.mx * 0.12;
    tilt.position.y = (reduce ? 0 : Math.sin(t * 0.7) * 0.045) + world.heroP * 0.8;
    back.position.set(-world.mx * 0.22, world.my * 0.14, 0);
    const intro = 1 - Math.pow(1 - clamp(since / 2.2), 3);
    camera.position.z = 7 + (1 - intro) * 1.8 - world.heroP * 1.2;
    camera.position.x = world.mx * 0.5; camera.position.y = -world.my * 0.3;
    camera.lookAt(rig.position.x * 0.12, 0, 0);
    halo.rotation.z = T * 0.15;
    rays.rotation.z = -T * 0.02;
    orbit.rotation.y = T * 0.12; orbit.rotation.x = Math.sin(T * 0.2) * 0.08;
    ringB.rotation.z = -T * 0.09; ringC.rotation.z = T * 0.07;
    for (let i = 0; i < SPK; i++) { const a = T * (0.5 + i * 0.07) + i * (Math.PI * 2 / SPK); sparkPos.setXYZ(i, Math.cos(a) * 2.05, Math.sin(a) * 2.05, 0); }
    sparkPos.needsUpdate = true;
    sparkMat.opacity = 0.9 * U.uReveal.value;
    ringA.material.opacity = 0.5 * U.uReveal.value; ringB.material.opacity = 0.3 * U.uReveal.value; ringC.material.opacity = 0.22 * U.uReveal.value;
    dust.rotation.y = world.mx * 0.14; stars.rotation.y = -world.mx * 0.04;
    renderer.render(scene, camera);
  }
  frame();
}
