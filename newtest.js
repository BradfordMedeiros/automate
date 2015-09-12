 

var FILES = require(process.env.HOME+'/.files');


var messagehandler = (new (require(FILES.messagehandler))).getMessageHandlerInstance();

var router = function( message ){

	console.log('got message on network')
}

var network 	   = (new (require(FILES.abstractnetwork))(router));
// we call the function when we get message received
// and we can call network.sendMessage 

var devicestrapper = (new (require(FILES.devicestrapper)));


// then this will know what to do with incoming messges
// @todo **** var message_control  = require messagecontrol  -->  this will make forward messages
// to classes.  classes do not have to -- and shouldn't --know about messages.


module.exports = {
	network: network,
	messagehandler: messagehandler
}
