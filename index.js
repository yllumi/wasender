const venom = require('venom-bot');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

var argv = require('minimist')(process.argv.slice(2));
var port = argv['p'] ?? argv['port'];
var session = argv['s'] ?? argv['session'];

if(!port) { console.log("Port not set.\nUse -p [portname] or --port=[portname]. \nexited."); return; }
if(!session) { console.log("Session not set.\nUse -s [session_name] or --session=[session_name]. \nexited."); return; }

// Init venom instance
venom
  .create({
    session: session,
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

// Callback for venom client
function start(client) {
  app.post('/send', upload.array(), function(req, res){
    client
      .sendText(req.body.to + '@c.us', req.body.message)
      .then((result) => {
        res.send('Sent');
      })
      .catch((erro) => {
        res.send('Error when sending:', erro);
      });
  });
}

app.get('/', function(req, res){
   res.send("WASender ready");
});

// Listen requests
console.log("Venom ready for session", session, "listening on port", port);
app.listen(port);
