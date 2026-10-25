// 把 js/config.js、js/prices.js 的資料寫成靜態內容，讓搜尋引擎與 AI 不必執行 JavaScript 也讀得到。
// 產出：index.html 裡 <!-- build:xxx --> 標記之間的區塊、sitemap.xml、llms.txt。
// 用法：node scripts/build.mjs（發布流程會自動執行；改完價格或聯絡資料想在本機預覽時也可以手動跑）。
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => readFileSync(join(root, f), 'utf8');
const write = (f, s) => writeFileSync(join(root, f), s);

// ---- 讀資料 ----
const sandbox = { window: {} };
vm.runInNewContext(read('js/config.js'), sandbox);
vm.runInNewContext(read('js/prices.js'), sandbox);
vm.runInNewContext(read('js/routes.js'), sandbox);
vm.runInNewContext(read('js/routes-en.js'), sandbox);
const SITE = sandbox.window.SITE;
const PRICES = sandbox.window.PRICES;
const ROUTES = sandbox.window.ROUTES;
const ROUTES_EN = sandbox.window.ROUTES_EN || {};
const LINKS_EN = sandbox.window.LINKS_EN || {};
// 同一家店的所有名稱：AI 靠這些把「山行接駁」「Go Hike」「gohike.tw」認成同一個品牌
const BRAND_NAMES = [SITE.brandEn, `${SITE.brand} ${SITE.brandEn}`, 'GoHike', `${SITE.brand} 包車旅遊`, 'gohike.tw'].filter(Boolean);

const URL = 'https://gohike.tw/';
const ORIGINS = { taipei: '台北出發', taichung: '台中出發' };
const CARS = { five: '五人座', nine: '九人座' };
const SEATS = { five: 4, nine: 8 };
const TRIPS = ['單程', '來回', '一天來回'];
const money = (n) => '$' + Number(n).toLocaleString('en-US');
// 有 -sm 小圖（寬 480px）就加上 srcset，讓手機和小卡片不必下載大圖
const srcset = (src, sizes) => {
  const sm = src.replace(/\.webp$/, '-sm.webp');
  return sm !== src && existsSync(join(root, sm)) ? ` srcset="${sm} 480w, ${src} 880w" sizes="${sizes}"` : '';
};
const CARD_SIZES = '(max-width: 760px) calc(100vw - 40px), (max-width: 1020px) 50vw, 370px';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const priced = PRICES.filter((r) => Object.keys(ORIGINS).some((o) => Object.keys(CARS).some((c) => r[o][c])));
const allOneWay = priced.flatMap((r) => Object.keys(ORIGINS).flatMap((o) => Object.keys(CARS).map((c) => r[o][c]?.[0]))).filter(Boolean);
const allPrices = priced.flatMap((r) => Object.keys(ORIGINS).flatMap((o) => Object.keys(CARS).flatMap((c) => r[o][c] || []))).filter(Boolean);
const lowest = Math.min(...allOneWay);
const lowestText = lowest.toLocaleString('en-US');
const routeNames = [...new Set(priced.map((r) => r.name.replace(/（.*?）/, '')))].join('、');

const description =
  `${SITE.brand}提供台北、台中出發的登山接駁包車，專車直達${priced.slice(0, 5).map((r) => r.name.replace(/（.*?）/, '')).join('、')}等高山登山口，下山再接你回家。` +
  `五人座、九人座整車計價，單程 NT$${lowestText} 起，各路線價格公開，歡迎用 LINE 或線上表單詢價。`;

// ---- 產生各區塊 ----
function cardPrice(route) {
  // 卡片只列一種走法：有單程就列單程，沒有就列來回或一天來回
  const i = [0, 1, 2].find((t) => Object.keys(ORIGINS).some((o) => Object.keys(CARS).some((c) => route[o][c]?.[t]))) ?? 0;
  const head = `<p class="route__price-k">${TRIPS[i]}・整車價</p>`;
  const rows = Object.keys(ORIGINS)
    .map((o) => {
      const cells = Object.keys(CARS)
        .filter((c) => route[o][c]?.[i])
        .map((c) => `<b>${CARS[c]} ${money(route[o][c][i])}</b>`);
      return `<div><span>${ORIGINS[o]}</span>${cells.length ? cells.join('') : '<b>歡迎詢價</b>'}</div>`;
    })
    .join('');
  return head + rows;
}

function priceTable() {
  const bodies = [];
  for (const o of Object.keys(ORIGINS)) {
    for (const c of Object.keys(CARS)) {
      const isDefault = o === 'taipei' && c === 'nine';
      const rows = PRICES.map((r) => {
        const p = r[o][c] || [];
        // 整條路線都沒有價格顯示「詢價」；只是沒有這種走法則顯示「—」
        const blank = priced.includes(r) ? '—' : '詢價';
        const cells = TRIPS.map((_, i) => `<td>${p[i] ? money(p[i]) : blank}</td>`).join('');
        return `              <tr><th scope="row">${esc(r.name)}</th>${cells}</tr>`;
      }).join('\n');
      bodies.push(
        `            <tbody data-origin="${o}" data-car="${c}" aria-label="${ORIGINS[o]}・${CARS[c]}"${isDefault ? '' : ' hidden'}>\n${rows}\n            </tbody>`,
      );
    }
  }
  return bodies.join('\n');
}

function priceAnswer(r) {
  return Object.keys(ORIGINS)
    .map((o) => {
      const parts = Object.keys(CARS)
        .filter((c) => r[o][c])
        .map((c) => CARS[c] + TRIPS.map((t, i) => (r[o][c][i] ? `${t} ${money(r[o][c][i])}` : '')).filter(Boolean).join('、'));
      return `${ORIGINS[o]}：${parts.join('；')}。`;
    })
    .join('') + '以上為整車價格；來回是去程、回程各一趟，一天來回是當天送上山、等下山再載回。';
}

// ---- 首頁路線卡片：js/routes.js 的介紹 + prices.js 的價格 ----
function routeCard(rt) {
  const price = PRICES.find((r) => r.key === rt.key);
  if (!price) throw new Error(`prices.js 沒有路線 ${rt.key}`);
  const tags = rt.dayTags.map((t) => `<span>${esc(t)}</span>`).join('');
  // 有照片的卡片把天數標籤疊在照片上
  const media = rt.img
    ? `\n            <div class="route__media"><img src="${rt.img.src}"${srcset(rt.img.src, CARD_SIZES)} alt="${esc(rt.img.alt)}" loading="lazy" width="${rt.img.w}" height="${rt.img.h}"><p class="route__tags route__tags--media">${tags}</p>${rt.alt ? `<span class="route__alt">${rt.alt}</span>` : ''}</div>`
    : '';
  const facts = [['登山口', rt.trailhead], ['台北車程', rt.drive], ...(rt.img ? [] : [['海拔', rt.alt]])].filter((f) => f[1]);
  return `          <article class="route reveal${rt.img ? '' : ' route--plain'}" id="route-${rt.key}" data-days="${rt.days}">${media}
            <div class="route__body">${rt.img ? '' : `\n              <p class="route__tags">${tags}</p>`}
              <h3><a href="routes/${rt.key}/">${esc(rt.name)}</a></h3>
              <p class="route__sub">${esc(rt.sub)}</p>
              <ul class="route__points">
                <li><b>景色特色</b>${esc(rt.card.scenery)}</li>
                <li><b>適合對象</b>${esc(rt.card.audience)}</li>
                <li><b>交通特色</b>${esc(rt.card.transport)}</li>
              </ul>
              <dl>${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
              <div class="route__price">${cardPrice(price)}</div>
              <div class="route__links"><a class="route__link" href="#book" data-dest="${esc(rt.dest)}">詢問這條路線</a><a class="route__more" href="routes/${rt.key}/">查看接駁詳情</a></div>
            </div>
          </article>`;
}

const about =
  `${SITE.brand}是台北、台中出發的登山接駁包車服務，接送${routeNames}等登山口，` +
  `提供五人座（最多 4 位乘客）與九人座（最多 8 位乘客）兩種車型，整車計價。` +
  `詢價請用 LINE（ID ${SITE.lineId}）、WhatsApp、Email（${SITE.email}）或網站上的詢價表單。`;

// 首頁常見問題（<!-- faq:start --> 到 <!-- faq:end --> 之間）
const pageFaq = (html) =>
  [...html.slice(html.indexOf('<!-- faq:start -->'), html.indexOf('<!-- faq:end -->')).matchAll(/<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/g)].map((m) => ({
    q: strip(m[1]),
    a: strip(m[2]),
  }));
const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

