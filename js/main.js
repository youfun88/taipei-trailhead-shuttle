(function () {
  'use strict';

  var SITE = window.SITE || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  // ---- 套用 config.js 的設定 ----
  var lineId = (SITE.lineId || '').trim();
  var phone = (SITE.phone || '').trim();

  if (SITE.brand) {
    $$('[data-brand]').forEach(function (el) { el.textContent = SITE.brand; });
    document.title = document.title.replace('山行接駁', SITE.brand);
  }
  if (SITE.tagline) {
    $$('[data-tagline]').forEach(function (el) { el.textContent = SITE.tagline; });
  }
  if (SITE.dayTripPrice) {
    var price = Number(SITE.dayTripPrice).toLocaleString('en-US');
    $$('[data-price]').forEach(function (el) { el.textContent = price; });
  }

  if (lineId) {
    var addUrl = 'https://line.me/R/ti/p/' + encodeURIComponent(lineId);
    $$('[data-line-link], [data-line-direct]').forEach(function (el) {
      el.href = addUrl;
      el.target = '_blank';
      el.rel = 'noopener';
      el.hidden = false;
    });
    $$('[data-line-id]').forEach(function (el) { el.textContent = lineId; });
  }
  if (phone) {
    $$('[data-phone-link]').forEach(function (el) {
      el.href = 'tel:' + phone.replace(/[^\d+]/g, '');
      el.hidden = false;
    });
    $$('[data-phone]').forEach(function (el) { el.textContent = phone; });
  }
  if (lineId || phone) $('#contactBox').hidden = false;

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
  onScroll();

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
  var chips = $$('.chip');
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
  var copyBtn = $('#copyBtn');

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
      f.phone.value.trim() ? '電話：' + f.phone.value.trim() : '',
      '目的地：' + f.dest.value,
      '出發日期：' + f.date.value.replace(/-/g, '/') + '（' + week + '）',
      '行程天數：' + f.days.value,
      '人數：' + f.people.value,
      '上車地點：' + f.pickup.value,
      f.note.value.trim() ? '備註：' + f.note.value.trim() : '',
    ];
    return lines.filter(Boolean).join('\n');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements;
    var missing = [];
    if (!f.name.value.trim()) missing.push(f.name);
    if (!f.dest.value) missing.push(f.dest);
    if (!f.date.value) missing.push(f.date);

    $$('.is-invalid', form).forEach(function (el) { el.classList.remove('is-invalid'); });
    if (missing.length) {
      missing.forEach(function (el) { el.classList.add('is-invalid'); });
      errorBox.textContent = '還有必填欄位沒填：稱呼、目的地、出發日期。';
      errorBox.hidden = false;
      result.hidden = true;
      missing[0].focus();
      return;
    }
    errorBox.hidden = true;

    var msg = buildMessage();
    resultText.textContent = msg;
    // 有設定 LINE ID 就直接開啟與車主的對話；沒有則開啟 LINE 分享讓客人選對象
    sendLine.href = lineId
      ? 'https://line.me/R/oaMessage/' + encodeURIComponent(lineId) + '/?' + encodeURIComponent(msg)
      : 'https://line.me/R/share?text=' + encodeURIComponent(msg);
    copyBtn.textContent = '複製訊息';
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  copyBtn.addEventListener('click', function () {
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
  });

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
