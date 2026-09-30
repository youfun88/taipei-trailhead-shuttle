# 山行接駁 — 登山口專車接駁網站

台北、台中出發的登山口接駁服務網站。純靜態網頁（HTML / CSS / JavaScript），不需要安裝或編譯，由 GitHub Pages 直接發布。

## 修改聯絡資訊與價格

打開 `js/config.js`，改完存檔、推上 GitHub 即可：

| 欄位 | 說明 |
| --- | --- |
| `brand` | 品牌名稱 |
| `tagline` | logo 下方的小字 |
| `lineUrl` | LINE 加好友連結（行動條碼掃出來的網址）。換帳號時，同時把新的條碼圖片存成 `images/line-qr.png` |
| `phone` | 聯絡電話。填了才會顯示電話按鈕 |
| `email` | 聯絡信箱 |
| `web3formsKey` | 詢價表單寄信用的 Web3Forms 金鑰。填了之後，送出的詢價會寄到申請金鑰時用的信箱；留空就不寄信，只用 LINE |

改了電話、信箱或 LINE 連結時，`contact.vcf`（電子名片「存到手機通訊錄」用的檔案）也要一起改，
否則自動檢查會擋下來提醒你。品牌名稱改了的話，`contact.vcf` 裡的名稱也請一併更新。

## 修改價格

各路線的價格都在 `js/prices.js`：分台北出發（`taipei`）和台中出發（`taichung`），每個出發地有五人座（`five`）和九人座（`nine`），兩個數字依序是單程、來回。
改完推上 GitHub，發布流程會自動把新價格寫進路線卡片、收費表、起價、價格問答和給搜尋引擎的資料。填 `null` 會顯示「詢價」。
想先在本機看結果，跑一次 `node scripts/build.mjs`。

## 搜尋引擎與 AI（SEO / AEO / GEO）

`scripts/build.mjs` 會依 `js/config.js` 和 `js/prices.js` 產生這些內容，不要手動改：

- `index.html` 裡 `<!-- build:… -->` 標記之間的區塊：結構化資料（商家、價格、常見問題）、收費表、各路線價格問答、頁尾簡介
- `sitemap.xml`：給搜尋引擎的網站地圖
- `llms.txt`：給 AI 助理讀的服務、價格、聯絡方式摘要

`robots.txt` 允許所有搜尋引擎與 AI 讀取。

每次發布完成後，會用 IndexNow 自動通知 Bing 網站有更新。根目錄的 `69ea85e35b38b64cc0d55ad2fe4b18c0.txt` 是 IndexNow 的驗證金鑰，不要刪除或改名。

## 修改路線

路線卡片在 `index.html` 的「熱門路線」區塊，每條路線是一個 `<article class="route">`。
`data-days` 決定篩選分類：`day`（當日來回）、`two`（兩天）、`multi`（三天以上）。
新增路線時，記得同步在詢價表單的「要去哪裡」下拉選單加上一個選項。

## 自動檢查與發布

每次把修改推上 `main`，GitHub Actions（`.github/workflows/deploy.yml`）會自動：

1. **產生**：把價格和聯絡資料寫成靜態內容（見下方「搜尋引擎與 AI」）。
2. **檢查**：JavaScript 語法、頁面引用的檔案是否存在、站內連結是否有對應區塊、圖片是否過大。
3. **發布**：檢查通過才會更新網站；沒通過就維持線上原本的版本。

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
