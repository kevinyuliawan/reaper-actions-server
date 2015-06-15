var twilio = require('twilio');

function Twilio(){
  var accountId = "xxx";
  var authToken = "xxx";
  var twilioNumber = "xxx";
  var ky = "xxx";
  var wy = "xxx";
  var client = new twilio.RestClient(accountId, authToken);

  function sendMessage(toNumber, content){
    client.sendSms({
      to: toNumber,
      from: twilioNumber,
      body: content
    }, function(error, message){
      if(error){
        console.log("Oops from Twilio:", error);
      }else{
        console.log("Message sent to " + toNumber);
        // console.log('Success! The SID for this SMS message is:');
        // console.log(message.sid);
        // console.log('Message sent on:');
        // console.log(message.dateCreated);
      }
    })
  }

  this.sendMessages = function(address){
    var content = "Open the following link in your browser: " + address
    sendMessage(ky,content+"/ky");
    sendMessage(wy,content+"/wy");
  }
}


module.exports = Twilio;