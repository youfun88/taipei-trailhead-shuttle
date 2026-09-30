// 各路線價格（整車，新台幣）—— 改這裡就好，發布時會自動更新路線卡片、收費表和價格問答。
// five = 五人座（最多 4 位乘客）、nine = 九人座（最多 8 位乘客）。
// 每組三個數字是 [單程, 來回, 一天來回]：
//   來回 = 去程、回程各一趟（兩天以上的行程）；一天來回 = 當天送上山、等下山再載回。
// 沒有的價格填 null；整個車型都沒有就直接填 null。
window.PRICES = [
  { key: 'yushan',   name: '玉山（塔塔加）', taipei: { five: [6500, 12000, null], nine: [8000, 15000, null] },   taichung: { five: [6000, 11000, null], nine: [7500, 14000, null] } },
  { key: 'xueshan',  name: '雪山・武陵四秀', taipei: { five: [5500, 11000, 9000], nine: [7000, 14000, 12000] }, taichung: { five: [6500, 13000, 12000], nine: [7500, 15000, 13000] } },
  { key: 'hehuan',   name: '合歡山群峰',     taipei: { five: [6000, 12000, null], nine: [7000, 14000, null] },   taichung: { five: [5000, 10000, null], nine: [6000, 12000, null] } },
  { key: 'dabajian', name: '大霸尖山',       taipei: { five: [6000, 12000, null], nine: [7000, 14000, null] },   taichung: { five: [6000, 12000, null], nine: [7000, 14000, null] } },
  { key: 'nanhu',    name: '南湖大山',       taipei: { five: [5500, 11000, null], nine: [7000, 14000, null] },   taichung: { five: [6500, 13000, null], nine: [7500, 15000, null] } },
  { key: 'qilai',    name: '奇萊南華',       taipei: { five: [6000, 12000, null], nine: [7000, 14000, null] },   taichung: { five: [5000, 10000, null], nine: [6000, 12000, null] } },
  { key: 'jiaming',  name: '嘉明湖',         taipei: { five: [8000, 16000, null], nine: [10000, 20000, null] },  taichung: { five: [8000, 16000, null], nine: [10000, 20000, null] } },
  { key: 'songluo',  name: '松蘿湖',         taipei: { five: [5000, 10000, null], nine: [6000, 12000, null] },   taichung: { five: [6000, 12000, null], nine: [7000, 14000, null] } },
  { key: 'luoma',    name: '羅馬縱走',       taipei: { five: [5500, 11000, 9000], nine: [7000, 14000, 12000] }, taichung: { five: [6000, 12000, 10000], nine: [7000, 14000, 12000] } },
  { key: 'gaodao',   name: '高島縱走',       taipei: { five: [null, null, 6500], nine: [null, null, 8000] },     taichung: { five: [null, null, 6500], nine: [null, null, 8000] } },
  { key: 'taman',    name: '塔曼山',         taipei: { five: [null, null, 6500], nine: [null, null, 8000] },     taichung: { five: [null, null, 7500], nine: [null, null, 8000] } },
  { key: 'beidelaman', name: '北得拉曼',     taipei: { five: [null, null, 6500], nine: [null, null, 8000] },     taichung: { five: [null, null, 7000], nine: [null, null, 9000] } },
  { key: 'junda',    name: '郡大山',         taipei: { five: null, nine: [null, 18000, 16000] },                 taichung: { five: null, nine: [null, 15000, 13000] } },
  { key: 'jiali',    name: '加里山',         taipei: { five: null, nine: null },                                 taichung: { five: null, nine: null } },
];
