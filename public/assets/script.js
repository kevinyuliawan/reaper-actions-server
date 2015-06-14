var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);
ws.onmessage = function (event) {
  parseSong(JSON.parse(event.data).song);
};

$(window).load(function(){
  calcStyling();
  calcTime();
  calcSong();
  calcActions();
  calcSubmit();
  $(window).resize(function(){
    calcStyling();
  });
});

function calcStyling(){
  var cur = $('.action').width();
  $('.action').height(cur);
  $('.fa').css({
    'line-height':cur+'px'
  });
  $('.display-time').css({
    'line-height':cur+25+'px' //+25 for padding and border
  });
}

function calcTime(){
  var now = new Date();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var denote = 'AM';
  if(hour >=13){
    hour = hour - 12;
    denote = 'PM';
  }
  if(minute <= 9){
    minute = '0'+minute;
  }
  var str = hour + ':' + minute + ' ' + denote;
  $('.display-time').html(str);
  setTimeout(calcTime,1000);
}

function calcSong(){
  $.get("/song", function(data){
    parseSong(JSON.parse(data).song);
  });
}

function parseSong(song){
  var temp = song.split(' ');
  for(var i=0;i<temp.length;i++){
    temp[i] = temp[i][0].toUpperCase() + temp[i].substr(1);
  }
  $('.song-info').html(temp.join(' '));
}

function calcActions(){
  var allObj = {
    "/actions/previous": '.action-backward',
    "/actions/next": '.action-forward',
    "/actions/playstop": '.action-play-stop',
    "/actions/record": '.action-record'
  }
  var all = $();
  simulateToggle.record = 0; //initialize these property to 0 to treat it as a static variable. confusing to do this here, I know
  simulateToggle.playstop = 0;
  $.each(allObj, function(key, val){  
    var valSelector = $(val);
    all = all.add(val); //set up the all selector
    switch (val){
      case '.action-play-stop':
      case '.action-record':
        valSelector.click(function(){
          if(simulateToggle.record === 1){ //if you hit record again while it's recording, then stop it/send a spacebar
            $.get("/actions/playstop", function(data){
              setAlert(data);
            });
          }else{
            $.get(key, function(data){
              setAlert(data);
            })
          }
          simulateToggle(val);
          calculateToggleStyling();
        });
        break;
      default:
        valSelector.click(function(){ //set up the click handlers
          simulateToggle.record = 0; //reset these in case previous/next is being called while it was recording
          simulateToggle.playstop = 0;
          calculateToggleStyling();
          all.removeClass("active");
          simulatePress(valSelector);
          $.get(key, function(data){
            setAlert(data);
          });
        });
    }
  });
}

function simulatePress(selector){
  selector.addClass("active");
  setTimeout(function(){
    selector.removeClass("active");
  }, 40);
}

function simulateToggle(val){ //use the string for easier comparison and so we only have to run a jQuery selector once
  var self = simulateToggle;
  if(val === '.action-record'){
    if(self.record === 0 && self.playstop === 0){ 
      self.record = 1; self.playstop = 1;
    }
    else if(self.record === 0 && self.playstop === 1){
      self.record = 1; self.playstop = 1;
    }
    else if(self.record === 1 && self.playstop === 0){ //not possible

    }
    else if(self.record === 1 && self.playstop === 1){
      self.record = 0; self.playstop = 0;
    } 
  }else{
    if(self.playstop === 0 && self.record === 0){
      self.playstop = 1; self.record = 0;
    }
    else if(self.playstop === 0 && self.record === 1){ //not possible
    }
    else if(self.playstop === 1 && self.record === 0){
      self.playstop = 0; 
    }
    else if(self.playstop === 1 && self.record === 1){
      self.playstop = 0; self.record = 0;
    }
  }
}

function calculateToggleStyling(){
  var self = simulateToggle;
  if(self.playstop === 1){ $('.action-play-stop').addClass("active") }
  else{ $('.action-play-stop').removeClass("active") }
  if(self.record === 1){ $('.action-record').addClass("active") }
  else{ $('.action-record').removeClass("active") }
  updatePlayStop();
}

function updatePlayStop(){
  var cur = $('.action-play-stop');
  if (cur.hasClass("active")){
    cur.html('<i class="fa fa-stop fa-3x"></i>');
  }else{
    cur.html('<i class="fa fa-play fa-3x"></i>');
  }
  calcStyling();
}

function setAlert(text){
  $('.alert-info').html(text).fadeIn(400).delay(400).fadeOut(400);
}

function calcSubmit(){
  $('.submit-btn').click(function(){
    var info = {
      song: $('#song').val()
    };
    $('#song').val('');
    $.post("/song", info); //don't need a success callback since we'll be broadcasting the info using websockets
  });
}
