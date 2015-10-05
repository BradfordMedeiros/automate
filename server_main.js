 

var FILES = require(process.env.HOME+'/.files');
var messaging = require (FILES.messaging);
var network = require (FILES.network);
console.log(network)

process.title = 'automate';

var messagehandler = messaging.message_handler.getMessageHandlerInstance();


var feed_message_to_mh = messagehandler.feedMessage.bind(messagehandler);
var inbound_on = true;
var outbound_on = true;
var enabled_interfaces = ['internet']; // this interface must be supported in abstractNetworkClass

var network 	   = new network.abstract_network(feed_message_to_mh, enabled_interfaces, inbound_on, outbound_on);
// we call the function when we get message received
// and we can call network.sendMessage 

var devicestrapper = (new (require(FILES.devicestrapper)));
var message_router = new (require(FILES.message_router))(devicestrapper,network);


// then this will know what to do with incoming messges
// @todo **** var message_control  = require messagecontrol  -->  this will make forward messages
// to classes.  classes do not have to -- and shouldn't --know about messag,networke.


module.exports = {
	network: network,
	messagehandler: messagehandler,
	devicestrapper: devicestrapper
};
