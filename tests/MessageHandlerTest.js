
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
test2.id = "MessageHandler: _createMessage";
test2.func = function ( ){
	mh =  require (require (process.env.HOME+FILEFINDER).messagehandler);
	messagehandler = new mh();
	
	newmessage = messagehandler._createMessage (messagehandler.MESSAGETYPES.SERVER_MESSAGES.SERVER_STATUS.messagename,{
		mode: 'enabled'
	});
	validmessage = messagehandler._isValidMessageType(newmessage.messagename,newmessage.type);
	newmessage.type = 'client';
	validafterchange = messagehandler._isValidMessageType(newmessage.messagename,newmessage.type)

	diderror = false;
	try {
		messagehandler._createMessage(messagehandler.MESSAGETYPES.SERVER_MESSAGES.SERVER_STATUS.messagename, {
			forgotfield: 'woops'
		})
	}catch(error){
		diderror = true;
	}
	return (validmessage && !validafterchange && diderror );
}

test2.answer = true;
testsuite.push(test2);


/////////TEST2////////////////////////////////
var test3 = { };
test3.id = "MessageHandler: _builder";
test3.func = function ( ){
	mh =  require (require (process.env.HOME+FILEFINDER).messagehandler);
	messagehandler = new mh();

	var messagetypes = messagehandler.getMessageTypeList();

	for (messageSource in messagetypes){
		for (messageType in messagetypes[messageSource]){
			var messagename = messagetypes[messageSource][messageType].messagename;
			var messagetype = messagetypes[messageSource][messageType].type;
			var genMessage = messagehandler.getMessageBuilder(messagename, messagetype).build();
			// need to write code to make sure setMode, etc. works
			// and save sand compare.
		}
	}
	//var message = builder.setMode('one').setMode('test mode').build();
	//console.log(messagetypes);


		

	return false;
}





test3.answer = true;
testsuite.push(test3);

module.exports = testsuite;