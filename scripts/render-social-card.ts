import { readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const root = new URL('../', import.meta.url);
const data = async (path: string, type: string) => `data:${type};base64,${(await readFile(new URL(path, root))).toString('base64')}`;
const [font, phone, atmosphere, mark, symbol] = await Promise.all([
  data('node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2', 'font/woff2'),
  data('public/assets/hero-phone.webp', 'image/webp'),
  data('public/assets/hero-atmosphere.webp', 'image/webp'),
  data('public/assets/figure-square.svg', 'image/svg+xml'),
  data('public/assets/figure-plus-minus.svg', 'image/svg+xml'),
]);
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
    @font-face { font-family: Geist; src: url('${font}') format('woff2'); font-weight: 100 900; }
    * { box-sizing: border-box; } body { margin: 0; width: 1200px; height: 630px; overflow: hidden; font-family: Geist, sans-serif; color: #f7f8fa; background: #101214 url('${atmosphere}') center / cover; }
    body::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, #080c10 0%, #080c10e8 45%, #080c1020 100%); }
    main { position: relative; height: 100%; padding: 48px 64px; }
    .brand { display: flex; align-items: center; gap: 14px; font-size: 42px; font-weight: 650; letter-spacing: -2px; }
    .mark { display: block; position: relative; width: 48px; height: 48px; } .mark img { position: absolute; inset: 0; width: 100%; height: 100%; }
    .eyebrow { margin: 74px 0 24px; color: #31c4ff; font-size: 16px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; }
    h1 { margin: 0; max-width: 680px; font-size: 80px; line-height: 1.04; font-weight: 720; letter-spacing: -5px; }
    .description { max-width: 610px; margin-top: 28px; font-size: 23px; line-height: 1.45; color: #d9dde3; }
    .address { position: absolute; bottom: 42px; left: 64px; margin: 0; color: #b4bec8; font-size: 20px; }
    .phone { position: absolute; right: 110px; bottom: 36px; height: 554px; width: auto; filter: drop-shadow(0 18px 24px #0009); }
  </style></head><body><main><div class="brand"><span class="mark"><img src="${mark}" alt=""><img src="${symbol}" alt=""></span>Figure</div>
  <p class="eyebrow">Construction · Fabrication · DIY</p><h1>Trade math.<br>Made intuitive.</h1><p class="description">Adaptive keys. Visual results.<br>Feet, inches, fractions and metric.</p><p class="address">figure.tvr.works</p><img class="phone" src="${phone}" alt="Figure’s Circle calculator on iPhone"></main></body></html>`);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(image => image.decode()));
  });
  await page.screenshot({ path: new URL('public/social-card.png', root).pathname });
  console.log('Rendered public/social-card.png at 1200 × 630 from the existing Figure assets.');
} finally {
  await browser.close();
}
