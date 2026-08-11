const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + process.cwd() + '/KidsLondon.html');
  await page.waitForTimeout(2000); // wait for render
  await page.screenshot({ path: 'kidslondon_home.png' });

  // click the first activity card
  const cards = await page.$$('button');
  if (cards.length > 0) {
      await cards[0].click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'kidslondon_modal.png' });
  }

  await browser.close();
})();
