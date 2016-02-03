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
		}

		,

		INVALID_TOPIC_RECEIVED: {
			type: 'server',
			messagename  : 'INVALID_TOPIC_RECEIVED',		// sends error message back to publisher who sent incorrect topic update message
			requirements : ['topics','reason']
		},

		DEVICE_INIT_SETUP: {
			type: 'server',
			messagename  : 'DEVICE_INIT_SETUP',				// asks the client to setup new configuration in desired mode (includes config payload)-
			requirements : ['mode','config']
		},
		VIEW_TOPIC_RESPONSE:{
			type: 'server',
			messagename : 'VIEW_TOPIC_RESPONSE',      // topics field looks like { topics: { topic_name: x, 
			requirements: ['topics','identifier']                  //							timestamp_last_update: y }, ...}
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

		VIEW_LAST_UPDATE_FOR_TOPIC: {
			type: 'client',
			messagename: 'VIEW_LAST_UPDATE_FOR_TOPIC',
			requirements: ['topics', 'identifier'] // identifier is field used by client to identify the response
		},

		// mode is used to support non-default methods of operations
		// undefined or null will assume normal two way push on update
		// mode == pull will signfify to queue outbound messages and wait
		// for the client to pull them before sending
		CLIENT_DEVICE_INIT: {
			type: 'client',
			messagename : 'CLIENT_DEVICE_INIT',
			requirements : ['subscriptions','publications','mode']
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
		},


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


