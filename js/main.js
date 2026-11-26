/* 画笔与算法的较量 · 交互脚本（无依赖，可直接用于 GitHub Pages） */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var $ = function (selector, root) { return (root || document).querySelector(selector); };
  var $$ = function (selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); };

  var header = $('#siteHeader');
  var progressBar = $('#progressBar');
  var navReading = $('#navReading');
  var backToTop = $('#backToTop');
  var navToggle = $('#navToggle');
  var navLinks = $('#navLinks');
  var links = $$('.nav-links a');
  var sections = $$('main > section[id], main > article[id]');

  /* ---------- 滚动：进度、导航高亮、返回顶部 ---------- */
  function onScroll() {
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - window.innerHeight;
    var percent = scrollable > 0 ? Math.min(100, Math.max(0, (window.pageYOffset / scrollable) * 100)) : 0;

    if (progressBar) progressBar.style.width = percent.toFixed(2) + '%';
    if (navReading) navReading.textContent = '阅读 ' + Math.round(percent) + '%';
    if (header) header.classList.toggle('is-scrolled', window.pageYOffset > 40);
    if (backToTop) backToTop.classList.toggle('is-visible', window.pageYOffset > 600);

    var current = '';
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= 180) current = section.id;
    });
    links.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', onScroll);
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 移动端章节菜单 ---------- */
  function closeNav() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    links.forEach(function (link) { link.addEventListener('click', closeNav); });
    document.addEventListener('click', function (event) {
      if (!header.contains(event.target)) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeNav();
    });
  }

  /* ---------- 图片灯箱 ---------- */
  var lightbox = $('#lightbox');
  var lightboxImg = $('#lightboxImg');
  var lightboxCaption = $('#lightboxCaption');
  var lightboxClose = $('#lightboxClose');
  var lastFocused = null;

  function openLightbox(button) {
    if (!lightbox || !lightboxImg) return;
    var img = $('img', button);
    if (!img) return;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || '';
    lightboxCaption.textContent = button.getAttribute('data-caption') || img.alt || '';
    lastFocused = document.activeElement;
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
    if (lightboxImg) lightboxImg.src = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  $$('.figure-frame').forEach(function (button) {
    button.addEventListener('click', function () { openLightbox(button); });
  });
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') { closeLightbox(); closeNav(); }
  });

  /* ---------- 复制网站地址 ---------- */
  $$('.copy-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      var text = button.getAttribute('data-copy') || '';
      var done = function () {
        button.textContent = '已复制';
        button.classList.add('is-copied');
        window.setTimeout(function () {
          button.textContent = '复制链接';
          button.classList.remove('is-copied');
        }, 1600);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { legacyCopy(text, done); });
      } else {
        legacyCopy(text, done);
      }
    });
  });

  function legacyCopy(text, done) {
    var field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    try { document.execCommand('copy'); done(); } catch (error) { /* 浏览器不支持时静默忽略 */ }
    document.body.removeChild(field);
  }

  /* ---------- 滚动淡入（尊重系统减少动效设置） ---------- */
  var revealItems = $$('.reveal');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.04, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach(function (item) { observer.observe(item); });
  }
})();
