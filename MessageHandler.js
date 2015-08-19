//@todonext
//@todo determine public/private categorization


// notes: -- create default message with DEFAULT_MESSAGE -= 'default',etc
// make it so it just has blank values for all default fields.  -1, null, etc.
// finish making .func1().func2(), build();
// need to do chaining, 


var FILEFINDER = '/.files';
var DEFAULT_MESSAGE = 'default';

var _builder = function( MessageHandler, messagetype , type ){

	if (type == undefined ){
		type = 'server';
	}

	this.functions = { };

	var that = this;
	this.message = MessageHandler._createMessage (messagetype, DEFAULT_MESSAGE, type)

	this._public = {
		build: function (){
			return this
		}
	}

}

_builder.prototype._getBuilder = function  () {
	return this._public;
}

//  note:  return values are ignored
_builder.prototype._addFunctions = function  ( functionames, functions ){
	for (var i = 0 ; i < functions.length ; i++ ){
		this.functions[functionames] = functions[i];	// REMOVE

		// need something like
		// this._public[function[i].functioname] = function
	}
}

_builder.prototype._build = function (){
	return this.message;
}



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
	return this.MESSAGETYPES.messagename;
}

//@tempcomment - coded
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
MessageHandler.prototype.getMessageBuilder  = function (messagetype, type) {
	//figure out the type, and get the options you can set for it.
	if (type ==  undefined ){
		type = 'server';
	}
	if (type !='server' && type !='client'){
		throw (new Error('Cannot create builder, invalid type'))
	}

	var builder = new _builder(this, messagetype, type);

	var functions = this.getFunctionsForMessageBuilder ( messagetype, type, _builder.message);

	console.log('pppp'+functions.functions)
	builder._addFunctions ( functions.names, functions.functions );
	console.log("0290239  "+typeof (functions.names));
	for (thing in builder){
		if (typeof (builder[thing]) == 'function' ){
			builder[thing]();
		}
	}
	return builder._getBuilder ();

}

// returns the functions that should be publicly accessible for the builder
// should return a bunch of setters
MessageHandler.prototype.getFunctionsForMessageBuilder = function ( messagetypename, type , message){
	var names = new Array();
	var functions = new Array();

	//////////////////////
	////ADD SOME CODE HERE TO ACTUALLY RIP THE FUNCTIONS

	var accessor = type =='client'? 'CLIENT_MESSAGES': 'SERVER_MESSAGES';
	var requirements = this.MESSAGETYPES[accessor][messagetypename].requirements;

	for ( var i = 0 ; i < requirements.length ; i++ ){	
		var functionName = 'set'+requirements[i].charAt(0).toUpperCase()+ requirements[i].slice(1);
		names.push(functionName);

		// expand this section if we want to add more complicated setters.
		// this is just going to do basic setValue without check.
		// might be interesting to define this is MessageTypes.js
		functions.push (function( value  ){
			message[requirements[i]] = value;
		});
	}

	var functionpair = { };
	functionpair['names'] = names;
	functionpair['functions'] = functions;
	console.log(functionpair['functions'])
	console.log("------"+JSON.stringify(functionpair))
	return functionpair;
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


//@tempcomment - coded
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

//@tempcomment - coded
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
	message.messagename =  undefined;
	message.type = undefined;
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

	var accessor = (type == 'server') ? 'SERVER_MESSAGES' : 'CLIENT_MESSAGES';
	var requiredFields = this.MESSAGETYPES[accessor][messagetypename].requirements;

	for ( var i = 0 ; i < requiredFields.length ; i++ ){

		if ( isDefault ){
			message.body[requiredFields[i]] = undefined
			continue;
		}

		if (body[requiredFields[i]] == undefined){
			throw (new Error("Cannot create message without all required fields"));
		}
		message.body[requiredFields[i]] = body[requiredFields[i]];
	}
	return message;
}

mh = new MessageHandler();

b = new _builder(mh,mh.MESSAGETYPES.SERVER_MESSAGES.DEVICE_INIT_SETUP.messagename, 'server');

//var a = mh.getFunctionsForMessageBuilder ( mh.MESSAGETYPES.SERVER_MESSAGES.DEVICE_INIT_SETUP.messagename, 'server',b.message);

builder = mh.getMessageBuilder(mh.MESSAGETYPES.SERVER_MESSAGES.DEVICE_INIT_SETUP.messagename);
module.exports = MessageHandler;

