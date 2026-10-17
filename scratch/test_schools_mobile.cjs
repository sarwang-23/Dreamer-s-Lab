const { chromium } = require('../frontend/node_modules/playwright-core');

(async () => {
  const browser = await chromium.launch();
  
  // Mobile Test with all fixed headers/menus hidden for isolated section capture
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:5174/dreamers-lab/index.html', { waitUntil: 'networkidle' });
  await mobilePage.addStyleTag({ content: '.dl-navbar, .nd-navbar, .dl-mobile-menu { display: none !important; }' });
  const mobileSection = await mobilePage.$('#schools');
  if (mobileSection) {
    await mobileSection.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(200);
    const box = await mobileSection.boundingBox();
    console.log(`MOBILE SCHOOLS HEIGHT: ${box ? Math.round(box.height) : 'null'}px`);
    await mobileSection.screenshot({
      path: 'C:/Users/Sarwang/.gemini/antigravity-ide/brain/eaaa12ed-320d-4f71-aa1a-8b2c705d05b3/scratch/schools_mobile_clean.png'
    });
    console.log('Mobile schools clean screenshot saved');
  }
  await mobilePage.close();

  await browser.close();
})();
