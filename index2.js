const qrcode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');
const socketIO = require('socket.io');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const server = http.createServer(app, {allowEIO3: true});
const upload = multer();
const io = socketIO(server);

const port = 8091;
const session = "client2";

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const client = new Client({
  puppeteer: {
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

client.on('ready', () => {
  console.log('Client is ready!');

});

app.get('/', function(req, res){
 res.send("WASender ready");
});

app.get('/qr', function(req, res){
  res.sendFile('qr.html', { root: __dirname })
});

client.initialize();

// Socket.io
io.on('connection', function(socket){
  socket.emit('message','Connecting..');

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

app.post('/send', upload.array(), function(req, res){
  client.sendMessage(req.body.to + '@c.us', req.body.message)
  .then(response => {
    res.status(200).json({
      status: true,
      response: response
    })
  })
  .catch(err => {
    res.status(500).json({
      status: false,
      response: err
    })
  })
});

// Listen requests
server.listen(port, function(){
  console.log("Preparing whatsapp-web on port", port, "waiting for WhatsApp Web client..");
});