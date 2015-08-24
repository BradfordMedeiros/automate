//** THIS IS GLORIED CONFIG FILE used to define the various server and client messages, and the required fields in the messages**/

/* Messages look  like this: 
--------------------------------------

	message : {
		messagename: ,
		type: ,
		metaData:{
			___:  ,
			___:  ,
			___:     etc
		},

		body: {
			___:  ,
			___:  ,				<---- requirements
			___:     etc
		}

	}
----------------------------------------

*/

var MESSAGE_TYPES = {
	

	//fields which should be defined for all messages
	// to add metadata, use the provided function above. 
	// this is necessary so we know how to generate the metadata.
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

		CLIENT_TOPIC_UPDATE: {
			type: 'client',
			messagename  : 'CLIENT_TOPIC_UPDATE',
			requirements : [ 'topics' ]
		}
	}

}



var addrequiredmetadata = function (field, creationFunction){
	if (creationFunction == undefined){
		throw (new Error('must defined a creation function'))
	}

	if (MESSAGE_TYPES.createMetadata == undefined){
		if (MESSAGE_TYPES.metadata.length > 0 ){
			throw (new Error ("Do not define meta data without calling  add metadata function"));
		}
		MESSAGE_TYPES.createMetadata = { };
	}
	MESSAGE_TYPES.metadata.push (field);
	MESSAGE_TYPES.createMetadata[field] = creationFunction;
}




var addRequirementToAllTopics = function( requirement ){
	for ( type in MESSAGE_TYPES ){
		for (messagetype in MESSAGE_TYPES[type]){
			MESSAGE_TYPES[type][messagetype].requirements.push(requirement);
		}
	}
}



// add anything here to enforce constraints on config style.
// sacrifice nominal savings in runtime here so we don't have to do this later
var checkFileIntegrity = function ( ){

	for ( message in MESSAGE_TYPES.SERVER_MESSAGES ){
		for (var i = 0 ; i < MESSAGE_TYPES.SERVER_MESSAGES[message].requirements.length ;i ++ ){
			if (MESSAGE_TYPES.SERVER_MESSAGES[message].requirements[i].length == 0){
				throw (new Error("field length must be > 0"))
			}
		}
	}

	for ( message in MESSAGE_TYPES.CLIENT_MESSAGES ){
		for (var i = 0 ; i < MESSAGE_TYPES.CLIENT_MESSAGES[message].requirements.length ;i ++ ){
			if (MESSAGE_TYPES.CLIENT_MESSAGES[message].requirements[i].length == 0){
				throw (new Error("field length must be > 0"))
			}
		}
	}
	
}


addRequirementToAllTopics ('networkInterface');
addrequiredmetadata ('timestamp', function(){
	return (new Date())	
})


checkFileIntegrity();




module.exports = MESSAGE_TYPES;


