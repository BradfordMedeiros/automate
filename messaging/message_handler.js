//@todonext
//@todo determine public/private categorizationo
// Should add encrypter in this file.
// MessageHandler ( EncryptionStrategy )
// encryption.encrypt ( message )  -->  .build () --> encrypted_message = encrypt(message); return encrypted_message

// notes: -- create default message with DEFAULT_MESSAGE -= 'default',etc
// make it so it just has blank values for all default fields.  -1, null, etc.
// finish making .func1().func2(), build();
// need to do chaining, 

//* This is a singleton.  We will only have one of these.  Instantiate a new one
// when you want the global


var DEFAULT_MESSAGE = 'default';


/**
	Used to build messages.  Users only access the public portion of the builder.
**/
var _builder = function( MessageHandler, messagetype , type ){

	if (type === undefined ){
		type = 'server';
	}


	var that = this;
	this.message = MessageHandler._createMessage (messagetype, DEFAULT_MESSAGE, type);

	this._public = {
		build: function (){
			return that.message;
		}
	}
};



/**
	private method for the message_handler to access the builder.  
**/
_builder.prototype._getBuilder = function  () {
	return this._public;
};


//  note:  return values are ignored
_builder.prototype._addFunctions = function  ( functionames, functions ){
	for (var i = 0 ; i < functions.length ; i++ ){
		this._public[functionames[i]] = functions[i];	// REMOVE
	}
};


_builder.prototype.build = function (){
	return this.message;
};


var message_handler_instance = undefined;	
var getInstance = function (){
	if ( message_handler_instance === undefined ){
		message_handler_instance = new MessageHandler;
	}
	return message_handler_instance;
};


var MessageFactory = function (){ };

MessageFactory.prototype.getMessageHandlerInstance = function(){
	 return getInstance();
};

var MessageHandler = function ( ) {
	if (message_handler_instance === undefined){
		instance = this;
	}else{
		throw (new Error("only one instance of message handler can exist, use MessageFactory to retrieve the instance"));
	}

	this.attachedMessageFunctions  = { };		// the functions to call when you get a certain message type
	this.MESSAGETYPES = require ("./message_types.js");
};



// returns the enumerated message type based upon message fields 
MessageHandler.prototype.getMessageType = function ( message ){	

	if ( ! this._isValidMessage (message) ){
		throw (new Error ("MESSAGE NOT DEFINED PROPERLY "));
	}
	return this.MESSAGETYPES.messagename;
};

//@tempcomment - coded
//@todo -- genericize this to exclude certain fields, so we could add more fields if we wanted
MessageHandler.prototype.getMessageTypeList = function ( ){
	return ( {
		SERVER_MESSAGES: this.MESSAGETYPES.SERVER_MESSAGES,
		CLIENT_MESSAGES: this.MESSAGETYPES.CLIENT_MESSAGES
	});
};


// creates a message
// @return message
// used the fields defined in the topic, and creates a message of type messagetype 
// tries best to populate the message with fields from topic.  Uses default fields if not defined.  Throws exception if extraneous fields.



// give the options to operate on the message
MessageHandler.prototype.getMessageBuilder  = function (messagetype) {	
	//figure out the type, and get the options you can set for it.
	if (messagetype.type ===  undefined ){
		type = 'server';
	}
	if (messagetype.type !='server' && messagetype.type !='client'){
		throw (new Error('Cannot create builder, invalid type'))
	}

	var builder = new _builder(this, messagetype.messagename, messagetype.type);
	var functions = this._getFunctionsForMessageBuilder ( messagetype.messagename, messagetype.type, builder);


	builder._addFunctions(functions.names, functions.functions);
	return builder._getBuilder ();

};


// feeds the handler a new message to process by the handler
// if it's client it should go in
// if it's server it should go out
// @todo if its not a valid message we should discard it
MessageHandler.prototype.feedMessage = function ( inbound_message ){

	if (inbound_message === undefined ){
		throw (new Error ("message not defined"));
	}

	
	var messagetype = this.getMessageType ( inbound_message );
	var functions = this.attachedMessageFunctions[inbound_message.id];

	if (functions !== undefined){
		for ( var i = 0 ; i < functions.length ; i++ ){
			var result = functions[i](inbound_message);
		}
	}
	
}


// associate functions to the message type
MessageHandler.prototype.attachFunctionToMessageType = function ( messagetype , func ){

	if (messagetype === undefined || func === undefined){
		throw (new Error ('undefined parameters'));
	}

	if (typeof (func) !='function'){
		throw (new Error('parameter func must be of type function'))
	}
	if ( this.MESSAGETYPES[messagetype.id] === undefined){
		throw (new Error ("Invalid Message Type -- cannot attach functionality"));
	}


	if (this.attachedMessageFunctions[messagetype.id] === undefined ){
		this.attachedMessageFunctions[messagetype.id] = [ ];
	}else if ( Array.isArray(this.attachedMessageFunctions[messagetype.id] === false)){
		throw (new Error("this.attachedMessageFunctions must be defined as an array"))
	} 

	for ( var i = 1; i < arguments.length ; i++ ){
	
		this.attachedMessageFunctions[messagetype.id].push(arguments[i]);
	}

};


// WARNING WARNING WARNING
// @consider : get rid of this function, and return a handle when you add an attached function
// this function will end up getting abused.

