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