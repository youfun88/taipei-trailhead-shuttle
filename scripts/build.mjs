// 把 js/config.js、js/prices.js 的資料寫成靜態內容，讓搜尋引擎與 AI 不必執行 JavaScript 也讀得到。
// 產出：index.html 裡 <!-- build:xxx --> 標記之間的區塊、sitemap.xml、llms.txt。
// 用法：node scripts/build.mjs（發布流程會自動執行；改完價格或聯絡資料想在本機預覽時也可以手動跑）。
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
const SITE = sandbox.window.SITE;
const PRICES = sandbox.window.PRICES;

const URL = 'https://gohike.tw/';
const ORIGINS = { taipei: '台北出發', taichung: '台中出發' };
const CARS = { five: '五人座', nine: '九人座' };
const SEATS = { five: 4, nine: 8 };
const TRIPS = ['單程', '來回', '一天來回'];
const money = (n) => '$' + Number(n).toLocaleString('en-US');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const intlPhone = SITE.phone.replace(/\D/g, '').replace(/^0/, '+886');

const priced = PRICES.filter((r) => Object.keys(ORIGINS).some((o) => Object.keys(CARS).some((c) => r[o][c])));
const allOneWay = priced.flatMap((r) => Object.keys(ORIGINS).flatMap((o) => Object.keys(CARS).map((c) => r[o][c]?.[0]))).filter(Boolean);
const allPrices = priced.flatMap((r) => Object.keys(ORIGINS).flatMap((o) => Object.keys(CARS).flatMap((c) => r[o][c] || []))).filter(Boolean);
const lowest = Math.min(...allOneWay);
const lowestText = lowest.toLocaleString('en-US');
const routeNames = [...new Set(priced.map((r) => r.name.replace(/（.*?）/, '')))].join('、');

const description =
  `${SITE.brand}提供台北、台中出發的登山接駁包車，專車直達${priced.slice(0, 5).map((r) => r.name.replace(/（.*?）/, '')).join('、')}等高山登山口，下山再接你回家。` +
  `五人座、九人座整車計價，單程 NT$${lowestText} 起，各路線價格公開。預約電話 ${SITE.phone}。`;

// ---- 產生各區塊 ----
function cardPrice(route) {
  return Object.keys(ORIGINS)
    .map((o) => {
      const cells = Object.keys(CARS)
        .filter((c) => route[o][c]?.[0])
        .map((c) => `<b>${CARS[c]} ${money(route[o][c][0])}</b>`);
      return `<div><span>${ORIGINS[o]}</span>${cells.length ? cells.join('') : '<b>歡迎詢價</b>'}</div>`;
    })
    .join('');
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
const priceFaq = priced.map((r) => ({ q: `${r.name}登山接駁多少錢？`, a: priceAnswer(r) }));

function priceFaqHtml() {
  return priceFaq
    .map(
      (f) =>
        `          <details>\n            <summary>${esc(f.q)}</summary>\n            <p>${esc(f.a)}</p>\n          </details>`,
    )
    .join('\n');
}

const about =
  `${SITE.brand}是台北、台中出發的登山接駁包車服務，接送${routeNames}等登山口，` +
  `提供五人座（最多 4 位乘客）與九人座（最多 8 位乘客）兩種車型，整車計價。` +
  `聯絡人${SITE.owner}，預約電話 ${SITE.phone}，LINE ID ${SITE.lineId}，信箱 ${SITE.email}。`;

function jsonLd(html) {
  // 常見問題直接從頁面上的問答抓，避免兩邊內容不一致
  const faqBlock = html.slice(html.indexOf('<div class="faq">'), html.indexOf('<!-- build:price-faq -->'));
  const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const faq = [...faqBlock.matchAll(/<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/g)].map((m) => ({ q: strip(m[1]), a: strip(m[2]) }));

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
    { '@type': 'WebSite', '@id': URL + '#website', url: URL, name: SITE.brand, inLanguage: 'zh-Hant-TW', publisher: { '@id': URL + '#business' } },
    {
      '@type': 'LocalBusiness',
      '@id': URL + '#business',
      name: SITE.brand,
      alternateName: 'gohike.tw',
      description,
      url: URL,
      image: URL + 'images/hero-sm.jpg',
      telephone: intlPhone,
      email: SITE.email,
      priceRange: `NT$${Math.min(...allPrices).toLocaleString('en-US')}–NT$${Math.max(...allPrices).toLocaleString('en-US')}`,
      currenciesAccepted: 'TWD',
      address: { '@type': 'PostalAddress', addressCountry: 'TW' },
      areaServed: ['台北市', '新北市', '台中市'].map((name) => ({ '@type': 'City', name })),
      knowsLanguage: 'zh-Hant-TW',
      contactPoint: { '@type': 'ContactPoint', name: SITE.owner, telephone: intlPhone, email: SITE.email, contactType: 'reservations', availableLanguage: 'zh-Hant-TW' },
      sameAs: [SITE.lineUrl].filter(Boolean),
      hasOfferCatalog: { '@type': 'OfferCatalog', name: '登山接駁路線與價格', itemListElement: offers },
    },
    {
      '@type': 'FAQPage',
      '@id': URL + '#faq',
      mainEntity: [...faq, ...priceFaq].map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];
  return `  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`;
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
html = html.replace(/(<div class="route__price" data-price-key="([^"]+)">)[\s\S]*?(<\/div>\n)/g, (m, a, key, c) => {
  const route = PRICES.find((r) => r.key === key);
  if (!route) throw new Error(`prices.js 沒有路線 ${key}`);
  return a + cardPrice(route) + c;
});
html = region(html, 'price-table', priceTable());
html = region(html, 'price-faq', priceFaqHtml());
html = region(html, 'about', `        <p class="footer__about">${esc(about)}</p>`);
html = region(html, 'jsonld', jsonLd(html));

