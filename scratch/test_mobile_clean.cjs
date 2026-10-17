const { chromium } = require('../frontend/node_modules/playwright-core');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:5174/dreamers-lab/index.html', { waitUntil: 'networkidle' });
  
  // Hide navbars
  await page.addStyleTag({ content: '.dl-navbar, .nd-navbar { display: none !important; }' });
  
  const section = await page.$('#parents');
  if (section) {
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await section.screenshot({
      path: 'C:/Users/Sarwang/.gemini/antigravity-ide/brain/eaaa12ed-320d-4f71-aa1a-8b2c705d05b3/scratch/parents_mobile_clean.png'
    });
    console.log('Clean mobile screenshot saved');
  }
  await browser.close();
})();
