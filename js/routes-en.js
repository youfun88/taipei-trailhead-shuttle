// 英文頁 en/ 用的路線文字 —— 只有英文頁會用到，價格一樣來自 prices.js、照片與天數篩選來自 routes.js。
// key 要和 routes.js、prices.js 的 key 一樣；沒寫在這裡的路線，英文頁會用中文。
//   name      英文名稱（括號保留中文，方便客人拿給司機或在地圖上搜尋）
//   sub       一句話介紹           trailhead  接送地點         drive  台北出發車程（routes.js 沒寫就不填）
//   dayTags   卡片上的天數標籤      imgAlt     照片說明
//   dest      英文頁詢價表單「Where to?」的選項文字（要和 en/index.html 的 <option> 一字不差）
//   card      卡片上的三個重點：scenery 景色、audience 適合對象、transport 交通
window.ROUTES_EN = {
  yushan: {
    name: 'Yushan / Jade Mountain (玉山)', sub: "Taiwan's highest peak, 3,952 m",
    trailhead: 'Tataka (塔塔加), Xinyi, Nantou', drive: 'About 4.5–5 hours', dayTags: ['2 days'],
    imgAlt: 'Yushan main peak', dest: 'Yushan (Tataka trailhead 塔塔加)',
    card: { scenery: "Taiwan's highest summit, with wide ridges and peaks all around", audience: 'Hikers with high-mountain experience; overseas groups climbing the Baiyue (百岳)', transport: 'Drop-off at Tataka; the last stretch to the trailhead is controlled and uses local shuttles' },
  },
  xueshan: {
    name: 'Xueshan / Snow Mountain & Wuling Four Peaks (雪山・武陵四秀)', sub: 'Glacial cirques and the Black Forest, 3,886 m',
    trailhead: 'Wuling Farm (武陵農場), Heping, Taichung', drive: 'About 3.5 hours', dayTags: ['2 days', '3 days'],
    imgAlt: 'Snow on the Xueshan glacial cirque', dest: 'Xueshan / Wuling Four Peaks (Wuling Farm 武陵農場)',
    card: { scenery: 'The Xueshan cirque, the Black Forest and high ridges', audience: 'Experienced hikers planning two days or more', transport: 'Drop-off at Wuling Farm; vehicle access is restricted at some times of year' },
  },
  hehuan: {
    name: 'Hehuanshan peaks (合歡山)', sub: 'Alpine grassland, sea of clouds, easy 3,000 m summits',
    trailhead: 'Wuling Pass, Kunyang or Xiaofengkou (武嶺・昆陽・小風口), Nantou', drive: 'About 4 hours', dayTags: ['Day trip', '2 days'],
    imgAlt: 'Trail through alpine bamboo grass on Hehuanshan', dest: 'Hehuanshan peaks (合歡山)',
    card: { scenery: 'Open alpine grassland, ridges and a sea of clouds', audience: 'First-timers on a Taiwan high mountain; groups of friends', transport: 'Meet at Wuling Pass, Kunyang, Xiaofengkou or other points' },
  },
  dabajian: {
    name: 'Dabajian (大霸尖山)', sub: "Taiwan's most recognizable barrel-shaped peak",
    trailhead: 'Guanwu / Dalulin Road (觀霧・大鹿林道), Hsinchu', drive: 'About 3.5 hours', dayTags: ['3 days'],
    imgAlt: 'The barrel-shaped summit of Dabajian', dest: 'Dabajian (Guanwu 觀霧)',
    card: { scenery: 'The barrel-shaped peak and the Holy Ridge (聖稜線)', audience: 'Hikers with multi-day and long-distance experience', transport: 'Drop-off at Guanwu / Dalulin Road; includes a long forest road walk' },
  },
  nanhu: {
    name: 'Nanhu Mountain (南湖大山)', sub: 'Remote cirques in the Central Range, 3,742 m',
    trailhead: 'Shengguang (勝光), Heping, Taichung', drive: 'About 3 hours', dayTags: ['3+ days'],
    imgAlt: 'Nanhu Mountain', dest: 'Nanhu Mountain (Shengguang trailhead 勝光)',
    card: { scenery: 'The Nanhu cirque, glacial landforms and big mountains', audience: 'Fit, experienced hikers planning three days or more', transport: 'Drop-off at Shengguang trailhead; timed to your multi-day plan' },
  },
  qilai: {
    name: 'Qilai South Peak & Nanhua (奇萊南華)', sub: 'Open grassy ridges, 3,358 m',
    trailhead: 'Tunyuan (屯原), Ren-ai, Nantou', drive: 'About 4.5 hours', dayTags: ['2 days'],
    imgAlt: 'Grassy ridge of Qilai South Peak', dest: 'Qilai South Peak & Nanhua (Tunyuan trailhead 屯原)',
    card: { scenery: 'Wide alpine grass slopes, ridges and a sea of clouds', audience: 'Hikers moving up from longer hikes to the Baiyue (百岳)', transport: 'Drop-off at Tunyuan; check that the Nenggao road (能高越嶺) is open' },
  },
  jiaming: {
    name: 'Jiaming Lake (嘉明湖)', sub: 'A blue lake high in the mountains',
    trailhead: 'Xiangyang (向陽), Haiduan, Taitung', drive: 'About 7–8 hours', dayTags: ['3 days'],
    imgAlt: 'Blue water and grassland at Jiaming Lake', dest: 'Jiaming Lake (Xiangyang trailhead 向陽)',
    card: { scenery: 'An alpine lake, with forest, grass slopes and ridges on the way', audience: 'Groups who can handle several long days of walking', transport: 'Drop-off at Xiangyang trailhead; about 7–8 hours from Taipei' },
  },
  songluo: {
    name: 'Songluo Lake (松蘿湖)', sub: 'A misty lake deep in the forest',
    trailhead: 'Songluo Lake trailhead, Datong, Yilan', drive: 'About 2 hours', dayTags: ['Day trip', '2 days'],
    imgAlt: 'Reflections and campsite at Songluo Lake', dest: 'Songluo Lake (松蘿湖)',
    card: { scenery: 'A forest-ringed lake with mirror reflections', audience: 'Hikers who like forest lakes and can handle muddy trails', transport: 'Datong, Yilan; about 2 hours from Taipei' },
  },
  jiali: {
    name: 'Jiali Mountain (加里山)', sub: "Miaoli's classic mid-elevation hike",
    trailhead: 'Luchang (鹿場), Nanzhuang, Miaoli', drive: 'About 2.5 hours', dayTags: ['Day trip'],
    imgAlt: 'Jiali Mountain seen from below', dest: 'Jiali Mountain (Luchang trailhead 鹿場)',
    card: { scenery: 'Cedar forest, rocky trail and a summit view', audience: 'Forest hikers with basic scrambling skills', transport: 'Drop-off at Luchang, Nanzhuang; narrow mountain roads' },
  },
  luoma: {
    name: 'Luoma traverse (羅馬縱走)', sub: 'A forest and ridge traverse',
    trailhead: 'Start and end set by your direction', dayTags: ['1-day traverse'], dest: 'Luoma traverse (羅馬縱走)',
    card: { scenery: 'Forest and ridges of Luoyewei and Mawuzuoyejun mountains', audience: 'Hikers with mid-elevation traverse experience', transport: 'Drop-off and pick-up at different ends; your direction affects the price' },
  },
  gaodao: {
    name: 'Gaodao traverse (高島縱走)', sub: 'Cedar forest and mid-elevation ridges',
    trailhead: 'Gaotai Mountain trailheads (高台山)', dayTags: ['Day trip'], dest: 'Gaodao traverse (高島縱走)',
    card: { scenery: 'Cedar forest and ridges from Gaotai to Daotian mountain', audience: 'Hikers ready for a longer forest traverse', transport: 'We confirm the exact entry and exit, and agree your finish time in advance' },
  },
  taman: {
    name: 'Taman Mountain (塔曼山)', sub: 'A high forest walk in northern Taiwan',
    trailhead: 'Lalashan area (拉拉山), Fuxing, Taoyuan', dayTags: ['Day trip'], dest: 'Taman Mountain (塔曼山)',
    card: { scenery: 'Old forest, moss and tangled tree roots', audience: 'Forest photographers and nature lovers', transport: 'In and out via Lalashan; we confirm how far the car can go' },
  },
  beidelaman: {
    name: 'Beidelaman (北得拉曼)', sub: 'Giant trees and a forest trail challenge',
    trailhead: 'Jianshi mountains (尖石), Hsinchu', dayTags: ['Day trip'], dest: 'Beidelaman (北得拉曼)',
    card: { scenery: 'Giant trees, forest life and a mid-elevation trail', audience: 'Hikers with basic trail experience who love big trees', transport: 'We confirm the trailhead before you go; allow time for the return' },
  },
  junda: {
    name: 'Junda Mountain (郡大山)', sub: 'Central Range ridge views',
    trailhead: 'Junda Forest Road (郡大林道), Xinyi, Nantou', dayTags: ['1-day Baiyue'], dest: 'Junda Mountain (郡大山)',
    card: { scenery: 'High ridges, bamboo grass slopes and mountain views', audience: 'Hikers with mid-to-high altitude experience aiming for a one-day Baiyue (百岳)', transport: 'Junda Forest Road has road and vehicle limits; please check with us first' },
  },
  'xiakaluo-ab': {
    name: 'Xiakaluo Old Trail, one-way (霞喀羅古道 A 進 B 出)', sub: 'A historic trail, end to end',
    trailhead: 'Yanglao and Shilu (養老・石鹿), Hsinchu', dayTags: ['Day trip'], dest: 'Xiakaluo Old Trail, one-way (霞喀羅古道 A 進 B 出)',
    card: { scenery: 'A historic trail and river valleys; maple colors in autumn on some sections', audience: 'Groups who enjoy old trails and long walks', transport: 'Dropped at one end, picked up at the other; no need to return to your car' },
  },
  'xiakaluo-yanglao': {
    name: 'Xiakaluo Old Trail, out and back (霞喀羅古道 養老進出)', sub: 'A walk on a historic forest trail',
    trailhead: 'Yanglao (養老), Jianshi, Hsinchu', dayTags: ['Day trip'], dest: 'Xiakaluo Old Trail, out and back (霞喀羅古道 養老進出)',
    card: { scenery: 'Forest and a historic path; turn back wherever you like', audience: 'Hikers who want a taste of the old trail without the full traverse', transport: 'In and out at the same end; we confirm how far the car can reach at Yanglao' },
  },
};
