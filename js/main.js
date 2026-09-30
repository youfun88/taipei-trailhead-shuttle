(function () {
  'use strict';

  var SITE = window.SITE || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  // ---- 套用 config.js 的設定 ----
  var lineUrl = (SITE.lineUrl || '').trim();
  var lineId = (SITE.lineId || '').trim();
  var phone = (SITE.phone || '').trim();
  var email = (SITE.email || '').trim();
  var formKey = (SITE.web3formsKey || '').trim();
  var formEndpoint = formKey ? 'https://api.web3forms.com/submit' : '';

  if (SITE.brand) {
    $$('[data-brand]').forEach(function (el) { el.textContent = SITE.brand; });
    document.title = document.title.replace('山行接駁', SITE.brand);
  }
  if (SITE.owner) $$('[data-owner]').forEach(function (el) { el.textContent = SITE.owner; });
  if (SITE.tagline) {
    $$('[data-tagline]').forEach(function (el) { el.textContent = SITE.tagline; });
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
    if (lineId) $$('[data-line-id]').forEach(function (el) { el.textContent = lineId; });
  }
  if (phone) {
    $$('[data-phone-link]').forEach(function (el) {
      el.href = 'tel:' + phone.replace(/[^\d+]/g, '');
      el.hidden = false;
    });
    $$('[data-phone]').forEach(function (el) { el.textContent = phone; });
    // 還沒設定 LINE 連結時，頁首按鈕改成直接撥電話
    if (!lineUrl) {
      $$('[data-line-link]').forEach(function (el) {
        el.href = 'tel:' + phone.replace(/[^\d+]/g, '');
        el.textContent = '電話預約 ' + phone;
        el.classList.replace('btn--line', 'btn--accent');
      });
    }
  }
  if (email) {
    $$('[data-email-link]').forEach(function (el) {
      el.href = 'mailto:' + email;
      el.hidden = false;
    });
    $$('[data-email]').forEach(function (el) { el.textContent = email; });
  }
  if (lineUrl || phone || email) $('#contactBox').hidden = false;

  $('#year').textContent = new Date().getFullYear();

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
    burger.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // ---- 路線篩選 ----
  var chips = $$('.chips .chip');
  var routes = $$('.route');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.dataset.filter;
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', String(on));
      });
      routes.forEach(function (r) {
        r.hidden = f !== 'all' && r.dataset.days.split(' ').indexOf(f) === -1;
      });
    });
  });

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
  var submitLabel = formEndpoint ? '送出詢價' : '整理成詢價訊息';
  submitBtn.textContent = submitLabel;

  // 出發日期不能選過去
  var today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  form.elements.date.min = today.toISOString().slice(0, 10);

  // 從路線卡片、方案按鈕帶入預設值
  $$('[data-dest]').forEach(function (a) {
    a.addEventListener('click', function () { form.elements.dest.value = a.dataset.dest; });
  });
  $$('a[data-days]').forEach(function (a) {
    a.addEventListener('click', function () { form.elements.days.value = a.dataset.days; });
  });

  function buildMessage() {
    var f = form.elements;
    var d = new Date(f.date.value + 'T00:00:00');
    var week = '日一二三四五六'.charAt(d.getDay());
    var lines = [
      '【登山接駁詢價】',
      '稱呼：' + f.name.value.trim(),
      '電話：' + f.phone.value.trim(),
      '目的地：' + f.dest.value,
      '出發日期：' + f.date.value.replace(/-/g, '/') + '（' + week + '）',
      '行程天數：' + f.days.value,
      '人數：' + f.people.value,
      '車型：' + f.car.value,
      '上車地點：' + f.pickup.value,
      f.note.value.trim() ? '備註：' + f.note.value.trim() : '',
    ];
    return lines.filter(Boolean).join('\n');
  }

  // 送出後顯示結果：訊息內容 + 用 LINE 傳同一則訊息的按鈕
  function showResult(title, warn) {
    resultTitle.textContent = title;
    result.classList.toggle('result--warn', !!warn);
    copyBtn.textContent = '複製訊息';
    // 個人 LINE 帳號無法預先帶入訊息：按鈕會先複製訊息再開啟聊天，客人貼上即可。
    sendLine.href = lineUrl || 'https://line.me/R/share?text=' + encodeURIComponent(resultText.textContent);
    sendLineLabel.textContent = lineUrl ? '複製訊息並開啟 LINE' : '用 LINE 傳送';
    result.hidden = false;
  }

  // 寄出成功：收起表單，換成確認畫面，並把畫面帶到那裡
  function showSent(name) {
    form.classList.add('is-sent');
    showResult('謝謝你，' + name + '！我們已經收到你的詢價，會盡快與你聯絡。');
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
      subject: '登山接駁詢價：' + f.dest.value + '・' + f.date.value.replace(/-/g, '/'),
      from_name: 'gohike.tw 詢價表單',
      '稱呼': f.name.value.trim(),
      '電話': f.phone.value.trim(),
      '目的地': f.dest.value,
      '出發日期': f.date.value.replace(/-/g, '/'),
      '行程天數': f.days.value,
      '人數': f.people.value,
      '車型': f.car.value,
      '上車地點': f.pickup.value,
      '備註': f.note.value.trim() || '（無）',
      '完整訊息': msg,
    };
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
    if (!f.name.value.trim()) missing.push(f.name);
    if (!f.phone.value.trim()) missing.push(f.phone);
    if (!f.dest.value) missing.push(f.dest);
    if (!f.date.value) missing.push(f.date);

    $$('.is-invalid', form).forEach(function (el) { el.classList.remove('is-invalid'); });
    if (missing.length) {
      missing.forEach(function (el) { el.classList.add('is-invalid'); });
      errorBox.textContent = '還有必填欄位沒填：稱呼、聯絡電話、目的地、出發日期。';
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
        ? '訊息整理好了。按下方按鈕會複製訊息並開啟 LINE，在聊天室貼上送出就完成詢價：'
        : '訊息整理好了，傳給我就完成詢價：');
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    sending = true;
    submitBtn.disabled = true;
    submitBtn.textContent = '寄送中…';
    result.hidden = true;
    sendEmail(f, msg).then(function (ok) {
      sending = false;
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel;
      if (ok) {
        showSent(f.name.value.trim());
      } else {
        showResult('詢價沒有寄出去。請把下面這則訊息用 LINE 傳給我' + (phone ? '，或直接打 ' + phone : '') + '：', true);
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
    var done = function () { copyBtn.textContent = '已複製 ✓'; };
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
      try { document.execCommand('copy'); done(); } catch (err) { copyBtn.textContent = '請長按上方文字複製'; }
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