// 首頁（中、英）共用的商家資料：只放網站上已經寫明的事實。地址、營業時間、評價都沒有公開，不要加。
const OG_IMAGE = URL + 'images/og.jpg';
const BUSINESS_IMAGES = [URL + 'images/car-tree.webp', URL + 'images/car-front.webp', OG_IMAGE];
const LOGO = { '@type': 'ImageObject', '@id': URL + '#logo', url: URL + 'images/apple-touch-icon.png', width: 180, height: 180 };
const PRICE_RANGE = `NT$${Math.min(...allPrices).toLocaleString('en-US')}–NT$${Math.max(...allPrices).toLocaleString('en-US')}`;
const businessFacts = {
  '@type': 'LocalBusiness',
  '@id': URL + '#business',
  name: SITE.brand,
  alternateName: BRAND_NAMES,
  url: URL,
  logo: LOGO,
  image: BUSINESS_IMAGES,
  email: SITE.email,
  priceRange: PRICE_RANGE,
  currenciesAccepted: 'TWD',
  paymentAccepted: 'Cash, Bank transfer, LINE Pay, PayPal',
  address: { '@type': 'PostalAddress', addressCountry: 'TW' },
  knowsLanguage: ['zh-Hant-TW', 'en'],
  sameAs: [SITE.lineUrl, SITE.instagramUrl, SITE.facebookUrl].filter(Boolean),
};

