# WASender

Simple engine for sending message to WhatsApp using nodejs module [whatsapp-web.js](https://wwebjs.dev/)

## Installation

You need to install nodejs and all dependencies (this is sample for ubuntu 20.04):

```
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install libatk1.0-0 libatk-bridge2.0-0 libcups2 libxkbcommon-x11-0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2
```

Then run this command:

```
npm install
```

## Running

Run this command from root of project:

```
node index.js
```

You can use any port number and session name inside file.
Once you logged in you can restart application without need to scan again, except if you remove device from WhatsApp application.

## Login WhatsApp

Before sending, we have to login first to WhatsApp Web by scanning QRCode in this page: 

`http://localhost:3001/qr`


## Sending Message

To send message, simply send request to this endpoint:

`http://localhost:3001/send`

with payload `to` and `message`. You can simulate it using Postman.
`to` field must begin with country code, i.e. 62864095xxxx.

## Credits

- whatsapp-web.js (https://wwebjs.dev/)
- ExpressJS

## Install as Service

Using PM2 we can run WASender as service. Install PM2 then run this command:

```
pm2 start index.js --cron-restart="0 * * * *"
```

## Troubleshooting

### Error: listen EADDRINUSE: address already in use :::3001

`killall -9 node`