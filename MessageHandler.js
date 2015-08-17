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
		throw (new Error ("MESSAGE NOT DEFINED PROPERLY "));
	}
	// check to make sure all required topics are defined

	return this.MESSAGETYPES.messagename;

}


//@todo -- genericize this to exclude certain fields, so we could add more fields if we wanted
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



// give the options to operate on the message
MessageHandler.prototype.getMessageBuilder  = function (messagetype){
	//figure out the type, and get the options you can set for it.

	/*
		flow should look like this:

		var builder = messagehandler.getMessageBuilder(MESSAGETYPE);
		var message = builder.setmode('on').setisslave(true).build();
				
	*/

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

MessageHandler.prototype.generateMetadata = function (){
	var metadata = this.MESSAGETYPES.metadata;

	var generatedMetadata =  { };
	for ( var i = 0 ; i < metadata.length ; i++ ){
		generatedMetadata[metadata[i]] =  this.MESSAGETYPES.createMetadata[metadata[i]]();
	}

	return generatedMetadata
}

//generates a message that contains elements common for every message
MessageHandler.prototype._generateGenericMessage = function (){
	var message =  { };
	message.messagename =  undefined;
	message.type = undefined;
	message.metadata = this.generateMetadata();
	message.body = { }
	return message;
}

MessageHandler.prototype._createMessage = function ( messagetypename, body, type){
	if (body == undefined){
		throw (new Error("Cannot create message without all required fields"));
	}

	if (type == undefined){
		type = 'server';
	}

	if ( ! this._isValidMessageType(messagetypename, type) ){
		throw (new Error ("MESSAGETYPE NOT VALID -- undefined"));
	}

	var message = this._generateGenericMessage();
	message.messagename = messagetypename;
	message.type = type;

	var accessor = (type == 'server') ? 'SERVER_MESSAGES' : 'CLIENT_MESSAGES';
	var requiredFields = this.MESSAGETYPES[accessor][messagetypename].requirements;

	for ( var i = 0 ; i < requiredFields.length ; i++ ){
		if (body[requiredFields[i]] == undefined){
			throw (new Error("Cannot create message without all required fields"));
		}

		message.body[requiredFields[i]] = body[requiredFields[i]];
	}
	return message;
}


module.exports = MessageHandler;

