module.exports = function BroadcastActions(wss){
  this.updatestate = function(req, res){
    wss.record = req.body.record;
    wss.playstop = req.body.playstop;
    if(req.body.song){ wss.song = req.body.song }
    // console.log(wss.record, wss.playstop);
    wss.broadcastState();
    res.end("OK");
  }

  this.updatesong = function(req, res){
    wss.song = req.body.song;
    wss.broadcastState();
    res.end("OK");
  }
};