const { chromium } = require('../frontend/node_modules/playwright-core');

(async () => {
  const browser = await chromium.launch();
  
  // 1. Desktop Test
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await desktopPage.goto('http://localhost:5174/dreamers-lab/index.html', { waitUntil: 'networkidle' });
  await desktopPage.addStyleTag({ content: '.dl-navbar, .nd-navbar, .dl-mobile-menu { display: none !important; }' });
  
  const section = await desktopPage.$('#program-details');
  if (section) {
    const box = await section.boundingBox();
    console.log(`DESKTOP DETAILS HEIGHT: ${box ? Math.round(box.height) : 'null'}px`);
    await section.screenshot({
      path: 'C:/Users/Sarwang/.gemini/antigravity-ide/brain/eaaa12ed-320d-4f71-aa1a-8b2c705d05b3/scratch/details_desktop.png'
    });
    console.log('Desktop details screenshot saved');
  }
  await desktopPage.close();

  // 2. Tablet Test
  const tabletPage = await browser.newPage({ viewport: { width: 820, height: 1180 } });
  await tabletPage.goto('http://localhost:5174/dreamers-lab/index.html', { waitUntil: 'networkidle' });
  await tabletPage.addStyleTag({ content: '.dl-navbar, .nd-navbar, .dl-mobile-menu { display: none !important; }' });
  const tabletSection = await tabletPage.$('#program-details');
  if (tabletSection) {
    const box = await tabletSection.boundingBox();
    console.log(`TABLET DETAILS HEIGHT: ${box ? Math.round(box.height) : 'null'}px`);
    await tabletSection.screenshot({
      path: 'C:/Users/Sarwang/.gemini/antigravity-ide/brain/eaaa12ed-320d-4f71-aa1a-8b2c705d05b3/scratch/details_tablet.png'
    });
    console.log('Tablet details screenshot saved');
  }
  await tabletPage.close();

  // 3. Mobile Test
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:5174/dreamers-lab/index.html', { waitUntil: 'networkidle' });
  await mobilePage.addStyleTag({ content: '.dl-navbar, .nd-navbar, .dl-mobile-menu { display: none !important; }' });
  const mobileSection = await mobilePage.$('#program-details');
  if (mobileSection) {
    const box = await mobileSection.boundingBox();
    console.log(`MOBILE DETAILS HEIGHT: ${box ? Math.round(box.height) : 'null'}px`);
    await mobileSection.screenshot({
      path: 'C:/Users/Sarwang/.gemini/antigravity-ide/brain/eaaa12ed-320d-4f71-aa1a-8b2c705d05b3/scratch/details_mobile.png'
    });
    console.log('Mobile details screenshot saved');
  }
  await mobilePage.close();

  await browser.close();
})();