function jsonLd(html) {
  // 常見問題直接從頁面上的問答抓，避免兩邊內容不一致
  const faq = pageFaq(html);

  const offers = [];
  for (const r of priced) {
    for (const o of Object.keys(ORIGINS)) {
      for (const c of Object.keys(CARS)) {
        if (!r[o][c]) continue;
        TRIPS.forEach((trip, i) => {
          const price = r[o][c][i];
          if (!price) return;
          offers.push({
            '@type': 'Offer',
            name: `${ORIGINS[o]}・${r.name}登山接駁・${CARS[c]}${trip}`,
            price,
            priceCurrency: 'TWD',
            itemOffered: {
              '@type': 'TaxiService',
              name: `${r.name}登山接駁（${ORIGINS[o]}）`,
              serviceType: '登山接駁包車',
              description: `${CARS[c]}整車${trip}，最多 ${SEATS[c]} 位乘客`,
            },
          });
        });
      }
    }
  }

  const graph = [
    { '@type': 'WebSite', '@id': URL + '#website', url: URL, name: SITE.brand, alternateName: BRAND_NAMES, inLanguage: ['zh-Hant-TW', 'en'], publisher: { '@id': URL + '#business' } },
    {
      '@type': 'WebPage',
      '@id': URL + '#webpage',
      url: URL,
      name: html.match(/<title>([^<]*)<\/title>/)[1],
      description,
      inLanguage: 'zh-Hant-TW',
      isPartOf: { '@id': URL + '#website' },
      about: { '@id': URL + '#business' },
      primaryImageOfPage: { '@type': 'ImageObject', url: OG_IMAGE, width: 1200, height: 630 },
    },
    {
      ...businessFacts,
      description,
      areaServed: ['台北市', '新北市', '台中市'].map((name) => ({ '@type': 'City', name })),
      contactPoint: { '@type': 'ContactPoint', email: SITE.email, url: URL + '#book', contactType: 'reservations', availableLanguage: ['zh-Hant-TW', 'en'] },
      hasOfferCatalog: { '@type': 'OfferCatalog', name: '登山接駁路線與價格', itemListElement: offers },
    },
    {
      '@type': 'FAQPage',
      '@id': URL + '#faq',
      mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];
  return `  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`;
}

// ---- 聯絡方式直接寫進 HTML：原本只靠 main.js 補上連結，搜尋引擎與 AI 不執行 JavaScript 時看不到 ----
// 對應 config.js 有填的項目：加上 href、拿掉 hidden；main.js 之後照樣會再設定一次，不衝突。
const CONTACT_LINKS = {
  'data-line-direct': SITE.lineUrl,
  'data-whatsapp-link': SITE.whatsapp ? 'https://wa.me/' + SITE.whatsapp.replace(/\D/g, '') : '',
  'data-instagram-link': SITE.instagramUrl,
  'data-facebook-link': SITE.facebookUrl,
  'data-email-link': SITE.email ? 'mailto:' + SITE.email : '',
};
function staticContacts(page) {
  const has = (attrs, k) => new RegExp(`\\s${k}(?=[\\s>=]|$)`).test(attrs);
  page = page.replace(/<(a|p|div)\b([^>]*)>/g, (tag, name, attrs) => {
    if (has(attrs, 'data-social') && (SITE.instagramUrl || SITE.facebookUrl)) return `<${name}${attrs.replace(/\shidden\b/, '')}>`;
    if (/\sid="contactBox"/.test(attrs) && (SITE.lineUrl || SITE.whatsapp || SITE.email)) return `<${name}${attrs.replace(/\shidden\b/, '')}>`;
    const key = Object.keys(CONTACT_LINKS).find((k) => has(attrs, k));
    if (!key || !CONTACT_LINKS[key]) return tag;
    let a = attrs.replace(/\shidden\b/, '');
    if (name !== 'a') return `<${name}${a}>`;
    const url = CONTACT_LINKS[key];
    a = a.replace(/\s(href|target|rel)="[^"]*"/g, '');
    return `<a${a} href="${esc(url)}"${url.startsWith('mailto:') ? '' : ' target="_blank" rel="noopener"'}>`;
  });
  if (SITE.lineId) page = page.replace(/(<(b|span) data-line-id>)[^<]*(<\/\2>)/g, (_, a, t, c) => a + esc(SITE.lineId) + c);
  if (SITE.email) page = page.replace(/(<(b|span) data-email>)[^<]*(<\/\2>)/g, (_, a, t, c) => a + esc(SITE.email) + c);
  return page;
}

// ---- 寫回 index.html ----
function region(html, name, content) {
  const open = `<!-- build:${name} -->`;
  const close = `<!-- /build:${name} -->`;
  const a = html.indexOf(open);
  const b = html.indexOf(close);
  if (a === -1 || b === -1) throw new Error(`找不到 ${open} 區塊`);
  return html.slice(0, a + open.length) + '\n' + content + '\n' + html.slice(html.lastIndexOf('\n', b) + 1);
}

let html = read('index.html');
html = html.replace(/(<meta name="description" content=")[^"]*(")/, (_, a, b) => a + esc(description) + b);
html = html.replace(/(<(b|span) data-price>)[^<]*(<\/\2>)/g, (_, a, tag, c) => a + lowestText + c);
html = region(html, 'route-cards', ROUTES.map(routeCard).join('\n\n'));
html = region(html, 'price-table', priceTable());
html = region(html, 'about', `        <p class="footer__about">${esc(about)}</p>`);
html = staticContacts(html);
html = region(html, 'jsonld', jsonLd(html));

// ---- 路線頁 routes/<key>/：js/routes.js 的每條路線一頁，讓「玉山 登山接駁」這類搜尋有專屬頁面 ----
// 介紹取自 js/routes.js、價格取自 prices.js、共通問答取自首頁的常見問題。
const credits = [...html.matchAll(/<li>([^<—]+?)\s*—\s*([\s\S]*?)<\/li>/g)].map((m) => ({ label: m[1].trim(), html: m[2].trim() }));
const homeFaq = pageFaq(html);
const SHARED_FAQ = ['單程、來回、一天來回有什麼差別？', '如果下山時間比預計晚，司機會等嗎？', '九人座真的可以坐八位乘客加八個大背包嗎？', '入園、入山證和山屋要自己申請嗎？', '如果行程取消或需要改期怎麼辦？'];
const sharedFaq = SHARED_FAQ.map((q) => {
  const f = homeFaq.find((x) => x.q === q);
  if (!f) throw new Error(`首頁常見問題找不到「${q}」，路線頁需要它`);
  return f;
});

const routePages = ROUTES.map((rt) => {
  const credit = rt.img && credits.find((c) => rt.img.alt.includes(c.label) || rt.name.includes(c.label));
  if (rt.img && !credit) throw new Error(`路線 ${rt.key} 的照片在頁尾找不到授權資料`);
  return { rt, route: PRICES.find((r) => r.key === rt.key), credit };
});
const routeUrl = (key) => `${URL}routes/${key}/`;
const isPriced = (r) => priced.includes(r);

function fromPrice(r, o) {
  // 這個出發地最便宜的走法，例如「五人座單程 $6,500」
  const opts = Object.keys(CARS).flatMap((c) => (r[o][c] || []).map((p, i) => (p ? { c, i, p } : null)).filter(Boolean));
  if (!opts.length) return '';
  const best = opts.sort((a, b) => a.p - b.p)[0];
  return `${CARS[best.c]}${TRIPS[best.i]} ${money(best.p)}`;
}

function routePage({ rt, route, credit }) {
  const name = rt.name;
  const url = routeUrl(rt.key);
  const title = `${name}登山接駁｜台北、台中出發｜${SITE.brand}`;
  const desc =
    `${name}登山接駁包車：${rt.sub}。台北、台中出發，接送地點：${rt.trailhead}。` +
    (isPriced(route)
      ? Object.keys(ORIGINS).map((o) => (fromPrice(route, o) ? `${ORIGINS[o]}${fromPrice(route, o)}起` : '')).filter(Boolean).join('，') + '，整車計價。'
      : '整車計價，歡迎詢價。') +
    '歡迎用 LINE 或線上表單詢價。';
  const faq = [...rt.faq, ...(isPriced(route) ? [{ q: `${route.name}登山接駁多少錢？`, a: priceAnswer(route) }] : []), ...sharedFaq];
  const ask = `/?dest=${encodeURIComponent(rt.dest)}#book`;
  const image = rt.img ? URL + rt.img.src : OG_IMAGE;

  const rows = Object.keys(ORIGINS).flatMap((o) =>
    Object.keys(CARS).map((c) => {
      const p = route[o][c];
      const cells = TRIPS.map((_, i) => `<td>${p?.[i] ? money(p[i]) : isPriced(route) ? '—' : '詢價'}</td>`).join('');
      return `            <tr><th scope="row">${ORIGINS[o]}・${CARS[c]}<small>最多 ${SEATS[c]} 位乘客</small></th>${cells}</tr>`;
    }),
  );

  const others = routePages
    .filter((x) => x.rt.key !== rt.key)
    .map((x) => {
      const from = isPriced(x.route) ? (fromPrice(x.route, 'taipei') || fromPrice(x.route, 'taichung')) + ' 起' : '歡迎詢價';
      const thumb = x.rt.img ? `<img src="/${x.rt.img.src.replace(/\.webp$/, '-sm.webp')}" alt="" loading="lazy" width="480" height="320">` : '';
      return `          <li><a href="/routes/${x.rt.key}/">${thumb}<b>${esc(x.rt.name)}</b><span>${esc(from)}</span></a></li>`;
    })
    .join('\n');

  const offers = Object.keys(ORIGINS).flatMap((o) =>
    Object.keys(CARS).flatMap((c) =>
      TRIPS.map((trip, i) => route[o][c]?.[i] && { '@type': 'Offer', name: `${ORIGINS[o]}・${CARS[c]}${trip}`, price: route[o][c][i], priceCurrency: 'TWD' }).filter(Boolean),
    ),
  );
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE.brand, item: URL },
          { '@type': 'ListItem', position: 2, name: `${name}登山接駁`, item: url },
        ],
      },
      {
        '@type': 'TaxiService',
        '@id': url + '#service',
        name: `${name}登山接駁`,
        serviceType: '登山接駁包車',
        description: desc,
        url,
        image,
        provider: { '@id': URL + '#business' },
        areaServed: ['台北市', '新北市', '台中市'].map((n) => ({ '@type': 'City', name: n })),
        ...(offers.length ? { offers } : {}),
      },
      { '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    ],
  };

  const facts = [['登山口', rt.trailhead], ['台北車程', rt.drive], ['海拔', rt.alt], ['行程類型', rt.dayTags.join('、')]].filter((f) => f[1]);
  const links = [...rt.links, { label: '臺灣登山申請一站式服務網（入園、入山申請）', url: 'https://hike.taiwan.gov.tw/' }].filter(
    (l, i, all) => all.findIndex((x) => x.url === l.url) === i,
  );

  return `<!doctype html>
<html lang="zh-Hant-TW">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="theme-color" content="#14231c">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="zh-Hant-TW" href="${url}">
  <link rel="alternate" hreflang="en" href="${URL}en/routes/${rt.key}/">
  <link rel="alternate" hreflang="x-default" href="${url}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="zh_TW">
  <meta property="og:site_name" content="${esc(SITE.brand)}">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="${image}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
  <!-- build:font -->
  <!-- /build:font -->
  <link rel="stylesheet" href="/css/style.css">
  <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-GTRGBHGVD0"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-GTRGBHGVD0');
  </script>
</head>
<body class="page">
  <a class="skip" href="#main">跳到主要內容</a>

  <header class="header is-solid page-header">
    <div class="wrap header__inner">
      <a class="logo" href="/">
        <svg class="logo__mark" viewBox="0 0 32 32" aria-hidden="true"><path d="M2 26 12 8l5 8 3-4 10 14z" fill="currentColor"/><path d="M12 8l3 4.8-3 2.2-3-1.6z" fill="#fff" opacity=".9"/></svg>
        <span class="logo__text"><b>${esc(SITE.brand)}</b><small>${esc(SITE.tagline)}</small></span>
      </a>
      <nav class="nav page-nav" aria-label="主選單">
        <a href="/#routes">熱門路線</a>
        <a href="/#pricing">收費與付款</a>
        <a href="/#faq">常見問題</a>
        <a href="/en/routes/${rt.key}/" hreflang="en" lang="en">English</a>
      </nav>
      <a class="btn btn--line btn--sm" href="${esc(SITE.lineUrl)}" target="_blank" rel="noopener">LINE 詢價</a>
    </div>
  </header>

  <main id="main">
    <section class="section route-page">
      <div class="wrap">
        <p class="crumbs"><a href="/">${esc(SITE.brand)}</a> / <a href="/#routes">熱門路線</a> / ${esc(name)}</p>
        <div class="route-page__grid${rt.img ? '' : ' route-page__grid--plain'}">
          <div>
            <p class="route-page__labels">${rt.labels.map((l) => `<span>${esc(l)}</span>`).join('')}</p>
            <h1>${esc(name)}登山接駁</h1>
            <p class="route-page__sub">${esc(rt.sub)}</p>
            <p class="section__lead">${esc(rt.scenery)}</p>
            <dl class="route-page__facts">
${facts.map(([k, v]) => `              <div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('\n')}
            </dl>
            <div class="route-page__cta">
              <a class="btn btn--accent" href="${esc(ask)}">我要詢問這條路線</a>
              <a class="btn btn--line" href="${esc(SITE.lineUrl)}" target="_blank" rel="noopener">LINE 詢價</a>
            </div>
          </div>${
            rt.img
              ? `
          <figure class="route-page__photo">
            <img src="/${rt.img.src}"${srcset(rt.img.src, '(max-width: 760px) calc(100vw - 40px), 560px').replace(/(srcset="|, )(images\/)/g, '$1/$2')} alt="${esc(rt.img.alt)}" width="${rt.img.w}" height="${rt.img.h}" fetchpriority="high">
            <figcaption>照片：${credit.html}</figcaption>
          </figure>`
              : ''
          }
        </div>
      </div>
    </section>

    <section class="section section--tint section--tight">
      <div class="wrap">
        <h2>路線特色</h2>
        <div class="route-page__cols">
          <div><h3>景觀</h3><p>${esc(rt.scenery)}</p></div>
          <div><h3>行程類型</h3><p>${esc([...rt.dayTags, ...rt.labels.filter((l) => !rt.dayTags.includes(l))].join('・'))}</p></div>
          <div><h3>適合客群</h3><p>${esc(rt.audience)}</p></div>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="wrap">
        <h2>交通接駁</h2>
        <dl class="route-page__transport">
          <div><dt>出發地</dt><dd>台北車站、台中高鐵站，也可以到府接送</dd></div>
          <div><dt>接送位置</dt><dd>${esc(rt.trailhead)}</dd></div>${rt.drive ? `\n          <div><dt>台北車程</dt><dd>${esc(rt.drive)}（一般路況下的概估）</dd></div>` : ''}
          <div><dt>注意事項</dt><dd>${esc(rt.transport)}</dd></div>
        </dl>
      </div>
    </section>

    <section class="section section--tint section--tight">
      <div class="wrap">
        <h2>${esc(name)}接駁價格</h2>
        <p class="section__lead">以下為整車參考費用，不是按人頭計價。來回是去程、回程兩段行程接駁；一天來回是當天送上山、依約定時間接回。實際報價依上車地點、接送時間與停靠需求確認，若有額外費用會在預約成立前列明。</p>
        <div class="price">
          <table class="price__table route-page__table">
            <thead><tr><th scope="col">出發地・車型</th>${TRIPS.map((t) => `<th scope="col">${t}</th>`).join('')}</tr></thead>
            <tbody>
