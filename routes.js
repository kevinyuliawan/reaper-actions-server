exports.song = function(req, res){
  console.log(req);
  res.json({
    song: req.body.song
  })
}