
var FILEFINDER = '/.files';
var assert = require("assert");

describe ("MessageHandler.js test",function (){
	mh =  require (require (process.env.HOME+FILEFINDER).messagehandler);
	messagehandler = (new mh()).getMessageHandlerInstance();

	it ("valid message type function - checks if message type specified is a real message type", function ( ){
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
		assert.equal( isvalid, true );
	});

	it ("valid message function - checks if certain message is a valid message format" , function ( ){
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
		assert.equal(m1pass,true);
		assert.equal(m2pass,true);
	});

	it ("create message function - sanity check for some functionality", function () {
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
		assert.equal(diderror, true);
	});

	it ("message builder check", function(){
		var messagetypes = messagehandler.getMessageTypeList();
		var correct = true;
		var count = 0;
		for (messageSource in messagetypes){
			for (messageType in messagetypes[messageSource]){
				var messagename = messagetypes[messageSource][messageType].messagename;
				var messagetype = messagetypes[messageSource][messageType].type;
				var builder = messagehandler.getMessageBuilder(messagetypes[messageSource][messageType]);
			
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
	});

	it ("attaching functions/as array, statefulness, feeding message", function(){
		var messagehandler = (new mh()).getMessageHandlerInstance();
		var messagetypes = messagehandler.getMessageTypeList();
		var count = 0;

		var cb = function(Y){
			count = count +1;
		}

		var message  = messagehandler.getMessageBuilder(messagetypes.SERVER_MESSAGES.SERVER_STATUS).build();
		messagehandler.attachFunctionToMessageType (messagetypes.SERVER_MESSAGES.SERVER_STATUS, cb)
		messagehandler.attachFunctionToMessageType (messagetypes.SERVER_MESSAGES.SERVER_STATUS, cb)
		messagehandler.attachFunctionToMessageType (messagetypes.SERVER_MESSAGES.SERVER_STATUS, cb,cb)
		messagehandler.feedMessage(message);
		messagehandler.clearAttachedFunctionsForMessageType(message);
		messagehandler.feedMessage(message);
		assert.equal(count,4);
	});

});