${rows.join('\n')}
            </tbody>
          </table>
        </div>
        <p class="route-page__note route-page__pay"><b>付款與取消</b>訂金可用匯款、LINE Pay，海外旅客可用 PayPal；尾款以新台幣現金或匯款支付。出發三日前通知可全額退費取消或改期，遇封山或官方管制可於出發前一日取消。<a href="/#payment">付款與取消說明</a></p>
        <p class="route-page__note">${isPriced(route) ? '「—」表示沒有這種走法，可以直接詢價。' : '這條路線依行程報價，歡迎詢價。'}預約時請告訴我們日期、人數和上車地點，也可以用<a href="${esc(ask)}">線上詢價表單</a>。</p>
      </div>
    </section>

    <section class="section section--tight">
      <div class="wrap wrap--narrow">
        <h2>登山須知</h2>
        <p class="section__lead">我們負責交通接駁；入園入山申請、山屋或營地、登山保險和裝備請自行準備，詢價時我們可以提供入山證、山屋的申請資訊。出發前請到官方網站確認最新的開放情形、路況與管制。</p>
        <ul class="route-page__links">
${links.map((l) => `          <li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a></li>`).join('\n')}
        </ul>
      </div>
    </section>

    <section class="section section--tint section--tight">
      <div class="wrap wrap--narrow">
        <h2>常見問題</h2>
        <div class="faq">
${faq.map((f) => `          <details>\n            <summary>${esc(f.q)}</summary>\n            <p>${esc(f.a)}</p>\n          </details>`).join('\n')}
        </div>
      </div>
    </section>

    <section class="section section--tight route-page__end">
      <div class="wrap">
        <h2>準備好出發了嗎？</h2>
        <p>告訴我們日期、人數與上車地點，確認車輛及行程後提供報價。</p>
        <a class="btn btn--accent btn--lg" href="${esc(ask)}">我要詢問這條路線</a>
      </div>
    </section>

    <section class="section section--tint section--tight">
      <div class="wrap">
        <h2>其他登山口</h2>
        <ul class="route-page__others">
${others}
        </ul>
      </div>
    </section>
  </main>

  <div class="dock is-visible">${SITE.whatsapp ? `\n    <a class="btn btn--outline" href="https://wa.me/${SITE.whatsapp.replace(/\D/g, '')}" target="_blank" rel="noopener">WhatsApp</a>` : ''}
    <a class="btn btn--line" href="${esc(SITE.lineUrl)}" target="_blank" rel="noopener">LINE</a>
    <a class="btn btn--accent" href="${esc(ask)}">免費詢價</a>
  </div>

  <footer class="footer">
    <div class="wrap footer__inner">
      <div>
        <a class="logo logo--footer" href="/">
          <svg class="logo__mark" viewBox="0 0 32 32" aria-hidden="true"><path d="M2 26 12 8l5 8 3-4 10 14z" fill="currentColor"/></svg>
          <span class="logo__text"><b>${esc(SITE.brand)}</b><small>${esc(SITE.tagline)}</small></span>
        </a>
        <p class="footer__about">${esc(about)}</p>
      </div>
      <nav class="footer__nav" aria-label="頁尾選單">
        <a href="/">首頁</a>
        <a href="/#routes">熱門路線</a>
        <a href="/#pricing">收費</a>
        <a href="/#book">詢價</a>
        <a href="/#faq">常見問題</a>${SITE.instagramUrl ? `\n        <a href="${esc(SITE.instagramUrl)}" target="_blank" rel="noopener">Instagram</a>` : ''}${SITE.facebookUrl ? `\n        <a href="${esc(SITE.facebookUrl)}" target="_blank" rel="noopener">Facebook 粉絲專頁</a>` : ''}
      </nav>
    </div>
  </footer>
</body>
</html>
`;
}
const routeHtml = Object.fromEntries(routePages.map((x) => [x.rt.key, routePage(x)]));

// ---- 標題字型：只向 Google Fonts 要頁面上實際用到的字，檔案才會小 ----
let cardHtml = read('card.html');
const headingText = [html, cardHtml, ...Object.values(routeHtml)]
  // 標題，以及路線頁用標題字型的副標
  .flatMap((page) => [...page.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>|<p class="route-page__sub">([\s\S]*?)<\/p>/g)].map((m) => (m[1] ?? m[2]).replace(/<[^>]+>/g, '')))
  .join('');
const ascii = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('');
const glyphs = [...new Set(headingText + SITE.brand + SITE.owner + SITE.tagline + '詢價掃描加好友—・，。：、？（）' + ascii)].filter((ch) => ch === ' ' || ch.trim()).sort().join('');
const fontUrl = 'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@900&display=swap&text=' + encodeURIComponent(glyphs);
const fontTags = [
  '  <link rel="preconnect" href="https://fonts.googleapis.com">',
  '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  `  <link rel="preload" as="style" href="${esc(fontUrl)}" onload="this.onload=null;this.rel='stylesheet'">`,
  `  <noscript><link rel="stylesheet" href="${esc(fontUrl)}"></noscript>`,
].join('\n');
html = region(html, 'font', fontTags);
cardHtml = region(cardHtml, 'font', fontTags);

// ---- css / js 網址加上內容版本號：避免瀏覽器拿舊版頁面配新版程式（或反過來）而壞掉 ----
const versioned = (page) =>
  page.replace(/((?:href|src)="\/?)((?:css|js)\/[\w.-]+\.(?:css|js))(?:\?v=[0-9a-f]+)?(")/g, (_, a, file, c) => {
    const hash = createHash('sha1').update(readFileSync(join(root, file))).digest('hex').slice(0, 8);
    return `${a}${file}?v=${hash}${c}`;
  });
html = versioned(html);
cardHtml = versioned(cardHtml);
write('index.html', html);
write('card.html', cardHtml);
// 路線頁整個資料夾重新產生，prices.js 拿掉的路線不會留下舊頁面
rmSync(join(root, 'routes'), { recursive: true, force: true });
for (const [key, page] of Object.entries(routeHtml)) {
  mkdirSync(join(root, 'routes', key), { recursive: true });
  write(`routes/${key}/index.html`, versioned(region(page, 'font', fontTags)));
}

// ---- 英文頁 en/：中文首頁的完整英文版，給海外山友，也讓用英文問 AI「Taiwan hiking shuttle」時找得到我們 ----
// en/index.html 是翻好的範本，<!-- build:… --> 之間由這裡產生：路線卡片（js/routes-en.js 的文字 + routes.js 的照片與篩選）、
// 收費表與結構化資料（prices.js），所以中英文價格永遠一致。常見問題直接從英文頁上抓。
const EN_URL = URL + 'en/';
const EN_ORIGINS = { taipei: 'From Taipei', taichung: 'From Taichung' };
const EN_CARS = { five: '5-seat', nine: '9-seat' };
const EN_TRIPS = ['One way', 'Round trip', 'Same-day return'];
const nt = (n) => 'NT$' + Number(n).toLocaleString('en-US');
const enName = (r) => ROUTES_EN[r.key]?.name || r.name;
const DAY_EN = { 兩天: '2 days', 三天: '3 days', 當日來回: 'Day trip', 三天以上: '3+ days', 單日縱走: '1-day traverse', 單日百岳: '1-day Baiyue' };

const enDescription =
  `${SITE.brandEn} (${SITE.brand}) is a private hiking shuttle in Taiwan from Taipei and Taichung to trailheads such as ` +
  `${priced.slice(0, 5).map((r) => enName(r).replace(/ \(.*\)$/, '')).join(', ')}, and back after your hike. ` +
  `Priced per vehicle (5-seat or 9-seat), one way from ${nt(lowest)}, with every route's price public. Ask on WhatsApp, LINE or with the online form.`;
// meta description 要短（約 160 字元內），完整版留給結構化資料
const enMetaDescription =
  `Private hiking shuttle in Taiwan from Taipei and Taichung to trailheads like Yushan, Xueshan and Hehuanshan, and back after your hike. ` +
  `Priced per vehicle, one way from ${nt(lowest)}.`;
const enAbout =
  `${SITE.brandEn} (${SITE.brand}) is a hiking shuttle from Taipei and Taichung to trailheads including ${priced.slice(0, 8).map((r) => enName(r).replace(/ \(.*\)$/, '')).join(', ')}. ` +
  `We have a 5-seat car (up to 4 passengers) and a 9-seat van (up to 8 passengers), priced per vehicle. ` +
  `Ask on WhatsApp (${SITE.whatsapp}), LINE (ID ${SITE.lineId}), email (${SITE.email}) or with the form on this page.`;

function enCardPrice(route) {
  const i = [0, 1, 2].find((t) => Object.keys(ORIGINS).some((o) => Object.keys(CARS).some((c) => route[o][c]?.[t]))) ?? 0;
  const head = `<p class="route__price-k">${EN_TRIPS[i]} · whole vehicle</p>`;
  const rows = Object.keys(ORIGINS)
    .map((o) => {
      const cells = Object.keys(CARS)
        .filter((c) => route[o][c]?.[i])
        .map((c) => `<b>${EN_CARS[c]} ${nt(route[o][c][i])}</b>`);
      return `<div><span>${EN_ORIGINS[o]}</span>${cells.length ? cells.join('') : '<b>Ask us</b>'}</div>`;
    })
    .join('');
  return head + rows;
}

