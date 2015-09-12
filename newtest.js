 

var FILES = require(process.env.HOME+'/.files');


var messagehandler = (new (require(FILES.messagehandler))).getMessageHandlerInstance();

var router = function( message ){
	if ( message.type == 'client' && message.messagename == 'DEVICE_INIT_SETUP'){
		console.log("got init");
	}

	console.log('got message')
}

var network 	   = (new (require(FILES.abstractnetwork))(router));
//network.deload_network_interfaces();

var devicestrapper = (new (require(FILES.devicestrapper)));
//var devicestrapper_router = new etc(devicestrapper).
messagehandler.attachFunctionsToMessageType(DEVICEINIT, devicestrapper.incomingMessage)

module.exports = {
	network: network,
	messagehandler: messagehandler
}
