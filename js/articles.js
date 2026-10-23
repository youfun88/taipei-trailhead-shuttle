// 登山交通攻略文章 —— 發布時會產生 articles/<slug>/ 文章頁，並列在首頁「登山交通攻略」。
//   slug     網址（英文小寫與 -）      lang     zh-Hant-TW 或 en
//   title    文章標題                    desc     搜尋結果下方的摘要（約 80 字）
//   lead     開頭一段                    routes   文章提到的路線 key（會附上路線資訊與連結）
//   compare  true 時插入路線比較表（海拔、天數、登山口、車程，取自 routes.js）
//   prices   true 時插入台北、台中出發的價格比較表（取自 prices.js）
//   sections 段落：h 小標、p 段落文字（陣列）、list 條列（可省略）
// 文章裡不寫死價格與車程，改用比較表，價格調整後文章會跟著更新。
window.ARTICLES = [
  {
    slug: 'hong-kong-yushan-transport',
    lang: 'zh-Hant-TW',
    title: '香港人挑戰玉山：從抵達台灣到登山口的交通安排',
    desc: '從香港飛來台灣爬玉山，入園申請、抵達後怎麼休息、怎麼到塔塔加登山口？整理香港山友最常問的交通安排與行程節奏。',
    lead: '玉山是台灣第一高峰，也是很多香港山友來台灣的第一個百岳目標。真正難安排的往往不是登山本身，而是從機場到登山口這一段：登山口在南投山區，沒有直達的大眾運輸，出發時間又常常是凌晨。這篇整理從抵達台灣到站上塔塔加的交通安排。',
    routes: ['yushan'],
    compare: true,
    sections: [
      {
        h: '先確認入園與山屋，再訂機票',
        p: [
          '玉山主峰需要申請國家公園入園許可與入山證，排雲山莊的床位採抽籤分配。外籍旅客的申請方式與名額，請以玉山國家公園官網公告為準。',
          '建議先確定山屋與入園結果，再決定機票與接駁日期。日期確定後再詢價，我們可以直接依你的上山、下山日期安排車輛。',
        ],
      },
      {
        h: '抵達台灣後，先休息一晚',
        p: [
          '從香港出發的航班大多降落在桃園機場。抵達當天建議先住在台北或台中，隔天再出發上山：一方面避免搭完飛機直接長途坐車，一方面也讓身體有時間準備面對高海拔。',
          '從桃園機場可以搭機場捷運到台北車站，或轉乘高鐵往台中。如果行李多、不想轉車，也可以請我們安排機場接送。',
        ],
      },
      {
        h: '常見的兩天行程節奏',
        list: [
          '前一天：抵達台灣，住台北或台中，準備裝備與補給。',
          '第一天：清晨在台北車站、台中高鐵站或飯店上車，專車前往塔塔加，沿途可以做最後補給，下午走到排雲山莊。',
          '第二天：凌晨攻頂、下山，在約好的時間地點上車，直接送回市區。',
        ],
      },
      {
        h: '塔塔加的接駁要注意什麼？',
        p: [
          '接送以塔塔加可通行的區域為準。塔塔加到玉山登山口之間是管制路段，需要搭當地接駁或步行，出發前請先確認最新的管制方式。',
          '起登前我們會再次和你確認下山時間與地點。山上有訊號時，盡量更新預計下山時間，回程會抓得更準。',
        ],
      },
      {
        h: '從香港怎麼預約與付款？',
        p: [
          '詢價表單可以填 +852 的電話，或只留 Email，並選擇用 WhatsApp、LINE 或 Email 聯絡。訂金海外旅客可用 PayPal，尾款以新台幣現金或匯款支付。出發三日前通知，可全額退費取消或改期；遇封山或官方管制，可於出發前一日取消。',
        ],
      },
    ],
  },
  {
    slug: 'yushan-xueshan-hehuan-compare',
    lang: 'zh-Hant-TW',
    title: '馬來西亞登山團來台灣：玉山、雪山、合歡山怎麼選？',
    desc: '玉山、雪山、合歡山是海外登山團最常問的三座台灣高山。比較海拔、天數、登山口與車程，幫你的登山團選出適合的路線。',
    lead: '從馬來西亞組團來台灣爬山，最常在玉山、雪山、合歡山三座山之間猶豫。三座山都超過 3,000 公尺，但難度、天數、申請方式和交通安排都不一樣。先看比較表，再依團員的經驗選擇。',
    routes: ['yushan', 'xueshan', 'hehuan'],
    compare: true,
    sections: [
      {
        h: '第一次來台灣爬高山：合歡山',
        p: [
          '合歡山的登山口就在公路旁，可以當天來回，步道相對短，景色是開闊的高山草原與雲海。很適合第一次接觸台灣高山、想先適應高海拔的團員，也可以排在玉山或雪山之前當作暖身。',
        ],
      },
      {
        h: '想挑戰台灣最高峰：玉山',
        p: [
          '玉山主峰海拔 3,952 公尺，是很多海外山友的目標。需要申請入園、入山證與排雲山莊床位，通常安排兩天。適合已有高山經驗、能早起長時間步行的團員。',
        ],
      },
      {
        h: '想看圈谷與黑森林：雪山',
        p: [
          '雪山從武陵農場進出，沿途有黑森林與雪山圈谷，通常安排兩天以上，也可以延伸到武陵四秀。需要申請雪霸國家公園入園，部分時期武陵農場一帶有車輛通行管制。',
        ],
      },
      {
        h: '登山團的交通怎麼安排？',
        list: [
          '九人座最多可搭乘 8 位乘客，五人座最多 4 位；人數更多時，詢價時請先告知，我們確認車輛安排後回覆。',
          '大型登山背包與行李箱會影響車內空間，請在詢價時告知件數與大小，我們協助評估車型。',
          '可在台北車站、台中高鐵站、飯店或機場上車，下山後直接送回市區。',
        ],
      },
      {
        h: '別忘了高山適應',
        p: [
          '三座山都超過 3,000 公尺，可能出現高山症。行程不要排得太緊，抵達台灣後先休息，再上山，會比較從容。',
        ],
      },
    ],
  },
  {
    slug: 'singapore-taiwan-hiking-yushan-hehuanshan',
    lang: 'en',
    title: 'Singapore to Taiwan Hiking: How to Reach Yushan and Hehuanshan Trailheads',
    desc: 'Flying from Singapore to hike Yushan or Hehuanshan? How to get from the airport to the trailheads, which permits to sort out first, and how to book a private hiking shuttle.',
    lead: 'Yushan (Jade Mountain) and Hehuanshan are two of the most popular high mountains for hikers flying in from Singapore. Both trailheads are deep in the central mountains of Taiwan, with little or no public transport and very early start times. Here is how to get there.',
    routes: ['yushan', 'hehuan'],
    // 英文文章的比較表用英文名稱
    routeEn: {
      yushan: { name: 'Yushan (玉山)', days: '2 days', trailhead: 'Tataka, Nantou' },
      hehuan: { name: 'Hehuanshan (合歡山)', days: 'Day trip or 2 days', trailhead: 'Wuling, Kunyang, Xiaofengkou (Nantou)' },
    },
    compare: true,
    sections: [
      {
        h: 'Landing in Taiwan',
        p: [
          'Most flights from Singapore land at Taoyuan International Airport. From there, the Airport MRT goes to Taipei Main Station, and the high speed rail runs south to Taichung. We suggest spending your first night in Taipei or Taichung before heading into the mountains, so you are rested before going to altitude.',
          'If you would rather not transfer with heavy packs, we can also arrange an airport pickup.',
        ],
      },
      {
        h: 'Getting to Yushan (Tataka)',
        p: [
          'Yushan is reached from Tataka in Nantou County. Our drop-off is at the area of Tataka open to vehicles; the road between Tataka and the Yushan trailhead is restricted and served by a local shuttle or on foot, so check the latest arrangement before you go.',
          'Yushan requires a national park entry permit and a mountain entry permit, and beds at Paiyun Lodge are allocated by lottery. Check the Yushan National Park website for how foreign hikers apply, and book your shuttle once your permits are confirmed.',
        ],
      },
      {
        h: 'Getting to Hehuanshan',
        p: [
          'Hehuanshan trailheads such as Wuling, Kunyang and Xiaofengkou sit right next to the highway, which makes it one of the easiest high mountains in Taiwan to reach. Many hikers do it as a day trip; others stay overnight for sunrise.',
        ],
      },
      {
        h: 'Booking a private shuttle',
        list: [
          'Pickup at Taipei Main Station, Taichung HSR station, your hotel or the airport.',
          'Prices are per vehicle, not per person: a 5-seater takes up to 4 passengers, a 9-seater up to 8.',
          'Enquire with a Singapore (+65) number or just an email address, and choose WhatsApp, LINE or email for our reply. Let us know your preferred language.',
          'Deposit by PayPal for overseas guests; the balance is paid in New Taiwan dollars in cash or by bank transfer.',
          'Free cancellation or rescheduling up to three days before departure; if the mountain or road is closed by the authorities, you can cancel the day before.',
        ],
      },
    ],
  },
  {
    slug: 'taipei-taichung-shuttle-cost',
    lang: 'zh-Hant-TW',
    title: '台灣百岳接駁攻略：台北、台中出發費用比較',
    desc: '台北出發和台中出發的登山接駁差多少？整理各路線五人座、九人座的整車價格，看看從哪裡出發比較省。',
    lead: '同一座山，從台北出發和從台中出發的接駁費用不一定一樣：中部的高山從台中出發比較近，北部和宜蘭的路線則是台北出發較省。下面整理各路線台北、台中出發的整車價格，規劃行程時可以一起考慮從哪裡上車。',
    routes: [],
    prices: true,
    sections: [
      {
        h: '價格怎麼看',
        list: [
          '價格是整台車的費用，不是按人頭計價。五人座最多搭乘 4 人，九人座最多搭乘 8 人。',
          '單程是一趟車；來回是去程、回程兩段行程接駁；一天來回是當天送上山、依約定時間接回。',
          '網站價格為整車參考費用，實際報價依上車地點、接送時間、停靠需求與道路條件確認。私人登山口、入園費、停車費等其他費用，會註明在行程確認單上。',
        ],
      },
      {
        h: '從哪裡上車比較划算？',
        p: [
          '如果你本來就住在中南部，或願意先搭高鐵到台中，玉山、合歡山、奇萊南華這類中部高山從台中高鐵站上車通常比較省；雪山、南湖大山、松蘿湖這類北部與宜蘭方向的路線，則是台北出發比較划算。實際差多少，看上面的比較表。',
        ],
      },
      {
        h: '付款與取消',
        p: [
          '確認報價後支付訂金，可用匯款或 LINE Pay，海外旅客可用 PayPal；尾款以新台幣現金或匯款支付。出發三日前通知，可全額退費取消或改期；遇封山或官方管制，可於出發前一日取消。',
        ],
      },
    ],
  },
  {
    slug: 'first-time-hiking-taiwan-guide',
    lang: 'zh-Hant-TW',
    title: '第一次來台灣登山：外國旅客需要注意哪些入園、保險與交通事項？',
    desc: '外國旅客第一次來台灣爬山，入園許可、入山證、山屋、登山保險和交通要怎麼準備？出發前的重點一次整理。',
    lead: '台灣的高山步道很有魅力，但第一次從海外來爬山，常會被申請文件和交通安排搞得手忙腳亂。這篇整理外國旅客出發前最需要注意的入園、保險與交通事項。',
    routes: ['hehuan', 'yushan', 'xueshan'],
    sections: [
      {
        h: '入園許可與入山證',
        p: [
          '台灣不少高山步道位在國家公園的生態保護區或山地管制區，需要事先申請入園許可或入山證，熱門山屋與營地也常採抽籤。可以透過臺灣登山申請一站式服務網（hike.taiwan.gov.tw）查詢與申請，每條路線的官方連結也列在我們的路線頁上。',
          '詢價時告訴我們想去的路線，我們可以提供入山證、山屋的申請資訊。',
        ],
      },
      {
        h: '登山保險',
        p: [
          '建議投保登山綜合保險。如果已經有旅遊保險，請先確認是否涵蓋高山健行。若想參加有嚮導的行程，我們也可以協助聘請登山嚮導（簽訂登山嚮導服務契約、投保登山綜合保險），或轉介至合法登山同業以商業團報名。',
        ],
      },
      {
        h: '交通：很多登山口沒有大眾運輸',
        p: [
          '台灣的高山登山口大多在山區深處，沒有直達的大眾運輸，出發時間又常在凌晨，自駕則要面對陌生的山路與一位難求的停車位。包車接駁可以從台北車站、台中高鐵站、飯店或機場直接送到登山口，下山再接回市區。',
        ],
      },
      {
        h: '山上常常沒有訊號',
        list: [
          '出發前確認集合位置、下山時間與緊急聯絡方式。',
          '山上有訊號時，盡量更新預計下山時間給司機。',
          '起登前我們會再次確認下山時間及地點，並在約定時間等你。',
        ],
      },
      {
        h: '天氣與道路管制',
        p: [
          '夏秋是颱風季，冬季高山可能下雪結冰，山區道路也可能因天候、施工或災害管制。出發前請確認氣象與道路資訊；遇到封山或官方管制，可於出發前一日取消。',
        ],
      },
      {
        h: '留意高山症',
        p: [
          '海拔 3,000 公尺以上可能出現高山症。抵達台灣後先休息一晚，行程不要排得太緊；第一次爬台灣高山，可以先從合歡山這類公路可達的路線開始。',
        ],
      },
    ],
  },
];
