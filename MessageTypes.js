//** THIS IS A GLORIFIED CONFIG FILE **/


var RESERVED_STRING 	= '----------';				// Combo used to uniquely identify messages.  Used to ID the message type.
var counter  			= 0;						

var isValidMessageType = function ( messagetype ) {
	var found  = false;

	for ( var serverMessage in MESSAGE_TYPES.SERVER_MESSAGES ){

		if ( MESSAGE_TYPES.SERVER_MESSAGES[serverMessage] == messagetype ){
			found  = true;
			break;
		}
	}	


	if ( !found ){
		for ( var clientMessage in MESSAGE_TYPES.CLIENT_MESSAGES ){
			if ( MESSAGE_TYPES.CLIENT_MESSAGES[clientMessage] == messagetype ){
				found = true;
				break;
			}
		}
			
	}
	return found;
}

var createRequirements = function ( messagetype, topics ){
	if ( !isValidMessageType ( messagetype ) ){
			throw new Error ('Invalid Message Type');
	}

	var messageid = MESSAGE_TYPES.messageTypeToID[messagetype];
	if ( messageid == undefined ){
		messageid = RESERVED_STRING + counter;
		counter ++;
	}

	MESSAGE_TYPES.idToMessageType [ messageid     ] = messagetype;
	MESSAGE_TYPES.messageTypeToID [ messagetype   ] = messageid;


	MESSAGE_TYPES.requirements[ messagetype ] = new Array (); 
		
	for ( var i = 1 ; i < arguments.length ; i++ ){
		MESSAGE_TYPES.requirements[ messagetype ].push(arguments[i]);
	}	
}


var MESSAGE_TYPES = {
	
	SERVER_MESSAGES: {
		SERVER_TOPIC_UPDATE			: 'SERVER TOPIC UPDATE'  ,  			// sends new topic info to subscribers
		DEVICE_INIT_SETUP			: 'DEVICE INIT SETUP' 			// asks the client to setup new configuration (includes config payload)

	}, 

	CLIENT_MESSAGES: {
		DEVICE_READY_FOR_SETUP  	: 'DEVICE READY FOR SETUP',		    //  client says its ready for setup
		CLIENT_TOPIC_UPDATE			: 'CLIENT TOPIC UPDATE'   ,			// client updates a topic or multiple topics or creates new topic 
	},

	//fields which should be defined for all messages
	metaData 						: [ "id" ] ,


	// ** DO NOT FILL THESE FIELDS IN MANUALLY ** //
	// use createRequirements to create requirements.  ID to message type, vice versa will be auto-populated
	// fields which must be defined in the message content for a message
	requirements 					: { },

	idToMessageType					: { },
	messageTypeToID					: { },

	// deletes old requirements for the message type and adds them.  
	// Call function again w/ all requirements at once w/ one function call for each message type
	
	
}


// Call create requirements here to add additional requirements
// A message must have requirements to be defined
//////////////////////////////////////////////////////////////
// To make a new message, add it under server/client message
// and call createRequirements to define requirements
//////////////////////////////////////////////////////////////////////













///////////////////////////////////////////////////////////////////////




module.exports = MESSAGE_TYPES;

/* Messages look  like this: 
--------------------------------------

	message : {
		metaData:{
			___:  ,
			___:  ,
			___:     etc
		},

		body: {
			___:  ,
			___:  ,
			___:     etc
		}

	}
----------------------------------------

*/
