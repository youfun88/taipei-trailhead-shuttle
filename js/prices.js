// 各路線價格（整車，新台幣）—— 改這裡，路線卡片和收費表會一起更新。
// five = 五人座（最多 4 位乘客）、nine = 九人座（最多 8 位乘客）。
// 每組兩個數字是 [單程, 來回]；來回 = 去程、回程各一趟。填 null 會顯示「詢價」。
window.PRICES = [
  { key: 'yushan',   name: '玉山（塔塔加）', taipei: { five: [6500, 12000], nine: [8000, 15000] },  taichung: { five: [6000, 11000], nine: [7500, 14000] } },
  { key: 'xueshan',  name: '雪山・武陵四秀', taipei: { five: [5500, 11000], nine: [7000, 14000] },  taichung: { five: [6500, 13000], nine: [7500, 15000] } },
  { key: 'hehuan',   name: '合歡山群峰',     taipei: { five: [6000, 12000], nine: [7000, 14000] },  taichung: { five: [5000, 10000], nine: [6000, 12000] } },
  { key: 'dabajian', name: '大霸尖山',       taipei: { five: [6000, 12000], nine: [7000, 14000] },  taichung: { five: [6000, 12000], nine: [7000, 14000] } },
  { key: 'nanhu',    name: '南湖大山',       taipei: { five: [5500, 11000], nine: [7000, 14000] },  taichung: { five: [6500, 13000], nine: [7500, 15000] } },
  { key: 'qilai',    name: '奇萊南華',       taipei: { five: [6000, 12000], nine: [7000, 14000] },  taichung: { five: [5000, 10000], nine: [6000, 12000] } },
  { key: 'jiaming',  name: '嘉明湖',         taipei: { five: [8000, 16000], nine: [10000, 20000] }, taichung: { five: [8000, 16000], nine: [10000, 20000] } },
  { key: 'songluo',  name: '松蘿湖',         taipei: { five: [5000, 10000], nine: [6000, 12000] },  taichung: { five: [6000, 12000], nine: [7000, 14000] } },
  { key: 'jiali',    name: '加里山',         taipei: { five: null, nine: null },                    taichung: { five: null, nine: null } },
];
