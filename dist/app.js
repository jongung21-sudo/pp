(function () {
  'use strict';

  const root = document.documentElement;
  const settings = document.querySelector('.display-settings');
  const brightness = document.getElementById('screen-brightness');
  let screenPreferences = { theme: root.dataset.theme || 'night', brightness: 100 };
  try { const saved = JSON.parse(localStorage.getItem('display-settings') || '{}'); screenPreferences.brightness = Math.max(60, Math.min(100, Number(saved.brightness) || 100)); } catch (e) {}
  function applyDisplaySettings() {
    root.dataset.theme = screenPreferences.theme;
    root.style.setProperty('--screen-dim', (100 - screenPreferences.brightness) / 100);
    brightness.value = screenPreferences.brightness;
    document.getElementById('brightness-value').textContent = screenPreferences.brightness + '%';
    document.querySelectorAll('[data-theme-choice]').forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.themeChoice === screenPreferences.theme)); });
    document.querySelector('meta[name="theme-color"]').content = screenPreferences.theme === 'day' ? '#f5f2eb' : '#090a09';
    try { localStorage.setItem('display-settings', JSON.stringify(screenPreferences)); } catch (e) {}
  }
  document.querySelectorAll('[data-theme-choice]').forEach(function (button) { button.addEventListener('click', function () { screenPreferences.theme = button.dataset.themeChoice; applyDisplaySettings(); }); });
  brightness.addEventListener('input', function () { screenPreferences.brightness = Number(brightness.value); applyDisplaySettings(); });
  document.addEventListener('click', function (event) { if (!settings.contains(event.target)) settings.open = false; });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && settings.open) { settings.open = false; settings.querySelector('summary').focus(); } });
  applyDisplaySettings();

  const works = [
    {
      id: '04', title: '썬더', kind: 'commercial', type: 'COMMERCIAL CONCEPT',
      description: '가상 운동화 브랜드의 속도와 추진력을 액션으로 표현한 광고.',
      duration: '00:18', plan: 'assets/plan-04.pdf'
    },
    {
      id: '07', title: '조용한 편', kind: 'film', type: 'ANIMATED FILM',
      description: '누군가의 편이 되는 작은 용기를 그린 성장 애니메이션.',
      duration: '02:24', plan: 'assets/plan-07.pdf'
    },
    {
      id: '05', title: '제네시스 — UNSTOPPABLE', kind: 'commercial', type: 'AUTOMOTIVE CONCEPT',
      description: '혼돈 속의 강력한 주행과 고요한 실내를 대비한 시네마틱 광고 콘셉트.',
      duration: '01:18', plan: 'assets/plan-05.pdf'
    },
    {
      id: '06', title: '조선의 마지막 검신', kind: 'film', type: 'CINEMATIC FILM',
      description: '궁을 지키는 검객의 결의와 상실을 담은 사극 액션 단편.',
      duration: '01:22', plan: 'assets/plan-06.pdf'
    },
    {
      id: '01', title: '그저 삶', kind: 'film', type: 'SHORT FILM',
      description: '불확실한 내일 앞에서 부부가 서로에게 건네는 작은 약속.',
      duration: '01:07', plan: 'assets/plan-01.pdf'
    },
    {
      id: '02', title: '단원 김홍도', kind: 'film', type: 'FILM · TEAM PROJECT',
      description: '단원 김홍도를 소재로 함께 만든 영상 프로젝트.',
      duration: '06:56'
    },
    {
      id: '03', title: '독도의 생명들', kind: 'film', type: 'VISUAL FILM',
      description: '강치와 독도의 생명들을 실사풍 화면으로 만나는 생태 이야기.',
      duration: '01:31', plan: 'assets/plan-03.pdf'
    },
    {
      id: '08', title: '친절한 금자씨 패러디', kind: 'film', type: 'PARODY FILM',
      description: '영화 〈친절한 금자씨〉를 재해석한 패러디 영상.',
      duration: '01:00'
    }
  ];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const grid = document.getElementById('work-grid');
  const dialog = document.getElementById('video-dialog');
  const player = document.getElementById('player');
  const header = document.getElementById('site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const progress = document.querySelector('.scroll-progress');
  let lenis = null;

  if (finePointer.matches && !reducedMotion.matches) {
    document.addEventListener('pointerdown', function (event) {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      [[-18, -16], [17, -13], [-15, 14], [16, 15], [0, -23]].forEach(function (offset) {
        const spark = document.createElement('span');
        spark.className = 'wand-spark';
        spark.style.left = event.clientX + 'px';
        spark.style.top = event.clientY + 'px';
        spark.style.setProperty('--spark-x', offset[0] + 'px');
        spark.style.setProperty('--spark-y', offset[1] + 'px');
        document.body.appendChild(spark);
        spark.addEventListener('animationend', function () { spark.remove(); }, { once: true });
      });
    });
  }

  function createWorkCard(work) {
    const card = document.createElement('article');
    card.className = 'work-card';
    card.dataset.kind = work.kind;
    card.dataset.reveal = '';
    card.innerHTML =
      '<button class="work-image" type="button" data-video="' + work.id + '" aria-label="' + work.title + ' 영상 보기">' +
        '<img src="assets/film-' + work.id + '.jpg" alt="' + work.title + ' 영상 대표 이미지" loading="lazy">' +
        '<span class="work-overlay"><small>' + work.duration + ' / ' + work.type + '</small><span class="work-play" aria-hidden="true">↗</span></span>' +
      '</button>' +
      '<div class="work-info">' +
        '<h3>' + work.title + '</h3>' +
        '<span class="work-tag">' + work.type + '</span>' +
        '<p>' + work.description + '</p>' +
        (work.plan ? '<a class="work-plan" href="' + work.plan + '" target="_blank" rel="noopener noreferrer" aria-label="' + work.title + ' 기획안 PDF 보기"><span class="work-plan-copy"><strong>기획안 보기</strong><small>PDF</small></span><span class="work-plan-icon" aria-hidden="true">↗</span></a>' : '') +
      '</div>';
    return card;
  }

  works.forEach(function (work) { grid.appendChild(createWorkCard(work)); });
  document.getElementById('year').textContent = String(new Date().getFullYear());

  function updateScrollUI() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progress.style.width = percent + '%';
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();

  function closeMenu() {
    mobileNav.classList.remove('open');
    header.classList.remove('menu-visible');
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', '메뉴 열기');
  }

  menuToggle.addEventListener('click', function () {
    const open = !mobileNav.classList.contains('open');
    mobileNav.classList.toggle('open', open);
    header.classList.toggle('menu-visible', open);
    document.body.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  });

  function scrollToTarget(target) {
    const top = target === 0 ? 0 : window.scrollY + target.getBoundingClientRect().top - 72;
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(top, { duration: 1.35, force: true });
    } else {
      window.scrollTo({ top: top, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    }
  }

  document.querySelectorAll('[data-scroll]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      const hash = link.getAttribute('href');
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      closeMenu();
      scrollToTarget(target);
    });
  });
  document.querySelector('.back-top').addEventListener('click', function () { scrollToTarget(0); });

  document.querySelectorAll('.filter').forEach(function (button) {
    button.addEventListener('click', function () {
      const filter = button.dataset.filter;
      document.querySelectorAll('.filter').forEach(function (item) {
        const selected = item === button;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      document.querySelectorAll('.work-card').forEach(function (card) {
        card.hidden = filter !== 'all' && card.dataset.kind !== filter;
        if (!card.hidden && window.gsap) gsap.set(card, { clearProps: 'opacity,visibility,transform' });
      });
      if (window.ScrollTrigger) requestAnimationFrame(function () { ScrollTrigger.refresh(); });
    });
  });

  function openVideo(work) {
    document.getElementById('dialog-title').textContent = work.title;
    document.getElementById('dialog-type').textContent = work.type + ' / ' + work.duration;
    document.getElementById('dialog-description').textContent = work.description;
    const plan = document.getElementById('dialog-plan');
    plan.hidden = !work.plan;
    if (work.plan) plan.href = work.plan;
    player.poster = 'assets/film-' + work.id + '.jpg';
    player.src = 'assets/film-' + work.id + '.mp4';
    dialog.showModal();
    if (lenis) lenis.stop();
    player.play().catch(function () {});
  }

  function closeVideo() {
    player.pause();
    player.removeAttribute('src');
    player.load();
    if (dialog.open) dialog.close();
    if (lenis) lenis.start();
  }

  grid.addEventListener('click', function (event) {
    const button = event.target.closest('[data-video]');
    if (!button) return;
    const work = works.find(function (item) { return item.id === button.dataset.video; });
    if (work) openVideo(work);
  });
  dialog.querySelector('.dialog-close').addEventListener('click', closeVideo);
  dialog.addEventListener('click', function (event) { if (event.target === dialog) closeVideo(); });
  dialog.addEventListener('close', function () {
    player.pause();
    player.removeAttribute('src');
    player.load();
    if (lenis) lenis.start();
  });

  const hero = document.querySelector('.hero');
  hero.addEventListener('pointermove', function (event) {
    const rect = hero.getBoundingClientRect();
    hero.style.setProperty('--pointer-x', ((event.clientX - rect.left) / rect.width * 100) + '%');
    hero.style.setProperty('--pointer-y', ((event.clientY - rect.top) / rect.height * 100) + '%');
  }, { passive: true });

  if (window.Lenis && !reducedMotion.matches) {
    lenis = new Lenis({ duration: 1.2, smoothWheel: true, anchors: false });
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }
  }

  if (window.gsap && window.ScrollTrigger && !reducedMotion.matches) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .from('.hero-kicker', { opacity: 0, y: 24, duration: .9 })
      .from('.title-word', { opacity: 0, yPercent: 110, duration: 1.35, stagger: .16 }, '-=.48')
      .from('.hero-copy, .circle-link', { opacity: 0, y: 32, duration: .95, stagger: .12 }, '-=.66')
      .from('.hero-bottom', { opacity: 0, y: 12, duration: .8 }, '-=.6');

    gsap.to('.hero-media', {
      scale: 1.18, yPercent: 12, ease: 'none',
      scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.hero-content', {
      yPercent: -15, opacity: .25, ease: 'none',
      scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true }
    });

    gsap.utils.toArray('[data-reveal]').forEach(function (element) {
      gsap.from(element, {
        opacity: 0, y: 60, duration: 1.05, ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true }
      });
    });

    ['home', 'portfolio', 'profile', 'skill', 'contact'].forEach(function (id) {
      ScrollTrigger.create({
        trigger: '#' + id, start: 'top center', end: 'bottom center',
        onToggle: function (self) {
          if (!self.isActive) return;
          document.querySelectorAll('.desktop-nav a').forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }
})();