// stop the message handler from calling functions for the message type, and disassociate the functionality
MessageHandler.prototype.clearAttachedFunctionsForMessageType  = function ( message ){
	if (message === undefined || message.id === undefined){
		throw (new Error ("must define message id parameter"))
	}
	this.attachedMessageFunctions[message.id] = undefined;
};



////////////////////// private ////////////////////////////////////////////

// returns the functions that should be publicly accessible for the builder
// should return a bunch of setters
MessageHandler.prototype._getFunctionsForMessageBuilder = function ( messagetypename, type , builder){

	var message = builder.message;
	var names = [ ];
	var functions = [ ];

	//////////////////////
	////ADD SOME CODE HERE TO ACTUALLY RIP THE FUNCTIONS

	var accessor = type =='client'? 'CLIENT_MESSAGES': 'SERVER_MESSAGES';
	var requirements = this.MESSAGETYPES[accessor][messagetypename].requirements;

	
	// this is hacky dealing to overcome language closure limitation.
	// replace with something better
	var getFunction = function (builder, message, fieldvalueName ){
		return function ( value ){
			message.body[fieldvalueName] = value;
			return builder._public;
		}
		
	};

	for (var i = 0 ; i < requirements.length ; i++ ){	
		var functionName = 'set'+requirements[i].charAt(0).toUpperCase()+ requirements[i].slice(1);
		names.push(functionName);
		functions.push (getFunction(builder, message, requirements[i]));

		// expand this section if we want to add more complicated setters.
		// this is just going to do basic setValue without check.
		// might be interesting to define this is MessageTypes.js

	}

	var functionpair = { };
	functionpair.names = names;
	functionpair.functions = functions;
	return functionpair;
}


//@tempcomment - coded
// this is not complete code yet
// checks fields in message to make sure all required fields are there
MessageHandler.prototype._isValidMessage = function ( message ) {

	// make sure main fields are defined
	if ( message.metadata === undefined || message.body === undefined || 
				message.messagename === undefined || message.type === undefined){

		return false;
	}

	// ensure id matches message name
	if (this.MESSAGETYPES[message.id].messagename !== message.messagename);

	// ensure all required metadata fields are defined
	for ( var i = 0 ; i < this.MESSAGETYPES.metadata.length ; i++ ){
		if (message.metadata[this.MESSAGETYPES.metadata[i] ] === undefined ){

			return false;
		}
	}

	if (this._isValidMessageType(message.messagename,message.type) === false){

		return false;
	}

	var type = message.type;
	if (type != 'client' && type !='server'){

		return false;
	}

	var accessor = type =='client'? 'CLIENT_MESSAGES': 'SERVER_MESSAGES';
 	var requirements  = this.MESSAGETYPES[accessor][message.messagename].requirements;
 	for (var i = 0 ; i < requirements.length ; i++ ){
 		if (message.body[requirements[i]] === undefined){

 			return false;
 		}
 	}

	return true;
}

//@tempcomment - coded
MessageHandler.prototype._isValidMessageType = function ( messagename, type ) {
	if (type == 'client'){
		for (messagetype in this.MESSAGETYPES.CLIENT_MESSAGES){
			var message=  this.MESSAGETYPES.CLIENT_MESSAGES[messagetype];
			if (messagename == message.messagename && type == message.type){
				return true;
			}
		}
	}else if (type =='server'){
		for (messagetype in this.MESSAGETYPES.SERVER_MESSAGES){
			var message=  this.MESSAGETYPES.SERVER_MESSAGES[messagetype];
			if (messagename == message.messagename && type == message.type){
				return true;
			}
		}
	}
	return false;
}

//@tempcomment - coded
MessageHandler.prototype._generateMetadata = function (){
	var metadata = this.MESSAGETYPES.metadata;

	var generatedMetadata =  { };
	for ( var i = 0 ; i < metadata.length ; i++ ){
		generatedMetadata[metadata[i]] =  this.MESSAGETYPES.createMetadata[metadata[i]]();
	}

	return generatedMetadata
}

//@tempcomment - coded
//generates a message that contains elements common for every message
MessageHandler.prototype._createGenericMessage = function (){
	var message =  { };
	message.messagename =  null;
	message.type = null;
	message.metadata = this._generateMetadata();
	message.body = { }
	return message;
}


//@tempcomment - coded
MessageHandler.prototype._createMessage = function ( messagetypename, body, type){

	var isDefault =  ( (typeof(body) == 'string') && (body == DEFAULT_MESSAGE) )
	if (body == undefined){
		throw (new Error("Cannot create message without all required fields"));
	}

	if (type == undefined){
		type = 'server';
	}

	if ( ! this._isValidMessageType(messagetypename, type) ){
		throw (new Error ("MESSAGETYPE NOT VALID -- undefined"));
	}

	var message = this._createGenericMessage();
	message.messagename = messagetypename;
	message.type = type;


	// generate required fields
	var accessor = (type == 'server') ? 'SERVER_MESSAGES' : 'CLIENT_MESSAGES';
	var requiredFields = this.MESSAGETYPES[accessor][messagetypename].requirements;
	message.id = this.MESSAGETYPES[accessor][messagetypename].id;


	for ( var i = 0 ; i < requiredFields.length ; i++ ){

		if ( isDefault ){
			message.body[requiredFields[i]] = null
			continue;
		}

		if (body[requiredFields[i]] == undefined){
			throw (new Error("Cannot create message without all required fields"));
		}
		message.body[requiredFields[i]] = body[requiredFields[i]];
	}
	return message;
}




module.exports = MessageFactory;

