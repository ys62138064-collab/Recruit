(function () {
  'use strict';

  var ASSETS = './assets/';
  var DURATION = 6000;

  var slides = [
    {
      file: 'slide-01.png',
      chapter: '观看模式',
      kicker: '导览 · 2 种观看模式 / 4 个比较维度',
      title: '在画外观看，还是走入画中？',
      note: '从《鳌山暝色图》到「巴黎 1874」沉浸式 VR 展览，看技术如何改变我们与艺术相遇的方式。同是沉浸，观看却不同。',
      alt: '第 1 页：在画外观看，还是走入画中？两种观看模式总览'
    },
    {
      file: 'slide-02.png',
      chapter: '观看模式',
      kicker: '维度 01 · 观看边界',
      title: '从观看边界上看',
      note: '《鳌山暝色图》在固定场所里面向屏幕画框观看投影；「巴黎 1874」则借助头戴设备，进入一个可以移动的虚拟空间。',
      alt: '第 2 页：屏幕式沉浸与空间式沉浸的观看边界对比'
    },
    {
      file: 'slide-03.png',
      chapter: '视点状态',
      kicker: '维度 02 · 视点状态',
      title: '从视点状态上看',
      note: '固定机位跟随光影推拉移动，对比第一人称自由视点：观看者的身体与视角关系被重新定义。',
      alt: '第 3 页：固定机位与第一人称自由视点的对比'
    },
    {
      file: 'slide-04.png',
      chapter: '感官通道',
      kicker: '维度 03 · 感官通道',
      title: '从感官通道上看',
      note: '视觉为主、环境音乐为辅的投影体验，对比视觉、听觉与空间交互共同构成的复合感知。',
      alt: '第 4 页：两种沉浸体验调动的感官通道对比'
    },
    {
      file: 'slide-05.png',
      chapter: '在现方式',
      kicker: '维度 04 · 在现方式',
      title: '从在现方式上看',
      note: '二维画面的动态化投影，对比场景重建的三维虚拟空间——艺术被呈现的方式，决定了沉浸的形态。',
      alt: '第 5 页：二维动态投影与三维虚拟空间的再现方式对比'
    },
    {
      file: 'slide-06.png',
      chapter: '在现方式',
      kicker: '总结 · 四个维度的关键差异',
      title: '同是沉浸，观看却不同。',
      note: '从观看边界到再现方式，用一张表读懂两种体验的四个关键差异；下方还可切换分维度对照与总览表格。',
      alt: '第 6 页：四个比较维度的总结表格'
    }
  ];

  var dimensions = [
    {
      name: '观看边界',
      question: '在哪里观看？',
      aTitle: '固定场所，面向投影',
      aDesc: '画作投射于《悬山》装置之上，观众在固定物理空间观看投影画面。',
      bTitle: '佩戴设备，进入虚拟空间',
      bDesc: '借助头戴显示器，进入一个可以移动的 3D 虚拟环境。'
    },
    {
      name: '视点状态',
      question: '如何改变视角？',
      aTitle: '固定机位，跟随光影',
      aDesc: '以固定机位呈现，观众跟随光影的推拉与移动观看画面。',
      bTitle: '第一人称，自由视点',
      bDesc: '通过转动头部改变观看方向，以自由视点探索虚拟空间。'
    },
    {
      name: '感官通道',
      question: '调动哪些感官？',
      aTitle: '视觉为主，环境音乐为辅',
      aDesc: '以投影画面的视觉体验为核心，配合环境音乐营造氛围。',
      bTitle: '视觉、听觉与空间交互',
      bDesc: '将视听体验与空间交互结合，形成复合感知。'
    },
    {
      name: '再现方式',
      question: '艺术如何被呈现？',
      aTitle: '让二维画面动起来',
      aDesc: '将二维画面动态化，通过投影呈现流动的光影。',
      bTitle: '重建三维场景',
      bDesc: '通过场景重建，构成可探索的三维虚拟空间。'
    }
  ];

  var chapterMap = [0, 0, 1, 2, 3, 3];

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    stage: $('stage'), stageImage: $('stageImage'), stageFigure: $('stageFigure'),
    slideIndex: $('slideIndex'), slideChapter: $('slideChapter'), progressFill: $('progressFill'),
    captionKicker: $('captionKicker'), captionTitle: $('captionTitle'), captionNote: $('captionNote'),
    thumbs: $('thumbs'), chapterNav: $('chapterNav'),
    prevBtn: $('prevBtn'), nextBtn: $('nextBtn'), zoomBtn: $('zoomBtn'), zoomHint: $('zoomHint'),
    autoplayBtn: $('autoplayBtn'), autoplayLabel: $('autoplayLabel'), fullscreenBtn: $('fullscreenBtn'),
    dimensionTabs: $('dimensionTabs'), compareBody: $('compareBody'), viewSwitch: document.querySelector('.view-switch'),
    lightbox: $('lightbox'), lightboxImage: $('lightboxImage'), lightboxLabel: $('lightboxLabel'),
    lightboxStage: $('lightboxStage'), lbZoomValue: $('lbZoomValue'),
    lbZoomIn: $('lbZoomIn'), lbZoomOut: $('lbZoomOut'), lbReset: $('lbReset'), lbClose: $('lbClose'),
    lbPrev: $('lbPrev'), lbNext: $('lbNext')
  };

  var current = 0;
  var playing = false;
  var elapsed = 0;
  var ticker = null;
  var activeDimension = 0;
  var view = 'cards';
  var zoom = 1;
  var lastFocused = null;

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function buildThumbs() {
    slides.forEach(function (slide, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'thumb';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-label', '跳转到第 ' + (i + 1) + ' 页：' + slide.title);
      var img = document.createElement('img');
      img.src = ASSETS + slide.file;
      img.alt = '';
      img.loading = 'lazy';
      var num = document.createElement('span');
      num.textContent = pad(i + 1);
      btn.appendChild(img);
      btn.appendChild(num);
      btn.addEventListener('click', function () { go(i, true); });
      els.thumbs.appendChild(btn);
    });
  }

  function go(index, userAction) {
    current = (index + slides.length) % slides.length;
    var slide = slides[current];

    els.stageImage.src = ASSETS + slide.file;
    els.stageImage.alt = slide.alt;
    els.slideIndex.textContent = pad(current + 1) + ' / ' + pad(slides.length);
    els.slideChapter.textContent = slide.chapter;
    els.captionKicker.textContent = slide.kicker;
    els.captionTitle.textContent = slide.title;
    els.captionNote.textContent = slide.note;
    els.stageFigure.style.animation = 'none';
    void els.stageFigure.offsetWidth;
    els.stageFigure.style.animation = '';

    Array.prototype.forEach.call(els.thumbs.children, function (btn, i) {
      var active = i === current;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    var chipIndex = chapterMap[current];
    Array.prototype.forEach.call(els.chapterNav.children, function (chip, i) {
      chip.classList.toggle('active', i === chipIndex);
    });

    elapsed = 0;
    updateProgress();
    if (!els.lightbox.hidden) updateLightbox();
    if (userAction) stopAutoplay();
  }

  function next() { go(current + 1); }
  function prev() { go(current - 1); }

  function updateProgress() {
    var base = (current / slides.length) * 100;
    var within = playing ? (elapsed / DURATION) * (100 / slides.length) : (100 / slides.length);
    els.progressFill.style.width = (base + within) + '%';
  }

  function startAutoplay() {
    if (playing) return;
    playing = true;
    elapsed = 0;
    els.autoplayBtn.setAttribute('aria-pressed', 'true');
    els.autoplayLabel.textContent = '暂停播放';
    els.autoplayBtn.querySelector('.btn-icon').textContent = '❚❚';
    els.progressFill.classList.add('playing');
    ticker = window.setInterval(function () {
      elapsed += 100;
      if (elapsed >= DURATION) next();
      else updateProgress();
    }, 100);
  }

  function stopAutoplay() {
    if (!playing) return;
    playing = false;
    window.clearInterval(ticker);
    ticker = null;
    els.autoplayBtn.setAttribute('aria-pressed', 'false');
    els.autoplayLabel.textContent = '自动播放';
    els.autoplayBtn.querySelector('.btn-icon').textContent = '▶';
    els.progressFill.classList.remove('playing');
    updateProgress();
  }

  function toggleAutoplay() { playing ? stopAutoplay() : startAutoplay(); }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (els.stage.requestFullscreen) {
      els.stage.requestFullscreen().catch(function () {});
    }
  }

  /* ---------- A / B 对照 ---------- */
  function buildDimensionTabs() {
    dimensions.forEach(function (dim, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dim-tab';
      btn.setAttribute('role', 'tab');
      btn.innerHTML = '<span class="num">维度 ' + pad(i + 1) + '</span><span class="name"></span>';
      btn.querySelector('.name').textContent = dim.name;
      btn.addEventListener('click', function () {
        activeDimension = i;
        view = 'cards';
        syncViewSwitch();
        renderCompare();
      });
      els.dimensionTabs.appendChild(btn);
    });
  }

  function syncViewSwitch() {
    Array.prototype.forEach.call(els.viewSwitch.children, function (btn) {
      var active = btn.dataset.view === view;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    els.dimensionTabs.classList.toggle('hidden', view === 'table');
    Array.prototype.forEach.call(els.dimensionTabs.children, function (btn, i) {
      var active = i === activeDimension;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function renderCompare() {
    syncViewSwitch();
    if (view === 'table') {
      var rows = dimensions.map(function (dim, i) {
        return '<tr>' +
          '<td><span class="row-num">' + pad(i + 1) + '</span><span class="row-name">' + dim.name + '</span><span class="row-q">' + dim.question + '</span></td>' +
          '<td><span class="cell-title">' + dim.aTitle + '</span>' + dim.aDesc + '</td>' +
          '<td><span class="cell-title">' + dim.bTitle + '</span>' + dim.bDesc + '</td>' +
        '</tr>';
      }).join('');
      els.compareBody.innerHTML = '<div class="table-wrap"><table>' +
        '<thead><tr><th>比较维度</th><th>A ·《鳌山暝色图》动态投影</th><th>B ·「巴黎 1874」沉浸式 VR</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table></div>';
      return;
    }

    var dim = dimensions[activeDimension];
    els.compareBody.innerHTML =
      '<div class="dimension-summary"><span class="dim-num">' + pad(activeDimension + 1) + '</span>' +
      '<div><h3></h3><p></p></div></div>' +
      '<div class="ab-grid">' +
        '<article class="ab-card a"><p class="ab-label">A / 屏幕式沉浸</p><h4></h4><p class="desc"></p><p class="ab-source">《鳌山暝色图》×《悬山》 · 动态投影</p></article>' +
        '<article class="ab-card b"><p class="ab-label">B / 空间式沉浸</p><h4></h4><p class="desc"></p><p class="ab-source">「巴黎 1874 · 印象派之夜」 · 沉浸式 VR</p></article>' +
      '</div>';
    var summary = els.compareBody.querySelector('.dimension-summary');
    summary.querySelector('h3').textContent = dim.name;
    summary.querySelector('p').textContent = dim.question;
    var cards = els.compareBody.querySelectorAll('.ab-card');
    cards[0].querySelector('h4').textContent = dim.aTitle;
    cards[0].querySelector('.desc').textContent = dim.aDesc;
    cards[1].querySelector('h4').textContent = dim.bTitle;
    cards[1].querySelector('.desc').textContent = dim.bDesc;
  }

  /* ---------- 放大查看 ---------- */
  function updateLightbox() {
    els.lightboxImage.src = ASSETS + slides[current].file;
    els.lightboxImage.alt = slides[current].alt;
    els.lightboxLabel.textContent = pad(current + 1) + ' / ' + pad(slides.length) + ' · ' + slides[current].chapter;
    setZoom(1);
  }

  function setZoom(value) {
    zoom = Math.min(3, Math.max(0.6, Math.round(value * 10) / 10));
    els.lightboxImage.style.width = (zoom * 100) + '%';
    els.lightboxImage.style.maxWidth = 'none';
    els.lbZoomValue.textContent = Math.round(zoom * 100) + '%';
    if (zoom <= 1) {
      els.lightboxStage.scrollLeft = 0;
      els.lightboxStage.scrollTop = 0;
    }
  }

  function openLightbox() {
    if (!els.lightbox.hidden) return;
    lastFocused = document.activeElement;
    els.lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    updateLightbox();
    els.lbClose.focus();
  }

  function closeLightbox() {
    if (els.lightbox.hidden) return;
    els.lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  /* ---------- 事件绑定 ---------- */
  els.prevBtn.addEventListener('click', function () { go(current - 1, true); });
  els.nextBtn.addEventListener('click', function () { go(current + 1, true); });
  els.zoomBtn.addEventListener('click', openLightbox);
  els.zoomHint.addEventListener('click', function (e) { e.stopPropagation(); openLightbox(); });
  els.stageFigure.addEventListener('click', openLightbox);
  els.autoplayBtn.addEventListener('click', toggleAutoplay);
  els.fullscreenBtn.addEventListener('click', toggleFullscreen);

  els.chapterNav.addEventListener('click', function (e) {
    var chip = e.target.closest('.chapter-chip');
    if (!chip) return;
    go(Number(chip.dataset.target), true);
    document.querySelector('.viewer').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  els.viewSwitch.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-view]');
    if (!btn) return;
    view = btn.dataset.view;
    renderCompare();
  });

  els.lbClose.addEventListener('click', closeLightbox);
  els.lbZoomIn.addEventListener('click', function () { setZoom(zoom + 0.2); });
  els.lbZoomOut.addEventListener('click', function () { setZoom(zoom - 0.2); });
  els.lbReset.addEventListener('click', function () { setZoom(1); });
  els.lbPrev.addEventListener('click', prev);
  els.lbNext.addEventListener('click', next);

  els.lightboxStage.addEventListener('wheel', function (e) {
    e.preventDefault();
    setZoom(zoom + (e.deltaY < 0 ? 0.1 : -0.1));
  }, { passive: false });

  var drag = null;
  els.lightboxStage.addEventListener('pointerdown', function (e) {
    if (zoom <= 1) return;
    drag = { x: e.clientX, y: e.clientY, left: els.lightboxStage.scrollLeft, top: els.lightboxStage.scrollTop };
    els.lightboxStage.classList.add('dragging');
    els.lightboxStage.setPointerCapture(e.pointerId);
  });
  els.lightboxStage.addEventListener('pointermove', function (e) {
    if (!drag) return;
    els.lightboxStage.scrollLeft = drag.left - (e.clientX - drag.x);
    els.lightboxStage.scrollTop = drag.top - (e.clientY - drag.y);
  });
  function endDrag() { drag = null; els.lightboxStage.classList.remove('dragging'); }
  els.lightboxStage.addEventListener('pointerup', endDrag);
  els.lightboxStage.addEventListener('pointercancel', endDrag);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeLightbox(); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); return; }
    if (e.key === 'Home') { go(0, true); return; }
    if (e.key === 'End') { go(slides.length - 1, true); return; }
    var tag = (e.target && e.target.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT|BUTTON|A/.test(tag)) return;
    if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); toggleAutoplay(); }
    if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleFullscreen(); }
    if (e.key === 'Enter') { e.preventDefault(); openLightbox(); }
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopAutoplay();
  });

  buildThumbs();
  buildDimensionTabs();
  go(0);
  renderCompare();
})();
