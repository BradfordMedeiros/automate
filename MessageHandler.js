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
MessageHandler.prototype.createMessage = function ( messagetype, topicrequirements ){
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
		functions[i]();
	}
}


// associate functions to the message type
MessageHandler.prototype.attachFunctionToMessageType = function ( messagetype, func ){

	if ( this._isValidMessageType (messagetype ) ){
		throw (new Error ("Invalid Message Type -- cannot attach functionality"));
	}

	if (this.attachedMessageFunctions[messagetype] = undefined ){
		this.attachedMessageFunctions[messagetype] = new Array();
	}

	for ( var i = 1; i < arguments.length ; i++ ){
		this.attachedMessageFunctions[messagetype].push(func[i]);
	}
}


// stop the message handler from calling functions for the message type, and disassociate the functionality
MessageHandler.prototype.clearAllAttachedFunctions  = function ( messagetype ){
	this.attachedMessageFunctions[messagetype] = undefined;
}



//////////////////////////////////////////////////////////////////

// checks if enumerated messagetype is defined
MessageHandler.prototype._isValidMessageType = function  ( messagetype ){
	return ( this.MESSAGETYPES.messageTypeToID[messagetype] != undefined );
}


// checks fields in message to make sure all required fields are there
MessageHandler.prototype._isValidMessage = function ( message ) {


	// make sure metadata and body portions are defined properly
	if ( message.metaData == undefined || message.body == undefined){
		return false;
	}

	// ensure all required metadata fields are defined
	for ( var i = 0 ; i < this.MESSAGETYPES.metaData.length ; i++ ){
		if (message.metaData[this.MESSAGETYPES.metaData[i] ] == undefined ){
			return false;
		}
	}

	var messagetype = this.MESSAGETYPES.idToMessageType[message.metaData.id];
	if ( messagetype == undefined ){
		return false;
	}

	var requiredFields = this.MESSAGETYPES.requirements[ messagetype ];
	for ( var i = 0 ; i < requiredFields.length ; i++ ){

		if ( message.body[requiredFields[i]] == undefined  ){
			console.log(message.body[requiredFields[i]]);
			return false;
		}
	}

	return true;
}


module.exports = MessageHandler;

