var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var app = express();
var Address = require("./Address");
var port = process.env.PORT || 5000;
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

//redirect root directory to public folder
app.use("/", express.static(__dirname + "/public"));

//start the http server, log the address
var server = http.createServer(app)
server.listen(port)
console.log("http server listening on %d", port)
var address = "http://"+Address()+":"+port
console.log(address);

//sms the server addresses to Ky and Wy
var TwilioWrapper = require("./TwilioWrapper");
//new TwilioWrapper().sendMessages(address);

//start up the websocket server
var wss = new WebSocketServer({server: server});
//initialize values
wss.song = "Third Eye Blind - Semi-Charmed Life [+0 G]"; 
wss.record = wss.playstop = "0";
wss.on("connection", function(ws) {
  console.log("websocket connection open");
  ws.send(JSON.stringify({ //send the current state
    song: wss.song,
    record: wss.record,
    playstop: wss.playstop
  }));

  ws.on("close", function() {
    console.log("websocket connection close");
  });
});

//set up the broadcast function
wss.broadcast = function(data){
  wss.clients.forEach(function(client){
      client.send(data);
  });
  console.log("broadcasted: " + data);
};

wss.broadcastState = function(){
  wss.broadcast(JSON.stringify({
    song: wss.song,
    record: wss.record,
    playstop: wss.playstop
  }));
}

var CA = require('./ClientActions');
var BA = require('./BroadcastActions');
var broadcastActions = new BA(wss); //set up with the wss
var clientActions = new CA(wss);

//the keyboard actions
app.get('/actions/previous', clientActions.previous);
app.get('/actions/next', clientActions.next);
app.get('/actions/playstop', clientActions.playstop);
app.get('/actions/record', clientActions.record);
app.get('/actions/volume-down/ky', clientActions.volumeDownKy);
app.get('/actions/volume-down/wy', clientActions.volumeDownWy);
app.get('/actions/volume-up/ky', clientActions.volumeUpKy);
app.get('/actions/volume-up/wy', clientActions.volumeUpWy);

//updates from Reaper
app.post('/actions/updatestate', broadcastActions.updatestate);
app.post('/actions/updatesong', broadcastActions.updatesong);