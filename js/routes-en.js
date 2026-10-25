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
    imgAlt: 'Grassy ridge of Qilai South Peak', dest: 'Qilai South Peak & Nanhua (奇萊南華)',
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
    faq: [{ q: 'Do we need to check the road to the Qilai South Peak trailhead first?', a: 'Yes. The Nenggao Trail (能高越嶺) and the road to the trailhead sometimes close because of conditions. We check how far we can reach before the trip.' }],
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
    faq: [{ q: 'Where do we get on and off for the Gaodao traverse?', a: 'We confirm the actual trailhead based on your route, and agree the pick-up time and place with you before the trip.' }],
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
  'https://www.ysnp.gov.tw/Highway/C001300': 'Yushan National Park: road status',
  'https://www.wuling-farm.com.tw/tw/stay/traffic.php': 'Wuling Farm: getting there (Chinese)',
  'https://www.thb.gov.tw/': 'Highway Bureau (road closures and controls)',
  'https://hsinchu.forest.gov.tw/ForestRoad/10003290': 'Forestry Agency, Hsinchu: Dalu Forest Road East (Chinese)',
  'https://99online.forest.gov.tw/': 'Jiujiu Cabin (九九山莊) booking',
  'https://hike.taiwan.gov.tw/open.aspx': 'Taiwan hiking permits portal: route open status',
  'https://www.forest.gov.tw/news/0077654': 'Forestry Agency: Nenggao Trail now starts at Yuntian Temple (Chinese)',
  'https://tconline.forest.gov.tw/room/': 'Tianchi Lodge (天池山莊) booking',
  'https://jmlnt.forest.gov.tw/room/': 'Jiaming Lake National Trail: cabin booking',
  'https://jmlnt.forest.gov.tw/one_day/': 'Jiaming Lake National Trail: single-day permit',
  'https://recreation.forest.gov.tw/Trail/RT?tr_id=043': 'Taiwan Forest Recreation: Jiali Mountain trail',
  'https://recreation.forest.gov.tw/Trail/RT?tr_id=034': 'Taiwan Forest Recreation: Taman Mountain trail',
  'https://recreation.forest.gov.tw/Trail/RT?tr_id=035': 'Taiwan Forest Recreation: Beidelaman giant tree trail',
  'https://nantou.forest.gov.tw/ForestRoad/10003316': 'Forestry Agency, Nantou: Junda Forest Road status (Chinese)',
  'https://recreation.forest.gov.tw/Trail/RT?tr_id=026': 'Taiwan Forest Recreation: Xiakaluo National Trail',
  'https://hsinchu.forest.gov.tw/0000133': 'Forestry Agency, Hsinchu: Xiakaluo National Trail notices (Chinese)',
};

