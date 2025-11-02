//shit

document.addEventListener('DOMContentLoaded', () => {
  const styleEl = document.createElement('style');
  document.head.appendChild(styleEl);

// Avatar rand flip
const avatarContainer = document.querySelector('.avatar-container');
if (avatarContainer) {
  const frontImg = avatarContainer.querySelector('.avatar.front');
  const backImg = avatarContainer.querySelector('.avatar.back');

  const originalFrontSrc = frontImg ? frontImg.src : '';
  const originalBackSrc = backImg ? backImg.src : '';

  const backCandidates = [
    originalBackSrc,
    'Icons/alt1.png',
    'Icons/alt2.png',
    'Icons/alt3.png',
    'Icons/alt4.png',
    'Icons/alt5.png'
  ];

  const swapProbability = 0.835; 

  const preloadMap = new Map();
  function preload(src) {
    if (preloadMap.has(src)) return preloadMap.get(src);
    const p = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => resolve(src); 
      img.src = src;
    });
    preloadMap.set(src, p);
    return p;
  }
  backCandidates.forEach(s => preload(s));

  function chooseBackSrc() {
    const idx = Math.floor(Math.random() * backCandidates.length);
    return backCandidates[idx];
  }

  let restoreTimer = null;
  let currentTempSrc = null;

function getFlipDurationMs() {
  const el = backImg || frontImg || avatarContainer;
  if (!el) return 600;
  const computed = window.getComputedStyle(el);
  const raw = computed.transitionDuration || computed.transition || '';
  const first = (raw.split(',')[0] || '').trim();

  let ms = 0;
  if (first.endsWith('ms')) {
    ms = parseFloat(first);
  } else if (first.endsWith('s')) {
    ms = parseFloat(first) * 1000;
  } else {
    const n = parseFloat(first);
    if (!Number.isNaN(n)) {
      ms = n > 10 ? n : n * 1000;
    }
  }

  if (!ms || ms <= 0) ms = 600;
  return Math.round(ms);
}
const flipMs = getFlipDurationMs();

  function clearPendingRestore() {
    if (restoreTimer) {
      clearTimeout(restoreTimer);
      restoreTimer = null;
    }
  }

  async function showFlip() {
    clearPendingRestore();
    if (!backImg) {
      avatarContainer.classList.add('flipped');
      return;
    }

    let chosen = originalBackSrc;
    if (Math.random() < swapProbability) chosen = chooseBackSrc();

    if (chosen === currentTempSrc) {
      avatarContainer.classList.add('flipped');
      return;
    }

    currentTempSrc = chosen;

    await preload(chosen);

    if (!avatarContainer.classList.contains('flipped')) {
      backImg.src = chosen;
      avatarContainer.classList.add('flipped');
    } else {
      backImg.src = chosen;
    }
  }

  function hideFlip() {
    clearPendingRestore();

    if (!backImg) {
      avatarContainer.classList.remove('flipped');
      return;
    }
    avatarContainer.classList.remove('flipped');
    restoreTimer = setTimeout(() => {
      if (!avatarContainer.classList.contains('flipped')) {
        backImg.src = originalBackSrc;
        currentTempSrc = null;
      }
      restoreTimer = null;
    }, flipMs + 40); 
  }

  avatarContainer.addEventListener('mouseenter', showFlip);
  avatarContainer.addEventListener('mouseleave', hideFlip);

  avatarContainer.tabIndex = avatarContainer.tabIndex || 0;
  avatarContainer.addEventListener('focus', showFlip);
  avatarContainer.addEventListener('blur', hideFlip);

  avatarContainer.addEventListener('click', (e) => {
    if (avatarContainer.classList.contains('flipped')) {
      hideFlip();
    } else {
      showFlip();
    }
  }, { passive: true });
}

