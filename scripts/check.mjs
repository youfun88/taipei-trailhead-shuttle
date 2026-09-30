// 發布前檢查：不需要安裝任何套件，直接 `node scripts/check.mjs` 即可。
// 1. JavaScript 語法  2. 頁面引用的檔案都存在  3. 站內錨點都有對應的 id  4. 圖片沒有過大
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const MAX_IMAGE_KB = 900;
const errors = [];

const isExternal = (ref) => /^(https?:|data:|mailto:|tel:|\/\/)/.test(ref);

// 1. JavaScript 語法
for (const file of readdirSync(join(root, 'js')).filter((f) => f.endsWith('.js'))) {
  try {
    execFileSync(process.execPath, ['--check', join(root, 'js', file)], { stdio: 'pipe' });
  } catch (err) {
    errors.push(`js/${file} 語法錯誤：\n${err.stderr}`);
  }
}

// 2. 頁面引用的檔案
const html = readFileSync(join(root, 'index.html'), 'utf8');
const refs = new Set();
for (const [, ref] of html.matchAll(/\s(?:src|href)="([^"]+)"/g)) refs.add(ref);
for (const [, list] of html.matchAll(/\s(?:srcset|imagesrcset)="([^"]+)"/g)) {
  for (const item of list.split(',')) refs.add(item.trim().split(/\s+/)[0]);
}
for (const ref of refs) {
  if (isExternal(ref) || ref.startsWith('#')) continue;
  if (!existsSync(join(root, ref.split(/[?#]/)[0]))) errors.push(`index.html 引用了不存在的檔案：${ref}`);
}

const css = readFileSync(join(root, 'css/style.css'), 'utf8');
for (const [, ref] of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
  if (isExternal(ref)) continue;
  if (!existsSync(join(root, 'css', ref))) errors.push(`css/style.css 引用了不存在的檔案：${ref}`);
}

// 3. 站內錨點
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
for (const ref of refs) {
  if (ref.startsWith('#') && ref.length > 1 && !ids.has(ref.slice(1))) {
    errors.push(`index.html 的連結 ${ref} 找不到對應的 id`);
  }
}

// 4. 圖片大小
for (const file of readdirSync(join(root, 'images'))) {
  const kb = Math.round(statSync(join(root, 'images', file)).size / 1024);
  if (kb > MAX_IMAGE_KB) errors.push(`images/${file} 有 ${kb} KB，超過上限 ${MAX_IMAGE_KB} KB，請先壓縮`);
}

if (errors.length) {
  console.error(`檢查未通過（${errors.length} 個問題）：\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(`檢查通過：${refs.size} 個引用、${ids.size} 個錨點、圖片大小皆正常。`);
