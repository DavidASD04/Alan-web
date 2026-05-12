/* ============================================
   ALAN SANTANA — interactions
   ============================================ */

// ---------- Loader ----------
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
  }, 1400);
});

// ---------- Custom cursor ----------
const cursor = document.getElementById('cursor');
const dot = document.getElementById('cursorDot');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let cx = mx, cy = my;

window.addEventListener('mousemove', (e) => {
  mx = e.clientX; my = e.clientY;
  dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
});
function loop() {
  cx += (mx - cx) * 0.15;
  cy += (my - cy) * 0.15;
  cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
  requestAnimationFrame(loop);
}
loop();

document.querySelectorAll('a, button, .card, .menu-btn, .cv-card, .play-btn').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
});

// ---------- Drawer menu ----------
const menuBtn = document.getElementById('menuBtn');
const drawer = document.getElementById('drawer');
menuBtn.addEventListener('click', () => {
  const open = drawer.classList.toggle('open');
  menuBtn.classList.toggle('open', open);
  drawer.setAttribute('aria-hidden', !open);
});
drawer.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    drawer.classList.remove('open');
    menuBtn.classList.remove('open');
  });
});

// ---------- Reveal on scroll ----------
const revealEls = document.querySelectorAll('.sec-head, .card, .video-wrap, .contact-grid, .marquee');
revealEls.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// ---------- Carousels ----------
document.querySelectorAll('[data-carousel]').forEach(car => {
  const track = car.querySelector('.carousel-track');
  const bar = car.querySelector('.cc-bar i');
  const btns = car.querySelectorAll('.cc-btn');

  const updateBar = () => {
    if (!bar) return;
    const max = track.scrollWidth - track.clientWidth;
    const p = max > 0 ? (track.scrollLeft / max) * 70 : 0;
    bar.style.left = p + '%';
  };
  track.addEventListener('scroll', updateBar);
  updateBar();

  btns.forEach(b => {
    b.addEventListener('click', () => {
      const dir = parseInt(b.dataset.dir, 10);
      const w = track.querySelector('.card').offsetWidth + 28;
      track.scrollBy({ left: w * dir, behavior: 'smooth' });
    });
  });

  // Drag to scroll
  let isDown = false, startX = 0, startScroll = 0;
  track.addEventListener('mousedown', (e) => {
    isDown = true; startX = e.pageX; startScroll = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });
  window.addEventListener('mouseup', () => { isDown = false; track.style.cursor = ''; });
  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    track.scrollLeft = startScroll - (e.pageX - startX) * 1.4;
  });
});

// ---------- Video play ----------
const video = document.getElementById('reel');
const wrap = document.getElementById('videoWrap');
const playBtn = document.getElementById('playBtn');
playBtn.addEventListener('click', () => {
  if (video.paused) {
    video.play();
    wrap.classList.add('playing');
  } else {
    video.pause();
    wrap.classList.remove('playing');
  }
});
video.addEventListener('click', () => {
  if (!video.paused) { video.pause(); wrap.classList.remove('playing'); }
});

// ---------- Parallax on hero text ----------
const huge = document.querySelector('.huge');
const isTouch = matchMedia('(hover: none)').matches || window.innerWidth < 900;
if (!isTouch) {
  window.addEventListener('mousemove', (e) => {
    if (!huge) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 12;
    huge.style.transform = `translate(${x}px, ${y}px)`;
  });
}

// ---------- Parallax scroll ----------
const cvCard = document.getElementById('cvCard');
if (!isTouch) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (cvCard) cvCard.style.transform = `rotate(${2 - y * 0.01}deg) translateY(${y * 0.15}px)`;
  });
}

// ---------- Smooth scroll anchors ----------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// ---------- CV preview modal ----------
const cvModal = document.getElementById('cvModal');
const cvObject = document.getElementById('cvObject');
const CV_SRC = 'public/Alan%20Santana%20(1).pdf';

// Mobile detection: Chrome/Safari mobile cannot render PDF inline; open new tab instead
const isMobilePdf = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

function openCv(e) {
  if (e) e.preventDefault();
  if (isMobilePdf) {
    window.open(CV_SRC, '_blank', 'noopener');
    return;
  }
  if (!cvObject.getAttribute('data')) {
    cvObject.setAttribute('data', CV_SRC + '#view=FitH&toolbar=1');
  }
  cvModal.classList.add('open');
  cvModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
}
function closeCv() {
  cvModal.classList.remove('open');
  cvModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

document.querySelectorAll('[data-open-cv]').forEach(el => {
  el.addEventListener('click', openCv);
});
document.querySelectorAll('[data-close-cv]').forEach(el => {
  el.addEventListener('click', closeCv);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cvModal.classList.contains('open')) closeCv();
});
