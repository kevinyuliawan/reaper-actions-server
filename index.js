var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;
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
wss.broadcast = function broadcast(data){
  wss.clients.forEach(function each(client){
      client.send(data);
  });
  console.log("broadcasted: " + data);
};

app.post('/song', function(req, res){
  wss.broadcast(JSON.stringify({
    song: req.body.song
  }));
  res.end("OK");
});
