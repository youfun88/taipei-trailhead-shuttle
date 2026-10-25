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

// 英文路線頁 en/routes/<key>/ 的完整說明（對應 routes.js 的 scenery、audience、transport、labels、faq）
const ROUTE_PAGES_EN = {
  yushan: {
    scenery: "At 3,952 m, Yushan is Taiwan's highest peak. From the main summit you look out over the Central Range and the peaks around it.",
    audience: "Hikers with mid-to-high altitude experience who want to climb Taiwan's highest peak. A good fit for overseas groups taking on the Baiyue (百岳).",
    transport: 'About 4.5 to 5 hours from Taipei. Drop-off and pick-up are within the part of Tataka (塔塔加) open to vehicles. The road from Tataka to the Yushan trailhead is controlled and uses a local shuttle.',
    labels: ["Taiwan's highest peak", 'Multi-day hike', 'Park permit required'],
    faq: [{ q: 'Can you drive us right to the Yushan trailhead?', a: 'We drop off and pick up within the part of Tataka (塔塔加) open to vehicles. The road from Tataka to the Yushan trailhead is controlled, so you take the local shuttle or walk. Please check the latest rules before you go.' }],
  },
  xueshan: {
    scenery: 'The Xueshan glacial cirque, the Black Forest and high ridges. The Wuling Four Peaks (武陵四秀) add different summits and views.',
    audience: 'Hikers with high-mountain experience planning two days or more, who want to see alpine landforms and forest.',
    transport: 'We mainly drop off and pick up in the hiking area of Wuling Farm (武陵農場). At some times of year there are entry and vehicle controls, so we confirm the meeting point you can actually reach in advance.',
    labels: ['Glacial cirque', 'Multi-day hike', 'Wuling Farm drop-off'],
    faq: [{ q: 'Can the car drive to the Xueshan trailhead?', a: 'We mainly drop off and pick up in the hiking area of Wuling Farm (武陵農場). At some times of year the farm has entry and vehicle controls, so we confirm the exact meeting point with you before the trip.' }],
  },
  hehuan: {
    scenery: 'Hehuanshan is known for open alpine grassland, ridges and a sea of clouds, with mountain views in different directions depending on your route.',
    audience: 'Overseas visitors on their first Taiwan high-mountain hike, groups of friends, and hikers who want a route that fits their level.',
    transport: 'We can meet you at Wuling Pass (武嶺), Kunyang (昆陽), Xiaofengkou (小風口) or other points, to fit your plan. The high road is often affected by thick fog, cold and road closures.',
    labels: ['Easy high-mountain start', 'Day trip or multi-day', 'Popular with overseas visitors'],
    faq: [{ q: 'What happens if there is thick fog or a road closure at Hehuanshan?', a: 'The high road at Hehuanshan often gets thick fog and cold, and may close in winter. We check road conditions before the trip. If the road is closed, we talk with you about another meeting point or a new date.' }],
  },
  dabajian: {
    scenery: "Dabajian's barrel-shaped summit and the Holy Ridge (聖稜線) are among Taiwan's best-known mountain views.",
    audience: 'Hikers with multi-day and long-distance experience who want an advanced high-mountain route.',
    transport: 'We use the legal drop-off points at Guanwu (觀霧) and on Dalulin Road (大鹿林道). The hike may include a long walk on the forest road, so plan the shuttle and walking time ahead.',
    labels: ['Iconic rock peak', 'Multi-day hike', 'Long-distance hike'],
    faq: [{ q: 'Can the car drive into Dalulin Road?', a: 'We use the legal drop-off points at Guanwu (觀霧) and on Dalulin Road (大鹿林道). The hike may include a long walk on the forest road, so include that walking time when you set your pick-up time.' }],
  },
  nanhu: {
    scenery: "The Nanhu cirque, glacial landforms and huge mountain views make this one of Taiwan's classic long high-mountain routes.",
    audience: 'Fit hikers with solid high-mountain experience planning three days or more.',
    transport: 'We mainly drop off and pick up around Shengguang trailhead (勝光). Plan around the timing and weather of a multi-day hike, and check the latest controls and openings.',
    labels: ['Glacial cirque', 'Advanced hike', '3+ days'],
    faq: [{ q: 'How do we arrange the return for a multi-day hike like Nanhu?', a: 'Agree your expected finish date and time before you start, and we wait for you around Shengguang trailhead (勝光). Multi-day trips depend on the weather, so if your finish time changes, message us as soon as you have signal.' }],
  },
  qilai: {
    scenery: 'Around Qilai South Peak and Nanhua Mountain (南華山) you get wide alpine grass slopes, ridges and a sea of clouds.',
    audience: 'Hikers with good fitness who want to move up from longer hikes to the Baiyue (百岳).',
    transport: 'We mainly drop off and pick up at the reachable points around Tunyuan (屯原). Check whether the Nenggao Trail (能高越嶺) area and its road are open. Plan two days or more.',
    labels: ['Alpine grassland', 'Baiyue hike', 'Check road conditions'],
    faq: [{ q: 'Do we need to check the road to Tunyuan trailhead first?', a: 'Yes. The Nenggao Trail (能高越嶺) area and its road sometimes close because of conditions. We check how far we can reach around Tunyuan (屯原) before the trip.' }],
  },
  jiaming: {
    scenery: 'Jiaming Lake is known for its alpine lake, with forest, grass slopes and high ridges on the way.',
    audience: 'Hiking groups who love alpine scenery and can handle several long days of walking.',
    transport: 'The trailhead is at Xiangyang (向陽) in Taitung, about 7 to 8 hours from Taipei. If you are flying in, leave enough time for the drive and rest.',
    labels: ['Alpine lake', 'Multi-day hike', 'Long-distance shuttle'],
    faq: [{ q: 'How long is the drive from Taipei to the Jiaming Lake trailhead?', a: 'Xiangyang trailhead (向陽) is in Taitung, about 7 to 8 hours from Taipei. If you have just arrived in Taiwan, rest a night before you go, or make the drive part of day one.' }],
  },
  songluo: {
    scenery: 'A lake ringed by forest, with mirror reflections. In rain and mist it has a moody forest-lake feel.',
    audience: 'Visitors who enjoy forest, lakes and camping, and have hiked muddy trails before.',
    transport: 'In Datong, Yilan (宜蘭大同), about 2 hours from Taipei. Check the last stretch of road and the weather; the trail gets muddy when wet.',
    labels: ['Forest lake', 'Day trip or 2 days'],
    faq: [{ q: 'Can we still go to Songluo Lake when it rains?', a: 'The last stretch of road and the trail both depend on the weather, and the trail gets muddy when wet. We check the road to the trailhead before the trip. In bad weather we suggest a new date.' }],
  },
  jiali: {
    scenery: 'Cedar forest, rocky trail sections and a summit view, typical of a mid-elevation forest hike.',
    audience: 'Hikers who enjoy forest walks and have good fitness and basic scrambling skills.',
    transport: 'We mainly drop off and pick up at the trailhead around Luchang (鹿場), Nanzhuang, Miaoli. The mountain road is narrow, so confirm the pick-up point and return time in advance.',
    labels: ['Forest hike', 'Day route'],
    faq: [{ q: 'What should we confirm before a Jiali Mountain shuttle?', a: "The mountain road around Luchang (鹿場) is narrow. Confirm the pick-up point and your expected finish time with us in advance, so you don't wait long for the ride back." }],
  },
  luoma: {
    scenery: 'Forest, ridges and nature around Luoyewei Mountain (羅葉尾山) and Mawuzuoyejun Mountain (馬武佐野郡山).',
    audience: 'Hikers with mid-elevation traverse experience who want a full day of long-distance hiking.',
    transport: 'First confirm your direction, start and end point. Different entry and exit points can change the vehicle plan and the price.',
    labels: ['1-day traverse', 'Different drop-off and pick-up'],
    faq: [{ q: 'The traverse starts and ends in different places. How does the shuttle work?', a: "We drop you at the start and pick you up at the end, so you don't need to go back for a car. Tell us your direction when you ask for a quote; different entry and exit points affect the vehicle plan and the price." }],
  },
  gaodao: {
    scenery: 'Cedar forest, ridges and a rolling trail from Gaotai Mountain (高台山) to the Daotian Mountain (島田山) range.',
    audience: 'Experienced hikers who want a longer forest traverse.',
    transport: 'Confirm the exact entry and exit points at Gaotai Mountain and the other end, and set your pick-up time in advance.',
    labels: ['Forest traverse', 'Day shuttle'],
    faq: [{ q: 'Where do we get on and off for the Gaodao traverse?', a: 'We confirm the actual entry and exit points at the Gaotai Mountain (高台山) end and the Daotian Mountain (島田山) end based on your route, and agree the pick-up time and place with you before the trip.' }],
  },
  taman: {
    scenery: 'Old-growth forest, moss, tree roots across the trail and damp forest life.',
    audience: 'Hikers who enjoy forest photography and nature watching, and are fine on slippery trails.',
    transport: 'Usually in and out via trailheads in the Lalashan (拉拉山) area. We confirm how far the car can reach and the local road conditions in advance.',
    labels: ['Moss forest', 'Day hike'],
    faq: [{ q: 'Can the car reach the Taman Mountain trailhead?', a: 'Taman Mountain is usually hiked from trailheads in the Lalashan (拉拉山) area. Before the trip we confirm how far the car can reach and the local road conditions.' }],
  },
  beidelaman: {
    scenery: 'Giant trees, forest life and a mid-elevation trail, a standout hike in the Hsinchu mountains.',
    audience: 'Hikers with basic trail experience who love giant-tree forest and want more of a challenge.',
    transport: 'Confirm the mountain road and the exact trailhead before the trip, and leave enough time for the descent and the drive back.',
    labels: ['Giant-tree forest', 'Mid-elevation'],
    faq: [{ q: 'How much time should we leave for the return from Beidelaman?', a: 'The Hsinchu mountain roads are winding, and there is still a long drive to the city after the hike. When you set the return time, leave enough time for the descent and the drive. We suggest a start time based on your plan.' }],
  },
  junda: {
    scenery: 'Junda Mountain is known for high ridges, bamboo grass slopes and mountain views.',
    audience: 'Hikers with mid-to-high altitude experience who want a one-day Baiyue (百岳).',
    transport: 'Junda Forest Road (郡大林道) may have limits on road conditions, traffic control, vehicle type and how far vehicles can go. We only list 9-seat prices for now. Your quote says which vehicle carries you, how far it can reach, and whether separate forest-road transport is needed. A regular vehicle may not reach the trailhead.',
    labels: ['1-day Baiyue', 'Check forest road conditions'],
    faq: [{ q: 'Can the car drive right to the Junda Mountain trailhead?', a: 'Not always. Junda Forest Road (郡大林道) has road, traffic and vehicle limits, and how far we can reach depends on conditions at the time. Your quote says which vehicle carries you, where it can reach, and whether separate forest-road transport is needed.' }],
  },
  'xiakaluo-ab': {
    scenery: 'A historic trail, mountain forest, river valleys and seasonal colors. Some sections are known for autumn maples.',
    audience: 'Groups who enjoy old trails and forest hiking, and have done longer walks before.',
    transport: "The big plus of an end-to-end hike is that you don't go back to your start for a car. We arrange different start and end points; the exact meeting points and coverage are listed in your quote.",
    labels: ['Historic trail', 'Different entry and exit', 'Traverse shuttle'],
    faq: [{ q: 'How does the one-way (A in, B out) shuttle work?', a: "We drop you at one end of the old trail. After you walk the whole way, the car waits at the other end, so you don't walk back to a car. The exact meeting points and coverage are listed in your quote." }],
  },
  'xiakaluo-yanglao': {
    scenery: 'Forest and a historic trail, like the full traverse, but you choose how far to walk before turning back.',
    audience: 'Hikers who want to see the old trail without doing the full end-to-end walk.',
    transport: 'For Yanglao in-and-out you get on and off at the same meeting area, unlike an end-to-end traverse. We confirm how far we can reach at the Yanglao (養老) end based on the road at the time.',
    labels: ['Historic trail', 'Out and back', 'Day shuttle'],
    faq: [{ q: 'What is the difference between Yanglao in-and-out and the one-way (A in, B out) route?', a: 'Yanglao in-and-out starts and ends at the same place: you walk in and come back the same way. One-way goes in at one end and out at the other, so it needs two pick-up points.' }],
  },
};
for (const key of Object.keys(ROUTE_PAGES_EN)) Object.assign(window.ROUTES_EN[key], ROUTE_PAGES_EN[key]);

// 登山須知的官方連結，英文頁顯示的名稱（網址和 routes.js 的 links 一樣）
window.LINKS_EN = {
  'https://www.ysnp.gov.tw/': 'Yushan National Park',
  'https://www.spnp.gov.tw/': 'Shei-Pa National Park',
  'https://www.taroko.gov.tw/': 'Taroko National Park',
  'https://recreation.forest.gov.tw/': 'Taiwan Forest Recreation (台灣山林悠遊網)',
  'https://hike.taiwan.gov.tw/': 'Taiwan hiking permits portal (park and mountain entry)',
};