// 英文路線頁的「trailhead access and permits」區塊和常見問題（對應 routes.js 的 ROUTE_GUIDE，guide、faq 項目數要一樣）
const ROUTE_GUIDE_EN = {
  yushan: {
    guide: [
      { k: 'Drop-off point', v: 'Regular vehicles can reach Tataka Visitor Center (塔塔加遊客中心, where Highway 18 meets Highway 21) and the Shangdongpu (上東埔) parking area. Past the Tataka checkpoint the road is controlled. Private cars cannot drive to the Yushan trailhead, and cars that do can be fined.' },
      { k: 'After drop-off', v: 'From the Paiyun Hiking Service Center (排雲登山服務中心) at Shangdongpu to the Yushan trailhead is about 2.5 km of paved road, a 40 to 50 minute walk. Or take the paid shuttle: the park lists NT$150 per person per ride, 06:30 to 17:00, booked by phone at 0989-104-222 or 049-2702213. From the trailhead to Paiyun Lodge (排雲山莊) is 8.5 km.' },
      { k: 'Check-in', v: 'Check in with ID at the Paiyun Hiking Service Center before you hike. It is staffed 06:30 to 17:00. Before 06:30 you can check in yourself by scanning a code.' },
      { k: 'Road rules', v: 'Highway 21 (新中橫) from Caopingtou to Tataka (110K to 144K, the Shuili and Xinyi side) closes every night from 17:30 to 07:00. To reach Tataka before 7 am, you have to come via Highway 18 from Alishan.' },
      { k: 'Permits', v: 'Yushan National Park entry permits open 2 months before and close 5 days before your entry date. Paiyun Lodge beds and the single-day Yushan route both go to a lottery about 1 month before. The single-day route takes 60 people a day. After the park permit is approved, apply for the police mountain permit (入山證, free).' },
      { k: 'Snow season', v: 'In 2026 the snow season ran January 1 to March 31. Single-day applications were suspended. Teams needed snow experience, crampons, an ice axe and a helmet, with at most 6 people per team. Dates are announced by the park each year.' },
      { k: 'Public transport', v: 'Yuanlin Bus 6739 (員林客運, Sun Moon Lake to Alishan) passes Tataka. For the Paiyun Hiking Service Center, get off at Shangdongpu. There are only a few buses a day, mostly after 10 am. Check the bus company for times.' },
    ],
    faq: [
      { q: 'Where does the shuttle drop you for Yushan?', a: 'Regular vehicles can only go as far as Tataka Visitor Center and the Shangdongpu (上東埔) parking area. Private cars cannot pass the Tataka checkpoint. From the Paiyun Hiking Service Center at Shangdongpu to the Yushan trailhead is about 2.5 km. You can walk it in 40 to 50 minutes or take the paid local shuttle (the park lists NT$150 per person per ride).' },
      { q: 'Can I get to Tataka by public transport?', a: 'Yes. Yuanlin Bus 6739 (Sun Moon Lake to Alishan) passes Tataka; get off at Shangdongpu for the Paiyun Hiking Service Center. There are only a few buses a day, mostly after 10 am, which is too late for a dawn start on the single-day route.' },
      { q: 'How early do I need to leave Taipei for Yushan?', a: 'Taipei to Tataka is about 4.5 to 5 hours. Highway 21 from Caopingtou to Tataka is closed every night from 17:30 to 07:00, so an early-morning arrival has to use Highway 18 via Alishan. Single-day hikers usually start before dawn, so you either leave Taipei in the middle of the night or stay nearby the night before.' },
      { q: 'What permits do I need for Yushan?', a: 'You need a Yushan National Park entry permit and a police mountain permit (入山證, free, applied for after the park permit is approved). Paiyun Lodge beds and the single-day route both go to a lottery about 1 month before. Apply on the Taiwan hiking permits portal, from 2 months to 5 days before your entry date.' },
    ],
  },
  xueshan: {
    guide: [
      { k: 'Drop-off point', v: 'Everyone pays at the Wuling Farm (武陵農場) gate: NT$160 per adult and NT$50 per car, cash only, valid for 2 days. Normally cars can drive on to the Xueshan trailhead parking lot or the Wuling Lodge (武陵山莊) lot. The trailhead lot is small. Large buses must stay on Wuling Road and cannot reach the trailhead.' },
      { k: 'After drop-off', v: 'Xueshan trailhead to the East Peak and back is 10.2 km, doable in a day. The main peak usually takes 2 days, staying at Qika Cabin (七卡山莊) or 369 (三六九). For the Wuling Four Peaks, walk the Taoshan Waterfall trail from the Wuling Lodge lot about 3.7 km to the Chiyou Mountain (池有山) trailhead.' },
      { k: 'Cabins', v: 'The old 369 Cabin building was torn down in 2023 and the rebuild has been delayed. A temporary campsite is used for now. Check the latest Shei-Pa National Park notices before you go.' },
      { k: 'Cherry blossom season', v: 'Vehicles are controlled during the February cherry blossom season (in 2026, February 13 to March 1). Multi-day teams send a vehicle form to Shei-Pa at least 3 days before entry, and the gate checks plates and headcount. Single-day teams get no vehicle pass and must use public transport or a licensed tour.' },
      { k: 'Roads', v: 'From Taipei: Freeway 5, Yilan, Highway 7, Qilan, then Highway 7A (台7甲) to Wuling. Wuling Farm lists about 3.5 hours. In winter, Highway 7A from Nanshan to Shengguang (40K to 50K) often needs snow chains or closes as a precaution.' },
      { k: 'Permits', v: 'You need a Shei-Pa National Park entry permit and a police mountain permit. Park permits open 2 months before and close 5 days before entry, 07:00 to 23:00. Cabin beds are booked with the park permit.' },
      { k: 'Snow season', v: 'In recent years the snow season has run from early January to March 31, as announced by Shei-Pa each year. Every team member needs snow gear skills, with at most 6 people per team.' },
      { k: 'Public transport', v: 'Kuo-Kuang buses 1751 (from Yilan at 07:30 and 12:40) and 1764 (from Luodong at 07:00) take about 2 hours 40 minutes to Wuling. Get off at the gate to buy tickets first.' },
    ],
    faq: [
      { q: 'Can the car drive to the Xueshan trailhead?', a: 'Normally yes. After paying at the Wuling Farm gate, cars can drive to the Xueshan trailhead lot or the Wuling Lodge lot. Large buses cannot reach the trailhead. During the February cherry blossom season, multi-day teams must register their vehicle with Shei-Pa in advance, and single-day teams get no vehicle pass.' },
      { q: 'How early do I need to leave Taipei for Xueshan?', a: 'Taipei to Wuling Farm is about 3.5 hours (Freeway 5 via Yilan and Highway 7A). On the 2-day main peak trip you need to reach Qika Cabin or 369 on day one, so you usually start from the trailhead early in the morning. An East Peak day hike also needs an early start. In winter Highway 7A may need chains or close, so leave extra time.' },
      { q: 'Can I get to Wuling Farm by public transport?', a: 'Yes. Kuo-Kuang bus 1751 (from Yilan) or 1764 (from Luodong) takes about 2 hours 40 minutes, with only two or three buses a day. You get off at the gate to buy tickets, and there is still a stretch of road from the farm to the Xueshan trailhead.' },
      { q: 'What permits do I need for Xueshan?', a: 'You need a Shei-Pa National Park entry permit and a police mountain permit. Park permits open 2 months before and close 5 days before entry, and Qika and 369 beds are booked with the park permit. In snow season (about early January to late March) there are extra rules on snow skills and gear.' },
    ],
  },
  hehuan: {
    guide: [
      { k: 'Drop-off point', v: 'It depends on the peak. The Hehuan Main Peak trailhead is at about 29.5K on Highway 14A (台14甲) with no parking, so cars stop at Wuling Pass (武嶺, about 10 minutes on foot) or Kunyang (昆陽). East Peak and Shimen Mountain start near Songxue Lodge (松雪樓) and Hehuan Villa (合歡山莊). The North Peak trailhead is at about 36.7K; cars park at Xiaofengkou (小風口), about 600 m away.' },
      { k: 'Parking', v: 'The Wuling Pass, Kunyang and Hehuan Villa lots charge a fee (2024 rates: NT$50 an hour on weekdays, NT$60 on weekends, up to NT$300 a day for cars). Illegal parking at Wuling Pass is often ticketed.' },
      { k: 'Permits', v: 'Hehuan Main, East, North and West peaks and Shimen Mountain currently need no park or mountain permit. Since 2020 the area is outside the protected zone and Ren-ai Township is no longer a restricted mountain area. Camping in the Hehuan area needs separate approval from Taroko National Park.' },
      { k: 'Road rules', v: 'From October 24, 2026, on every holiday of 3 or more days, cars on Highway 14A between Cuifeng (翠峰) and Dayuling (大禹嶺) need at least 3 people from 00:00 to 08:00. Spring rhododendron season weekends have a similar rule.' },
      { k: 'Snow season', v: 'When there is snow or ice, buses, trucks over 3.5 tonnes and all motorcycles are banned, and some stretches are open only to cars with snow chains. On icy nights the road may close from 17:00 to 07:00 as a precaution. The 2026 snow season ran January 1 to March 1.' },
      { k: 'Lodging', v: 'Songxue Lodge is run by the Forestry and Nature Conservation Agency and booked through Taiwan Forest Recreation (台灣山林悠遊網).' },
    ],
    faq: [
      { q: 'Where does the car stop for Hehuan Main Peak?', a: 'The Hehuan Main Peak trailhead is at about 29.5K on Highway 14A, with no parking next to it. Cars usually stop at Wuling Pass (about 10 minutes on foot) or Kunyang. For North Peak, walk about 600 m from Xiaofengkou. East Peak and Shimen Mountain start near Songxue Lodge and Hehuan Villa.' },
      { q: 'Do I need a permit to hike Hehuanshan?', a: 'Not for Hehuan Main, East, North and West peaks or Shimen Mountain. Since 2020 the area is outside the protected zone and Ren-ai Township is no longer a restricted mountain area. Only camping needs separate approval from Taroko National Park.' },
      { q: 'Is there a carpool rule on Hehuanshan on long weekends?', a: 'Yes. From October 24, 2026, on every holiday of 3 or more days, cars between Cuifeng and Dayuling on Highway 14A need at least 3 people from 00:00 to 08:00. Spring rhododendron season weekends have a similar rule. Check the Highway Bureau before you go.' },
      { q: 'What should I know about Hehuanshan in winter?', a: 'When there is snow or ice, motorcycles, buses and trucks over 3.5 tonnes are banned, and some stretches are open only to cars with snow chains. The road may also close on icy nights. Check the Highway Bureau road status before you go and keep your plan flexible.' },
    ],
  },
  dabajian: {
    guide: [
      { k: 'Drop-off point', v: 'Guanwu (觀霧, Guanwu Forest Recreation Area). Dalu Forest Road East (大鹿林道東線) has a checkpoint and gate at 0.4K. Regular vehicles cannot enter; only approved work vehicles can.' },
      { k: 'After drop-off', v: 'From Guanwu, walk about 19 km on Dalu Forest Road East to the Madala River trailhead (馬達拉溪登山口), about 7 hours. Then climb about 4 km to Jiujiu Cabin (九九山莊).' },
      { k: 'Roads', v: 'Freeway 3 Zhulin exit, Zhudong, County Road 122, Qingquan, Tuchang, then follow signs to Guanwu. Guanwu and the forest road often close after typhoons and heavy rain.' },
      { k: 'Permits', v: 'You need a Shei-Pa National Park entry permit, from 2 months to 5 days before entry. Climbing the Dabajian summit itself is banned; hikes go to the base of the peak (霸基).' },
      { k: 'Cabin', v: 'Jiujiu Cabin is run by the Forestry Agency Hsinchu branch. It is under renovation from March 30, 2026 to the end of 2028, with only 70 beds a day during the work.' },
    ],
    faq: [
      { q: 'Can the car drive into Dalu Forest Road for Dabajian?', a: 'No. Dalu Forest Road East has a checkpoint at 0.4K and regular vehicles cannot enter. Cars stop at Guanwu. From there it is about 19 km on foot to the Madala River trailhead (about 7 hours), then about 4 km up to Jiujiu Cabin.' },
      { q: 'What permits do I need for Dabajian?', a: 'You need a Shei-Pa National Park entry permit (from 2 months to 5 days before entry). Jiujiu Cabin beds are booked separately through the Forestry Agency Hsinchu branch. The cabin is under renovation until the end of 2028, with only 70 beds a day. Climbing the Dabajian summit is banned.' },
      { q: 'How early do I need to leave Taipei for Dabajian?', a: 'Taipei to Guanwu is about 3.5 hours. Day one includes about 7 hours on the forest road before the climb to Jiujiu Cabin, so you usually start walking from Guanwu early in the morning.' },
    ],
  },
  nanhu: {
    guide: [
      { k: 'Drop-off point', v: 'Shengguang trailhead (勝光登山口) is on Highway 7A next to the Shengguang police post, beside cabbage fields. Cars park on the road shoulder. The land next to it is private farmland, so do not park on it. The old Siyuan Pass (思源埡口) trailhead on Forest Road 710 has many landslides, so most hikers now start at Shengguang.' },
      { k: 'After drop-off', v: 'Cabins on the way are Yunleng (雲稜山屋), Shenmazhen (審馬陣山屋) and Nanhu (南湖山屋). Multi-day hikers often start from the trailhead at 4 or 5 am.' },
      { k: 'Permits', v: 'Nanhu is in a Taroko National Park protected area, so you need a park entry permit and a police mountain permit. Park permits are first come, first served, with no lottery, from 2 months to 5 days before entry (3 pm cutoff). From July 2025 the Nanhu route takes 60 people a day. Cabin beds are booked with the park permit.' },
      { k: 'Roads', v: 'In winter, Highway 7A from Nanshan to Shengguang (40K to 50K) often needs snow chains or closes as a precaution.' },
      { k: 'Snow season', v: 'Taroko National Park usually announces the snow season after the first snow, around November or December. Nanhu holds snow for a long time; crampons, an ice axe and a helmet are advised. The Wuyan Peak (五岩峰) section is especially risky in snow.' },
      { k: 'Public transport', v: 'Kuo-Kuang buses 1751 (from Yilan) and 1764 (from Luodong) pass the Shengguang and Siyuan area on Highway 7A, with only two or three buses a day.' },
    ],
    faq: [
      { q: 'Where does the car drop you for Nanhu Mountain?', a: 'Most hikers now start at Shengguang trailhead, on Highway 7A next to the Shengguang police post. Cars park on the road shoulder; the land next to it is private farmland. The old Siyuan Pass trailhead on Forest Road 710 has many landslides and is used less.' },
      { q: 'What permits do I need for Nanhu Mountain?', a: 'You need a Taroko National Park entry permit (it is a protected area) and a police mountain permit. Park permits are first come, first served, from 2 months to 5 days before entry, with 60 people a day on the Nanhu route. Yunleng, Shenmazhen and Nanhu cabin beds are booked with the park permit.' },
      { q: 'How early do I need to leave Taipei for Nanhu?', a: 'Taipei to Shengguang is about 3 hours. Multi-day hikers often start from the trailhead at 4 or 5 am, so you would leave Taipei in the middle of the night, or stay nearby the night before. In winter Highway 7A may need chains or close, so leave extra time.' },
    ],
  },
  qilai: {
    trailhead: 'Yuntian Temple trailhead (雲天宮登山口), Ren-ai, Nantou',
    card: { transport: 'The trailhead moved to Yuntian Temple; the old Tunyuan section is closed' },
    transport: 'From 2026 the trail starts at Yuntian Temple (雲天宮). The old Tunyuan (屯原) section, 0 to 3K, is closed by landslides. The road to Yuntian Temple is rough, so check that the Nenggao Trail (能高越嶺) is open. Plan two days or more.',
    guide: [
      { k: 'Drop-off point', v: 'From January 1, 2026, the west Nenggao Trail starts at the Yuntian Temple trailhead (雲天宮登山口) and joins the old trail at about 3K. The Tunyuan section from 0 to 3K has been closed by landslides since April 2023. The Tunyuan service station has moved to Yuntian Temple, and every hiker must check in there.' },
      { k: 'Roads', v: 'The road to Yuntian Temple turns off Highway 14 at about 99K. It is bumpy and in poor shape; the Forestry Agency recommends a high-clearance vehicle or a shuttle. Park only in the designated lot, as large farm trucks use the road. Official drive times: Puli to Wushe 40 minutes, Wushe to Lushan 45 minutes, Lushan to the trailhead 30 minutes.' },
      { k: 'After drop-off', v: 'From the old Tunyuan start, Tianchi Lodge (天池山莊) was about 13 km. Starting from Yuntian Temple adds about 350 m of climbing and 1.5 to 2 hours. Tianchi Lodge currently has no meals and no gear rental.' },
      { k: 'Permits', v: 'Tianchi Lodge beds and tent sites open 60 days before and close 5 days before your stay, with a lottery 30 days before at 3 pm. Qilai South Peak is inside Taroko National Park and needs a park entry permit; Nanhua Mountain does not. No police mountain permit has been needed since 2020.' },
      { k: 'Weather', v: 'The trail and Tianchi Lodge close during typhoon warnings and heavy rain warnings.' },
    ],
    faq: [
      { q: 'Which trailhead is used for Qilai South Peak and Nanhua now?', a: 'From January 1, 2026, the trail starts at Yuntian Temple (雲天宮). The old Tunyuan section from 0 to 3K is closed by landslides, and the Tunyuan service station has moved to Yuntian Temple. The new start adds about 350 m of climbing and 1.5 to 2 hours.' },
      { q: 'Can a car reach the Yuntian Temple trailhead?', a: 'Official information says small cars can get there. But the road from Highway 14 at about 99K is bumpy and in poor shape, the Forestry Agency recommends a high-clearance vehicle or a shuttle, and you must park in the designated lot. Check the latest road conditions before you go.' },
      { q: 'What permits do I need for Qilai South Peak and Nanhua?', a: 'Book Tianchi Lodge beds or tent sites from 60 to 5 days before your stay; the lottery is 30 days before. Qilai South Peak is inside Taroko National Park and needs a park entry permit. Nanhua Mountain does not. No police mountain permit has been needed since 2020.' },
    ],
  },
  jiaming: {
    guide: [
      { k: 'Drop-off point', v: 'Xiangyang National Forest Recreation Area (向陽國家森林遊樂區), at 154.5K on Highway 20, the Southern Cross-Island Highway (南橫). The recreation area is closed for works and serves only as a way through to the trail. There is no parking inside.' },
      { k: 'After drop-off', v: 'From the Xiangyang hiking station (0K) it is 4.3 km to Xiangyang Cabin (向陽山屋), about 2 to 3 hours. Jiaming Lake Cabin (嘉明湖山屋) is at 8.4 km and the lake at 13 km.' },
      { k: 'Road rules', v: 'The western Southern Cross-Island Highway, from Meishankou (梅山口) to Xiangyang, is closed Tuesday to Thursday. On other days you can enter 07:00 to 14:00 and must be out by 17:00. Coming up from Chishang or Haiduan on the Taitung side does not use this section.' },
      { k: 'Permits', v: 'Xiangyang Cabin, Jiaming Lake Cabin and tent sites open 60 days before and close 5 days before your stay (foreigners 120 to 61 days before), with a lottery 30 days before. Beds are NT$400 on weekdays and NT$600 on weekends. You also need a police mountain permit. It is not in a national park, so no park permit is needed.' },
      { k: 'Single-day permit', v: 'Applied for separately. Start no earlier than 03:00, be off the mountain by 17:00, at most 10 people per group, and register at the Xiangyang hiking station going in and coming out.' },
    ],
    faq: [
      { q: 'Where does the car drop you for Jiaming Lake?', a: 'At Xiangyang National Forest Recreation Area, 154.5K on Highway 20. The recreation area is closed for works and only serves as a way through to the trail, with no parking inside. From the Xiangyang hiking station it is 4.3 km to Xiangyang Cabin and 13 km to the lake.' },
      { q: 'Is the Southern Cross-Island Highway open for Jiaming Lake?', a: 'The western section, from Meishankou in Kaohsiung to Xiangyang, is closed Tuesday to Thursday. On other days you can enter 07:00 to 14:00 and must be out by 17:00. Coming up from Chishang or Haiduan in Taitung does not use this section. Check the Highway Bureau before you go.' },
      { q: 'What permits do I need for Jiaming Lake?', a: 'You need a cabin or tent site booking (from 60 to 5 days before your stay, lottery 30 days before) and a police mountain permit. Jiaming Lake is not in a national park, so no park permit. Single-day hikes need a separate permit: at most 10 people, start no earlier than 03:00 and finish by 17:00.' },
    ],
  },
  songluo: {
    guide: [
      { k: 'Drop-off point', v: 'Songluo Lake trailhead is at the end of the Yulan tea farm road (玉蘭茶園產業道路) in Datong, Yilan, next to a big water tank. Turn off Highway 7 at about 100K onto Benjue Road (本覺路) and drive up through Yulan. Navigation apps sometimes send cars toward Xianuoying (夏諾營), where they get stuck. Parking at the trailhead fits only about 6 or 7 cars.' },
      { k: 'After drop-off', v: '5.4 km each way, out and back. About 7 hours round trip with a light pack. With a heavy pack, about 4 to 5 hours up and 3 to 4 hours down. The trail is very muddy, so rain boots are a good idea.' },
      { k: 'Permits', v: 'You need a police mountain permit (入山證). Apply online, or in person on the day at the Datong police post (大同分駐所) at about 102K on Highway 7.' },
      { k: 'Season', v: 'Open all year. The lake is usually fullest from October to April.' },
    ],
    faq: [
      { q: 'Where is the Songluo Lake trailhead, and can a car get there?', a: 'It is at the end of the Yulan tea farm road in Datong, Yilan, next to a big water tank. Turn off Highway 7 at about 100K onto Benjue Road. Navigation apps sometimes send cars toward Xianuoying, where they get stuck. The trailhead only has room for 6 or 7 cars.' },
      { q: 'Do I need a permit for Songluo Lake?', a: 'Yes, a police mountain permit (入山證). Apply online, or in person on the day at the Datong police post at about 102K on Highway 7.' },
      { q: 'How long is the hike to Songluo Lake?', a: '5.4 km each way, out and back. About 7 hours round trip with a light pack, or 4 to 5 hours up with a heavy pack. The trail is very muddy, so rain boots are a good idea.' },
    ],
  },
  jiali: {
    guide: [
      { k: 'Drop-off point', v: 'Luchang trailhead (鹿場登山口): County Road 124 to Nanzhuang, Miao 21, then Luchang village. The trailhead is behind Jiali Mountain B&B (加里山民宿). There is also the Dapin trailhead (大坪登山口) with a parking lot, for a loop. Tour buses cannot enter.' },
      { k: 'Parking', v: 'The Luchang lot is private. Hikers report NT$100 per car, and it fills early on weekends. The road before the trailhead is narrow and hard to pass on.' },
      { k: 'After drop-off', v: 'From Luchang, 6.8 km round trip, about 7 to 9 hours. The Dapin loop is 9.6 km, about 8 to 9 hours.' },
      { k: 'Permits', v: 'No mountain permit needed.' },
      { k: 'Season', v: 'Fog often rolls in by afternoon, so start early. Pleione orchids (一葉蘭) bloom in March and April.' },
    ],
    faq: [
      { q: 'Which trailhead do people use for Jiali Mountain?', a: 'Most use Luchang trailhead, in Luchang village, Nanzhuang, behind Jiali Mountain B&B: 6.8 km round trip, about 7 to 9 hours. You can also do a 9.6 km loop from the Dapin trailhead. Tour buses cannot enter.' },
      { q: 'Do I need a permit for Jiali Mountain?', a: 'No. Jiali Mountain needs no mountain permit.' },
    ],
  },
  luoma: {
    trailhead: 'Siyuan Pass and Mashi Bridge (思源埡口・馬鰣橋), Highway 7A',
    guide: [
      { k: 'Start', v: 'The old Siyuan police post (思源埡口舊派出所) at about 45.6K on Highway 7A, Datong, Yilan. Turn left at the Forest Road 720 gate and cross the Luoyewei River to the trailhead.' },
      { k: 'Finish', v: 'Mashi Bridge (馬鰣橋) at about 50.6K on Highway 7A, Heping, Taichung, near Shengguang. The two ends are about 5 km apart by road.' },
      { k: 'Route', v: 'The usual direction is Siyuan Pass, Luoyewei Mountain, the Luoma giant tree, Mawuzuoyejun Mountain, then Mashi Bridge. About 10 to 12 km, 8 to 9 hours.' },
      { k: 'Watch out', v: 'Both ends have river crossings, and water rises after rain. There is no water on the way. The firebreak on Mawuzuoyejun Mountain is a steep slope, dangerous when wet or icy. Roadside parking on Highway 7A is not allowed.' },
      { k: 'Public transport', v: 'Kuo-Kuang buses 1751 and 1764 reach Siyuan, but the last bus back leaves around 2:30 pm, too early for most day traversers.' },
      { k: 'Permits', v: 'Sources disagree on whether the Yilan side needs a police mountain permit. Apply before you go, or check with the police.' },
    ],
    faq: [
      { q: 'Where does the Luoma traverse start and finish?', a: 'Usually you start at the old Siyuan police post (about 45.6K on Highway 7A) and finish at Mashi Bridge (about 50.6K, near Shengguang). The two ends are about 5 km apart by road. The traverse is about 10 to 12 km and takes 8 to 9 hours.' },
      { q: 'Can I do the Luoma traverse by bus?', a: 'Kuo-Kuang buses 1751 and 1764 reach Siyuan, but the last bus back leaves around 2:30 pm. Most day traversers finish later than that, so you need other transport.' },
    ],
  },
  gaodao: {
    guide: [
      { k: 'Location', v: 'Around Nalo village (那羅部落), Jianshi, Hsinchu. Take County Road 60 over Shishan Bridge (柿山大橋) and follow the signs for Gaotai Mountain Campground (高台山露營區).' },
      { k: 'Trailheads', v: 'Trailhead 1 has roadside room for about 10 or more cars. The road is narrow and low cars may scrape. Trailhead 2 sits on a steep bend with almost no parking. Trailhead 3 is inside a private campground and closed to hikers.' },
      { k: 'Route', v: 'Most hikers go in and out from the same trailhead (out and back, or a P-shaped loop), about 9 to 10 km and 6 to 8 hours. There is no water on the route, so carry 2 to 3 liters.' },
      { k: 'Permits', v: 'Hiking sites (健行筆記, Hikingbook) say no mountain permit is needed.' },
      { k: 'Weather', v: 'Fog often rolls in by afternoon, so start early.' },
    ],
    faq: [
      { q: 'Where is the Gaodao traverse, and where do you start?', a: 'Around Nalo village in Jianshi, Hsinchu. Take County Road 60 over Shishan Bridge and follow the Gaotai Mountain Campground signs. Most hikers start at Trailhead 1 and come back to the same place, about 9 to 10 km and 6 to 8 hours.' },
      { q: 'How much water should I carry for the Gaodao traverse?', a: 'There is no water on the route, so carry 2 to 3 liters. Fog often rolls in by afternoon, so start early.' },
    ],
  },
  taman: {
    guide: [
      { k: 'Drop-off point', v: 'Big Water Tank trailhead (大水塔登山口): Highway 7 to Lalashan, Zhong Baling, Shang Baling, past Shun-en Farm (順恩愛農場) and Yunding Campground (雲頂露營區), then follow the Taman signs. Small cars can get there; mid-size and large buses cannot. There is room for only 3 to 5 cars near the trailhead.' },
      { k: 'After drop-off', v: '3 km each way: about 3 hours up and 2 hours down, a half-day hike. The summit (2,130 m) has no view.' },
      { k: 'Permits', v: 'No mountain permit needed. Beyond the summit is the Chatianshan Nature Reserve (插天山自然保留區). Entering without approval can bring a fine of NT$30,000 to 150,000, so turn back at the summit.' },
    ],
    faq: [
      { q: 'Where do you start the Taman Mountain hike?', a: 'At the Big Water Tank trailhead: Highway 7 to Lalashan, then Shang Baling and Yunding Campground, then follow the signs. It is 3 km each way, about 3 hours up and 2 hours down. Only 3 to 5 cars fit near the trailhead, and mid-size or large buses cannot get there.' },
      { q: 'Do I need a permit for Taman Mountain?', a: 'No. But beyond the summit is the Chatianshan Nature Reserve, and entering without approval can bring a fine, so turn back at the summit.' },
    ],
  },
  beidelaman: {
    trailhead: 'Shuitian village (水田部落), Jianshi, Hsinchu',
    guide: [
      { k: 'Drop-off point', v: 'The Shuitian Forest Road trailhead above Shuitian village (水田部落): County Road 120 toward Xinle, turn onto Shuitian Forest Road (竹58) to the village, then drive uphill past Yuanshengyuan store (源昇園商店). Cars can get there (higher clearance helps); mid-size and large buses cannot.' },
      { k: 'Parking', v: 'The trailhead fits about 10 to 15 cars and is often full before 7 am on weekends.' },
      { k: 'After drop-off', v: 'Hikers report about 6 hours round trip, or 6 to 8 hours adding Neiniaozui Mountain (內鳥嘴山). There are no toilets on the trail. The area is geologically sensitive; watch for rockfall after rain.' },
      { k: 'Permits', v: 'No mountain permit needed.' },
    ],
    faq: [
      { q: 'Where is the Beidelaman trailhead?', a: 'At the Shuitian Forest Road trailhead above Shuitian village in Jianshi, Hsinchu: County Road 120 toward Xinle, then Shuitian Forest Road (竹58). Cars can get there, but mid-size and large buses cannot. Parking is often full before 7 am on weekends.' },
      { q: 'Do I need a permit for Beidelaman?', a: 'No mountain permit is needed. The hike takes about 6 hours round trip, and there are no toilets on the trail.' },
    ],
  },
  junda: {
    guide: [
      { k: 'Forest road', v: 'Junda Forest Road (郡大林道) is managed by the Forestry Agency Nantou branch. The Junda Mountain trailhead is at about 32K, with a control point at about 23K. The agency recommends a high-clearance 4WD. The road climbs from about 630 m to 2,865 m and takes about 1.5 to 2 hours.' },
      { k: 'Works and closures', v: 'The road often has changed hours or short closures for works (for example, closed November 1 to 15, 2026 for paving at 8K). Check the Nantou branch road status before you go.' },
      { k: 'Permits', v: 'Junda Mountain is not in a national park, so no park permit is needed. Check the mountain permit rules on the Taiwan hiking permits portal or with the Xinyi police.' },
      { k: 'Season', v: 'In the July and August rainy season the forest road is prone to landslides. Check road conditions before you go.' },
    ],
    faq: [
      { q: 'Is Junda Forest Road open to vehicles now?', a: 'The road is managed by the Forestry Agency Nantou branch. The Junda Mountain trailhead is at about 32K, and the agency recommends a high-clearance 4WD. Hours often change and the road sometimes closes for works, so check the Nantou branch road status page before you go.' },
    ],
  },
  'xiakaluo-ab': {
    guide: [
      { k: 'Shilu end', v: 'Trail 0K, in Wufeng, Hsinchu. Freeway 3 Zhulin exit, Zhudong, County Road 122, Qingquan, then the Qingshi farm road (清石產業道路), about 45 minutes up from Qingquan.' },
      { k: 'Yanglao end', v: 'In Jianshi, Hsinchu. County Road 120, Neiwan, Jianshi, then County Road 60 toward Xiuluan, to Yanglao (養老).' },
      { k: 'Roads', v: 'Small cars can reach both ends, though the Forestry Agency warns low-clearance sedans against it. Mid-size and large buses cannot enter, and there is no public transport.' },
      { k: 'Distance', v: 'About 22 km. The agency suggests doing it in one day, with segment times adding up to about 10 hours. There is a campsite at Baishi police post (白石駐在所).' },
      { k: 'Permits', v: 'No mountain permit needed.' },
      { k: 'Trail status', v: 'The Yanglao end near 21K has closed several times for landslides (March and May 2025, June 2026), and in 2026 a boulder smashed the trestle bridge at 16.2K. Check the Forestry Agency Hsinchu notices to see whether the full trail is passable.' },
      { k: 'Season', v: 'The agency says it is good in all seasons, with maple colors in autumn and early winter.' },
    ],
    faq: [
      { q: 'Where are the two ends of the Xiakaluo Old Trail?', a: 'The Shilu end (0K) is in Wufeng: County Road 122 to Qingquan, then about 45 minutes up the Qingshi farm road. The Yanglao end is in Jianshi, via County Road 60 toward Xiuluan. The trail is about 22 km; the agency estimates about 10 hours.' },
      { q: 'Can you walk the whole Xiakaluo Old Trail right now?', a: 'It depends on current notices. The Yanglao end near 21K has closed several times for landslides, and in 2026 a boulder smashed the trestle bridge at 16.2K. Check the Forestry Agency Hsinchu trail notices before you go.' },
      { q: 'Do I need a permit for the Xiakaluo Old Trail?', a: 'No mountain permit is needed. Neither end has public transport, and mid-size or large buses cannot enter.' },
    ],
  },
  'xiakaluo-yanglao': {
    guide: [
      { k: 'Yanglao end', v: 'In Jianshi, Hsinchu. County Road 120, Neiwan, Jianshi, then County Road 60 toward Xiuluan, to Yanglao (養老). Small cars can get there, though the Forestry Agency warns low-clearance sedans against it. Mid-size and large buses cannot enter, and there is no public transport.' },
      { k: 'Trail status', v: 'The Yanglao end near 21K has closed several times for landslides (March and May 2025, June 2026). Check the Forestry Agency Hsinchu notices before you go to see whether this section is open.' },
      { k: 'Permits', v: 'No mountain permit needed.' },
      { k: 'Season', v: 'The agency says it is good in all seasons, with maple colors in autumn and early winter.' },
    ],
    faq: [
      { q: 'What should I know before hiking Xiakaluo from the Yanglao end?', a: 'The Yanglao end near 21K has closed several times for landslides, so check the Forestry Agency Hsinchu notices before you go. No mountain permit is needed, but there is no public transport and mid-size or large buses cannot enter.' },
    ],
  },
};
for (const [key, g] of Object.entries(ROUTE_GUIDE_EN)) {
  const en = window.ROUTES_EN[key];
  const { faq = [], card, ...rest } = g;
  Object.assign(en, rest);
  if (card) Object.assign(en.card, card);
  en.faq = [...en.faq, ...faq];
}