function enPriceTable() {
  const bodies = [];
  for (const o of Object.keys(ORIGINS)) {
    for (const c of Object.keys(CARS)) {
      const isDefault = o === 'taipei' && c === 'nine';
      const rows = PRICES.map((r) => {
        const p = r[o][c] || [];
        const blank = priced.includes(r) ? '—' : 'Ask us';
        const cells = EN_TRIPS.map((_, i) => `<td>${p[i] ? nt(p[i]) : blank}</td>`).join('');
        return `              <tr><th scope="row">${esc(enName(r))}</th>${cells}</tr>`;
      }).join('\n');
      bodies.push(
        `            <tbody data-origin="${o}" data-car="${c}" aria-label="${EN_ORIGINS[o]}, ${EN_CARS[c]}"${isDefault ? '' : ' hidden'}>\n${rows}\n            </tbody>`,
      );
    }
  }
  return bodies.join('\n');
}

function enRouteCard(rt) {
  const price = PRICES.find((r) => r.key === rt.key);
  const en = ROUTES_EN[rt.key];
  if (!en) throw new Error(`js/routes-en.js 沒有路線 ${rt.key} 的英文`);
  const tags = (en.dayTags || rt.dayTags.map((d) => DAY_EN[d] || d)).map((t) => `<span>${esc(t)}</span>`).join('');
  const media = rt.img
    ? `\n            <div class="route__media"><img src="/${rt.img.src}"${srcset('/' + rt.img.src, CARD_SIZES)} alt="${esc(en.imgAlt || en.name)}" loading="lazy" width="${rt.img.w}" height="${rt.img.h}"><p class="route__tags route__tags--media">${tags}</p>${rt.alt ? `<span class="route__alt">${rt.alt}</span>` : ''}</div>`
    : '';
  const facts = [['Trailhead', en.trailhead], ['Drive', rt.drive && en.drive && `${en.drive} from Taipei`], ...(rt.img ? [] : [['Altitude', rt.alt]])].filter((f) => f[1]);
  return `          <article class="route reveal${rt.img ? '' : ' route--plain'}" id="route-${rt.key}" data-days="${rt.days}">${media}
            <div class="route__body">${rt.img ? '' : `\n              <p class="route__tags">${tags}</p>`}
              <h3><a href="/en/routes/${rt.key}/">${esc(en.name)}</a></h3>
              <p class="route__sub">${esc(en.sub)}</p>
              <ul class="route__points">
                <li><b>Scenery</b>${esc(en.card.scenery)}</li>
                <li><b>Good for</b>${esc(en.card.audience)}</li>
                <li><b>Getting there</b>${esc(en.card.transport)}</li>
              </ul>
              <dl>${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
              <div class="route__price">${enCardPrice(price)}</div>
              <div class="route__links"><a class="route__link" href="#book" data-dest="${esc(en.dest)}">Ask about this route</a><a class="route__more" href="/en/routes/${rt.key}/">Route details</a></div>
            </div>
          </article>`;
}

