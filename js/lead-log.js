// 詢價紀錄：有人按 LINE / WhatsApp、或成功送出詢價表單時，通知 admin.shiptolive.com
// 這位訪客最早從哪裡來（Google、Bing、ChatGPT、直接輸入…）。
// 匿名：不送姓名、信箱或 IP；地區只到國家 / 城市層級，由伺服器端加上。
// 做法：包住頁面上已經定義的 gtag()，GA 收到的事件照舊，另外送一份到 admin。
(function () {
  var ENDPOINT = 'https://admin.shiptolive.com/api/track';
  var KEY = 'gh_first_touch';

  function store(fn) { try { return fn(window.localStorage); } catch (e) { return null; } }

  // 第一次進站的來源，保留 90 天
  function firstTouch() {
    var saved = store(function (s) { return JSON.parse(s.getItem(KEY) || 'null'); });
    if (saved && Date.now() - saved.t < 90 * 864e5) return saved;
    var ref = '';
    try { ref = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '') : ''; } catch (e) {}
    if (ref === location.hostname.replace(/^www\./, '')) ref = '';
    var q = new URLSearchParams(location.search);
    var utm = ['utm_source', 'utm_medium', 'utm_campaign'].map(function (k) { return q.get(k) ? k.slice(4) + '=' + q.get(k) : ''; }).filter(Boolean).join('&');
    var ft = { t: Date.now(), ref: ref, src: q.get('utm_source') || '', utm: utm, landing: location.pathname };
    store(function (s) { s.setItem(KEY, JSON.stringify(ft)); });
    return ft;
  }
  var ft = firstTouch();

  function send(event, label) {
    var body = JSON.stringify({
      site: 'gohike', event: event, label: label || '',
      referrerHost: ft.ref, utmSource: ft.src, utm: ft.utm, landing: ft.landing,
      page: location.pathname, lang: document.documentElement.lang || navigator.language || ''
    });
    try {
      if (navigator.sendBeacon) navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'text/plain' }));
      else fetch(ENDPOINT, { method: 'POST', body: body, keepalive: true, mode: 'no-cors' });
    } catch (e) {}
  }

  // LINE、WhatsApp 是這裡的訂車管道，算「詢價點擊」；信箱、電話算一般聯絡
  var LABEL = { line: 'LINE', whatsapp: 'WhatsApp', email: 'Email', phone: 'Phone', form: '詢價表單' };
  var original = window.gtag;
  if (typeof original !== 'function') return;
  window.gtag = function (cmd, name, params) {
    try {
      if (cmd === 'event' && name === 'contact_click') {
        var m = params && params.method;
        send(m === 'line' || m === 'whatsapp' ? 'book_consultation_click' : 'contact_click', LABEL[m] || m);
      } else if (cmd === 'event' && name === 'generate_lead') {
        send('generate_lead', LABEL.form);
      }
    } catch (e) {}
    return original.apply(this, arguments);
  };
})();
