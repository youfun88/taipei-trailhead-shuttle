// 網站基本資料 —— 改這裡就好，全站會自動套用。
window.SITE = {
  // 品牌名稱（顯示在左上角 logo、頁尾、瀏覽器分頁標題）
  brand: '山行接駁',
  tagline: '登山口專車',

  // 聯絡人姓名（顯示在名片、詢價區和頁尾）
  owner: '汪鑫',

  // LINE 加好友連結（LINE 行動條碼掃出來的網址）。對應的條碼圖片是 images/line-qr.png。
  // 留空時，LINE 按鈕會帶客人到詢價表單，由客人自行選擇傳送對象。
  lineUrl: 'https://line.me/ti/p/1fAToCMY_h',

  // LINE ID（顯示給客人在 LINE 裡搜尋加好友用）。留空則只顯示「加入好友」。
  lineId: '0910321666',

  // 聯絡電話（例如 '0912-345-678'）。留空則不顯示電話按鈕。
  phone: '0910-321-666',

  // 聯絡信箱。留空則不顯示。
  email: 'taipei.cars@gmail.com',

  // 詢價表單的寄信服務（FormSubmit）。表單送出後會把內容寄到上面的信箱。
  // 第一次有人送出表單時，信箱會收到一封「Activate Form」確認信，點一下才會開始收信。
  // 留空則不寄信，表單只會整理成訊息讓客人用 LINE 傳送。
  formEndpoint: 'https://formsubmit.co/ajax/taipei.cars@gmail.com',
};
