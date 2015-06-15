var os = require('os');
var ifaces = os.networkInterfaces();

module.exports = function(){

  var temp = "(none)";

  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0
      ;

    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log("multiple ipv4 addresses:");
        temp = ifname + ':' + alias, iface.address;
      } else {
        // this interface has only one ipv4 adress
        console.log("only one address:");
        temp = iface.address;
      }
    });
  });

  return temp;
}