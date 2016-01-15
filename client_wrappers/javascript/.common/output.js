(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){



var automate_common = function ( message_handler ){
	this.message_handler = message_handler;
	this.publication_manager = publication_manager;
	this.subscription_manager = subscription_manager;
};

var publication_manager = function (){
	this.publications = { };
	this.id_to_publications = { };
	this.publications_count = 0;
	this.id_counter = 0;
};



publication_manager.prototype.get_publications = function(){
	var publications = [ ];
	for ( var fields in this.id_to_publications){
		for (var field in this.id_to_publications[fields]){
			if (publications.indexOf(this.id_to_publications[fields][field]) < 0){
				publications.push(this.id_to_publications[fields][field]);
			}
		}
	}
	return publications;
};

publication_manager.prototype.get_count = function(){
	return this.publications_count;
};

publication_manager.prototype.add_publication = function ( publication  ){

	var publications_array = [].concat(publication);

	for ( var i = 0 ; i < publications_array.length ; i++){
		if (this.publications[publications_array[i]] === undefined){
			this.publications[publications_array[i]] = 0;
		}
		this.publications[publications_array[i]]++;
	}
	this.id_to_publications[this.id_counter] = publications_array;
	this.publications_count++;
	this.id_counter++;
	return this.id_counter-1;
};

publication_manager.prototype.remove_publication = function (id){

	if (this.id_to_publications[id] === undefined){
		throw (new Error("Cannot remove a handle that is not a current publication"));
	}
	for (var publication in this.id_to_publications[id]){
		this.publications[this.id_to_publications[id][publication]]--;
		if (this.publications[this.id_to_publications[id][publication]] === 0){
			delete this.publications[this.id_to_publications[id][publication]];
		}
	}
	delete this.id_to_publications[id];
	this.publications_count--;
};


var subscription_manager = function(){

	this.number_of_subscriptions = 0;
	this.subscription_to_id = { };
	this.subscription_id_to_callback = { };
	this.id_counter = 0;
};


subscription_manager.prototype.get_count = function(){
	return this.number_of_subscriptions;
};

subscription_manager.prototype.add_subscription = function ( subscriptions, callback){

	if (callback === undefined){
		throw (new Error("Subscription invalid:  Must include a callback"));
	}
	var subscriptions_array = [].concat(subscriptions);
	for ( var subscription in subscriptions_array ){
		if (this.subscription_to_id[subscriptions_array[subscription]] === undefined){
			this.subscription_to_id[subscriptions_array[subscription]] = { };
		}
		this.subscription_to_id[subscriptions_array[subscription]][this.id_counter] = true;
	}
	this.subscription_id_to_callback[this.id_counter] = callback;
	this.number_of_subscriptions++;
	this.id_counter++;
	return this.id_counter-1;
};

subscription_manager.prototype.remove_subscription = function (id){

	if (this.subscription_id_to_callback[id] === undefined){
		throw (new Error ("Cannot remove a handle that is not a current subscription"));
	}

	for ( var subscription in this.subscription_to_id ){
		if (this.subscription_to_id[subscription][id] !== undefined){
			delete this.subscription_to_id[subscription][id];
		}

		var is_empty = true;
		for ( var key in this.subscription_to_id[subscription]){
			if (this.subscription_to_id[subscription].hasOwnProperty(key)){
				is_empty = false;
			}
		}
		if ( is_empty){
			delete this.subscription_to_id[subscription];
		}
	}
	delete this.subscription_id_to_callback[id];
	this.number_of_subscriptions--;
};


/**
	@todo misleading
	Kind of funky because this is the real subscriptions fields that we'll use that we send to the server
	So might want to consider renaming to show that this is aggregate?
**/
subscription_manager.prototype.get_subscriptions = function (){
	var subscriptions = [ ];
	for ( var field in this.subscription_to_id){
		subscriptions.push(field);
	}
	return subscriptions;
};


subscription_manager.prototype.get_subscription_callback = function (subscription_id){
	return this.subscription_id_to_callback[subscription_id];
};

subscription_manager.prototype.get_subscription_updates = function(topic_update){

	var subscription_updates = { };
	for (var field in topic_update){ // for every field such as fire, ice, flames in the update
		var subscribers_to_field = this.subscription_to_id[field]; // get the ids array of subscriptions subscribing to field in topic_Update
		//add_subscription_field_update_to_subscriber(subscription_updates, subscribers_to_field);
		for ( var subscription_id in subscribers_to_field){
			if (subscription_updates[subscription_id] === undefined){
				subscription_updates[subscription_id] = { };
			}
			subscription_updates[subscription_id][field] = topic_update[field];
		}
	}
	return subscription_updates;

};

subscription_manager.prototype.update_subscriptions = function (topic_update){
	var subscription_update = this.get_subscription_updates(topic_update);
	for (var subscription_id in subscription_update){
		var callback = this.get_subscription_callback(subscription_id);
		callback(subscription_update[subscription_id], subscription_update[subscription_id]);
	}	
};

//@TODO SHOULD USE THIS TO PRIVATIZE THE FUNCTION
/*function get_subscription_updates (subscription_manager, topic_update){

}*/




module.exports = {
	subscription_manager: subscription_manager,
	publication_manager: publication_manager,

};



},{}],2:[function(require,module,exports){
/*-

** THIS FILE SHOULD ALWAYS BE LOCATED IN /config/ **
Config must be located in the root of the project folder

This file details the locations of other files.  It you should read this file to get the location of another file. Do not ever hardcode file locations except for this one.

*/

var path = require("path");


var PWD = "/home/samantha"+ '/Documents/automationGIT/'

var filelocations = {


	// folders
	f_config  		: PWD + 'config/',

	// files - main project files
	network : PWD + 'Network/modules.js',
	bluetooth		: PWD + 'Bluetooth.js',
	devicestrapper		: PWD + 'devicestrapper.js',
	enumerated_interfaces	: PWD + 'enumerated_interfaces.js',
	interface		: PWD + 'Interface.js',

	message_router	: PWD + 'message_router.js',
	messaging 	: PWD + 'messaging/modules.js',
	
	options			: PWD +'config/options.js',
	zigbee			: PWD + 'Zigbee.js',

	// files - test project files
	autotester		: PWD + 'autotester.js',

	// folders - test project files
	f_tests			: PWD + 'tests/'
	
};

module.exports = filelocations;

},{"path":7}],3:[function(require,module,exports){

a = require('./automate_common.js');
var files = require('./files.js');
var path = require("path");


//var mod = path.relative(".",files.messaging);
//console.log(mod)
var messaging = require('/home/samantha/Documents/automationGIT/messaging/modules.js');

console.log(messaging);
//setInterval(function(){console.log("ehl")},1000);

},{"./automate_common.js":1,"./files.js":2,"/home/samantha/Documents/automationGIT/messaging/modules.js":6,"path":7}],4:[function(require,module,exports){
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


},{"./message_types.js":5}],5:[function(require,module,exports){
/** 
THIS IS GLORIED CONFIG FILE used to define the various server and client messages, and the required fields in the messages.

/* Messages look  like this: 
=====================================
	message : {

		id: ,  <----generated through function call don't populate this on own
		messagename: ,
		type: ,
		metaData:{
			___:  ,  <---- call functions to add new stuff
			___:  ,
			___:     etc
		},

		body: {

			___:  ,
			___:  ,				<---- requirements, can defined common ones
			___:     etc			via function call
		}

	}
=====================================
**/

var count = 0;
var RESERVED_STRING = '000000';
var MESSAGE_TYPES = {
	
	/*fields which should be defined for all messages
	  to add metadata, use the provided function above. 
	  this is necessary so we know how to generate the metadata.
	*/
	metadata 						: [ ],

	SERVER_MESSAGES: {
																				
		SERVER_STATUS: {
			type: 'server',
			messagename  : 'SERVER_STATUS',					// sends status of the server --> a general ping message
			requirements : ['mode']
		},

		SERVER_TOPIC_UPDATE: {
			type: 'server',
			messagename  : 'SERVER_TOPIC_UPDATE',			// sends new topic info to subscribers
			requirements : ['topics']
		},

		INVALID_TOPIC_RECEIVED: {
			type: 'server',
			messagename  : 'INVALID_TOPIC_RECEIVED',		// sends error message back to publisher who sent incorrect topic update message
			requirements : ['topics','reason']
		},

		DEVICE_INIT_SETUP: {
			type: 'server',
			messagename  : 'DEVICE_INIT_SETUP',				// asks the client to setup new configuration in desired mode (includes config payload)-
			requirements : ['mode','config']
		}
	}, 

	CLIENT_MESSAGES: {

		CLIENT_STATUS : {
			type: 'client',
			messagename  : 'CLIENT_STATUS',
			requirements : ['mode','isSlave','ready']		
		},

		TOPIC_UPDATE: {
			type: 'client',
			messagename  : 'TOPIC_UPDATE',
			requirements : [ 'topics' ]
		},

		CLIENT_DEVICE_INIT: {
			type: 'client',
			messagename : 'CLIENT_DEVICE_INIT',
			requirements : ['subscriptions','publications']
		},

		REMOVE_DEVICE: {
			type: 'client',
			messagename: 'REMOVE_DEVICE',
			requirements : [  ]
		},

		SERVICE_REQUEST:{
			type: 'client',
			messagename: 'SERVICE_REQUEST',
			requirements: ['service','parameters']
		}
	}

};


/**
{   title: "generateId",
	params: "void",
	return: "void",
	description: "generates id numbers for each message type.   Just call this once at the end of this file. It's a necessary field to identify messages"
}
**/
var generateId = function (){
	MESSAGE_TYPES.idToMessageType = { };

	for ( var messagetype in MESSAGE_TYPES){
		for ( var message in MESSAGE_TYPES[messagetype]){
			var id = RESERVED_STRING + count;
			MESSAGE_TYPES[messagetype][message].id = id;
			count = count + 1 ;
			MESSAGE_TYPES[id] = {
 				type: 		 MESSAGE_TYPES[messagetype][message].type,
				messagename: MESSAGE_TYPES[messagetype][message].messagename
			};
		}
	}
};


/**
{   title: "add_required_metadata",
	params: {
		field: "the fieldname of the required metadata",
		creationFunction: "the function used to create the metadata each time a message is built"
	},
	return: "void",
	description: use this function to add new metadata that will be added to every single message
}
**/
var add_required_metadata = function (field, creationFunction){
	if (creationFunction === undefined){
		throw (new Error('must defined a creation function'));
	}

	if (MESSAGE_TYPES.createMetadata === undefined){
		if (MESSAGE_TYPES.metadata.length > 0 ){
			throw (new Error ("Do not define meta data without calling  add metadata function"));
		}
		MESSAGE_TYPES.createMetadata = { };
	}
	MESSAGE_TYPES.metadata.push (field);
	MESSAGE_TYPES.createMetadata[field] = creationFunction;
};



var addRequirementToAllTopics = function( requirement ){
	for ( var type in MESSAGE_TYPES ){
		for ( var messagetype in MESSAGE_TYPES[type]){
			MESSAGE_TYPES[type][messagetype].requirements.push(requirement);
		}
	}
};


// add anything here to enforce constraints on config style.
// sacrifice nominal savings in runtime here so we don't have to do this later
var check_file_integrity = function ( ){

	var s_requirements = { };
	var c_requirements = { };

	for ( var message in MESSAGE_TYPES.SERVER_MESSAGES ){
		for (var i = 0 ; i < MESSAGE_TYPES.SERVER_MESSAGES[message].requirements.length ;i ++ ){

			if (s_requirements[MESSAGE_TYPES.SERVER_MESSAGES[message].requirements[i]] !== undefined){
				throw (new Error("cannot have duplicate requirements:\t"+MESSAGE_TYPES.SERVER_MESSAGES[message].requirements[i]));
			}

			s_requirements[MESSAGE_TYPES.SERVER_MESSAGES[message].requirements[i]] = true;

			if (MESSAGE_TYPES.SERVER_MESSAGES[message].requirements[i].length === 0){
				throw (new Error("field length must be > 0"));
			}
		}
		s_requirements = { } ;

	}

	for ( var message in MESSAGE_TYPES.CLIENT_MESSAGES ){

		for (var i = 0 ; i < MESSAGE_TYPES.CLIENT_MESSAGES[message].requirements.length ;i ++ ){

			if (c_requirements[MESSAGE_TYPES.CLIENT_MESSAGES[message].requirements[i]] !== undefined){
				throw (new Error("cannot have duplicate requirements:\t"+MESSAGE_TYPES.CLIENT_MESSAGES[message].requirements[i]));
			}

			c_requirements[MESSAGE_TYPES.CLIENT_MESSAGES[message].requirements[i]] = true;
			if (MESSAGE_TYPES.CLIENT_MESSAGES[message].requirements[i].length === 0){
				throw (new Error("field length must be > 0"));
			}
		}
		c_requirements = { };
	}
	
};





generateId();
add_required_metadata ('identifier', function(){
	return 'localhost';
});

add_required_metadata ('network_interface', function(){
	return  null;
});

add_required_metadata ('timestamp', function(){
	return (new Date());
});

check_file_integrity();




module.exports = MESSAGE_TYPES;



},{}],6:[function(require,module,exports){

var messaging_module = {
    message_types : require("./message_types.js"),
    message_handler : new (require("./message_handler.js"))
};

module.exports = messaging_module;

},{"./message_handler.js":4,"./message_types.js":5}],7:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":8}],8:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[3]);
