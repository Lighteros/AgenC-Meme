/* AgenC — Super Intelligent Beauty
   PLAYBOOK B (dark cinematic) + E (immersive WebGL/Lenis) + D (narrative timeline).
   Hero = official 2D portrait as a lit, textured plane in Three.js (no invented face mesh).
   CA / X: TBA — every Buy / Chart / Explorer / X control is a "Soon" placeholder. No Telegram. */
import * as THREE from './vendor/three.module.min.js';

// Fill these ONLY with the officially announced values. Until then everything stays "Soon".
const CA = ''; // Robinhood Chain token address — TBA
const X_URL = ''; // official X — TBA
const LINKS = CA ? {
  Buy: `https://app.uniswap.org/swap?outputCurrency=${CA}&chain=robinhood`,
  Chart: `https://dexscreener.com/robinhood/${CA}`,
  Explorer: `https://robinhoodchain.blockscout.com/token/${CA}`,
} : {};

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
  Buy: 'Buy on Uniswap · Robinhood Chain — soon · CA TBA',
  Chart: 'DexScreener chart — soon · CA TBA',
  Explorer: 'Blockscout explorer — soon · CA TBA',
  X: 'Official X — soon',
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
  $$('.tw-card, .lk').forEach((c) => {
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

/* ───────── Three.js hero: portrait plane + halo + wings/particles ───────── */
const canvas = $('#gl');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (err) { renderer = null; }

if (!renderer) { finishLoad(); }
else {
  document.documentElement.classList.add('gl-ok');
  const DPR = Math.min(devicePixelRatio || 1, 2);
  renderer.setPixelRatio(DPR);
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  const rig = new THREE.Group(); scene.add(rig); // follows layout (right on desktop, top on mobile)
  const tilt = new THREE.Group(); rig.add(tilt);  // mouse parallax

  const U = { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() }, uReveal: { value: 0 }, uScroll: { value: 0 } };

  /* back light: god-rays + concentric gold rings (behind portrait) */
  const raysMat = new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: `
      uniform float uTime; uniform float uReveal; varying vec2 vUv;
      void main(){
        vec2 p = vUv - .5; float r = length(p); float a = atan(p.y, p.x);
        float rays = pow(.5 + .5*sin(a*18. + uTime*.15), 6.) * .55 + pow(.5 + .5*sin(a*7. - uTime*.1), 8.) * .35;
        float fall = smoothstep(.5, .05, r);
        vec3 gold = vec3(.89,.70,.35);
        float ring = smoothstep(.006,.0,abs(r-.30)) * .5 + smoothstep(.004,.0,abs(r-.385)) * .35 + smoothstep(.003,.0,abs(r-.46)) * .25;
        float core = smoothstep(.36,.0,r) * .22;
        vec3 col = gold * (rays*fall*.55 + ring + core) + vec3(.82,.14,.23) * smoothstep(.5,.2,r) * .05;
        gl_FragColor = vec4(col * uReveal, 1.);
      }`,
  });
  const rays = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), raysMat);
  rays.position.z = -1.6; tilt.add(rays);

  /* the official portrait as a textured plane */
  const texLoader = new THREE.TextureLoader();
  const portraitMat = new THREE.ShaderMaterial({
    uniforms: { ...U, uTex: { value: null }, uAspect: { value: 1 } }, transparent: true, depthWrite: false,
    vertexShader: `
      uniform float uTime; uniform vec2 uMouse; varying vec2 vUv; varying float vShade;
      void main(){
        vUv = uv; vec3 p = position;
        float d = dot(p.xy, p.xy);
        p.z += -d * .035 + sin(uTime*.6) * .015;           // gentle card curvature + breathing
        vShade = dot(normalize(vec3(-p.x*.08, -p.y*.08, 1.)), normalize(vec3(uMouse.x, -uMouse.y, 1.6)));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
      }`,
    fragmentShader: `
      uniform sampler2D uTex; uniform float uTime; uniform vec2 uMouse; uniform float uReveal; uniform float uScroll;
      varying vec2 vUv; varying float vShade;
      float rbox(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q,0.)) + min(max(q.x,q.y),0.) - r; }
      void main(){
        vec2 c = vUv - .5;
        // 2.5D parallax: centre (face) moves a hair more than the edges
        float w = 1. - smoothstep(0., .6, length(c));
        vec2 uv = vUv + uMouse * vec2(-.006, .006) * w;
        vec3 col = texture2D(uTex, uv).rgb;
        // light: soft key from cursor side + gold rim sweep
        col *= .86 + .2 * vShade;
        float sweep = smoothstep(.12, .0, abs(vUv.x + vUv.y*.35 - mod(uTime*.12, 2.2) + .4));
        col += vec3(1., .82, .45) * sweep * .10;
        // red eyes glint (eye positions on the official portrait)
        float e = smoothstep(.022, .0, length((vUv - vec2(.412,.563)) * vec2(1.,2.2))) + smoothstep(.022, .0, length((vUv - vec2(.598,.563)) * vec2(1.,2.2)));
        col += vec3(1., .1, .16) * e * (.16 + .1 * sin(uTime*2.2));
        // filmic grade toward navy in shadows
        col = mix(col, col * vec3(.86,.9,1.1), .25);
        // feathered rounded-square edge so the plane melts into the scene
        float d = rbox(c, vec2(.5), .06);
        float a = smoothstep(.0, -.12, d);
        float vig = smoothstep(.75, .25, length(c * vec2(1., 1.1)));
        col *= mix(.55, 1., vig);
        gl_FragColor = vec4(col, a * uReveal * (1. - uScroll*.6));
      }`,
  });
  const PH = 3.1;
  const portrait = new THREE.Mesh(new THREE.PlaneGeometry(PH, PH, 48, 48), portraitMat);
  tilt.add(portrait);

  texLoader.load('/img/agenc-portrait.webp', (t) => {
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true;
    portraitMat.uniforms.uTex.value = t;
    finishLoad();
  }, undefined, () => {
    texLoader.load('/img/agenc-logo.png', (t) => { portraitMat.uniforms.uTex.value = t; finishLoad(); }, undefined, finishLoad);
  });

  /* gold halo — floats above the cap, as in the official banner */
  const haloMat = new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: `
      uniform float uTime; uniform float uReveal; varying vec2 vUv;
      void main(){
        float r = length(vUv - .5) * 2.;
        float core = smoothstep(.035, .0, abs(r - .78));
        float glow = smoothstep(.35, .0, abs(r - .78));
        float sh = .75 + .25 * sin(atan(vUv.y-.5, vUv.x-.5) * 2. + uTime * 1.3);
        vec3 col = vec3(1., .86, .52) * core * 1.4 + vec3(.95, .66, .26) * pow(glow, 2.2) * .7;
        gl_FragColor = vec4(col * sh * uReveal, 1.);
      }`,
  });
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.3), haloMat);
  halo.rotation.x = -1.28; halo.position.set(0.0, PH * 0.5 + 0.02, 0.25);
  tilt.add(halo);

  /* particles: gold dust (depth-of-field), dark feathers (wing accents), faint stars */
  const pointVS = `
    attribute float aSize; attribute float aSeed; uniform float uTime; uniform float uPR; uniform float uFocus;
    varying float vAlpha; varying float vBlur; varying float vSeed;
    void main(){
      vec3 p = position;
      p.y += mod(uTime * (.05 + aSeed*.08) + aSeed*10., 8.) - 4.;
      p.x += sin(uTime*.3 + aSeed*20.) * .15;
      vec4 mv = modelViewMatrix * vec4(p, 1.);
      float dist = -mv.z;
      vBlur = clamp(abs(dist - uFocus) / 4., 0., 1.);
      gl_PointSize = aSize * uPR * (1. + vBlur * 3.) * (8. / dist);
      vAlpha = (1. - vBlur*.75) * smoothstep(4., 3., abs(p.y));
      vSeed = aSeed;
      gl_Position = projectionMatrix * mv;
    }`;
  const N = innerWidth < 700 ? 260 : 520;
  const mkGeo = (n, spread, z0, z1, s0, s1) => {
    const g = new THREE.BufferGeometry(); const pos = new Float32Array(n*3), size = new Float32Array(n), seed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      pos[i*3] = (Math.random()*2-1) * spread; pos[i*3+1] = (Math.random()*2-1) * 4; pos[i*3+2] = lerp(z0, z1, Math.random());
      size[i] = lerp(s0, s1, Math.random()); seed[i] = Math.random();
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aSize', new THREE.BufferAttribute(size, 1)); g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    return g;
  };
  const PU = { ...U, uPR: { value: DPR }, uFocus: { value: 7 } };
  const dust = new THREE.Points(mkGeo(N, 5.5, -3, 3.5, 2, 6), new THREE.ShaderMaterial({
    uniforms: PU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexShader: pointVS,
    fragmentShader: `
      uniform float uReveal; uniform float uTime; varying float vAlpha; varying float vBlur; varying float vSeed;
      void main(){ float d = length(gl_PointCoord - .5);
        float a = smoothstep(.5, mix(.05, .45, 1.-vBlur) * (1.-vBlur*.9), d); a = 1. - a;
        a = smoothstep(.5, .0, d) * mix(1., .35, vBlur);
        float tw = .6 + .4 * sin(uTime*2. + vSeed*40.);
        vec3 col = mix(vec3(1., .84, .5), vec3(1., .35, .35), step(.93, vSeed));
        gl_FragColor = vec4(col * a * vAlpha * tw * uReveal * .9, 1.); }`,
  }));
  scene.add(dust);

  // feathers: elongated dark shards drifting out from behind her shoulders (wing accents)
  const FN = innerWidth < 700 ? 24 : 60;
  const fg = new THREE.BufferGeometry(); const fpos = new Float32Array(FN*3), fsize = new Float32Array(FN), fseed = new Float32Array(FN);
  for (let i = 0; i < FN; i++) {
    const side = i % 2 ? 1 : -1; const r = 1.4 + Math.random() * 2.2; const ang = (Math.random() * 1.2 - 0.3);
    fpos[i*3] = side * Math.cos(ang) * r; fpos[i*3+1] = Math.sin(ang) * r * 0.8 - 0.3; fpos[i*3+2] = -0.8 - Math.random() * 1.2;
    fsize[i] = 10 + Math.random() * 18; fseed[i] = Math.random();
  }
  fg.setAttribute('position', new THREE.BufferAttribute(fpos, 3)); fg.setAttribute('aSize', new THREE.BufferAttribute(fsize, 1)); fg.setAttribute('aSeed', new THREE.BufferAttribute(fseed, 1));
  const feathers = new THREE.Points(fg, new THREE.ShaderMaterial({
    uniforms: PU, transparent: true, depthWrite: false,
    vertexShader: `
      attribute float aSize; attribute float aSeed; uniform float uTime; uniform float uPR; varying float vSeed; varying float vRot;
      void main(){ vec3 p = position; float t = uTime*.12 + aSeed*6.28;
        p.x += sign(p.x) * (.15 + .15*sin(t)); p.y += sin(t*1.3)*.12 - mod(uTime*.03 + aSeed, 1.)*.3;
        vec4 mv = modelViewMatrix * vec4(p,1.); gl_PointSize = aSize * uPR * (7. / -mv.z);
        vSeed = aSeed; vRot = aSeed*6.28 + uTime*.2*(aSeed-.5); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `
      uniform float uReveal; varying float vSeed; varying float vRot;
      void main(){ vec2 q = gl_PointCoord - .5; float c = cos(vRot), s = sin(vRot); q = mat2(c,-s,s,c) * q;
        float shape = 1. - smoothstep(.0, .02, (q.x*q.x)/(.012) + (q.y*q.y)/(.23) - 1.);   // feather ellipse
        float spine = smoothstep(.02, .0, abs(q.x)) * step(abs(q.y), .45);
        float rim = smoothstep(.0, .02, (q.x*q.x)/(.012) + (q.y*q.y)/(.23) - .55) * shape;
        vec3 col = mix(vec3(.03,.04,.09), vec3(.85,.65,.3), rim*.55 + spine*.25);
        gl_FragColor = vec4(col, shape * .5 * uReveal); }`,
  }));
  feathers.position.z = 0; tilt.add(feathers);

  const stars = new THREE.Points(mkGeo(innerWidth < 700 ? 200 : 420, 12, -12, -5, 1, 2.4), new THREE.ShaderMaterial({
    uniforms: PU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexShader: pointVS,
    fragmentShader: `uniform float uReveal; uniform float uTime; varying float vSeed;
      void main(){ float d = length(gl_PointCoord-.5); float a = smoothstep(.5,.0,d);
        gl_FragColor = vec4(vec3(.75,.8,1.) * a * (.35 + .35*sin(uTime + vSeed*50.)) * uReveal, 1.); }`,
  }));
  scene.add(stars);

  /* layout */
  let vw = 0, vh = 0;
  function resize() {
    const r = canvas.getBoundingClientRect(); vw = r.width; vh = r.height;
    renderer.setSize(vw, vh, false); camera.aspect = vw / vh; camera.updateProjectionMatrix();
    const viewH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z; const viewW = viewH * camera.aspect;
    if (camera.aspect > 1.05) { // desktop: portrait right of the copy
      const s = clamp(viewH * 0.74 / PH, 0.5, 1.2);
      rig.scale.setScalar(s); rig.position.set(viewW * 0.22, viewH * 0.0, 0);
    } else { // mobile: portrait up top, copy below
      const s = clamp(viewW * 0.86 / PH, 0.4, 1.1);
      rig.scale.setScalar(s); rig.position.set(0, viewH * 0.5 - PH * s * 0.5 - viewH * 0.1, 0);
    }
  }
  resize(); addEventListener('resize', resize);

  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe($('#hero'));

  const clockT = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const t = clockT.getElapsedTime();
    const k = reduce ? 1 : 0.05;
    world.mx = lerp(world.mx, reduce ? 0 : world.tx, k); world.my = lerp(world.my, reduce ? 0 : world.ty, k);
    U.uTime.value = reduce ? 0 : t;
    U.uMouse.value.set(world.mx, world.my);
    const since = world.introT0 ? (performance.now() - world.introT0) / 1000 : 0;
    U.uReveal.value = world.introT0 ? (reduce ? 1 : clamp(since / 1.6)) : 0;
    U.uScroll.value = world.heroP;
    tilt.rotation.y = world.mx * 0.16; tilt.rotation.x = world.my * 0.1;
    tilt.position.y = (reduce ? 0 : Math.sin(t * 0.7) * 0.04) + world.heroP * 0.8;
    const intro = 1 - Math.pow(1 - clamp(since / 2.2), 3);
    camera.position.z = 7 + (1 - intro) * 1.6 - world.heroP * 1.2;
    camera.position.x = world.mx * 0.25; camera.position.y = -world.my * 0.15;
    camera.lookAt(0, 0, 0);
    halo.rotation.z = t * 0.15;
    rays.rotation.z = -t * 0.02;
    dust.rotation.y = world.mx * 0.1;
    renderer.render(scene, camera);
  }
  frame();
}
