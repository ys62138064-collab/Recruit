(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);

  const DISHES = [
    {
      id: 'beef', name: '炭火慢烤牛肋排', desc: '慢火现烤 · 外焦里嫩', cat: '招牌菜',
      price: 68, rating: 4.9, sales: 328, tag: '招牌', img: 'assets/hero-beef.png',
      longDesc: '选用带骨牛肋排，72 小时低温腌制后炭火慢烤，外焦里嫩；配自制酸萝卜与香葱碎，咸香回甘，两人份刚好。',
      note: '现点现烤，出餐约 25 分钟 · 建议 2 人分享',
      specs: [
        { key: 'small', label: '小份', price: 68, hint: '香配菜' },
        { key: 'large', label: '大份', price: 128, hint: '香配菜' }
      ]
    },
    {
      id: 'hongshaorou', name: '秘制红烧肉', desc: '慢火三小时 · 甜润不腻', cat: '招牌菜',
      price: 68, rating: 4.8, sales: 216, tag: '招牌', img: 'assets/dish-hongshaorou.png',
      longDesc: '五花三层慢火煨足三小时，收汁到琥珀色，入口即化；配一碗现蒸米饭，是老灶最下饭的一道。',
      note: '每日限量 40 份 · 建议趁热享用',
      specs: [{ key: 'small', label: '标准份', price: 68, hint: '含米饭' }]
    },
    {
      id: 'doufubao', name: '蟹黄豆腐煲', desc: '现拆蟹黄 · 嫩滑鲜香', cat: '汤品',
      price: 52, rating: 4.8, sales: 192, tag: '鲜炖', img: 'assets/dish-doufubao.png',
      longDesc: '每日现拆蟹黄与内酯豆腐同煲，起锅前淋一勺蟹油，鲜香不腻，配米饭绝佳。',
      note: '砂锅现煲 · 出餐约 15 分钟',
      specs: [{ key: 'small', label: '标准份', price: 52, hint: '1-2 人份' }]
    },
    {
      id: 'niujian', name: '老灶酱卤牛腱', desc: '卤香入味 · 薄切不散', cat: '招牌菜',
      price: 58, rating: 4.7, sales: 184, tag: '招牌', emoji: '🥘',
      longDesc: '老卤每日续汤，牛腱低温浸卤六小时后冰镇定形，薄切带花，蘸一点蒜醋汁更香。',
      note: '现切现摆 · 出餐约 10 分钟',
      specs: [
        { key: 'small', label: '小份', price: 58, hint: '约 160g' },
        { key: 'large', label: '大份', price: 98, hint: '约 300g' }
      ]
    },
    {
      id: 'jungutang', name: '瓦罐菌菇汤', desc: '慢煨四小时 · 清鲜回甘', cat: '汤品',
      price: 38, rating: 4.6, sales: 143, tag: '暖汤', emoji: '🍲',
      longDesc: '五种山菌与老鸡清汤入瓦罐，炭火慢煨四小时，不加味精，只留一口清鲜。',
      note: '全天供应 · 可免费续汤一次',
      specs: [{ key: 'small', label: '标准份', price: 38, hint: '2 人份' }]
    },
    {
      id: 'congyoumian', name: '老灶葱油拌面', desc: '现熬葱油 · 拌开即香', cat: '主食',
      price: 28, rating: 4.7, sales: 268, tag: '主食', emoji: '🍜',
      longDesc: '小葱慢熬至金黄，酱油与糖调出老味道；碱水面现煮不过水，拌开葱香扑鼻。',
      note: '现煮现拌 · 出餐约 8 分钟',
      specs: [{ key: 'small', label: '标准份', price: 28, hint: '1 人份' }]
    },
    {
      id: 'laweifan', name: '柴火腊味饭', desc: '锅巴焦香 · 腊味油润', cat: '主食',
      price: 42, rating: 4.6, sales: 157, tag: '主食', emoji: '🍚',
      longDesc: '砂锅柴火焖饭，腊肠与腊肉的油脂渗进米粒，底部一层金黄锅巴，拌上豉油最香。',
      note: '砂锅现焖 · 出餐约 20 分钟',
      specs: [{ key: 'small', label: '标准份', price: 42, hint: '1-2 人份' }]
    }
  ];

  const STORES = [
    { name: '老灶食堂 · 建业路店', addr: '建业路 88 号', dist: '1.2km', hours: '11:00 - 21:30', walk: '15 分钟' },
    { name: '老灶食堂 · 梧桐里店', addr: '梧桐里 12 号', dist: '2.8km', hours: '10:30 - 22:00', walk: '28 分钟' },
    { name: '老灶食堂 · 滨江店', addr: '滨江大道 166 号', dist: '4.5km', hours: '11:00 - 21:00', walk: '42 分钟' }
  ];

  const SORTS = ['推荐', '价格从低到高', '评分最高', '月售最多'];

  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (err) { return fallback; }
  }

  const state = {
    view: 'home',
    beforeDetail: 'home',
    category: '全部',
    query: '',
    sort: '推荐',
    dishId: 'beef',
    specKey: 'small',
    qty: 1,
    cart: load('lz-cart', []),
    storeIndex: load('lz-store', 0),
    points: load('lz-points', 1280),
    orders: load('lz-orders', 12)
  };
  if (!Array.isArray(state.cart)) state.cart = [];
  if (state.storeIndex < 0 || state.storeIndex >= STORES.length) state.storeIndex = 0;

  function save() {
    try {
      localStorage.setItem('lz-cart', JSON.stringify(state.cart));
      localStorage.setItem('lz-store', JSON.stringify(state.storeIndex));
      localStorage.setItem('lz-points', JSON.stringify(state.points));
      localStorage.setItem('lz-orders', JSON.stringify(state.orders));
    } catch (err) { /* 隐私模式下忽略 */ }
  }

  const dishById = (id) => DISHES.find((d) => d.id === id) || DISHES[0];
  const specOf = (dish, key) => dish.specs.find((s) => s.key === key) || dish.specs[0];
  const fmtPoints = (n) => Number(n).toLocaleString('en-US');
  const store = () => STORES[state.storeIndex];

  function thumb(dish, cls) {
    return dish.img
      ? '<img class="' + cls + '" src="' + dish.img + '" alt="" />'
      : '<div class="' + cls + ' emoji" aria-hidden="true">' + (dish.emoji || '🍽') + '</div>';
  }

  /* ---------- 渲染：首页 / 招牌 ---------- */
  function homeDishes() {
    let list = DISHES.filter((d) => d.id !== 'beef');
    if (state.category !== '全部') list = list.filter((d) => d.cat === state.category);
    const q = state.query.trim().toLowerCase();
    if (q) list = list.filter((d) => (d.name + d.desc + d.cat).toLowerCase().indexOf(q) !== -1);
    if (state.sort === '价格从低到高') list.sort((a, b) => a.price - b.price);
    else if (state.sort === '评分最高') list.sort((a, b) => b.rating - a.rating);
    else if (state.sort === '月售最多') list.sort((a, b) => b.sales - a.sales);
    return list;
  }

  function dishCard(dish) {
    return '<div class="dish-card">' +
      '<button class="dish-open" data-action="open-detail" data-id="' + dish.id + '">' +
        thumb(dish, 'dish-thumb') +
        '<span class="dish-info"><strong>' + dish.name + '</strong><p>' + dish.desc + '</p>' +
        '<span class="dish-price">¥' + dish.price + '</span></span>' +
      '</button>' +
      '<button class="add-btn" data-action="add" data-id="' + dish.id + '" aria-label="加入购物车 ' + dish.name + '">+</button>' +
    '</div>';
  }

  function matchedStores() {
    const q = state.query.trim().toLowerCase();
    if (!q) return [];
    return STORES.filter((s) => (s.name + s.addr).toLowerCase().indexOf(q) !== -1 || '门店'.indexOf(q) !== -1);
  }

  function renderHome() {
    const list = homeDishes();
    const stores = state.category === '全部' ? matchedStores() : [];
    let html = '';
    stores.forEach((s, i) => {
      html += '<div class="dish-card">' +
        '<button class="dish-open" data-action="nav" data-view="store">' +
          '<div class="dish-thumb emoji" aria-hidden="true">📍</div>' +
          '<span class="dish-info"><strong>' + s.name + '</strong><p>' + s.addr + ' · 营业中</p>' +
          '<span class="dish-price">距你 ' + s.dist + '</span></span>' +
        '</button>' +
        '<button class="add-btn" data-action="nav" data-view="store" aria-label="查看门店">›</button>' +
      '</div>';
      if (i > 99) html += '';
    });
    html += list.map(dishCard).join('');
    if (!html) html = '<div class="empty-state">没有找到相关菜品，试试「红烧肉」或切换分类～</div>';
    $('dishList').innerHTML = html;

    $('homeSectionTitle').textContent = state.query.trim()
      ? '搜索结果'
      : (state.category === '全部' ? '本周招牌' : state.category);
    document.querySelectorAll('#chipRow .chip').forEach((chip) => {
      chip.classList.toggle('is-active', chip.dataset.cat === state.category);
    });
  }

  function renderSign() {
    const list = DISHES.filter((d) => d.cat === '招牌菜');
    $('signList').innerHTML = list.map(dishCard).join('');
    $('signCount').textContent = list.length + ' 道';
  }

  /* ---------- 渲染：详情 ---------- */
  function renderDetail() {
    const dish = dishById(state.dishId);
    const spec = specOf(dish, state.specKey);
    state.specKey = spec.key;

    $('detailImg').src = dish.img || 'assets/hero-beef.png';
    document.querySelector('.detail-hero').dataset.emoji = dish.emoji || '';
    $('detailName').textContent = dish.name;
    $('detailTag').textContent = dish.tag || '推荐';
    $('detailMeta').textContent = dish.rating + ' 分 · 月售 ' + dish.sales + ' · 约 ' + (dish.id === 'beef' ? 25 : 15) + ' 分钟';
    $('detailDesc').textContent = dish.longDesc;
    $('detailNote').textContent = dish.note;
    $('specRow').innerHTML = dish.specs.map((s) =>
      '<button class="spec-btn' + (s.key === state.specKey ? ' is-active' : '') + '" data-action="spec" data-spec="' + s.key + '">' +
      s.label + ' ¥' + s.price + '</button>'
    ).join('');
    $('qtyVal').textContent = state.qty;
    $('detailPrice').textContent = '¥' + (spec.price * state.qty);
    $('detailSpecLabel').textContent = spec.label + ' · ' + spec.hint;
  }

  /* ---------- 渲染：购物车 / 会员 ---------- */
  function cartTotalQty() { return state.cart.reduce((sum, it) => sum + it.qty, 0); }
  function cartTotalPrice() { return state.cart.reduce((sum, it) => sum + it.price * it.qty, 0); }

  function renderCart() {
    const box = $('cartBox');
    $('cartCount').textContent = cartTotalQty() + ' 件';
    if (!state.cart.length) {
      box.innerHTML = '<div class="empty-state">购物车还是空的，去首页点几道招牌菜吧～</div>';
    } else {
      box.innerHTML = state.cart.map((it) =>
        '<div class="cart-item">' +
          thumb(it, 'cart-thumb') +
          '<div><div class="cart-name">' + it.name + '</div><div class="cart-sub">' + it.specLabel + ' × ' + it.qty + '</div></div>' +
          '<span class="cart-price">¥' + it.price * it.qty + '</span>' +
          '<button class="remove-btn" data-action="remove-cart" data-key="' + it.key + '" aria-label="移除">✕</button>' +
        '</div>'
      ).join('') +
      '<div class="cart-total"><span>合计</span><strong>¥' + cartTotalPrice() + '</strong></div>';
    }
    const badge = $('tabBadge');
    badge.textContent = cartTotalQty();
    badge.hidden = cartTotalQty() === 0;
  }

  function updatePoints() {
    $('pointsVal').textContent = fmtPoints(state.points);
    $('minePoints').textContent = fmtPoints(state.points);
    $('orderCount').textContent = state.orders;
  }

  function updateStore() {
    const s = store();
    $('storeName').textContent = s.name;
    $('storeAddr').textContent = s.addr;
    $('storeDist').textContent = s.dist;
    $('storeHours').textContent = s.hours;
    $('navText').textContent = '导航到店 · 步行 ' + s.walk;
  }

  /* ---------- 视图切换 ---------- */
  function showView(view) {
    state.view = view;
    $('device').dataset.current = view;
    document.querySelectorAll('.view').forEach((el) => el.classList.toggle('is-active', el.dataset.view === view));
    const activeTab = view === 'detail' ? state.beforeDetail : view;
    document.querySelectorAll('.tab').forEach((tab) => tab.classList.toggle('is-active', tab.dataset.view === activeTab));
    if (view !== 'detail') {
      const el = document.querySelector('.view[data-view="' + view + '"]');
      if (el) el.scrollTop = 0;
    }
  }

  function openDetail(id) {
    if (state.view !== 'detail') state.beforeDetail = state.view;
    state.dishId = id;
    state.specKey = dishById(id).specs[0].key;
    state.qty = 1;
    renderDetail();
    showView('detail');
    const scroller = document.querySelector('.detail-scroll');
    if (scroller) scroller.scrollTop = 0;
  }

  /* ---------- 提示 / 弹层 ---------- */
  let toastTimer = null;
  function toast(msg) {
    const el = $('toast');
    el.textContent = msg;
    el.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-show'), 1900);
  }

  function openSheet(title, bodyHtml) {
    $('sheetTitle').textContent = title;
    $('sheetBody').innerHTML = bodyHtml;
    $('sheetLayer').classList.add('is-open');
    $('sheetLayer').setAttribute('aria-hidden', 'false');
  }

  function closeSheet() {
    $('sheetLayer').classList.remove('is-open');
    $('sheetLayer').setAttribute('aria-hidden', 'true');
  }

  function filterSheetHtml() {
    return '<p class="sheet-note">排序与分类会立即作用于首页菜品列表</p>' +
      SORTS.map((s) =>
        '<button class="sheet-option' + (state.sort === s ? ' is-active' : '') + '" data-action="sort" data-sort="' + s + '">' +
        s + (state.sort === s ? '<span class="tick">✓</span>' : '') + '</button>'
      ).join('') +
      '<p class="sheet-note" style="margin-top:18px">菜品分类</p>' +
      ['全部', '招牌菜', '汤品', '主食'].map((c) =>
        '<button class="sheet-option' + (state.category === c ? ' is-active' : '') + '" data-action="chip" data-cat="' + c + '">' +
        c + (state.category === c ? '<span class="tick">✓</span>' : '') + '</button>'
      ).join('');
  }

  function storeSheetHtml() {
    return '<p class="sheet-note">选择你常去的门店，导航时长与门店信息会同步更新</p>' +
      STORES.map((s, i) =>
        '<button class="store-option" data-action="choose-store" data-index="' + i + '">' +
          '<img class="cart-thumb" src="assets/store-thumb.png" alt="" />' +
          '<span><strong>' + s.name + '</strong><p>' + s.addr + ' · ' + s.hours + ' · ' + s.dist + '</p></span>' +
          (state.storeIndex === i ? '<span class="tick">✓</span>' : '') +
        '</button>'
      ).join('');
  }

  function couponSheetHtml() {
    const coupons = [
      { amount: '¥20', title: '满 100 减 20', sub: '全场菜品可用 · 有效期至 2026.12.31' },
      { amount: '9折', title: '招牌菜 9 折', sub: '限招牌菜分类 · 不可与其他优惠叠加' },
      { amount: '免费', title: '生日礼遇 · 免费汤品', sub: '会员生日当月可用 · 每张限 1 次' }
    ];
    return '<p class="sheet-note">金卡会员专享，结算时可直接选用</p>' +
      coupons.map((c) =>
        '<div class="coupon"><span class="coupon-amount">' + c.amount + '</span>' +
        '<div><div class="coupon-title">' + c.title + '</div><div class="coupon-sub">' + c.sub + '</div></div>' +
        '<button class="coupon-use" data-action="use-coupon" data-title="' + c.title + '">去使用</button></div>'
      ).join('');
  }

  function recordsSheetHtml() {
    const rows = [
      { date: '11.18', title: '炭火慢烤牛肋排 · 小份', sub: '建业路店 · 堂食', amount: '¥68' },
      { date: '11.09', title: '秘制红烧肉 + 蟹黄豆腐煲', sub: '建业路店 · 堂食', amount: '¥120' },
      { date: '10.26', title: '老灶葱油拌面 · 标准份', sub: '梧桐里店 · 外带', amount: '¥28' }
    ];
    return '<p class="sheet-note">最近 3 次用餐 · 累计 ' + state.orders + ' 次</p>' +
      rows.map((r) =>
        '<div class="record"><span class="record-date">' + r.date + '</span>' +
        '<div class="record-main"><strong>' + r.title + '</strong><p>' + r.sub + '</p></div>' +
        '<span class="record-amount">' + r.amount + '</span></div>'
      ).join('');
  }

  function notifySheetHtml() {
    const rows = [
      { icon: '🔥', title: '本周招牌上新', text: '炭火慢烤牛肋排已上架，主厨推荐 4.9 分，月售 328 份。' },
      { icon: '🎂', title: '生日礼遇待领取', text: '金卡会员本月可享免费汤品一份，到店出示会员码即可。' },
      { icon: '📍', title: '建业路店营业中', text: '今日 11:00 - 21:30，现点现烤，建议提前 15 分钟下单。' }
    ];
    return rows.map((r) =>
      '<div class="notify-item"><span class="notify-ico">' + r.icon + '</span>' +
      '<div><strong>' + r.title + '</strong><p>' + r.text + '</p></div></div>'
    ).join('');
  }

  /* ---------- 购物车动作 ---------- */
  function addToCart(dish, specKey, qty) {
    const spec = specOf(dish, specKey);
    const key = dish.id + '::' + spec.key;
    const found = state.cart.find((it) => it.key === key);
    if (found) found.qty += qty;
    else state.cart.push({
      key: key, id: dish.id, name: dish.name,
      specLabel: spec.label + ' · ' + spec.hint, price: spec.price, qty: qty,
      img: dish.img || '', emoji: dish.emoji || ''
    });
    save();
    renderCart();
  }

  function addDetailToCart() {
    const dish = dishById(state.dishId);
    addToCart(dish, state.specKey, state.qty);
    return dish;
  }

  function checkout() {
    if (!state.cart.length) { toast('购物车还是空的，先去点几道菜吧'); return; }
    const total = cartTotalPrice();
    const gain = Math.round(total / 10);
    state.points += gain;
    state.orders += 1;
    state.cart = [];
    save();
    renderCart();
    updatePoints();
    toast('下单成功 · 共 ¥' + total + ' · 积分 +' + gain);
  }

  /* ---------- 引导演示 ---------- */
  let demoToken = 0;
  function runDemo() {
    const token = ++demoToken;
    showView('home');
    openDetail('beef');
    toast('演示 1/4 · 打开招牌详情');
    setTimeout(() => {
      if (token !== demoToken) return;
      state.specKey = 'large'; state.qty = 2; renderDetail();
      toast('演示 2/4 · 切换大份 ×2');
    }, 1100);
    setTimeout(() => {
      if (token !== demoToken) return;
      addDetailToCart();
      toast('演示 3/4 · 加入购物车');
    }, 2200);
    setTimeout(() => {
      if (token !== demoToken) return;
      showView('mine'); renderCart();
      toast('演示 4/4 · 到「我的」完成结算');
    }, 3100);
  }

  /* ---------- 事件总线 ---------- */
  document.addEventListener('click', (event) => {
    const el = event.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;
    if (action !== 'intro-demo') demoToken++;

    switch (action) {
      case 'nav':
        closeSheet();
        showView(el.dataset.view);
        break;
      case 'open-detail': openDetail(el.dataset.id); break;
      case 'back': showView(state.beforeDetail); break;
      case 'share': {
        const link = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(link).then(
            () => toast('链接已复制，可分享给好友'),
            () => toast('分享链接：' + link)
          );
        } else toast('分享链接：' + link);
        break;
      }
      case 'chip':
        state.category = el.dataset.cat;
        if (state.view !== 'home') showView('home');
        renderHome();
        closeSheet();
        break;
      case 'view-all':
        state.category = '全部'; state.query = ''; state.sort = '推荐';
        $('searchInput').value = '';
        renderHome();
        toast('已展示全部菜品');
        break;
      case 'filter-sheet': openSheet('筛选与排序', filterSheetHtml()); break;
      case 'sort':
        state.sort = el.dataset.sort;
        renderHome();
        openSheet('筛选与排序', filterSheetHtml());
        break;
      case 'notify-sheet': openSheet('消息通知', notifySheetHtml()); break;
      case 'store-sheet': openSheet('切换门店', storeSheetHtml()); break;
      case 'coupon-sheet': openSheet('我的优惠券', couponSheetHtml()); break;
      case 'records-sheet': openSheet('用餐记录', recordsSheetHtml()); break;
      case 'choose-store':
        state.storeIndex = Number(el.dataset.index);
        save(); updateStore(); closeSheet();
        toast('已切换至 ' + store().name);
        break;
      case 'use-coupon':
        closeSheet();
        toast('已选用「' + el.dataset.title + '」，结算时可享');
        break;
      case 'navigate':
        toast('已规划步行路线 · 到 ' + store().name + ' 约 ' + store().walk);
        break;
      case 'close-sheet': closeSheet(); break;
      case 'add': {
        const dish = dishById(el.dataset.id);
        addToCart(dish, dish.specs[0].key, 1);
        toast('已加入购物车 · ' + dish.name);
        break;
      }
      case 'spec': state.specKey = el.dataset.spec; renderDetail(); break;
      case 'qty-minus': state.qty = Math.max(1, state.qty - 1); renderDetail(); break;
      case 'qty-plus': state.qty = Math.min(9, state.qty + 1); renderDetail(); break;
      case 'add-detail': {
        const dish = addDetailToCart();
        toast('已加入购物车 · ' + dish.name + ' ×' + state.qty);
        break;
      }
      case 'remove-cart':
        state.cart = state.cart.filter((it) => it.key !== el.dataset.key);
        save(); renderCart(); toast('已从购物车移除');
        break;
      case 'checkout': checkout(); break;
      case 'intro-demo': runDemo(); break;
      case 'gallery-open':
        $('gallery').classList.add('is-open');
        $('gallery').setAttribute('aria-hidden', 'false');
        break;
      case 'gallery-close':
        $('gallery').classList.remove('is-open');
        $('gallery').setAttribute('aria-hidden', 'true');
        break;
      case 'zoom':
        $('lightboxImg').src = el.dataset.src;
        $('lightbox').classList.add('is-open');
        $('lightbox').setAttribute('aria-hidden', 'false');
        break;
      case 'lightbox-close':
        $('lightbox').classList.remove('is-open');
        $('lightbox').setAttribute('aria-hidden', 'true');
        break;
      default: break;
    }
  });

  $('searchInput').addEventListener('input', (e) => {
    demoToken++;
    state.query = e.target.value;
    renderHome();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if ($('lightbox').classList.contains('is-open')) {
      $('lightbox').classList.remove('is-open');
    } else if ($('gallery').classList.contains('is-open')) {
      $('gallery').classList.remove('is-open');
    } else if ($('sheetLayer').classList.contains('is-open')) {
      closeSheet();
    }
  });

  /* ---------- 初始化 ---------- */
  renderHome();
  renderSign();
  renderDetail();
  renderCart();
  updatePoints();
  updateStore();
  showView('home');
})();