function enJsonLd(page) {
  const faq = pageFaq(page);
  const offers = priced.flatMap((r) =>
    Object.keys(ORIGINS).flatMap((o) =>
      Object.keys(CARS).flatMap((c) =>
        EN_TRIPS.map((trip, i) =>
          r[o][c]?.[i]
            ? {
                '@type': 'Offer',
                name: `${enName(r)} hiking shuttle, ${EN_ORIGINS[o].replace(/^From/, 'from')}, ${EN_CARS[c]}, ${trip.toLowerCase()}`,
                price: r[o][c][i],
                priceCurrency: 'TWD',
                itemOffered: { '@type': 'TaxiService', name: `${enName(r)} hiking shuttle (${EN_ORIGINS[o].replace(/^From/, 'from')})`, serviceType: 'Hiking shuttle / trailhead transfer', description: `${EN_CARS[c]} whole vehicle, ${trip.toLowerCase()}, up to ${SEATS[c]} passengers` },
              }
            : null,
        ).filter(Boolean),
      ),
    ),
  );
  const graph = [
    {
      '@type': 'WebPage',
      '@id': EN_URL + '#webpage',
      url: EN_URL,
      name: page.match(/<title>([^<]*)<\/title>/)[1].replace(/&amp;/g, '&'),
      description: enMetaDescription,
      inLanguage: 'en',
      isPartOf: { '@id': URL + '#website' },
      about: { '@id': URL + '#business' },
      primaryImageOfPage: { '@type': 'ImageObject', url: OG_IMAGE, width: 1200, height: 630 },
    },
    {
      ...businessFacts,
      description: enDescription,
      areaServed: ['Taipei', 'New Taipei', 'Taichung'].map((name) => ({ '@type': 'City', name })),
      contactPoint: { '@type': 'ContactPoint', email: SITE.email, url: EN_URL + '#book', contactType: 'reservations', availableLanguage: ['zh-Hant-TW', 'en'] },
      hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Hiking shuttle routes and prices', itemListElement: offers },
    },
    { '@type': 'FAQPage', '@id': EN_URL + '#faq', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ];
  return `  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`;
}

// 英文頁的表單選項要和卡片的 data-dest 一致，否則「Ask about this route」帶不進表單
let enHtml = read('en/index.html');
for (const rt of ROUTES) {
  const dest = ROUTES_EN[rt.key]?.dest;
  if (dest && !enHtml.includes(`<option>${esc(dest)}</option>`)) throw new Error(`en/index.html 的目的地選單沒有「${dest}」`);
}
enHtml = enHtml.replace(/(<meta name="description" content=")[^"]*(")/, (_, a, b) => a + esc(enMetaDescription) + b);
enHtml = enHtml.replace(/(<(b|span) data-price>)[^<]*(<\/\2>)/g, (_, a, tag, c) => a + lowestText + c);
enHtml = region(enHtml, 'route-cards', ROUTES.map(enRouteCard).join('\n\n'));
enHtml = region(enHtml, 'price-table', enPriceTable());
enHtml = region(enHtml, 'about', `        <p class="footer__about">${esc(enAbout)}</p>`);
enHtml = staticContacts(enHtml);
enHtml = region(enHtml, 'jsonld', enJsonLd(enHtml));

// ---- 英文路線頁 en/routes/<key>/：中文路線頁的英文版，讓「Hehuanshan shuttle from Taipei」這類英文搜尋有專屬頁面 ----
// 文字取自 js/routes-en.js、價格取自 prices.js、照片與天數篩選取自 routes.js；共通問答與照片授權取自英文首頁。
const enRouteUrl = (key) => `${EN_URL}routes/${key}/`;
const enHomeFaq = pageFaq(enHtml);
const EN_SHARED_FAQ = [
  'What is the difference between one way, round trip and same-day return?',
  'Will the driver wait if we come down late?',
  'Can the 9-seat van really take 8 passengers and 8 big packs?',
  'Do I need to arrange park and mountain permits and cabins myself?',
  'What if I need to cancel or change dates?',
  'Does the driver speak English?',
];
const enSharedFaq = EN_SHARED_FAQ.map((q) => {
  const f = enHomeFaq.find((x) => x.q === q);
  if (!f) throw new Error(`英文首頁常見問題找不到「${q}」，英文路線頁需要它`);
  return f;
});
const enCreditsBlock = enHtml.slice(enHtml.indexOf('<details class="credits">'), enHtml.indexOf('</details>', enHtml.indexOf('<details class="credits">')));
const enCredits = [...enCreditsBlock.matchAll(/<li>([^:<]+):\s*([\s\S]*?)<\/li>/g)].map((m) => ({ label: m[1].trim(), html: m[2].trim() }));

function enFromPrice(r, o) {
  const opts = Object.keys(CARS).flatMap((c) => (r[o][c] || []).map((p, i) => (p ? { c, i, p } : null)).filter(Boolean));
  if (!opts.length) return '';
  const best = opts.sort((a, b) => a.p - b.p)[0];
  return `${EN_CARS[best.c]} ${EN_TRIPS[best.i].toLowerCase()} ${nt(best.p)}`;
}

function enPriceAnswer(r) {
  return (
    Object.keys(ORIGINS)
      .map((o) => {
        const parts = Object.keys(CARS)
          .filter((c) => r[o][c])
          .map((c) => `${EN_CARS[c]}: ` + EN_TRIPS.map((t, i) => (r[o][c][i] ? `${t.toLowerCase()} ${nt(r[o][c][i])}` : '')).filter(Boolean).join(', '));
        return `${EN_ORIGINS[o]}, ${parts.join('; ')}.`;
      })
      .join(' ') + ' Prices are per vehicle. Round trip is two drives, there and back; same-day return means we drop you off and pick you up the same day.'
  );
}

function enRoutePage(rt) {
  const en = ROUTES_EN[rt.key];
  if (!en?.scenery) throw new Error(`js/routes-en.js 沒有路線 ${rt.key} 的路線頁英文（scenery、audience、transport、labels、faq）`);
  const route = PRICES.find((r) => r.key === rt.key);
  const url = enRouteUrl(rt.key);
  const short = en.name.replace(/ \(.*\)$/, '');
  const zhName = (en.name.match(/\(([^)]*)\)$/) || [])[1] || rt.name;
  // 標題控制在約 60 字元內，搜尋結果才不會被截斷；中文名稱留在 h1 與內文
  const title = `${short} hiking shuttle from Taipei & Taichung | ${SITE.brandEn}`;
  const desc =
    `Private hiking shuttle to ${short} from Taipei or Taichung. ${en.sub}. Drop-off at ${en.trailhead}. ` +
    (isPriced(route)
      ? 'Per vehicle: ' + Object.keys(ORIGINS).map((o) => (enFromPrice(route, o) ? `${EN_ORIGINS[o].replace(/^From/, 'from')}, ${enFromPrice(route, o)}` : '')).filter(Boolean).join('; ') + '.'
      : 'Priced per vehicle; ask us for a quote.') +
    ' Ask on WhatsApp, LINE or with the online form.';
  const faq = [...en.faq, ...(isPriced(route) ? [{ q: `How much is a hiking shuttle to ${short}?`, a: enPriceAnswer(route) }] : []), ...enSharedFaq];
  const ask = `/en/?dest=${encodeURIComponent(en.dest)}#book`;
  const image = rt.img ? URL + rt.img.src : OG_IMAGE;
  const credit = rt.img && enCredits.find((c) => (en.imgAlt || '').toLowerCase().includes(c.label.toLowerCase()) || en.name.toLowerCase().includes(c.label.toLowerCase()));
  if (rt.img && !credit) throw new Error(`英文路線頁 ${rt.key} 的照片在英文首頁頁尾找不到授權資料`);
  const dayTags = en.dayTags || rt.dayTags.map((d) => DAY_EN[d] || d);
  const waUrl = SITE.whatsapp ? 'https://wa.me/' + SITE.whatsapp.replace(/\D/g, '') : '';

  const rows = Object.keys(ORIGINS).flatMap((o) =>
    Object.keys(CARS).map((c) => {
      const p = route[o][c];
      const cells = EN_TRIPS.map((_, i) => `<td>${p?.[i] ? nt(p[i]) : isPriced(route) ? '—' : 'Ask us'}</td>`).join('');
      return `            <tr><th scope="row">${EN_ORIGINS[o]} · ${EN_CARS[c]}<small>Up to ${SEATS[c]} passengers</small></th>${cells}</tr>`;
    }),
  );

  const others = ROUTES.filter((x) => x.key !== rt.key)
    .map((x) => {
      const xr = PRICES.find((r) => r.key === x.key);
      const from = isPriced(xr) ? 'from ' + (enFromPrice(xr, 'taipei') || enFromPrice(xr, 'taichung')) : 'Ask for a quote';
      const thumb = x.img ? `<img src="/${x.img.src.replace(/\.webp$/, '-sm.webp')}" alt="" loading="lazy" width="480" height="320">` : '';
      return `          <li><a href="/en/routes/${x.key}/">${thumb}<b>${esc(ROUTES_EN[x.key]?.name || x.name)}</b><span>${esc(from)}</span></a></li>`;
    })
    .join('\n');

  const offers = Object.keys(ORIGINS).flatMap((o) =>
    Object.keys(CARS).flatMap((c) =>
      EN_TRIPS.map((trip, i) => route[o][c]?.[i] && { '@type': 'Offer', name: `${EN_ORIGINS[o]}, ${EN_CARS[c]}, ${trip.toLowerCase()}`, price: route[o][c][i], priceCurrency: 'TWD' }).filter(Boolean),
    ),
  );
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE.brandEn, item: EN_URL },
          { '@type': 'ListItem', position: 2, name: `${short} hiking shuttle`, item: url },
        ],
      },
      {
        '@type': 'TaxiService',
        '@id': url + '#service',
        name: `${en.name} hiking shuttle`,
        serviceType: 'Hiking shuttle / trailhead transfer',
        description: desc,
        url,
        image,
        provider: { '@id': URL + '#business' },
        areaServed: ['Taipei', 'New Taipei', 'Taichung'].map((n) => ({ '@type': 'City', name: n })),
        ...(offers.length ? { offers } : {}),
      },
      { '@type': 'FAQPage', inLanguage: 'en', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    ],
  };

  const facts = [['Trailhead', en.trailhead], ['Drive from Taipei', rt.drive && en.drive], ['Altitude', rt.alt], ['Trip length', dayTags.join(', ')]].filter((f) => f[1]);
  const links = [...rt.links, { url: 'https://hike.taiwan.gov.tw/' }]
    .filter((l, i, all) => all.findIndex((x) => x.url === l.url) === i)
    .map((l) => ({ url: l.url, label: LINKS_EN[l.url] || l.label }));

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="theme-color" content="#14231c">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="zh-Hant-TW" href="${routeUrl(rt.key)}">
  <link rel="alternate" hreflang="en" href="${url}">
  <link rel="alternate" hreflang="x-default" href="${routeUrl(rt.key)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_US">
  <meta property="og:site_name" content="${esc(SITE.brandEn)}">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="${image}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
  <!-- build:font -->
  <!-- /build:font -->
  <link rel="stylesheet" href="/css/style.css">
  <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-GTRGBHGVD0"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-GTRGBHGVD0');
  </script>
</head>
<body class="page">
  <a class="skip" href="#main">Skip to main content</a>

  <header class="header is-solid page-header">
    <div class="wrap header__inner">
      <a class="logo" href="/en/">
        <svg class="logo__mark" viewBox="0 0 32 32" aria-hidden="true"><path d="M2 26 12 8l5 8 3-4 10 14z" fill="currentColor"/><path d="M12 8l3 4.8-3 2.2-3-1.6z" fill="#fff" opacity=".9"/></svg>
        <span class="logo__text"><b>${esc(SITE.brandEn)}</b><small>${esc(SITE.brand)} · Trailhead shuttle</small></span>
      </a>
      <nav class="nav page-nav" aria-label="Main menu">
        <a href="/en/#routes">Routes</a>
        <a href="/en/#pricing">Prices &amp; payment</a>
        <a href="/en/#faq">FAQ</a>
        <a href="${routeUrl(rt.key).replace(URL, '/')}" hreflang="zh-Hant-TW" lang="zh-Hant-TW">中文</a>
      </nav>
      <a class="btn btn--line btn--sm" href="${esc(SITE.lineUrl)}" target="_blank" rel="noopener">Ask on LINE</a>
    </div>
  </header>

  <main id="main">
    <section class="section route-page">
      <div class="wrap">
        <p class="crumbs"><a href="/en/">${esc(SITE.brandEn)}</a> / <a href="/en/#routes">Routes</a> / ${esc(short)}</p>
        <div class="route-page__grid${rt.img ? '' : ' route-page__grid--plain'}">
          <div>
            <p class="route-page__labels">${en.labels.map((l) => `<span>${esc(l)}</span>`).join('')}</p>
            <h1>${esc(short)} hiking shuttle <span lang="zh-Hant-TW">(${esc(zhName)})</span></h1>
            <p class="route-page__sub">${esc(en.sub)}</p>
            <p class="section__lead">${esc(en.scenery)}</p>
            <dl class="route-page__facts">