// ---- 路線頁 routes/<key>/：每條有價格、也有路線卡片的路線一頁，讓「玉山 登山接駁」這類搜尋有專屬頁面 ----
// 內容全部取自首頁的路線卡片（登山口、車程、海拔、照片）、prices.js 和首頁的常見問題，不另外寫新的事實。
const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const noParen = (s) => s.replace(/（.*?）/g, '');
const credits = [...html.matchAll(/<li>([^<—]+?)\s*—\s*([\s\S]*?)<\/li>/g)].map((m) => ({ label: m[1].trim(), html: m[2].trim() }));
const homeFaq = [...html.slice(html.indexOf('<div class="faq">'), html.indexOf('<!-- build:price-faq -->')).matchAll(/<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/g)]
  .map((m) => ({ q: strip(m[1]), a: strip(m[2]) }));
const SHARED_FAQ = ['是什麼車？最多可以坐幾個人？', '可以到我家接嗎？', '兩天、三天的行程，下山怎麼接？', '入園、入山證和山屋要自己申請嗎？', '天氣不好要取消怎麼辦？'];
const sharedFaq = SHARED_FAQ.map((q) => {
  const f = homeFaq.find((x) => x.q === q);
  if (!f) throw new Error(`首頁常見問題找不到「${q}」，路線頁需要它`);
  return f;
});

const cards = [...html.matchAll(/<article class="route[^"]*" id="route-([\w-]+)"[^>]*>([\s\S]*?)<\/article>/g)].map(([, key, b]) => {
  const img = b.match(/<img src="([^"]+)" alt="([^"]*)"[^>]*width="(\d+)" height="(\d+)"/);
  const title = strip(b.match(/<h3>([\s\S]*?)<\/h3>/)[1]);
  const facts = Object.fromEntries([...b.matchAll(/<dt>(.*?)<\/dt><dd>(.*?)<\/dd>/g)].map((m) => [m[1], m[2]]));
  const credit = credits.find((c) => img[2].includes(c.label) || title.includes(c.label));
  if (!credit) throw new Error(`路線 ${key} 的照片在頁尾找不到授權資料`);
  return {
    key,
    title,
    tags: [...b.matchAll(/<p class="route__tags">([\s\S]*?)<\/p>/g)].flatMap((m) => [...m[1].matchAll(/<span>(.*?)<\/span>/g)].map((s) => s[1])),
    alt: (b.match(/class="route__alt">(.*?)</) || [])[1],
    img: { src: img[1], alt: img[2], w: img[3], h: img[4] },
    trailhead: facts['登山口'],
    // 「塔塔加（南投信義）」→ 名稱「塔塔加登山口」、完整「塔塔加登山口（南投信義）」；本身已叫「…登山口」的不重複加
    trailheadName: noParen(facts['登山口']).replace(/(?<!登山口)$/, '登山口'),
    trailheadFull: noParen(facts['登山口']).replace(/(?<!登山口)$/, '登山口') + ((facts['登山口'].match(/（.*?）/) || [''])[0]),
    drive: facts['台北車程'],
    credit,
  };
});
const routePages = cards.map((card) => ({ card, route: priced.find((r) => r.key === card.key) })).filter((x) => x.route);
const routeUrl = (key) => `${URL}routes/${key}/`;

