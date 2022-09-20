FROM node:16

WORKDIR /app
#RUN apk add --no-cache chromium 
#--repository=http://dl-cdn.alpinelinux.org/alpine/v3.10/main

RUN apt-get install libatk1.0-0 libatk-bridge2.0-0 libcups2 libxkbcommon-x11-0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2

COPY . ./

RUN npm ci --only=production

EXPOSE 8090

CMD [ "node", "index.js" ]