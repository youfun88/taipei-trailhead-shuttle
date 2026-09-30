// 各路線價格（九人座整車，新台幣）—— 改這裡，路線卡片和收費表會一起更新。
// oneWay = 單程一趟；round = 來回（去程、回程各一趟）。填 null 會顯示「詢價」。
window.PRICES = [
  { key: 'yushan',   name: '玉山（塔塔加）',     taipei: { oneWay: 8000,  round: 15000 }, taichung: { oneWay: 7500,  round: 14000 } },
  { key: 'xueshan',  name: '雪山・武陵四秀',     taipei: { oneWay: 7000,  round: 14000 }, taichung: { oneWay: 7500,  round: 15000 } },
  { key: 'hehuan',   name: '合歡山群峰',         taipei: { oneWay: 7000,  round: 14000 }, taichung: { oneWay: 6000,  round: 12000 } },
  { key: 'dabajian', name: '大霸尖山',           taipei: { oneWay: 7000,  round: 14000 }, taichung: { oneWay: 7000,  round: 14000 } },
  { key: 'nanhu',    name: '南湖大山',           taipei: { oneWay: 7000,  round: 14000 }, taichung: { oneWay: 7500,  round: 15000 } },
  { key: 'qilai',    name: '奇萊南華',           taipei: { oneWay: 7000,  round: 14000 }, taichung: { oneWay: 6000,  round: 12000 } },
  { key: 'jiaming',  name: '嘉明湖',             taipei: { oneWay: 10000, round: 20000 }, taichung: { oneWay: 10000, round: 20000 } },
  { key: 'songluo',  name: '松蘿湖',             taipei: { oneWay: 6000,  round: 12000 }, taichung: { oneWay: 7000,  round: 14000 } },
  { key: 'jiali',    name: '加里山',             taipei: { oneWay: null,  round: null },  taichung: { oneWay: null,  round: null } },
];
