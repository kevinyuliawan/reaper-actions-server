var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;
var ClientActions = require('./ClientActions');
var BroadcastActions = require('./BroadcastActions');
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

wss.broadcastState = function(){
  wss.broadcast({
    song: wss.song,
    record: wss.record,
    playstop: wss.playstop
  });
}

//initialize the song and states on first request
//arbitrarily put it on the wss object so that that's the only thing we have to pass around
wss.song = "Queen - Don't Stop Me Now"; 
wss.record = wss.playstop = 0;
app.get('/state', function(req, res){
  res.send({
    song: wss.song,
    record: wss.record,
    playstop: wss.playstop
  });
});

var broadcastActions = new BroadcastActions(wss); //set up with the wss
var clientActions = new ClientActions(wss);

//the keyboard actions
app.get('/actions/previous', clientActions.previous);
app.get('/actions/next', clientActions.next);
app.get('/actions/playstop', clientActions.playstop);
app.get('/actions/record', clientActions.record);
app.get('/actions/volume-down/ky', clientActions.volumeDownKy);
app.get('/actions/volume-down/wy', clientActions.volumeDownWy);
app.get('/actions/volume-up/ky', clientActions.volumeUpKy);
app.get('/actions/volume-up/wy', clientActions.volumeUpWy);

app.post('/actions/updatestate', broadcastActions.updateState);
app.post('/actions/updatesong', broadcastActions.updatesong);
