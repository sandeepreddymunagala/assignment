# ScaniaAssignment
### Task:-
- Uses Node.js with Puppeteer and Chromium to scrape a user-specified URL.
- Uses Python (with a lightweight web framework like Flask) to host the scraped
content.
- Demonstrates the combined power of Node.js for browser automation and Python
for serving content, while keeping the final image lean.
### Objective:-
- Multi-Stage Build: Develop a Dockerfile that contains at least two stages:
- A build stage (or scraper stage) based on a Node.js image that installs
Chromium and Puppeteer, executes a script to scrape data from any provided
URL, and saves the output (e.g., a JSON file).
- A final stage based on a Python image that copies the scraped output and runs
a web server to host the content.

- Puppeteer & Chromium: Properly install Chromium (or Google Chrome) and configure
Puppeteer so that your Node.js script can run headless browser operations.
- Dynamic Scraping: Your scraper should accept a URL parameter (either via an
environment variable or command-line argument) and then scrape the specified site.
- Hosting: Implement a simple web server (using Python and Flask) that reads the
scraped output and displays it as JSON when accessed via a web browser.
- Containerization: The final Docker container should expose a port and allow users to
access the scraped content over HTTP.

## Procedure
<p>Step1 : create a folder of you choice name (assignment)
  
```Shell
cd assignment
```
<p>Step 2: Enter the commands</p>

```Shell
npm init -y 
npm install puppeteer-core
```
<p>Step3 : Create a file named scrape.js</p>
```Javascript
const { test, expect } = require('@playwright/test');

test('My first test', async ({ page }) => {
  await page.goto('https://www.skyscanner.se/');
  await page.pause();

  console.log('Hello World Welcome to skyscanner');
  await page.getByText('Ok', { exact: true }).click();
  await page
    .getByRole('combobox', { name: 'Ange den stad du flyger ifrån' })
    .click();
  await page
    .getByRole('combobox', { name: 'Ange den stad du flyger ifrån' })
    .fill('stoc');
  await page.getByText('Stockholm Arlanda (ARN)').click();
  await page
    .getByRole('combobox', { name: '. Ange din destination eller' })
    .click();
  await page.getByRole('button', { name: 'Utforska överallt' }).click();
  await page.getByLabel('fredag 22 december 2023. Välj').click();
  await page.getByLabel('lördag 6 januari 2024. Välj').click();
  await page.getByTestId('traveller-button').click();
  await page.getByLabel('VuxnaÖver 16 år').click();
  await page
    .getByTestId('desktop-travellerselector')
    .getByRole('button', { name: 'Sök' })
    .click();
  await page
    .getByRole('link', { name: 'Direktflyg till Sverige från' })
    .click();

  const page1Promise = page.waitForEvent('popup');

  await page
    .locator('.BpkBackgroundImage_bpk-background-image__img__NDhjM')
    .first()
    .click();

  const page1 = await page1Promise;

  const price1 = await page1
    .getByRole('button', {
      name: 'Flygalternativ 2: Total',
    })
    .textContent();
  const myArray = price1.split(' ');
  const price1_extract = myArray[4] + ' ' + myArray[5].substring(0, 3);
  console.log(`Price of Flight in first link : ${price1_extract}`);

  await page1
    .getByRole('button', { name: 'Flygalternativ 2: Total' })
    .getByRole('button')
    .click();

  const first_price = await page1
    .getByTestId('pricing-item-container')
    .getByText('SEK');
  const f_price = await first_price.textContent();
  console.log(`Price of Flight after clicking the first link: ${f_price}`);

  if (price1_extract === f_price) {
    console.log('Testcase Passed: Prices are same');
  } else {
    console.log('Testcase Failed: Prices are different, berfore and after');
  }
});
```

<p>Step 4: Create a file name server.py</p>

```Shell
npx playwright test ./tests/test1.spec.js --project firefox --headed
```
<p><b>Here is a recored video of execution of the test case</b></p>

https://github.com/Saipreetham7/ScaniaAssignment/assets/70648426/999c3662-56ac-452b-ba61-504bc7c4da71


<h1>Results</h1>
<p>The test case we executed, will test for the intial flight amount before clicking the link with the flight amount after clicking the link.</p>
<p>Here is the logic for comparison:</p>

```JavaScript
if (price1_extract === f_price) {
    console.log('Testcase Passed: Prices are same');
  } else {
    console.log('Testcase Failed: Prices are different, before and after');
}
```

<p>Here, 
  <li>if both the prices are same then we print "Testcase Passed"</li>
  <li>If they are different, we print "Testcase Failed"</li>
</p>

<p><b>Here are few screenshots of the results</b></p>
<img width="1136" alt="Screenshot 2023-12-20 at 11 53 23 AM" src="https://github.com/Saipreetham7/ScaniaAssignment/assets/70648426/e83431f6-68a1-4c0f-900e-683c070e8617">

<img width="709" alt="Screenshot 2023-12-20 at 11 53 46 AM" src="https://github.com/Saipreetham7/ScaniaAssignment/assets/70648426/24ed0026-4374-4bf0-a712-60ea9452c9e7">

<h3>Testcase Report</h3>
<img width="1350" alt="Screenshot 2023-12-20 at 11 55 04 AM" src="https://github.com/Saipreetham7/ScaniaAssignment/assets/70648426/b81bd34c-f301-425b-a954-6daf30de7425">


<h1>Challenges faced during Assignment</h1>
<p>Initially, I began automating tasks using the Selenium tool. However, as the test script ran in Selenium, the browser opened a Captcha. I attempted to eradicate it, but it kept popping up. Then I tried some methods to get around the Captcha, but they didn't work.
</p>
<img width="500" alt="Screenshot 2023-12-18 at 6 25 48 PM" src="https://github.com/Saipreetham7/ScaniaAssignment/assets/70648426/84821cd8-fdcf-466b-b969-9c00b20c0311">
<br><br>

<p>So I used Playwright tool and only used Firefox browser for testing because I discovered that other web browsers generate Captcha while running test scripts. Using which I successfully executed the testcase in Firefox browser and received Test reports, of which I attached a screenshot in the preceding section.</p>

<img width="1399" alt="Screenshot 2023-12-20 at 2 28 00 PM" src="https://github.com/Saipreetham7/ScaniaAssignment/assets/70648426/31db9609-549f-4afa-9f7f-0beb9eef22fe">


