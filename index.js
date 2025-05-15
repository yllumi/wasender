const qrcode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');
const socketIO = require('socket.io');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

const app = express();
const server = http.createServer(app, {allowEIO3: true});
const upload = multer();
const io = socketIO(server);

// Change this for antoher session
const port = process.env.PORT || 3000;
const session = process.env.SESSION || "default_session";
const webhookURL = process.env.WEBHOOK_URL || "";

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
var status = false;

const client = new Client({
  puppeteer: {
    executablePath: '/usr/bin/chromium-browser',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't works in Windows
      '--disable-gpu'
    ],
    headless: true
  },
  authStrategy: new LocalAuth({ clientId:session })
});

client.once('ready', () => {
  console.log('Client is ready!');
  status = true;

});

app.get('/', function(req, res){
 res.send("WASender ready");
});

app.get('/qr', function(req, res){
  res.sendFile('qr.html', { root: __dirname })
});

client.initialize();

// Kirim setiap pesan masuk ke endpoint webhook
client.on('message', message => {
  if (message.body === '!ping') {
    client.sendMessage(message.from, 'pong');
  }

  // Data dalam format form-urlencoded
  const postData = qs.stringify({
    from: message.from,
    body: message.body,
    timestamp: message.timestamp,
    id: message.id._serialized,
    type: message.type,
    isGroupMsg: message.from.endsWith('@g.us') ? '1' : '0',
  });

  axios.post(webhookURL, postData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).catch(err => {
    console.error('Gagal mengirim ke webhook:', err.message);
  });
});


// Socket.io
io.on('connection', function(socket){
  socket.emit('message','Connecting..');
  
  if(status == true)
    socket.emit('message', 'WhatsApp is ready!');

  client.on('authenticated', () => {
    socket.emit('message', 'WhatsApp is ready!');
  })

  client.on('qr', (qr) => {
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit('qr', url);
      socket.emit('message', 'Silakan scan qrcode');
    });
  });

  client.on('ready', () => {
    socket.emit('message', 'WhatsApp is ready!');
  })

})

app.post('/send', upload.array(), async function(req, res) {
  const number = req.body.to + '@c.us';
  const message = req.body.message;

  try {
    const chat = await client.getChatById(number);

    // Delay acak antara 2–5 detik
    let delay = Math.floor(Math.random() * (6000 - 3000 + 1)) + 3000;
    
    // Kirim status "typing..."
    await new Promise(resolve => setTimeout(resolve, delay));
    await chat.sendStateTyping();

    delay = Math.floor(Math.random() * (6000 - 3000 + 1)) + 3000;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Hapus status typing
    await chat.clearState();

    // Kirim pesan
    const response = await client.sendMessage(number, message);

    res.status(200).json({
      status: true,
      response: response
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      response: err.message || err
    });
  }
});


// Listen requests
server.listen(port, function(){
  var msg = `Preparing whatsapp-web on port ${port}, open http://ip_address:${port}/qr for login..`;
  console.log(msg);
});