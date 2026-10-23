(function () {
  'use strict';

  var SITE = window.SITE || {};
  var $$ = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };
  var lineUrl = (SITE.lineUrl || '').trim();
  var lineId = (SITE.lineId || '').trim();
  var phone = (SITE.phone || '').trim();
  var email = (SITE.email || '').trim();

  if (SITE.brand) {
    $$('[data-brand]').forEach(function (el) { el.textContent = SITE.brand; });
    document.title = document.title.replace('山行接駁', SITE.brand);
  }
  if (SITE.owner) $$('[data-owner]').forEach(function (el) { el.textContent = SITE.owner; });
  if (SITE.tagline) $$('[data-tagline]').forEach(function (el) { el.textContent = SITE.tagline; });

  function show(rowSel, linkSel, href, textSel, text) {
    $$(linkSel).forEach(function (el) { el.href = href; });
    $$(rowSel).forEach(function (el) { el.hidden = false; });
    if (textSel) $$(textSel).forEach(function (el) { el.textContent = text; });
  }
  if (phone) show('[data-phone-row]', '[data-phone-link]', 'tel:' + phone.replace(/[^\d+]/g, ''), '[data-phone]', phone);
  if (email) show('[data-email-row]', '[data-email-link]', 'mailto:' + email, '[data-email]', email);
  var wa = (SITE.whatsapp || '').replace(/\D/g, '');
  if (wa) show('[data-wa-row]', '[data-wa-link]', 'https://wa.me/' + wa, '[data-wa]', '+' + wa.replace(/^(886)(\d{3})(\d{3})(\d{3})$/, '$1 $2-$3-$4'));
  var ig = (SITE.instagramUrl || '').trim();
  if (ig) show('[data-ig-row]', '[data-ig-link]', ig, '[data-ig]', '@' + ig.replace(/\/+$/, '').split('/').pop());
  if (SITE.facebookUrl) show('[data-fb-row]', '[data-fb-link]', SITE.facebookUrl);
  $$('[data-wa-link], [data-ig-link], [data-fb-link]').forEach(function (el) { el.target = '_blank'; el.rel = 'noopener'; });
  if (lineUrl) {
    show('[data-line-row]', '[data-line-link]', lineUrl);
    if (lineId) $$('[data-line-id]').forEach(function (el) { el.textContent = lineId; });
    $$('[data-line-link]').forEach(function (el) { el.target = '_blank'; el.rel = 'noopener'; });
  }

  // 分享名片：手機用系統分享，其他裝置複製網址
  var shareBtn = document.getElementById('shareBtn');
  shareBtn.addEventListener('click', function () {
    var url = location.href.split('#')[0];
    if (navigator.share) {
      navigator.share({ title: document.title, url: url }).catch(function () {});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () { shareBtn.textContent = '已複製網址 ✓'; });
    } else {
      window.prompt('複製這個網址分享名片：', url);
    }
  });
})();
