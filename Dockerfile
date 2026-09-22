# Image resmi: https://hub.docker.com/r/yllumi/wasender
FROM node:22-bookworm-slim

LABEL org.opencontainers.image.title="wasender" \
      org.opencontainers.image.description="Simple engine for sending message to WhatsApp" \
      org.opencontainers.image.source="https://github.com/yllumi/wasender" \
      org.opencontainers.image.url="https://hub.docker.com/r/yllumi/wasender" \
      org.opencontainers.image.licenses="ISC"

# Chromium + library yang dibutuhkan whatsapp-web.js / puppeteer
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      chromium \
      ca-certificates \
      fonts-liberation \
      libatk1.0-0 \
      libatk-bridge2.0-0 \
      libcups2 \
      libxkbcommon0 \
      libxcomposite1 \
      libxdamage1 \
      libxfixes3 \
      libxrandr2 \
      libgbm1 \
      libpango-1.0-0 \
      libcairo2 \
      libasound2 \
      libnss3 \
      libnspr4 \
      libdrm2 \
 && rm -rf /var/lib/apt/lists/*

# Pakai Chromium sistem (jangan unduh Chromium lagi saat npm install)
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    NODE_ENV=production

WORKDIR /app

# Layer terpisah: dependency di-cache selama package*.json tidak berubah
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . ./

ENV PORT=8090 \
    SESSION=default_session

EXPOSE 8090

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "require('http').get({host:'127.0.0.1',port:process.env.PORT||8090,path:'/'},r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD [ "node", "index.js" ]