this.wss = false;

exports.setup = function(temp){
  this.wss = temp;
  var cur = this.wss;
  cur.on("connection", function(ws) {
    console.log("websocket connection open");

    ws.on("close", function() {
      console.log("websocket connection close");
    })
  });

  //set up the broadcast function
  cur.broadcast = function(data){
    cur.clients.forEach(function(client){
        client.send(data);
    });
    console.log("broadcasted: " + data);
  };
  return cur;
}

exports.get = function(){
  return this.wss;
}