
// BASIC ELEMENTARY TESTS
var FILEFINDER = '/.files.js';

var testsuite = new Array();
/////////TEST0/////////////////////////////////
var test0 = { };
test0.id = "MessageControl:  CLIENT: Client Device Init";
test0.func = function ( ){

	var mh =  require (require (process.env.HOME+FILEFINDER).messagehandler);
	var messagehandler = (new mh()).getMessageHandlerInstance();

	var messagetype = messagehandler.MESSAGETYPES.CLIENT_MESSAGES.CLIENT_DEVICE_INIT;
	var ds = require((require(process.env.HOME+FILEFINDER)).devicestrapper);
	var devicestrapper = new ds();

	var mcpath = (require(process.env.HOME+FILEFINDER)).messagecontrol;
	var message_control = (new (require(mcpath))(devicestrapper));


	var device_init_message = messagehandler.getMessageBuilder(messagetype).setSubscriptions(['temp','humidity']).setPublications(['width']).build();
	device_init_message.metadata.identifier = '192.158.32.244';
	device_init_message.metadata.network_interface = 'test_interface';
	messagehandler.feedMessage(device_init_message);
	messagehandler.feedMessage(device_init_message);
	messagehandler.feedMessage(device_init_message);

	var devices = devicestrapper.devices;
	var answer = { 
		'192.158.32.244': { identifier: '192.158.32.244',
     						network_interface: 'test_interface',
     						subscriptions: [ 'temp', 'humidity' ],
     						publications: [ 'width' ] 
     					  }
 	}
 	var _ = require('underscore');
 	return (_.isEqual(answer,devices));
}

test0.answer = true;
testsuite.push(test0);

/////////TEST1/////////////////////////////////
var test1 = { };
test1.id = "MessageControl:  CLIENT: Client Topic Update";
test1.func = function ( ){

	return false;
}

test1.answer = true;
testsuite.push(test1);

/////////TEST2/////////////////////////////////
var test2 = { };
test2.id = "MessageControl:  CLIENT: Client Status";
test2.func = function ( ){

	return false;
}

test2.answer = true;
testsuite.push(test2);

/////////TEST3////////////////////////////////
var test3 = { };
test3.id = "MessageControl:  CLIENT: Service Request";
test3.func = function ( ){

	return false;
}

test3.answer = true;
testsuite.push(test3);





module.exports = testsuite;


