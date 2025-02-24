const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const urls = process.env.SCRAPE_URLS ? process.env.SCRAPE_URLS.split(',') : [];

  if (urls.length === 0) {
    console.error('Error: SCRAPE_URLS environment variable is not set or empty.');
    process.exit(1);
  }

  // Launch Puppeteer with proper flags for headless operation
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ],
    executablePath: process.env.CHROMIUM_PATH || undefined
  });

  const results = [];

  try {
    const page = await browser.newPage();

    for (const url of urls) {
      console.log(`Scraping: ${url}`);
      await page.goto(url.trim(), { waitUntil: 'networkidle2' });

      const data = await page.evaluate(() => {
        const title = document.title;
        const headingElement = document.querySelector('h1');
        const heading = headingElement ? headingElement.innerText : '';
        return { title, heading };
      });

      results.push({ url, ...data });
    }

    // Write the scraped data to a JSON file
    fs.writeFileSync('scraped_data.json', JSON.stringify(results, null, 2));
    console.log('Scraping complete. Data saved to scraped_data.json');
  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await browser.close();
  }
})();
