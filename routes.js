exports.previous = function(req, res){
  //TODO
  res.send("previous!");
}

exports.next = function(req, res){
  //TODO
  res.send("next!");
}

exports.playstop = function(req, res){
  //spacebar
  res.send("playstop!");
}

exports.record = function(req, res){
  //Ctrl+R
  res.send("record!");
}

exports.volumeDownKy = function(req, res){
  //to turn the click track down
  res.send("volume down ky!");
}

exports.volumeDownWy = function(req, res){
  res.send("volume down wylie!");
}

exports.volumeUpKy = function(req, res){
  res.send("volume up ky!");
}

exports.volumeUpWy = function(req, res){
  res.send("volume up wylie!");
}