function fromPrice(r, o) {
  // 這個出發地最便宜的走法，例如「五人座單程 $6,500」
  const opts = Object.keys(CARS).flatMap((c) => (r[o][c] || []).map((p, i) => (p ? { c, i, p } : null)).filter(Boolean));
  if (!opts.length) return '';
  const best = opts.sort((a, b) => a.p - b.p)[0];
  return `${CARS[best.c]}${TRIPS[best.i]} ${money(best.p)}`;
}

function routePage({ card, route }) {
  const name = noParen(route.name);
  const trailhead = card.trailheadName;
  const url = routeUrl(route.key);
  const title = `${name}登山接駁｜台北、台中出發到${trailhead}｜${SITE.brand}`;
  const desc =
    `${name}登山接駁包車，專車送到${trailhead}、下山再接你回市區。` +
    Object.keys(ORIGINS).map((o) => (fromPrice(route, o) ? `${ORIGINS[o]}${fromPrice(route, o)}起` : '')).filter(Boolean).join('，') +
    `，整車計價。預約電話 ${SITE.phone}。`;
  const faq = [{ q: `${route.name}登山接駁多少錢？`, a: priceAnswer(route) }, ...sharedFaq];
  const tel = 'tel:' + SITE.phone.replace(/[^\d+]/g, '');

  const rows = Object.keys(ORIGINS).flatMap((o) =>
    Object.keys(CARS).map((c) => {
      const p = route[o][c];
      const cells = TRIPS.map((_, i) => `<td>${p?.[i] ? money(p[i]) : '—'}</td>`).join('');
      return `            <tr><th scope="row">${ORIGINS[o]}・${CARS[c]}<small>最多 ${SEATS[c]} 位乘客</small></th>${cells}</tr>`;
    }),
  );

  const others = routePages
    .filter((x) => x.route.key !== route.key)
    .map((x) => `          <li><a href="/routes/${x.route.key}/"><b>${esc(noParen(x.route.name))}</b><span>${esc(fromPrice(x.route, 'taipei') || fromPrice(x.route, 'taichung'))} 起</span></a></li>`)
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
        name: `${route.name}登山接駁`,
        serviceType: '登山接駁包車',
        description: desc,
        url,
        image: URL + card.img.src,
        provider: { '@id': URL + '#business' },
        areaServed: ['台北市', '新北市', '台中市'].map((n) => ({ '@type': 'City', name: n })),
        offers,
      },
      { '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    ],
  };

  return `<!doctype html>
<html lang="zh-Hant-TW">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="theme-color" content="#14231c">
  <link rel="canonical" href="${url}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="zh_TW">
  <meta property="og:site_name" content="${esc(SITE.brand)}">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="${URL}${card.img.src}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
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
        <a href="/#pricing">收費</a>
        <a href="/#faq">常見問題</a>
        <a class="nav__tel" href="${tel}">${esc(SITE.phone)}</a>
      </nav>
      <a class="btn btn--line btn--sm" href="${esc(SITE.lineUrl)}" target="_blank" rel="noopener">LINE 詢價</a>
    </div>
  </header>

  <main id="main">
    <section class="section route-page">
      <div class="wrap">
        <p class="crumbs"><a href="/">${esc(SITE.brand)}</a> / <a href="/#routes">熱門路線</a> / ${esc(name)}</p>
        <div class="route-page__grid">
          <div>
            <p class="eyebrow">${esc(card.title)}</p>
            <h1>${esc(name)}登山接駁</h1>
            <p class="section__lead">台北、台中出發，專車送到${esc(card.trailheadFull)}，下山再接你回市區。五人座、九人座整車計價，價格公開。</p>
            <dl class="route-page__facts">
              <div><dt>登山口</dt><dd>${esc(card.trailhead)}</dd></div>${card.drive ? `\n              <div><dt>台北車程</dt><dd>${esc(card.drive)}</dd></div>` : ''}${card.alt ? `\n              <div><dt>海拔</dt><dd>${esc(card.alt)}</dd></div>` : ''}${card.tags.length ? `\n              <div><dt>常見行程</dt><dd>${esc(card.tags.join('、'))}</dd></div>` : ''}
            </dl>
            <div class="route-page__cta">
              <a class="btn btn--line" href="${esc(SITE.lineUrl)}" target="_blank" rel="noopener">LINE 詢價</a>
              <a class="btn btn--outline" href="${tel}">電話 ${esc(SITE.phone)}</a>
            </div>
          </div>
          <figure class="route-page__photo">
            <img src="/${card.img.src}" alt="${esc(card.img.alt)}" width="${card.img.w}" height="${card.img.h}" fetchpriority="high">
            <figcaption>照片：${card.credit.html}</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section class="section section--tint section--tight">
      <div class="wrap">
        <h2>${esc(name)}接駁價格</h2>
        <p class="section__lead">整台車的價格，不是按人頭。來回是去程、回程各一趟；一天來回是當天送上山、等下山再載回。</p>
        <div class="price">
          <table class="price__table route-page__table">
            <thead><tr><th scope="col">出發地・車型</th>${TRIPS.map((t) => `<th scope="col">${t}</th>`).join('')}</tr></thead>
            <tbody>
${rows.join('\n')}
            </tbody>
          </table>
        </div>
        <p class="route-page__note">「—」表示沒有這種走法，可以直接詢價。預約時請告訴我日期、人數和上車地點，也可以用<a href="/#book">線上詢價表單</a>。</p>
      </div>
    </section>

    <section class="section section--tight">
      <div class="wrap wrap--narrow">
        <h2>常見問題</h2>
        <div class="faq">
${faq.map((f) => `          <details>\n            <summary>${esc(f.q)}</summary>\n            <p>${esc(f.a)}</p>\n          </details>`).join('\n')}
        </div>
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
        <a href="/#faq">常見問題</a>
      </nav>
    </div>
  </footer>
</body>
</html>
`;
}
const routeHtml = Object.fromEntries(routePages.map((x) => [x.route.key, routePage(x)]));

