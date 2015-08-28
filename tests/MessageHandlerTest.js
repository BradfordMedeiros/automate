
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
			'timestamp': '1020',
			'identifier':'unspecified',
			'network_interface':'unspecified'
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
			timestamp: '1020',
			'identifier':'unspecified',
			'network_interface':'unspecified'
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
	/*
	newmessage = messagehandler._createMessage (messagehandler.MESSAGETYPES.SERVER_MESSAGES.SERVER_STATUS.messagename,{
		mode: 'enabled'
	});
	validmessage = messagehandler._isValidMessageType(newmessage.messagename,newmessage.type);
	newmessage.type = 'client';
	validafterchange = messagehandler._isValidMessageType(newmessage.messagename,newmessage.type)

*/	diderror = false;
	try {
		//messagehandler._createMessage(messagehandler.MESSAGETYPES.SERVER_MESSAGES.SERVER_STATUS.messagename, {
		//	forgotfield: 'woops'
		//})
	}catch(error){
		diderror = true;
	}
	return (true);
}

test2.answer = true;
testsuite.push(test2);


/////////TEST2////////////////////////////////
var test3 = { };
test3.id = "MessageHandler: _builder --> makes builder, calls functions, makes message, checks if valid";
test3.func = function ( ){
	mh =  require (require (process.env.HOME+FILEFINDER).messagehandler);
	messagehandler = new mh();

	var messagetypes = messagehandler.getMessageTypeList();
	var correct = true;

	var count = 0;
	for (messageSource in messagetypes){
		for (messageType in messagetypes[messageSource]){
			var messagename = messagetypes[messageSource][messageType].messagename;
			var messagetype = messagetypes[messageSource][messageType].type;
			var builder = messagehandler.getMessageBuilder(messagename, messagetype);
			
			for (element in builder){
				if (typeof (builder[element]) == 'function'){
					builder[element](count);
					count = count + 1;
				}
			}

			var genMessage = builder.build();
		    var parameters = genMessage.body;
			var requirements = messagetypes[messageSource][messageType].requirements;

			var genMessage = builder.build();
			if (!messagehandler._isValidMessage(genMessage)){
				correct = false;
			}

			for (element in parameters){
				if (requirements.indexOf(element) < 0) {
					correct = false;
				}
			}

		}
	}
	return correct;
}

test3.answer = true;
testsuite.push(test3);


/////////TEST4////////////////////////////////
var test4 = { };
test4.id =  "MessageHandler: attaching functions/as array, statefullness, feeding message";
test4.func = function (){
	mh =  require (require (process.env.HOME+FILEFINDER).messagehandler);
	var messagehandler = new mh();
	var messagetypes = messagehandler.getMessageTypeList();

	
	var count = 0;

	var cb = function(Y){
		count = count +1;
	}

	var message  = messagehandler.getMessageBuilder(messagetypes.SERVER_MESSAGES.SERVER_STATUS.messagename).build();
	messagehandler.attachFunctionToMessageType (messagetypes.SERVER_MESSAGES.SERVER_STATUS.id
		,cb)
	messagehandler.attachFunctionToMessageType (messagetypes.SERVER_MESSAGES.SERVER_STATUS.id
		,cb)
	messagehandler.attachFunctionToMessageType (messagetypes.SERVER_MESSAGES.SERVER_STATUS.id
		,cb,cb)
	messagehandler.feedMessage(message);
	messagehandler.clearAttachedFunctionsForMessageType(message.id);
	messagehandler.feedMessage(message);

	return (count == 4)
}

test4.answer = true;
testsuite.push(test4);

module.exports = testsuite;


/////////TEST5////////////////////////////////
