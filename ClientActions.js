var exec = require('child_process').exec;
var config = require('./config.js');
var windowID = 'unfilled';

function setWindowID() {
    if (config.os === 'other' && windowID === 'unfilled') {
        exec('xdotool search --onlyvisible --name ' + config.programName, function(error, stdout) {
            windowID = stdout.trim();
            // console.log(key, windowID);
        });
    }
}

setWindowID();

function sendKey(command) {
  if(config.os === "macintosh"){ //mac: use cliclick
    exec('cliclick ' + config.commands.macintosh[command]);
  }
  else if(config.os === "windows"){ //windows: use key.py
    exec('key.py' + '  ' + config.programName + ' ' + key);
  }
  else{ //Send to preset window under other (linux) systems
    exec('xdotool key --window ' + windowID + ' --delay ' + config.delay + ' ' + key);
  }
}

module.exports = function ClientActions(wss){
  this.previous = function(req, res){
    res.send("previous!");
    sendKey("previous");
  }

  this.next = function(req, res){
    res.send("next!");
    sendKey("next");
  }

  this.playstop = function(req, res){
    //spacebar
    res.send("playstop!");
    sendKey("playstop");
  }

  this.record = function(req, res){
    //Ctrl+R
    res.send("record!");
    sendKey("record");
  }

  this.volumeDownKy = function(req, res){
    //to turn the click track down
    res.send("volume down ky!");
    sendKey("volumeDownKy");
  }

  this.volumeDownWy = function(req, res){
    res.send("volume down wylie!");
    sendKey("volumeDownWy");
  }

  this.volumeUpKy = function(req, res){
    res.send("volume up ky!");
    sendKey("volumeUpKy");
  }

  this.volumeUpWy = function(req, res){
    res.send("volume up wylie!");
    sendKey("volumeUpWy");
  }
}