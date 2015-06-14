var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;
var routes = require('./routes.js');
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use("/", express.static(__dirname + "/public"));

var server = http.createServer(app)
server.listen(port)
console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server});
console.log("websocket server created");

wss.on("connection", function(ws) {
  console.log("websocket connection open");

  ws.on("close", function() {
    console.log("websocket connection close");
  })
});

//set up the broadcast function
wss.broadcast = function(data){
  wss.clients.forEach(function(client){
      client.send(data);
  });
  console.log("broadcasted: " + data);
};

var song = "Queen - Don't Stop Me Now"; //initialize the song on first request
app.get('/song', function(req, res){
  res.send(JSON.stringify({ //only send as needed, no need to broadcast
    song: song
  }));
});

app.post('/song', function(req, res){
  song = req.body.song;
  wss.broadcast(JSON.stringify({
    song: song
  }));
  res.end("OK");
});

//the keyboard actions
app.get('/actions/previous', routes.previous);
app.get('/actions/next', routes.next);
app.get('/actions/playstop', routes.playstop);
app.get('/actions/record', routes.record);
app.get('/actions/volume-down/ky', routes.volumeDownKy);
app.get('/actions/volume-down/wy', routes.volumeDownWy);
app.get('/actions/volume-up/ky', routes.volumeUpKy);
app.get('/actions/volume-up/wy', routes.volumeUpWy);
