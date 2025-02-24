# Assignment
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
```

<p>Step 4: Create a file name server.py</p>

```python
from flask import Flask, jsonify
import json
import os

app = Flask(__name__)

DATA_FILE = os.environ.get('SCRAPED_DATA_FILE', 'scraped_data.json')

def load_data():
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        return {"error": f"Unable to load data: {str(e)}"}

@app.route('/')
def index():
    data = load_data()
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

```
<p>Step 5: Create a file named Dockerfile</p>

``` Shell
# Stage 1: Node.js Scraper Stage
FROM node:18-alpine AS scraper
WORKDIR /app

# Install Chromium and dependencies
RUN apk add --no-cache \
    chromium 

# Configure Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CHROMIUM_PATH=/usr/bin/chromium

# Install Node.js dependencies
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

# Copy scraping script
COPY scrape.js .

# Handle build arguments for URLs
ARG SCRAPE_URLS
ENV SCRAPE_URLS=${SCRAPE_URLS}

# Conditional scraping execution
RUN if [ -n "$SCRAPE_URLS" ]; then \
      node scrape.js; \
    else \
      echo "No SCRAPE_URLS provided, skipping scrape"; \
    fi

# Stage 2: Python Hosting Stage
FROM python:3.10-alpine AS runtime
WORKDIR /app

# Copy scraped data from previous stage
COPY --from=scraper /app/scraped_data.json ./

# Copy Flask application
COPY server.py .

# Install Python dependencies without caching
RUN pip install --no-cache-dir flask

# Expose and run the application
EXPOSE 5000
CMD ["python", "server.py"]
```
<p>Step 6: In terminal type</p>

``` Shell
docker build --build-arg SCRAPE_URLS="https://www.google.com,https://www.bing.com" -t web-scraperer .
```

``` Shell
docker run -p 5000:5000 web-scraperer
```


<p>Step 7: Now open a browser and type the url</p>

``` url
http://localhost:5000/
```
if you are unable to see the output and page is still loading, open incognito mode and type the url or clear the cache of the browser
