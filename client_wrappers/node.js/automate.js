
var files = require ("./files.js");
var messaging = require(files.messaging);
var network_module = require (files.network);


var message_handler =  messaging.message_handler.getMessageHandlerInstance();
var feed_message = message_handler.feedMessage.bind(message_handler);
var network = new network_module.abstract_network ( feed_message, get_interfaces(), true, true, true );

var SERVER_IP = "NOT SET";

var topic_update = function ( update ){

}

var automate = {
	subscriptions : [ ],
	publications : [ ],
	subscription_handles: { },
	publication_handles: { }
};


message_handler.attachFunctionToMessageType ( message_handler.MESSAGETYPES.CLIENT_MESSAGES.TOPIC_UPDATE, topic_update);



/**
	Gets the interfaces we want to turn on.  We will just use internet for now.
	It would be interesting to use command line for this.
**/
function get_interface ( ){
	return 'internet';
}

function send_device_update ( ){
	var device_init_builder = message_handler.getMessageBuilder ( message_handler.MESSAGETYPES.CLIENT_MESSAGES.CLIENT_DEVICE_INIT);
	device_init_builder.setSubscriptions (automate.subscriptions).setPublications(automate.publications);
	var device_init_message = device_init_builder.build();
	network.sendMessage (device_init_message, SERVER_IP, get_interface());
}

automate.add_subscription = function (  subscription ){
	if ( typeof (subscription) !== "string" ){
		throw (new Error ("subscription must be of type string"));
	}

	if ( automate.subscriptions.indexOf(subscription) < 0 ){
		automate.subscriptions.push (subscription);
	}
	send_device_update();
};

automate.add_publication = function ( publication ) {
	if ( typeof ( publication ) !== "string" ){
		throw (new Error ("publication must be of type string"));
	}

	if ( automate.publications.indexOf(publication) < 0 ){
		automate.publications.push(publication);
	}
	send_device_update();
};

automate.remove_subscription = function ( subscription ){
	if ( typeof (subscription) !== "string" ){
		throw (new Error ("subscription must be of type string"));
	}
	automate.subscriptions.splice(automate.subscriptions.indexOf(subscription),1);
	send_device_update();
};

automate.remove_publication = function ( publication ){
	if ( typeof ( publication ) !== "string" ){
		throw (new Error ("publication must be of type string"));
	}
	automate.publications.splice(automate.publications.indexOf(publication),1);
	send_device_update();
};

/*var automate = require ("automate");
var subscription = new automate.subscriptions(["fire","ice"], callback);
subscription.stop();*/

/**
	Creates a new subscription to topics.  Callback is called when a new message is passed in.
**/
var subscription = function ( subscriptions, callback ){
	///automate.add_subscription (subscription, callback );
};

/**
	Stops messages from being passed to the callback function.
	This also stops messages from being sent to the device at all.  Messages will not be 
	sent to this ip.
**/
subscription.prototype.stop = function ( ){

};

/**
	Creates a new publisher to topics.  Allows you to publish to topics.  
	Throws an error if the topic is set for exclusive access and it fails
**/
var publisher = function ( publications  ){

};

/**
	Publishes the topics to the main server.
**/
publisher.prototype.publish =  function ( topic_content ){

};

/**
	You stop the ability, and responsibility of publishing.
	The advantage  of calling this is that if other devices want to publish to the topic,
	and exclusively, this helps them with that. 
**/
publisher.prototype.stop = function ( ){

};


subscription.prototype.automate = automate;



module.exports = automate;