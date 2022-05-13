# WASender

Simple engine for sending message to WhatsApp using nodejs module [Venom](https://github.com/orkestral/venom)

## Installation

You need to install nodejs (and also npm ofcourse) and run this command:

```
npm install
```

## Running

Run this command from root of project:

```
node index.js -p 3001 -s toharyan
```

or

```
node index.js --port=3001 --session=toharyan
```

You can use any port number and session name. Use different port and session name for each WhatsApp number.
For the first time you will need to scan qrcode provided in terminal to log in to whatsapp device.
Once you logged in you can restart application without need to scan again, except if you remove device from WhatsApp application.

## Sending Message

To send message, simply send request to this endpoint:

`http://localhost:3001/send`

with post data `to` and `message`. You can simulate it using Postman.

## Credits

- Venom (https://github.com/orkestral/venom)
- ExpressJS

## Install as Service

Using PM2 we can run WASender as service. Install PM2 then run this command:

```
pm2 start index.js --cron-restart="0 * * * *" -- -p 3000 -s project
```
