(function () {
  'use strict';

  var SITE = window.SITE || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  // 英文頁 en/ 和中文頁共用這支程式：t('中文', 'English') 依頁面語言選一個
  var EN = document.documentElement.lang === 'en';
  var t = function (zh, en) { return EN ? en : zh; };
  // 內容和 HTML 已經一樣就不改，避免載入時整頁重新排版
  var setText = function (el, v) { v = String(v); if (el.textContent !== v) el.textContent = v; };

  // ---- 套用 config.js 的設定 ----
  var lineUrl = (SITE.lineUrl || '').trim();
  var lineId = (SITE.lineId || '').trim();
  var phone = (SITE.phone || '').trim();
  var email = (SITE.email || '').trim();
  var whatsapp = (SITE.whatsapp || '').replace(/\D/g, '');
  var formKey = (SITE.web3formsKey || '').trim();
  var formEndpoint = formKey ? 'https://api.web3forms.com/submit' : '';

  if (EN) {
    // 英文頁的品牌與標語寫在 HTML 裡，不用中文設定蓋掉
  } else if (SITE.brand) {
    $$('[data-brand]').forEach(function (el) { setText(el, SITE.brand); });
    document.title = document.title.replace('山行接駁', SITE.brand);
  }
  if (SITE.owner) $$('[data-owner]').forEach(function (el) { setText(el, SITE.owner); });
  if (SITE.tagline && !EN) {
    $$('[data-tagline]').forEach(function (el) { setText(el, SITE.tagline); });
  }

  // ---- 收費表：出發地、車型各一組切換（表格內容由 scripts/build.mjs 產生）----
  var priceBodies = $$('.price__table tbody');
  var priceTabs = $$('.price__tab');
  var priceState = { origin: 'taipei', car: 'nine' };
  function showPrices() {
    priceBodies.forEach(function (tb) {
      tb.hidden = tb.dataset.origin !== priceState.origin || tb.dataset.car !== priceState.car;
    });
    priceTabs.forEach(function (t) {
      var on = t.dataset.origin ? t.dataset.origin === priceState.origin : t.dataset.car === priceState.car;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-pressed', String(on));
    });
  }
  priceTabs.forEach(function (t) {
    t.addEventListener('click', function () {
      if (t.dataset.origin) priceState.origin = t.dataset.origin;
      if (t.dataset.car) priceState.car = t.dataset.car;
      showPrices();
    });
  });
  showPrices();

  if (lineUrl) {
    $$('a[data-line-link], a[data-line-direct]').forEach(function (el) {
      el.href = lineUrl;
      el.target = '_blank';
      el.rel = 'noopener';
    });
    $$('[data-line-direct]').forEach(function (el) { el.hidden = false; });
    if (lineId) $$('[data-line-id]').forEach(function (el) { setText(el, lineId); });
  }
  if (phone) {
    $$('[data-phone-link]').forEach(function (el) {
      el.href = 'tel:' + phone.replace(/[^\d+]/g, '');
      el.hidden = false;
    });
    $$('[data-phone]').forEach(function (el) { setText(el, phone); });
    // 還沒設定 LINE 連結時，頁首按鈕改成直接撥電話
    if (!lineUrl) {
      $$('[data-line-link]').forEach(function (el) {
        el.href = 'tel:' + phone.replace(/[^\d+]/g, '');
        el.textContent = t('電話預約 ', 'Call to book ') + phone;
        el.classList.replace('btn--line', 'btn--accent');
      });
    }
  }
  if (email) {
    $$('[data-email-link]').forEach(function (el) {
      el.href = 'mailto:' + email;
      el.hidden = false;
    });
    $$('[data-email]').forEach(function (el) { setText(el, email); });
  }
  if (whatsapp) {
    $$('[data-whatsapp-link]').forEach(function (el) {
      el.href = 'https://wa.me/' + whatsapp;
      el.target = '_blank';
      el.rel = 'noopener';
      el.hidden = false;
    });
  }
  [['instagramUrl', '[data-instagram-link]'], ['facebookUrl', '[data-facebook-link]']].forEach(function (s) {
    var url = (SITE[s[0]] || '').trim();
    if (!url) return;
    $$(s[1]).forEach(function (el) {
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener';
      el.hidden = false;
    });
    $$('[data-social]').forEach(function (el) { el.hidden = false; });
  });
  if (lineUrl || whatsapp || email) $('#contactBox').hidden = false;

  setText($('#year'), new Date().getFullYear());

  // ---- 頁首：捲動後變實色、手機選單 ----
  var header = $('#header');
  var burger = $('#burger');
  var nav = $('#nav');
  var dock = $('#dock');

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-solid', y > 40);
    dock.classList.toggle('is-visible', y > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  requestAnimationFrame(onScroll);

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    header.classList.toggle('is-menu', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? t('關閉選單', 'Close menu') : t('開啟選單', 'Open menu'));
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // ---- 路線篩選 ----
  // 「全部」先顯示前 6 條，按「看全部」再展開（沒有 JavaScript 時全部顯示）
  var chips = $$('.chips .chip');
  var routes = $$('.route');
  var routesMore = $('#routesMore');
  var ROUTE_LIMIT = 6;
  var routeFilter = 'all';
  var showAllRoutes = false;
  function applyRouteFilter() {
    var shown = 0;
    routes.forEach(function (r) {
      var match = routeFilter === 'all' || r.dataset.days.split(' ').indexOf(routeFilter) !== -1;
      var folded = routeFilter === 'all' && !showAllRoutes && shown >= ROUTE_LIMIT;
      if (match) shown++;
      r.hidden = !match || folded;
    });
    if (routesMore) {
      setText(routesMore, t('看全部 ' + routes.length + ' 條路線', 'See all ' + routes.length + ' routes'));
      routesMore.hidden = routeFilter !== 'all' || showAllRoutes || shown <= ROUTE_LIMIT;
    }
  }
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      routeFilter = chip.dataset.filter;
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', String(on));
      });
      applyRouteFilter();
    });
  });
  if (routesMore) {
    routesMore.addEventListener('click', function () {
      showAllRoutes = true;
      applyRouteFilter();
      if (routes[ROUTE_LIMIT]) routes[ROUTE_LIMIT].querySelector('a').focus({ preventScroll: true });
    });
  }
  applyRouteFilter();

  // ---- 常見問題分類（沒有 JavaScript 時三類全部顯示）----
  var faqTabs = $$('.faq-tabs [role="tab"]');
  function showFaq(tab) {
    faqTabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      $('#' + t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  faqTabs.forEach(function (t, i) {
    t.addEventListener('click', function () { showFaq(t); });
    t.addEventListener('keydown', function (e) {
      var step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      var next = faqTabs[(i + step + faqTabs.length) % faqTabs.length];
      showFaq(next);
      next.focus();
    });
  });
  if (faqTabs.length) showFaq(faqTabs[0]);
  // 首屏前 HTML 用 .js-fold 先收起第 7 條以後的路線和第 2、3 類常見問題（見 index.html、style.css），這裡改由 hidden 接手
  document.documentElement.classList.remove('js-fold');

  // ---- 詢價表單 ----
  var form = $('#quoteForm');
  var errorBox = $('#formError');
  var result = $('#result');
  var resultText = $('#resultText');
  var sendLine = $('#sendLine');
  var sendLineLabel = $('#sendLineLabel');
  var resultTitle = $('#resultTitle');
  var copyBtn = $('#copyBtn');
  var againBtn = $('#againBtn');
  var submitBtn = $('button[type="submit"]', form);
  var submitLabel = formEndpoint ? t('送出詢價', 'Send inquiry') : t('整理成詢價訊息', 'Prepare my message');
  setText(submitBtn, submitLabel);

  // 出發日期不能選過去
  var today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  form.elements.date.min = today.toISOString().slice(0, 10);
  form.elements.returnDate.min = form.elements.date.min;
  form.elements.flight.min = form.elements.date.min;
  form.elements.date.addEventListener('change', function () {
    form.elements.returnDate.min = form.elements.date.value || form.elements.date.min;
  });

  // 路線頁「我要詢問這條路線」會帶 ?dest=目的地 過來
  var askDest = new URLSearchParams(location.search).get('dest');
  if (askDest && $$('option', form.elements.dest).some(function (o) { return o.value === askDest; })) {
    form.elements.dest.value = askDest;
  }

  // 從路線卡片、方案按鈕帶入預設值
  $$('[data-dest]').forEach(function (a) {
    a.addEventListener('click', function () { form.elements.dest.value = a.dataset.dest; });
  });
  $$('a[data-days]').forEach(function (a) {
    a.addEventListener('click', function () { form.elements.days.value = a.dataset.days; });
  });

  function fullPhone(f) {
    var num = f.phone.value.trim();
    if (!num) return '';
    // 選了國際區碼就去掉號碼開頭的 0，例如 +886 0912… → +886 912…
    return f.cc.value ? f.cc.value + ' ' + num.replace(/^0/, '') : num;
  }
  function withWeek(value) {
    var d = new Date(value + 'T00:00:00');
    var zhDay = '日一二三四五六'.charAt(d.getDay());
    return value.replace(/-/g, '/') + t('（' + zhDay + '）', ' (' + ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()] + ' ' + zhDay + ')');
  }

  function buildMessage() {
    var f = form.elements;
    // 訊息是傳給車主的：英文頁用中英對照的欄位名稱，車主和客人都看得懂
    var L = function (zh, en) { return EN ? en + ' ' + zh + '：' : zh + '：'; };
    var lines = [
      EN ? '【登山接駁詢價 Hiking shuttle inquiry】' : '【登山接駁詢價】',
      EN ? '頁面語言：English' : '',
      L('稱呼', 'Name') + f.name.value.trim(),
      L('希望聯絡方式', 'Contact by') + f.contact.value,
      fullPhone(f) ? L('電話', 'Phone') + fullPhone(f) : '',
      f.email.value.trim() ? 'Email：' + f.email.value.trim() : '',
      L('目的地', 'Destination') + f.dest.value,
      L('去程日期', 'Date') + withWeek(f.date.value),
      f.returnDate.value ? L('回程日期', 'Return date') + withWeek(f.returnDate.value) : '',
      L('接送需求', 'Trip') + f.trip.value,
      L('行程天數', 'Days') + f.days.value,
      L('人數', 'Hikers') + f.people.value,
      L('車型', 'Vehicle') + f.car.value,
      L('上車地點', 'Pick-up') + f.pickup.value,
      f.flight.value ? L('航班抵達日期', 'Flight arrives') + withWeek(f.flight.value) : '',
      L('偏好語言', 'Language') + f.lang.value,
      f.note.value.trim() ? L('其他需求', 'Notes') + f.note.value.trim() : '',
    ];
    return lines.filter(Boolean).join('\n');
  }

  // 送出後顯示結果：訊息內容 + 用 LINE 傳同一則訊息的按鈕
  function showResult(title, warn) {
    resultTitle.textContent = title;
    result.classList.toggle('result--warn', !!warn);
    copyBtn.textContent = t('複製訊息', 'Copy message');
    // 個人 LINE 帳號無法預先帶入訊息：按鈕會先複製訊息再開啟聊天，客人貼上即可。
    sendLine.href = lineUrl || 'https://line.me/R/share?text=' + encodeURIComponent(resultText.textContent);
    sendLineLabel.textContent = lineUrl ? t('複製訊息並開啟 LINE', 'Copy message and open LINE') : t('用 LINE 傳送', 'Send by LINE');
    // WhatsApp 可以預先帶入訊息
    var sendWa = $('#sendWa');
    if (sendWa && whatsapp) {
      sendWa.href = 'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(resultText.textContent);
      sendWa.hidden = false;
    }
    result.hidden = false;
  }

  // 寄出成功：收起表單，換成確認畫面，並把畫面帶到那裡
  function showSent(name) {
    form.classList.add('is-sent');
    showResult(t('謝謝你，' + name + '！我們已經收到你的詢價，會盡快與你聯絡。', 'Thank you, ' + name + '! We received your inquiry and will reply soon.'));
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    result.focus({ preventScroll: true });
  }
  if (againBtn) {
    againBtn.addEventListener('click', function () {
      form.classList.remove('is-sent');
      result.hidden = true;
      form.reset();
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // 把詢價寄到車主信箱（Web3Forms）。寄不出去時回傳 false，由呼叫端改請客人用 LINE 或電話。
  function sendEmail(f, msg) {
    // 隱藏欄位只有機器人會填；填了就不寄，但照樣回報成功，不讓機器人知道被擋下
    if (f._honey && f._honey.value) return Promise.resolve(true);
    var body = {
      access_key: formKey,
      subject: t('登山接駁詢價：', '登山接駁詢價（英文頁）：') + f.dest.value + '・' + f.date.value.replace(/-/g, '/'),
      from_name: 'gohike.tw 詢價表單',
      '稱呼': f.name.value.trim(),
      '希望聯絡方式': f.contact.value,
      '電話': fullPhone(f) || '（未填）',
      'Email': f.email.value.trim() || '（未填）',
      '目的地': f.dest.value,
      '去程日期': f.date.value.replace(/-/g, '/'),
      '回程日期': f.returnDate.value.replace(/-/g, '/') || '（未填）',
      '接送需求': f.trip.value,
      '行程天數': f.days.value,
      '人數': f.people.value,
      '車型': f.car.value,
      '上車地點': f.pickup.value,
      '航班抵達日期': f.flight.value.replace(/-/g, '/') || '（未填）',
      '偏好語言': f.lang.value,
      '其他需求': f.note.value.trim() || '（無）',
      '完整訊息': msg,
    };
    if (EN) body['頁面語言'] = 'English';
    return fetch(formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    })
      .then(function (res) { return res.json().catch(function () { return {}; }).then(function (data) { return res.ok && String(data.success) === 'true'; }); })
      .catch(function () { return false; });
  }

  var sending = false;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    var f = form.elements;
    var missing = [];
    var problems = [];
    var phoneVal = f.phone.value.trim();
    var emailVal = f.email.value.trim();
    var method = f.contact.value;
    if (!f.name.value.trim()) { missing.push(f.name); problems.push(t('稱呼', 'your name')); }
    // 電話或 Email 擇一；選了 Email 聯絡就要有 Email，選 WhatsApp 就要有電話
    if (method === 'Email' && !emailVal) { missing.push(f.email); problems.push(t('Email（你選了用 Email 聯絡）', 'email (you chose to be contacted by email)')); }
    else if (method === 'WhatsApp' && !phoneVal) { missing.push(f.phone); problems.push(t('手機號碼（你選了用 ' + method + ' 聯絡）', 'mobile number (you chose ' + method + ')')); }
    else if (!phoneVal && !emailVal) { missing.push(f.phone, f.email); problems.push(t('手機號碼或 Email 擇一', 'a mobile number or an email')); }
    if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) { missing.push(f.email); problems.push(t('Email 格式不正確', 'a valid email address')); }
    if (!f.dest.value) { missing.push(f.dest); problems.push(t('目的地', 'destination')); }
    if (!f.date.value) { missing.push(f.date); problems.push(t('去程日期', 'date')); }

    $$('.is-invalid', form).forEach(function (el) { el.classList.remove('is-invalid'); });
    if (missing.length) {
      missing.forEach(function (el) { el.classList.add('is-invalid'); });
      errorBox.textContent = t('請再確認：' + problems.join('、') + '。', 'Please check: ' + problems.join(', ') + '.');
      errorBox.hidden = false;
      result.hidden = true;
      missing[0].focus();
      return;
    }
    errorBox.hidden = true;

    var msg = buildMessage();
    resultText.textContent = msg;

    if (!formEndpoint) {
      showResult(lineUrl
        ? t('訊息整理好了。按下方按鈕會複製訊息並開啟 LINE，在聊天室貼上送出就完成詢價：', 'Your message is ready. The button below copies it and opens LINE. Paste it in the chat and send:')
        : t('訊息整理好了，傳給我們就完成詢價：', 'Your message is ready. Send it to us to finish your inquiry:'));
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    sending = true;
    submitBtn.disabled = true;
    submitBtn.textContent = t('寄送中…', 'Sending…');
    result.hidden = true;
    sendEmail(f, msg).then(function (ok) {
      sending = false;
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel;
      if (ok) {
        if (typeof gtag === 'function') gtag('event', 'generate_lead', { method: 'form', page: location.pathname });
        showSent(f.name.value.trim());
      } else {
        showResult(t('詢價沒有寄出去。請把下面這則訊息用 LINE 傳給我們' + (email ? '，或寄到 ' + email : '') + '：', 'Your inquiry was not sent. Please send this message to us by LINE or WhatsApp' + (email ? ', or email it to ' + email : '') + ':'), true);
        result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  sendLine.addEventListener('click', function () {
    if (lineUrl) copyMessage();
  });
  copyBtn.addEventListener('click', copyMessage);

  function copyMessage() {
    var text = resultText.textContent;
    var done = function () { copyBtn.textContent = t('已複製 ✓', 'Copied ✓'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
    function fallback() {
      var range = document.createRange();
      range.selectNodeContents(resultText);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      try { document.execCommand('copy'); done(); } catch (err) { copyBtn.textContent = t('請長按上方文字複製', 'Press and hold the text above to copy'); }
    }
  }

  // ---- 進場動畫 ----
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('has-reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }
})();
