# 山行接駁 — 登山口專車接駁網站

台北出發的登山口接駁服務網站。純靜態網頁（HTML / CSS / JavaScript），不需要安裝或編譯，由 GitHub Pages 直接發布。

## 修改聯絡資訊與價格

打開 `js/config.js`，改完存檔、推上 GitHub 即可：

| 欄位 | 說明 |
| --- | --- |
| `brand` | 品牌名稱 |
| `tagline` | logo 下方的小字 |
| `lineId` | LINE ID（官方帳號含 `@`）。填了之後，「LINE 詢價」會直接開啟與你的對話 |
| `phone` | 聯絡電話。填了才會顯示電話按鈕 |
| `dayTripPrice` | 當日來回起價 |

## 修改路線

路線卡片在 `index.html` 的「熱門路線」區塊，每條路線是一個 `<article class="route">`。
`data-days` 決定篩選分類：`day`（當日來回）、`two`（兩天）、`multi`（三天以上）。
新增路線時，記得同步在詢價表單的「要去哪裡」下拉選單加上一個選項。

## 本機預覽

```sh
python3 -m http.server 8000
```

然後開啟 <http://localhost:8000>。

## 照片授權

照片取自 Wikimedia Commons，依創用 CC 授權使用，作者與授權條款列在網站頁尾的「照片來源與授權」。
換成自己拍的照片時，把對應的檔案放進 `images/` 並更新頁尾的授權清單即可。
