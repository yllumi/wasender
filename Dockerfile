FROM node:16

WORKDIR /app
#RUN apk add --no-cache chromium 
#--repository=http://dl-cdn.alpinelinux.org/alpine/v3.10/main

COPY . ./

RUN npm ci --only=production

EXPOSE 8090

CMD [ "node", "index.js" ]