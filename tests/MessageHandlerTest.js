
// BASIC ELEMENTARY TESTS
var FILEFINDER = '/.files';

var testsuite = new Array();
/////////TEST0/////////////////////////////////
var test0 = { };
test0.id = "MessageHandler: _isValidMessageType";
test0.func = function ( ){

	mh =  require (require (process.env.HOME+FILEFINDER).messagehandler);
	messagehandler = new mh();
	
	var isvalid = true;
	for (message in messagehandler.MESSAGETYPES){
		var message_groups = messagehandler.MESSAGETYPES[message];
		if (message == 'SERVER_MESSAGES' || message =='CLIENT_MESSAGES'){
			for (message in message_groups){
				var message = message_groups[message];
				isvalid = isvalid && messagehandler._isValidMessageType(message.messagename, message.type);
			}
		}
	}

	var messagename = 'googly';
	var type = 'ohno';
	isvalid = isvalid && (!messagehandler._isValidMessageType(messagename,type));

	return isvalid;
}

test0.answer = true;
testsuite.push(test0);

/////////TEST1////////////////////////////////
var test1 = { };
test1.id = "MessageHandler: _isValidMessage";
test1.func = function ( ){
	mh =  require (require (process.env.HOME+FILEFINDER).messagehandler);
	messagehandler = new mh();

	message1 = {
		messagename:  'CLIENT_STATUS',
		type: 'client',
		metadata:{
			timestamp: '1020'
		},
		body: {
			'mode': 'good',
			'ready': true,
			'isSlave': true
		}
	}

	message2 = {
		messagename:  'CLIENT_STATUS',
		type: 'client',
		metadata:{
			timestamp: '1020'
		},
		body: {
			'mode': 'good',
			'ready': true,
		}
	}

	var m1pass = messagehandler._isValidMessage(message1);
	var m2pass = !messagehandler._isValidMessage(message2)
	return m1pass && m2pass;
}

test1.answer = true;
testsuite.push(test1);


/////////TEST2////////////////////////////////
var test2 = { };
test2.id = "MessageHandler: _isValidMessage";
test2.func = function ( ){
	mh =  require (require (process.env.HOME+FILEFINDER).messagehandler);
	messagehandler = new mh();
	messagehandler.createMessage (messagehandler.MESSAGETYPES.SERVER_MESSAGES.SERVER_STATUS.messagename,{
		mode: 'enabled'
	});
	return false;
}

test2.answer = false;
testsuite.push(test2);


module.exports = testsuite;