// ---- 標題字型：只向 Google Fonts 要頁面上實際用到的字，檔案才會小 ----
let cardHtml = read('card.html');
const headingText = [html, cardHtml, ...Object.values(routeHtml)]
  .flatMap((page) => [...page.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/g)].map((m) => m[1].replace(/<[^>]+>/g, '')))
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

// ---- sitemap.xml ----
const today = new Date().toISOString().slice(0, 10);
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${URL}</loc><lastmod>${today}</lastmod></url>
  <url><loc>${URL}card.html</loc><lastmod>${today}</lastmod></url>
${routePages.map((x) => `  <url><loc>${routeUrl(x.route.key)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
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

- 登山接駁包車：從台北車站、板橋車站、台中或指定地址出發，專車直達登山口；下山時在登山口接回市區。
- 行程：當日來回、兩天、三天以上都可以預約。
- 車型：五人座（最多 4 位乘客）、九人座（Volkswagen Caravelle 或同級，最多 8 位乘客）。
- 計價：整車計價，不是按人頭。單程是一趟車；來回是去程、回程各一趟；一天來回是當天送上山、等下山再載回。
- 入園入山申請、山屋、保險與裝備由乘客自行準備。

## 價格（新台幣，整車，單程 / 來回 / 一天來回，— 表示沒有這種走法或請詢價）

| 路線 | 台北出發 五人座 | 台北出發 九人座 | 台中出發 五人座 | 台中出發 九人座 |
| --- | --- | --- | --- | --- |
${priceRows}

A 進 B 出的縱走、表上沒有的登山口或走法請直接詢價。

## 預約與聯絡

- 聯絡人：${SITE.owner}
- 電話：${SITE.phone}
- LINE ID：${SITE.lineId}（${SITE.lineUrl}）
- 信箱：${SITE.email}

## 頁面

- [首頁：路線、價格、詢價表單、常見問題](${URL})
- [電子名片：一鍵存到手機通訊錄](${URL}card.html)
${routePages.map((x) => `- [${noParen(x.route.name)}登山接駁：${x.card.trailheadFull}，價格與常見問題](${routeUrl(x.route.key)})`).join('\n')}
`,
);

console.log(`已更新：index.html（起價 NT$${lowestText}、${priced.length} 條有價格的路線）、${routePages.length} 個路線頁、sitemap.xml、llms.txt`);
