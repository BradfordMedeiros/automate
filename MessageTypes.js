//** THIS IS CONFIG FILE used to define the various server and client messages, and the required fields in the messages**/

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
	metadata 						: [ "id","timestamp" ],

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

module.exports = MESSAGE_TYPES;


