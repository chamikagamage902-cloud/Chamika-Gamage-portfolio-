/* ═══════════════════════════════════════════════════════
   CHAMIKA GAMAGE — PORTFOLIO SCRIPT
   Animations: loader · cursor · particles · typed text
               scroll reveal · counter · parallax
═══════════════════════════════════════════════════════ */

/* ── 1. DYNAMIC AGE ──────────────────────────────────── */
(function computeAge() {
  const birthYear = 2008, birthMonth = 1, birthDay = 1;
  const today = new Date();
  let age = today.getFullYear() - birthYear;
  if (today.getMonth() + 1 < birthMonth ||
    (today.getMonth() + 1 === birthMonth && today.getDate() < birthDay)) age--;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('ageDisplay', age);
  set('ageInline', age);
  set('yearsExp', Math.max(1, age - 13) + '+');
  set('footerYear', today.getFullYear());
})();

/* ── 2. PAGE LOADER ──────────────────────────────────── */
const loader = document.getElementById('pageLoader');
window.addEventListener('load', () => {
  setTimeout(() => loader && loader.classList.add('hidden'), 600);
});

/* ── 3. CUSTOM CURSOR ────────────────────────────────── */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let ringX = 0, ringY = 0, dotX = 0, dotY = 0;

document.addEventListener('mousemove', e => {
  dotX = e.clientX; dotY = e.clientY;
  if (cursorDot) { cursorDot.style.left = dotX + 'px'; cursorDot.style.top = dotY + 'px'; }
});

(function animRing() {
  ringX += (dotX - ringX) * 0.12;
  ringY += (dotY - ringY) * 0.12;
  if (cursorRing) { cursorRing.style.left = ringX + 'px'; cursorRing.style.top = ringY + 'px'; }
  requestAnimationFrame(animRing);
})();

// grow ring on interactive elements
document.querySelectorAll('a, button, .skill-card, .soc-btn, .role-tag').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing && cursorRing.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursorRing && cursorRing.classList.remove('hovered'));
});

/* ── 4. CANVAS PARTICLES ─────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = 55;
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * 1000,
      y: Math.random() * 1000,
      vx: (Math.random() - .5) * .4,
      vy: (Math.random() - .5) * .4,
      r: Math.random() * 1.8 + .4,
      alpha: Math.random() * .5 + .15
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(247,201,35,${p.alpha})`;
      ctx.fill();
    });

    // draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(247,201,35,${.08 * (1 - dist / 100)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── 5. TYPED TEXT ───────────────────────────────────── */
(function typedEffect() {
  const el = document.getElementById('heroTyped');
  if (!el) return;
  const roles = ['Graphic Designer', 'Logo and Art Designer', 'Web Developer', 'Video Editor', 'Programmer'];
  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const word = roles[ri];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);

    if (!deleting && ci > word.length) { deleting = true; setTimeout(tick, 1500); return; }
    if (deleting && ci < 0) { deleting = false; ri = (ri + 1) % roles.length; ci = 0; setTimeout(tick, 400); return; }
    setTimeout(tick, deleting ? 50 : 90);
  }
  setTimeout(tick, 1800); // wait for loader
})();

/* ── 6. SCROLL REVEAL (data-reveal) ─────────────────── */
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = entry.target.dataset.delay || 0;
    setTimeout(() => entry.target.classList.add('in-view'), +delay);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObs.observe(el));

/* ── 7. SKILL CARDS STAGGER REVEAL ──────────────────── */
const skillCards = document.querySelectorAll('.skill-card');
const cardObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    setTimeout(() => {
      entry.target.classList.add('visible');
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }, i * 100);
    cardObs.unobserve(entry.target);
  });
}, { threshold: 0.12 });

skillCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity .6s ease, transform .6s ease';
  cardObs.observe(card);
});

/* ── 8. ABOUT SECTION REVEAL ─────────────────────────── */
const aboutGrid = document.querySelector('.about-grid');
if (aboutGrid) {
  aboutGrid.style.opacity = '0';
  aboutGrid.style.transform = 'translateY(30px)';
  aboutGrid.style.transition = 'opacity .8s ease, transform .8s ease';
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      aboutGrid.style.opacity = '1';
      aboutGrid.style.transform = 'translateY(0)';
    }
  }, { threshold: 0.1 }).observe(aboutGrid);
}

/* ── 9. CONTACT FORM REVEAL ──────────────────────────── */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.style.opacity = '0';
  contactForm.style.transform = 'translateY(30px)';
  contactForm.style.transition = 'opacity .8s .2s ease, transform .8s .2s ease';
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      contactForm.style.opacity = '1';
      contactForm.style.transform = 'translateY(0)';
    }
  }, { threshold: 0.1 }).observe(contactForm);
}

/* ── 10. STAT COUNTER ANIMATION ──────────────────────── */
function animateCounter(el, target, suffix = '+', duration = 1200) {
  let start = 0;
  const step = () => {
    start += Math.ceil(target / (duration / 16));
    if (start >= target) { el.textContent = target + suffix; return; }
    el.textContent = start + suffix;
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const yearsExpEl = document.getElementById('yearsExp');
if (yearsExpEl) {
  const target = parseInt(yearsExpEl.textContent) || 3;
  yearsExpEl.textContent = '0+';
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) animateCounter(yearsExpEl, target);
  }, { threshold: 0.5 }).observe(yearsExpEl);
}

/* ── 11. NAVBAR ACTIVE + SHADOW ON SCROLL ────────────── */
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  // shadow
  navbar.style.boxShadow = window.scrollY > 20 ? '0 4px 30px rgba(0,0,0,.6)' : 'none';

  // active link
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const id = sec.getAttribute('id');
    if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
    }
  });
}, { passive: true });

/* ── 12. SMOOTH SCROLL ───────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    mobileMenu.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  });
});

/* ── 13. MOBILE MENU ─────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const overlay = document.getElementById('overlay');
const closeMenu = document.getElementById('closeMenu');

const openMob = () => { mobileMenu.classList.add('open'); overlay.classList.add('show'); document.body.style.overflow = 'hidden'; };
const closeMob = () => { mobileMenu.classList.remove('open'); overlay.classList.remove('show'); document.body.style.overflow = ''; };

hamburger.addEventListener('click', openMob);
closeMenu.addEventListener('click', closeMob);
overlay.addEventListener('click', closeMob);

/* ── 14. HERO IMAGE PARALLAX ─────────────────────────── */
const heroImg = document.getElementById('heroImg');
window.addEventListener('scroll', () => {
  if (!heroImg) return;
  heroImg.style.transform = `translateY(${-window.scrollY * 0.12}px)`;
}, { passive: true });

/* ── 15. CONTACT FORM SUBMIT ─────────────────────────── */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
form && form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('nameInput').value;
  const email = document.getElementById('emailInput').value;
  const subject = document.getElementById('subjectInput').value;
  const message = document.getElementById('messageInput').value;

  submitBtn.textContent = 'Opening Email...';
  submitBtn.disabled = true;

  const mailtoLink = `mailto:chamikagamage902@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + message)}`;

  setTimeout(() => {
    window.location.href = mailtoLink;
    submitBtn.textContent = '✅ Email Ready!';
    submitBtn.style.background = '#22c55e';
    form.reset();
    setTimeout(() => {
      submitBtn.textContent = 'Send Message ✉️';
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 4000);
  }, 800);
});
