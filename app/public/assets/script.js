var state = { //global object to hold the client state, needs to be in sync with the server/Reaper
  record: "0",
  playstop: "0",
  song: ''
}
var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);
ws.onmessage = function (event) {
  state = JSON.parse(event.data);
  parseSong(state.song);
  calculateToggleStyling();
};

$(window).load(function(){
  calcStyling();
  calcTime();
  calcState();
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
  if(hour === 0){ hour = 12; }
  if(hour >=12){
    hour = hour === 12 ? 12 : hour - 12;
    denote = 'PM';
  }
  if(minute <= 9){
    minute = '0'+minute;
  }
  var str = hour + ':' + minute + ' ' + denote;
  $('.display-time').html(str);
  setTimeout(calcTime,1000);
}

function calcState(){
  $.get("/state", function(data){
    state = data;
    parseSong(state.song);
    calculateToggleStyling();
  })
}

function parseSong(song){
  var temp = song.split(' ');
  for(var i=0;i<temp.length;i++){
    if(temp[i].length>0){
      temp[i] = temp[i][0].toUpperCase() + temp[i].substr(1);
    }
  }
  $('.song-info').html(temp.join(' ').replace('-', '<span class="dash">-</span>'));
}

function calcActions(){
  var allObj = {
    "/actions/previous": '.action-backward',
    "/actions/next": '.action-forward',
    "/actions/playstop": '.action-play-stop',
    "/actions/record": '.action-record',
    "/actions/volume-down/ky": '.action-volume-down.volume-ky',
    "/actions/volume-up/ky": '.action-volume-up.volume-ky',
    "/actions/volume-down/wy": '.action-volume-down.volume-wy',
    "/actions/volume-up/wy": '.action-volume-up.volume-wy'
  }
  var all = $();
  state.record = "0"; //initialize these properties to 0 to treat it as a static variable. confusing to do this here, I know
  state.playstop = "0";
  $.each(allObj, function(key, val){  
    all = all.add(val); //set up the all selector
    function setupClickHandler(next, ignore){
      $(val).click(function(){
        if($(val).attr("disabled")) return; //dont do anything if button is currently disabled
        if(!ignore){ //used for the volume, dont want to ignore if pressed multiple times
          all.attr("disabled", "disabled");
          setTimeout(function(){ all.removeAttr("disabled") }, 300)
        }
        next();
      });
    }
    switch (val){
      case '.action-play-stop':
      case '.action-record':
        setupClickHandler(function(){
          if(state.record === "1"){ //if you hit record again while it's recording, then stop it/send a spacebar
            $.get("/actions/playstop", function(data){
              setAlert(data);
            });
          }else{
            $.get(key, function(data){
              setAlert(data);
            })
          }
        });
        break;
      case '.action-backward':
      case '.action-forward':
        setupClickHandler(function(){
          all.removeClass("active");    
          simulatePress(val);
          $.get(key, function(data){
            setAlert(data);
          });
        });
        break;
      default:
        setupClickHandler(function(){
          simulatePress(val); //don't need to remove everything else when pressing volume buttons
          $.get(key, function(data){
            setAlert(data);
          });
        }, true); //ignore the setting of disabled by setting 'ignore' to true
    }
  });
}

function simulatePress(val){
  var selector = $(val);
  selector.addClass("active");
  setTimeout(function(){
    selector.removeClass("active");
  }, 40);
}

function calculateToggleStyling(){
  if(state.playstop === "1"){ $('.action-play-stop').addClass("active") }
  else{ $('.action-play-stop').removeClass("active") }
  if(state.record === "1"){ $('.action-record').addClass("active") }
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
  $('.alert-info').html(text).fadeIn(400).delay(100).fadeOut(400);
}

function calcSubmit(){
  $('.submit-btn').click(function(){
    var info = {
      song: $('#song').val()
    };
    $('#song').val('');
    $.post("/actions/updatesong", info); //don't need a success callback since we'll be broadcasting the info using websockets
  });
}
