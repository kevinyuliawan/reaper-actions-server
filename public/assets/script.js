// var host = location.origin.replace(/^http/, 'ws')
//       var ws = new WebSocket(host);
//       ws.onmessage = function (event) {
//         var li = document.createElement('li');
//         li.innerHTML = JSON.parse(event.data);
//         document.querySelector('#pings').appendChild(li);
//       };

      $(window).load(function(){
        calcStyling();
        calcTime();
        calcBtn();
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

      function calcBtn(){
        $('.submit-btn').click(function(){
          var info = {
            song: $('#song').val()
          };

          $.post("/song", info, function(data){
            var temp = data.song.split(' ');
            for(var i=0;i<temp.length;i++){
              temp[i] = temp[i][0].toUpperCase() + temp[i].substr(1);
            }
            $('.song-info').html(temp.join(' '));
          })
        });
      }