// PARTICLES
  function createParticles() {
    const avatar = document.querySelector('.avatar-container');
    if (!avatar) return;

    let particleCount = 0;

    setInterval(() => {
      const rect = avatar.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2 + window.scrollX;
      const centerY = rect.top + rect.height / 2 + window.scrollY;

      const particle = document.createElement('div');
      particle.className = 'particle';
      document.body.appendChild(particle);

      const size = 16 + Math.random() * 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;

      const angle = Math.random() * 2 * Math.PI;

      const maxDistance = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)) / 2;
      const distance = maxDistance * (0.8 + Math.random() * 0.2);
      const xOffset = Math.cos(angle) * distance;
      const yOffset = Math.sin(angle) * distance;

      const duration = 5 + Math.random() * 3;
      const animName = `burst-${particleCount}`;
      particle.style.animation = `${animName} ${duration}s ease-out forwards`;

      const opacity = 0.1 + Math.random() * 0.4;
      particle.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
      particle.style.position = 'absolute';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';

      const keyframes = `
@keyframes ${animName} {
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }
  10% {
    opacity: ${opacity};
  }
  90% {
    opacity: ${opacity};
  }
  100% {
    transform: translate(${xOffset}px, ${yOffset}px);
    opacity: 0;
  }
}
`;
      styleEl.innerHTML += keyframes;

      setTimeout(() => {
        particle.remove();
      }, duration * 1000);

      particleCount++;
    }, 500);
  }

  createParticles();

// WAVES IN PILL NAV

  const links = Array.from(document.querySelectorAll('.pill-nav__link'));
  if (links.length > 0) {
    links.forEach((link, i) => {
      const svg = link.querySelector('.pill-nav__wave');
      if (!svg) return;

      const clipId = `pill-clip-${i}-${Date.now() % 100000}`;

      svg.innerHTML = `
      <defs>
        <linearGradient id="g-${clipId}" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="${getComputedStyle(document.documentElement).getPropertyValue('--blue-2') || '#00aaff'}"/>
          <stop offset="105%" stop-color="${getComputedStyle(document.documentElement).getPropertyValue('--blue-1') || '#007bff'}"/>
        </linearGradient>
        <clipPath id="${clipId}">
          <path id="wave-path-${i}" d="" />
        </clipPath>
      </defs>
      <rect x="0" y="0" width="100" height="40" fill="url(#g-${clipId})" clip-path="url(#${clipId})" />
    `;

      const pathEl = svg.querySelector(`#wave-path-${i}`);
      if (!pathEl) return;

      // wave parameters
      const amplitude = 2.6 + Math.random() * 1.8;
      const frequency = 1.0 + Math.random() * 0.6;
      const speed = 0.9 + Math.random() * 0.7;

      function buildWave(t) {
        const samples = 20;
        const w = 100;
        const hBase = 20;
        const bottom = 40;
        let d = `M0 ${bottom} L0 ${hBase} `;

        for (let s = 0; s <= samples; s++) {
          const x = (s / samples) * w;
          const y = hBase + Math.sin((s / samples) * Math.PI * frequency * 2 + t * speed) * amplitude;
          const nx = ((s + 1) / samples) * w;
          const cy = y;
          const cx = x + (nx - x) / 2;
          if (s === 0) {
            d += `L ${x.toFixed(2)} ${y.toFixed(2)} `;
          } else {
            d += `Q ${x.toFixed(2)} ${y.toFixed(2)} ${cx.toFixed(2)} ${((y + (s < samples ? y : y)) / 2).toFixed(2)} `;
          }
        }
        d += `L ${w} ${bottom} Z`;
        return d;
      }

      pathEl.setAttribute('d', buildWave(0));
      svg.setAttribute('viewBox', '0 0 100 40');

      svg._wave = { pathEl, buildWave, amplitude, frequency, speed, tick: Math.random() * 100 };
    });

    let last = performance.now();
    function raf(now) {
      const dt = (now - last) / 1000;
      last = now;
      document.querySelectorAll('.pill-nav__wave').forEach(svg => {
        if (!svg._wave) return;
        svg._wave.tick += dt;
        const link = svg.closest('.pill-nav__link');

        if (link && link.classList.contains('active')) {
          // flat top at y=0 so scaleY(1) fills entire pill
          svg._wave.pathEl.setAttribute('d', `M0 100 L0 0 L100 0 L100 100 Z`);
        } else {
          const d = svg._wave.buildWave(svg._wave.tick * 1.8);
          svg._wave.pathEl.setAttribute('d', d);
        }
      });
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }
});