${facts.map(([k, v]) => `              <div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('\n')}
            </dl>
            <div class="route-page__cta">
              <a class="btn btn--accent" href="${esc(ask)}">Ask about this route</a>
              ${waUrl ? `<a class="btn btn--outline" href="${waUrl}" target="_blank" rel="noopener">WhatsApp</a>` : ''}
              <a class="btn btn--line" href="${esc(SITE.lineUrl)}" target="_blank" rel="noopener">Ask on LINE</a>
            </div>
          </div>${
            rt.img
              ? `
          <figure class="route-page__photo">
            <img src="/${rt.img.src}"${srcset(rt.img.src, '(max-width: 760px) calc(100vw - 40px), 560px').replace(/(srcset="|, )(images\/)/g, '$1/$2')} alt="${esc(en.imgAlt || en.name)}" width="${rt.img.w}" height="${rt.img.h}" fetchpriority="high">
            <figcaption>Photo: ${credit.html}</figcaption>
          </figure>`
              : ''
          }
        </div>
      </div>
    </section>

    <section class="section section--tint section--tight">
      <div class="wrap">
        <h2>About this route</h2>
        <div class="route-page__cols">
          <div><h3>Scenery</h3><p>${esc(en.scenery)}</p></div>
          <div><h3>Trip type</h3><p>${esc([...dayTags, ...en.labels.filter((l) => !dayTags.includes(l))].join(' · '))}</p></div>
          <div><h3>Good for</h3><p>${esc(en.audience)}</p></div>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="wrap">
        <h2>Getting there</h2>
        <dl class="route-page__transport">
          <div><dt>Pick-up</dt><dd>Taipei Main Station, Taichung HSR Station, or your address</dd></div>
          <div><dt>Drop-off</dt><dd>${esc(en.trailhead)}</dd></div>${rt.drive && en.drive ? `\n          <div><dt>Drive from Taipei</dt><dd>${esc(en.drive)} (a rough estimate in normal traffic)</dd></div>` : ''}
          <div><dt>Good to know</dt><dd>${esc(en.transport)}</dd></div>
        </dl>
      </div>
    </section>

    <section class="section section--tint section--tight">
      <div class="wrap">
        <h2>${esc(short)} shuttle prices</h2>
        <p class="section__lead">Prices are per vehicle, not per person, in New Taiwan dollars. Round trip is two drives, there and back. Same-day return means we drop you off and pick you up at the agreed time the same day. Your final quote depends on the pick-up place, times and stops; any extra cost is listed before you book.</p>
        <div class="price">
          <table class="price__table route-page__table">
            <thead><tr><th scope="col">From · vehicle</th>${EN_TRIPS.map((t) => `<th scope="col">${t}</th>`).join('')}</tr></thead>
            <tbody>
${rows.join('\n')}
            </tbody>
          </table>
        </div>
        <p class="route-page__note route-page__pay"><b>Payment and cancellation</b>Pay the deposit by bank transfer or LINE Pay; overseas visitors can use PayPal. The balance is paid in New Taiwan dollars, in cash or by bank transfer. Tell us at least three days before departure for a full refund or a new date. If the mountain or road is closed by the authorities, you can cancel up to one day before. <a href="/en/#payment">Payment and cancellation details</a></p>
        <p class="route-page__note">${isPriced(route) ? '"—" means we don\'t offer that trip type here; ask us for a quote. ' : 'This route is quoted per trip; ask us for a price. '}When you book, tell us your dates, number of hikers and pick-up place, or use the <a href="${esc(ask)}">online inquiry form</a>.</p>
      </div>
    </section>

    <section class="section section--tight">
      <div class="wrap wrap--narrow">
        <h2>Before you hike</h2>
        <p class="section__lead">We provide the transport. Park and mountain permits, cabins or campsites, hiking insurance and gear are yours to arrange; we can share where to apply when you ask for a quote. Check the official sites for the latest openings, trail conditions and closures before you go.</p>
        <ul class="route-page__links">
${links.map((l) => `          <li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a></li>`).join('\n')}
        </ul>
      </div>
    </section>

    <section class="section section--tint section--tight">
      <div class="wrap wrap--narrow">
        <h2>Questions</h2>
        <div class="faq">
${faq.map((f) => `          <details>\n            <summary>${esc(f.q)}</summary>\n            <p>${esc(f.a)}</p>\n          </details>`).join('\n')}
        </div>
      </div>
    </section>

    <section class="section section--tight route-page__end">
      <div class="wrap">
        <h2>Ready to go?</h2>
        <p>Tell us your dates, number of hikers and pick-up place. We confirm the vehicle and your plan, then send a quote. Our driver speaks some basic English, and we confirm everything in writing.</p>
        <a class="btn btn--accent btn--lg" href="${esc(ask)}">Ask about this route</a>
      </div>
    </section>

    <section class="section section--tint section--tight">
      <div class="wrap">
        <h2>Other trailheads</h2>
        <ul class="route-page__others">
${others}
        </ul>
      </div>
    </section>
  </main>

  <div class="dock is-visible">${waUrl ? `\n    <a class="btn btn--outline" href="${waUrl}" target="_blank" rel="noopener">WhatsApp</a>` : ''}
    <a class="btn btn--line" href="${esc(SITE.lineUrl)}" target="_blank" rel="noopener">LINE</a>
    <a class="btn btn--accent" href="${esc(ask)}">Free quote</a>
  </div>

  <footer class="footer">
    <div class="wrap footer__inner">
      <div>
        <a class="logo logo--footer" href="/en/">
          <svg class="logo__mark" viewBox="0 0 32 32" aria-hidden="true"><path d="M2 26 12 8l5 8 3-4 10 14z" fill="currentColor"/></svg>
          <span class="logo__text"><b>${esc(SITE.brandEn)}</b><small>${esc(SITE.brand)} · Trailhead shuttle</small></span>
        </a>
        <p class="footer__about">${esc(enAbout)}</p>
      </div>
      <nav class="footer__nav" aria-label="Footer menu">
        <a href="/en/">Home</a>
        <a href="/en/#routes">Routes</a>
        <a href="/en/#pricing">Prices</a>
        <a href="/en/#book">Get a quote</a>
        <a href="/en/#faq">FAQ</a>${SITE.instagramUrl ? `\n        <a href="${esc(SITE.instagramUrl)}" target="_blank" rel="noopener">Instagram</a>` : ''}${SITE.facebookUrl ? `\n        <a href="${esc(SITE.facebookUrl)}" target="_blank" rel="noopener">Facebook</a>` : ''}
        <a href="${routeUrl(rt.key).replace(URL, '/')}" hreflang="zh-Hant-TW" lang="zh-Hant-TW">中文</a>
      </nav>
    </div>
  </footer>
</body>
</html>
`;
}
const enRouteHtml = Object.fromEntries(ROUTES.map((rt) => [rt.key, enRoutePage(rt)]));

// 英文頁標題裡括號內的中文也要用標題字型
const enHeading = [enHtml, ...Object.values(enRouteHtml)]
  .flatMap((page) => [...page.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>|<p class="route-page__sub">([\s\S]*?)<\/p>/g)].map((m) => (m[1] ?? m[2]).replace(/<[^>]+>/g, '')))
  .join('');
const enGlyphs = [...new Set(enHeading + SITE.brand + ascii)].filter((ch) => ch === ' ' || ch.trim()).sort().join('');
const enFontUrl = 'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@900&display=swap&text=' + encodeURIComponent(enGlyphs);
const enFontTags = [
  '  <link rel="preconnect" href="https://fonts.googleapis.com">',
  '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  `  <link rel="preload" as="style" href="${esc(enFontUrl)}" onload="this.onload=null;this.rel='stylesheet'">`,
  `  <noscript><link rel="stylesheet" href="${esc(enFontUrl)}"></noscript>`,
].join('\n');
enHtml = region(enHtml, 'font', enFontTags);
write('en/index.html', versioned(enHtml));
// 英文路線頁整個資料夾重新產生，拿掉的路線不會留下舊頁面
rmSync(join(root, 'en/routes'), { recursive: true, force: true });
for (const [key, page] of Object.entries(enRouteHtml)) {
  mkdirSync(join(root, 'en/routes', key), { recursive: true });
  write(`en/routes/${key}/index.html`, versioned(region(page, 'font', enFontTags)));
}


// ---- sitemap.xml ----
// lastmod 只在頁面內容真的改變時才更新：scripts/lastmod.json 記錄每頁的內容指紋與日期。
// 每次發布都填今天的話，搜尋引擎會學到「這個日期不可信」而忽略它。
// 指紋不含 css/js 版本號與字型網址（那些改了不代表這頁的內容變了）。
const today = new Date().toISOString().slice(0, 10);
const LASTMOD_FILE = 'scripts/lastmod.json';
const lastmodPrev = existsSync(join(root, LASTMOD_FILE)) ? JSON.parse(read(LASTMOD_FILE)) : {};
const fingerprint = (page) =>
  createHash('sha1')
    .update(page.replace(/<!-- build:font -->[\s\S]*?<!-- \/build:font -->/g, '').replace(/\?v=[0-9a-f]+/g, ''))
    .digest('hex')
    .slice(0, 12);
const sitemapPages = [
  [URL, html],
  [URL + 'card.html', cardHtml],
  [EN_URL, enHtml],
  ...routePages.map((x) => [routeUrl(x.rt.key), routeHtml[x.rt.key]]),
  ...ROUTES.map((rt) => [enRouteUrl(rt.key), enRouteHtml[rt.key]]),
];
const lastmod = {};
for (const [loc, page] of sitemapPages) {
  const hash = fingerprint(page);
  lastmod[loc] = lastmodPrev[loc]?.hash === hash ? lastmodPrev[loc] : { hash, date: today };
}
write(LASTMOD_FILE, JSON.stringify(lastmod, null, 2) + '\n');
// 中英文互為翻譯的頁面，在 sitemap 也標出 hreflang（和頁面 <head> 一致）
const pairs = { [URL]: EN_URL, ...Object.fromEntries(ROUTES.map((rt) => [routeUrl(rt.key), enRouteUrl(rt.key)])) };
const zhOf = Object.fromEntries(Object.entries(pairs).map(([zh, en]) => [en, zh]));
const alternates = (loc) => {
  const zh = pairs[loc] ? loc : zhOf[loc];
  if (!zh) return '';
  return `\n    <xhtml:link rel="alternate" hreflang="zh-Hant-TW" href="${zh}"/>\n    <xhtml:link rel="alternate" hreflang="en" href="${pairs[zh]}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${zh}"/>\n  `;
};
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapPages.map(([loc]) => `  <url><loc>${loc}</loc><lastmod>${lastmod[loc].date}</lastmod>${alternates(loc)}</url>`).join('\n')}
</urlset>
`,
);

// ---- llms.txt（給 AI 助理讀的摘要）----
const priceRows = priced
  .map((r) => `| ${r.name} | ${['taipei', 'taichung'].flatMap((o) => ['five', 'nine'].map((c) => (r[o][c] ? r[o][c].map((v) => (v ? money(v) : '—')).join(' / ') : '—'))).join(' | ')} |`)
  .join('\n');
write(
  'llms.txt',
  `# ${SITE.brand}（gohike.tw）

> ${about}

## 服務內容

- 登山接駁包車：從台北車站、台中高鐵站或指定地址出發，專車直達登山口；下山時在登山口接回市區。
- 行程：當日來回、兩天、三天以上都可以預約。
- 車型：五人座（最多 4 位乘客）、九人座（Volkswagen Caravelle 或同級，最多 8 位乘客）。
- 計價：整車計價，不是按人頭。單程是一趟車；來回是去程、回程各一趟；一天來回是當天送上山、等下山再載回。
- 入園入山申請、山屋、保險與裝備由乘客自行準備；詢價時可提供入山證、山屋的申請資訊。
- 付款：訂金可用匯款、LINE Pay，海外旅客可用 PayPal；尾款以新台幣現金或匯款支付。
- 取消：出發三日前可全額退費取消或改期；遇封山或官方管制，可於出發前一日取消。
- 詢價請用 LINE、WhatsApp（${SITE.whatsapp}）、Email 或網站表單（司機行車中不便接聽電話）。

## 價格（新台幣，整車，單程 / 來回 / 一天來回，— 表示沒有這種走法或請詢價）

| 路線 | 台北出發 五人座 | 台北出發 九人座 | 台中出發 五人座 | 台中出發 九人座 |
| --- | --- | --- | --- | --- |
${priceRows}

A 進 B 出的縱走、表上沒有的登山口或走法請直接詢價。

## 預約與聯絡

- LINE ID：${SITE.lineId}（${SITE.lineUrl}）
- 信箱：${SITE.email}
- WhatsApp：${SITE.whatsapp}${SITE.instagramUrl ? `\n- Instagram：${SITE.instagramUrl}` : ''}${SITE.facebookUrl ? `\n- Facebook 粉絲專頁：${SITE.facebookUrl}` : ''}

## In English

${SITE.brandEn} (${SITE.brand}, gohike.tw) is a private hiking shuttle (trailhead transfer) in Taiwan, from Taipei and Taichung to mountain trailheads including ${priced.slice(0, 8).map(enName).join(', ')}. Priced per vehicle, not per person: 5-seat car (up to 4 passengers) or 9-seat van (up to 8 passengers), one way from ${nt(lowest)}. Overseas hikers can pay the deposit by PayPal. Book by WhatsApp (${SITE.whatsapp}), LINE (ID ${SITE.lineId}) or email (${SITE.email}). English page: ${EN_URL}

English route pages (trailhead, drive time, prices, FAQ):
${ROUTES.map((rt) => `- [${ROUTES_EN[rt.key].name} hiking shuttle: ${ROUTES_EN[rt.key].sub}](${enRouteUrl(rt.key)})`).join('\n')}

## 頁面

- [首頁：路線、價格、詢價表單、常見問題](${URL})
- [English: hiking shuttle routes, prices and booking](${EN_URL})
- [電子名片：一鍵存到手機通訊錄](${URL}card.html)
- [完整版給 AI 的資料：每條路線的介紹、價格與常見問題（中英文）](${URL}llms-full.txt)
${routePages.map((x) => `- [${x.rt.name}登山接駁：${x.rt.sub}，接送地點、價格與常見問題](${routeUrl(x.rt.key)})`).join('\n')}
`,
);

// ---- llms-full.txt：llms.txt 的完整版，把每條路線的介紹、價格、問答和首頁常見問題都放進一個純文字檔，AI 一次讀完 ----
const zhPriceLines = (r) =>
  isPriced(r)
    ? Object.keys(ORIGINS).flatMap((o) => Object.keys(CARS).filter((c) => r[o][c]).map((c) => `${ORIGINS[o]}・${CARS[c]}：` + TRIPS.map((t, i) => (r[o][c][i] ? `${t} ${money(r[o][c][i])}` : '')).filter(Boolean).join('、')))
    : ['依行程報價，歡迎詢價'];
const enPriceLines = (r) =>
  isPriced(r)
    ? Object.keys(ORIGINS).flatMap((o) => Object.keys(CARS).filter((c) => r[o][c]).map((c) => `${EN_ORIGINS[o]}, ${EN_CARS[c]}: ` + EN_TRIPS.map((t, i) => (r[o][c][i] ? `${t.toLowerCase()} ${nt(r[o][c][i])}` : '')).filter(Boolean).join(', ')))
    : ['Quoted per trip; ask us for a price'];
const qa = (list) => list.map((f) => `**${f.q}**\n${f.a}`).join('\n\n');
const zhRouteFull = ({ rt, route }) =>
  [
    `### ${rt.name}登山接駁：${rt.sub}`,
    `網址：${routeUrl(rt.key)}`,
    [['登山口／接送點', rt.trailhead], ['台北車程', rt.drive], ['海拔', rt.alt], ['行程類型', rt.dayTags?.join('、')]].filter((f) => f[1]).map(([k, v]) => `- ${k}：${v}`).join('\n'),
    [['景觀', rt.scenery], ['適合客群', rt.audience], ['交通與注意事項', rt.transport]].filter((f) => f[1]).map(([k, v]) => `${k}：${v}`).join('\n'),
    '價格（整車，新台幣）：\n' + zhPriceLines(route).map((l) => `- ${l}`).join('\n'),
    rt.faq?.length ? qa(rt.faq) : '',
  ].filter(Boolean).join('\n\n');
const enRouteFull = (rt) => {
  const en = ROUTES_EN[rt.key];
  if (!en) return '';
  const route = PRICES.find((r) => r.key === rt.key);
  return [
    `### ${en.name} hiking shuttle: ${en.sub}`,
    `URL: ${enRouteUrl(rt.key)}`,
    [['Trailhead / drop-off', en.trailhead], ['Drive from Taipei', rt.drive && en.drive], ['Altitude', rt.alt], ['Trip length', (en.dayTags || rt.dayTags.map((d) => DAY_EN[d] || d)).join(', ')]].filter((f) => f[1]).map(([k, v]) => `- ${k}: ${v}`).join('\n'),
    [['Scenery', en.scenery], ['Good for', en.audience], ['Getting there', en.transport]].filter((f) => f[1]).map(([k, v]) => `${k}: ${v}`).join('\n'),
    'Prices (per vehicle, NT$):\n' + enPriceLines(route).map((l) => `- ${l}`).join('\n'),
    en.faq?.length ? qa(en.faq) : '',
  ].filter(Boolean).join('\n\n');
};
const llms = read('llms.txt');
write(
  'llms-full.txt',
  `# ${SITE.brand} ${SITE.brandEn}（gohike.tw）完整資料 / full reference

> ${about}
>
> ${enAbout}

本檔由網站資料自動產生，內容和網站頁面一致。摘要版：${URL}llms.txt
This file is generated from the same data as the website. Short version: ${URL}llms.txt

${llms.slice(llms.indexOf('## 服務內容'), llms.indexOf('## In English')).trim()}

## 常見問題

${qa(homeFaq)}

## 各路線介紹

${routePages.map(zhRouteFull).join('\n\n')}

## In English

### Questions

${qa(enHomeFaq)}

## Routes in English

${ROUTES.map(enRouteFull).filter(Boolean).join('\n\n')}
`,
);

console.log(`已更新：en/index.html、${ROUTES.length} 個英文路線頁、index.html（起價 NT$${lowestText}、${priced.length} 條有價格的路線）、${routePages.length} 個路線頁、sitemap.xml、llms.txt、llms-full.txt`);
