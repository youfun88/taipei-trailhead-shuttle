# 山行接駁 — 登山口專車接駁網站

台北出發的登山口接駁服務網站。純靜態網頁（HTML / CSS / JavaScript），不需要安裝或編譯，由 GitHub Pages 直接發布。

## 修改聯絡資訊與價格

打開 `js/config.js`，改完存檔、推上 GitHub 即可：

| 欄位 | 說明 |
| --- | --- |
| `brand` | 品牌名稱 |
| `tagline` | logo 下方的小字 |
| `lineUrl` | LINE 加好友連結（行動條碼掃出來的網址）。換帳號時，同時把新的條碼圖片存成 `images/line-qr.png` |
| `phone` | 聯絡電話。填了才會顯示電話按鈕 |
| `email` | 聯絡信箱 |
| `dayTripPrice` | 當日來回起價 |

改了電話、信箱或 LINE 連結時，`contact.vcf`（電子名片「存到手機通訊錄」用的檔案）也要一起改，
否則自動檢查會擋下來提醒你。品牌名稱改了的話，`contact.vcf` 裡的名稱也請一併更新。

## 修改路線

路線卡片在 `index.html` 的「熱門路線」區塊，每條路線是一個 `<article class="route">`。
`data-days` 決定篩選分類：`day`（當日來回）、`two`（兩天）、`multi`（三天以上）。
新增路線時，記得同步在詢價表單的「要去哪裡」下拉選單加上一個選項。

## 自動檢查與發布

每次把修改推上 `main`，GitHub Actions（`.github/workflows/deploy.yml`）會自動：

1. **檢查**：JavaScript 語法、頁面引用的檔案是否存在、站內連結是否有對應區塊、圖片是否過大。
2. **發布**：檢查通過才會更新網站；沒通過就維持線上原本的版本。

推送前也可以先在本機跑同一個檢查：

```sh
node scripts/check.mjs
```

## 本機預覽

```sh
python3 -m http.server 8000
```

然後開啟 <http://localhost:8000>。

## 照片授權

照片取自 Wikimedia Commons，依創用 CC 授權使用，作者與授權條款列在網站頁尾的「照片來源與授權」。
換成自己拍的照片時，把對應的檔案放進 `images/` 並更新頁尾的授權清單即可。
