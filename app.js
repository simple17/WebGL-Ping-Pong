var express = require('express');
var app = express();
var http = require("http");
var path = require('path');
var WebSocketServer = require('ws').Server;
var server = http.createServer(app);

var clientsState = {
};

var connections = [];

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/joystick', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/mobile-client.html'));
});

app.use(express.static('public'));


server.listen(3000, function(){
    console.log('test');
});

var wss = new WebSocketServer({server: server, path: "/client"});

wss.on("connection", function(w){
  var id = w.upgradeReq.headers['sec-websocket-key'];
  console.log('New Connection id :: ', id);

  w.on('message', function(msg){
    var id = w.upgradeReq.headers['sec-websocket-key'];
    var messageData = JSON.parse(msg);

    switch (messageData.type) {
      case 'setOrientation':
        if(typeof clientsState[messageData.clientId] !== 'undefined'){
          clientsState[messageData.clientId].orientation =  messageData.orientation;
        } else{
          clientsState[messageData.clientId] = messageData;
        }

        console.log('Message :: ', messageData.clientId, msg);
        break;
      case 'getStates':
        w.send(JSON.stringify(clientsState));
        break;
      default:

    }


    console.log('Message :: ', id, msg);
  });

  w.on('close', function() {
    var id = w.upgradeReq.headers['sec-websocket-key'];
    console.log('Closing :: ', id);
  });

  connections[id] = w;
});

// setInterval(function(){
//   console.log(views.length);
//   views.forEach(function(v){
//     // v.send(JSON.stringify(clientsState));
//   })
// },1000)
