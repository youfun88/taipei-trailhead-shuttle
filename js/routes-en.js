// 英文版頁面 en/ 用的路線名稱與介紹 —— 只有英文頁會用到，價格一樣來自 prices.js。
// key 要和 routes.js、prices.js 的 key 一樣；沒寫在這裡的路線，英文頁會用中文名稱。
//   name  英文名稱（括號保留中文，方便客人拿給司機或在地圖上搜尋）
//   sub   一句話介紹      trailhead  接送地點
window.ROUTES_EN = {
  yushan: { name: 'Yushan / Jade Mountain (玉山)', sub: "Taiwan's highest peak, 3,952 m", trailhead: 'Tataka (塔塔加), Xinyi, Nantou' },
  xueshan: { name: 'Xueshan / Snow Mountain & Wuling Four Peaks (雪山・武陵四秀)', sub: 'Glacial cirques and the Black Forest, 3,886 m', trailhead: 'Wuling Farm (武陵農場), Heping, Taichung' },
  hehuan: { name: 'Hehuanshan peaks (合歡山)', sub: 'Alpine grassland, sea of clouds, easy 3,000 m summits', trailhead: 'Wuling Pass, Kunyang or Xiaofengkou (武嶺・昆陽・小風口), Nantou' },
  dabajian: { name: 'Dabajian (大霸尖山)', sub: "Taiwan's most recognizable barrel-shaped peak", trailhead: 'Guanwu / Dalulin Road (觀霧・大鹿林道), Hsinchu' },
  nanhu: { name: 'Nanhu Mountain (南湖大山)', sub: 'Remote cirques in the Central Range, 3,742 m', trailhead: 'Shengguang (勝光), Heping, Taichung' },
  qilai: { name: 'Qilai South Peak & Nanhua (奇萊南華)', sub: 'Open grassy ridges, 3,358 m', trailhead: 'Tunyuan (屯原), Ren-ai, Nantou' },
  jiaming: { name: 'Jiaming Lake (嘉明湖)', sub: 'The "Angel\'s Tears" alpine lake', trailhead: 'Xiangyang (向陽), Haiduan, Taitung' },
  songluo: { name: 'Songluo Lake (松蘿湖)', sub: 'A misty forest lake in Yilan', trailhead: 'Songluo Lake trailhead, Datong, Yilan' },
  jiali: { name: 'Jiali Mountain (加里山)', sub: "Miaoli's classic mid-elevation hike", trailhead: 'Luchang (鹿場), Nanzhuang, Miaoli' },
  luoma: { name: 'Luoma traverse (羅馬縱走)', sub: 'Forest and ridge traverse, drop-off and pick-up at different ends', trailhead: 'Start and end set by your direction' },
  gaodao: { name: 'Gaodao traverse (高島縱走)', sub: 'Cedar forest and mid-elevation ridges', trailhead: 'Gaotai Mountain trailheads (高台山)' },
  taman: { name: 'Taman Mountain (塔曼山)', sub: 'High forest walk near Lalashan', trailhead: 'Lalashan area (拉拉山), Fuxing, Taoyuan' },
  beidelaman: { name: 'Beidelaman (北得拉曼)', sub: 'Giant trees and a steep forest trail', trailhead: 'Jianshi mountains (尖石), Hsinchu' },
  junda: { name: 'Junda Mountain (郡大山)', sub: 'A one-day Baiyue peak with Central Range views', trailhead: 'Junda Forest Road (郡大林道), Xinyi, Nantou' },
  'xiakaluo-ab': { name: 'Xiakaluo Old Trail, one-way (霞喀羅古道 A 進 B 出)', sub: 'Historic trail, in at one end and out at the other', trailhead: 'Yanglao and Shilu (養老・石鹿), Hsinchu' },
  'xiakaluo-yanglao': { name: 'Xiakaluo Old Trail, out and back (霞喀羅古道 養老進出)', sub: 'Historic forest trail', trailhead: 'Yanglao (養老), Jianshi, Hsinchu' },
};
