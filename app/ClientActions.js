var exec = require('child_process').exec;
var config = require('./config.js');
var windowID = 'unfilled';
var foundWin32 = false;

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
    var findWindow = __dirname + '\\findWindow.py "'+config.programName+'"';
    //make the key call a function since the window can change
    function key(foundWin32, command){ return __dirname + '\\key.py "'+foundWin32+'" '+command; }
    //call findWindow everytime, it's a little inefficient but sometimes REAPER will change the window title e.g. if the track is modified
    exec(findWindow, function(error, stdout){
      if(error != null){ console.log("uh oh...", error); }
      else{
        foundWin32 = stdout.trim();
        exec(key(foundWin32,command), function(error, stdout){
          if(error!=null){ console.log("uhh ohh...", error); }
          else{ console.log("done"); }
        });
      }
    });
    
  }
  else{ //Send to preset window under other (linux) systems
    exec('xdotool key --window ' + windowID + ' --delay ' + config.delay + ' ' + key);
  }
}

module.exports = function ClientActions(wss){
  this.previous = function(req, res){
    res.send("previous!");
    sendKey("previous");
    wss.record = wss.playstop = 0;
    wss.broadcastState();
  }

  this.next = function(req, res){
    res.send("next!");
    sendKey("next");
    wss.record = wss.playstop = 0;
    wss.broadcastState();
  }

  this.playstop = function(req, res){
    //spacebar
    res.send("playstop!");
    sendKey("playstop");
    if(wss.playstop === 0 && wss.record === 0){
      wss.playstop = 1; wss.record = 0;
    }
    else if(wss.playstop === 0 && wss.record === 1){ //not possible
    }
    else if(wss.playstop === 1 && wss.record === 0){
      wss.playstop = 0; 
    }
    else if(wss.playstop === 1 && wss.record === 1){
      wss.playstop = 0; wss.record = 0;
    }
    wss.broadcastState();
  }

  this.record = function(req, res){
    //Ctrl+R
    res.send("record!");
    sendKey("record");
    if(wss.record === 0 && wss.playstop === 0){ 
      wss.record = 1; wss.playstop = 1;
    }
    else if(wss.record === 0 && wss.playstop === 1){
      wss.record = 1; wss.playstop = 1;
    }
    else if(wss.record === 1 && wss.playstop === 0){ //not possible

    }
    else if(wss.record === 1 && wss.playstop === 1){
      wss.record = 0; wss.playstop = 0;
    }
    wss.broadcastState();
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