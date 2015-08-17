//@todonext
//@todo determine public/private categorization
var FILEFINDER = '/.files';


var MessageHandler = function ( ) {
	this.attachedMessageFunctions  = { };		// the functions to call when you get a certain message type
	var files = require (process.env.HOME+FILEFINDER);
	this.MESSAGETYPES = require (files.messagetypes);
}


// returns the enumerated message type based upon message fields 

MessageHandler.prototype.getMessageType = function ( message ){	

	if ( ! this._isValidMessage (message) ){
		throw (new Error ("MESSAGE NOT DEFINED PROPERLY -- missing fields"));
	}
	// check to make sure all required topics are defined

	return this.MESSAGETYPES.idToMessageType[messageid];

}


MessageHandler.prototype.getMessageTypeList = function ( ){
	return ( {
		SERVER_MESSAGES: this.MESSAGETYPES.SERVER_MESSAGES,
		CLIENT_MESSAGES: this.MESSAGETYPES.CLIENT_MESSAGES
	});
}


// creates a message
// @return message
// used the fields defined in the topic, and creates a message of type messagetype 
// tries best to populate the message with fields from topic.  Uses default fields if not defined.  Throws exception if extraneous fields.

//@todo: code
MessageHandler.prototype.createMessage = function ( messagetypename, topicrequirements, type){
	if ( ! this._isValidMessageType(messagetype) ){
		throw (new Error ("MESSAGETYPE NOT VALID -- missing fields"));
	}

	var requiredFields = this.MESSAGETYPES.requirements[ messagetype ];

	
	var Message = { };

}



// feeds the handler a new message to process by the handler
MessageHandler.prototype.feedMessage = function ( inbound_message ){
	var messagetype = this.getMessageType ( inbound_message );
	var functions = this.attachedMessageFunctions[messagetype];

	for ( var i = 0 ; i < functions.length ; i++ ){
		var result = functions[i].func();
		functions[i].callback(result);
	}
}


// associate functions to the message type
MessageHandler.prototype.attachFunctionToMessageType = function ( messagetype, func , callback ){

	if ( this._isValidMessageType (messagetype ) ){
		throw (new Error ("Invalid Message Type -- cannot attach functionality"));
	}

	if (this.attachedMessageFunctions[messagetype] = undefined ){
		this.attachedMessageFunctions[messagetype] = new Array();
	}

	var funct = func;
	var callb = callback;
	for ( var i = 1; i < arguments.length ; i++ ){
		var obj = {
			func: funct,
			callback: callb
		};

		this.attachedMessageFunctions[messagetype].push(obj);
	}
}


// stop the message handler from calling functions for the message type, and disassociate the functionality
MessageHandler.prototype.clearAllAttachedFunctions  = function ( messagetype ){
	this.attachedMessageFunctions[messagetype] = undefined;
}



//////////////////////////////////////////////////////////////////



// this is not complete code yet
// checks fields in message to make sure all required fields are there
MessageHandler.prototype._isValidMessage = function ( message ) {


	// make sure main fields are defined
	if ( message.metadata == undefined || message.body == undefined || 
				message.messagename == undefined || message.type == undefined){
		return false;
	}

	// ensure all required metadata fields are defined
	for ( var i = 0 ; i < this.MESSAGETYPES.metadata.length ; i++ ){
		if (message.metadata[this.MESSAGETYPES.metadata[i] ] == undefined ){
			return false;
		}
	}

	if (this._isValidMessageType(message.messagename,message.type) == false){
		return false;
	}

	var type = message.type;
	if (type != 'client' && type !='server'){
		return false;
	}

	var accessor = type =='client'? 'CLIENT_MESSAGES': 'SERVER_MESSAGES';
 	var requirements  = this.MESSAGETYPES[accessor][message.messagename].requirements;
 	for (var i = 0 ; i < requirements.length ; i++ ){
 		if (message.body[requirements[i]] == undefined){
 			return false;
 		}
 	}

	return true;
}


MessageHandler.prototype._isValidMessageType = function ( messagename, type ) {
	if (type == 'client'){
		for (messagetype in this.MESSAGETYPES.CLIENT_MESSAGES){
			message=  this.MESSAGETYPES.CLIENT_MESSAGES[messagetype];
			if (messagename == message.messagename && type == message.type){
				return true;
			}
		}
	}else if (type =='server'){
		for (messagetype in this.MESSAGETYPES.SERVER_MESSAGES){
			message=  this.MESSAGETYPES.SERVER_MESSAGES[messagetype];
			if (messagename == message.messagename && type == message.type){
				return true;
			}
		}
	}
	return false;
}

module.exports = MessageHandler;

