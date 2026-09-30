// 把 js/config.js、js/prices.js 的資料寫成靜態內容，讓搜尋引擎與 AI 不必執行 JavaScript 也讀得到。
// 產出：index.html 裡 <!-- build:xxx --> 標記之間的區塊、sitemap.xml、llms.txt。
// 用法：node scripts/build.mjs（發布流程會自動執行；改完價格或聯絡資料想在本機預覽時也可以手動跑）。
import { readFileSync, writeFileSync } from 'node:fs';
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

// ---- 標題字型：只向 Google Fonts 要頁面上實際用到的字，檔案才會小 ----
let cardHtml = read('card.html');
const headingText = [html, cardHtml]
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
write('index.html', html);
write('card.html', cardHtml);

// ---- sitemap.xml ----
const today = new Date().toISOString().slice(0, 10);
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${URL}</loc><lastmod>${today}</lastmod></url>
  <url><loc>${URL}card.html</loc><lastmod>${today}</lastmod></url>
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
`,
);

console.log(`已更新：index.html（起價 NT$${lowestText}、${priced.length} 條有價格的路線）、sitemap.xml、llms.txt`);
