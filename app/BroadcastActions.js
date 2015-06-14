module.exports = function BroadcastActions(wss){
  this.playstop = function(req, res){

  }

  this.record = function(req, res){

  }

  this.updatesong = function(req, res){
    wss.song = req.body.song;
    wss.broadcast(JSON.stringify({
      song: wss.song
    }));
    res.end("OK");
  }
};