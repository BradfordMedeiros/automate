 

var FILES = require(process.env.HOME+'/.files');


var messagehandler = (new (require(FILES.messagehandler))).getMessageHandlerInstance();


var network 	   = (new (require(FILES.abstractnetwork))(function(){},false,true,true));
var devicestrapper = (new (require(FILES.devicestrapper)));

messagename = messagehandler.MESSAGETYPES.CLIENT_MESSAGES.CLIENT_DEVICE_INIT;
message = messagehandler.getMessageBuilder(messagename, 'client').build();
//message.metadata.identifier = 'http://localhost';
//message.metadata.network_interface = 'internet';

//console.log(messagehandler.feedMessage)

var a = {
	net : network,
	message : message,
	config : {
		network_interface : 'internet',
		identifier  : 'http://localhost'
	}
}

//network.sendMessage(a.message, a.config);
module.exports = a;


