
var files = require ("./files.js");
var event_emitter = new (require("events").EventEmitter)();

var message_handler = require(files.messaging).message_handler.getMessageHandlerInstance();
var network_module = require (files.network);


var CONSTANTS = { };
CONSTANTS.CLIENT_DEVICE_INIT = "CLIENT_DEVICE_INIT";


var SERVER_IP = "localhost";
var subscription_to_id = { } ;
var subscription_id_to_callback = { } ;
var subscription_count = 0;
var publication_count = 0;
var publications = [ ]


/**
	{
		fire:10,
		ice: 20
	}
**/


var route_message = function( ){

};

var get_subscriptions = function(){
	var subscriptions = [ ];
	for ( var field in subscription_to_id ){
		subscriptions.push(field);
	}
	return subscriptions;
};

var get_publications = function ( ){
	return publications;
};

var get_subscription_updates = function(topic_update){

	var subscription_updates = { };
	for (var field in topic_update){ // for every field such as fire, ice, flames in the update
		var subscribers_to_field = subscription_to_id[field]; // get the ids array of subscriptions subscribing to field in topic_Update
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

var get_client_config_update = function  () {
	var config_update_builder =  message_handler.getMessageBuilder( message_handler.MESSAGETYPES.CLIENT_MESSAGES.CLIENT_DEVICE_INIT );
	config_update_builder.setSubscriptions(get_subscriptions());
	config_update_builder.setPublications(get_publications());
	return config_update_builder.build();
}

var get_subscription_callback = function(subscription_id){
	return subscription_id_to_callback[subscription_id];
}

var update_topic = function ( topic_update ){
	var subscription_update = get_subscription_updates(topic_update);
	for (var subscription_id in subscription_update){
		var callback = get_subscription_callback(subscription_id);
		callback(subscription_update[subscription_id]);
	}
}
// feedMessage will be called when a message is received
//var feedMessage = message_handler.feedMessage.bind(message_handler);

//message_handler.attachFunctionToMessageType(message_handler.MESSAGETYPES.SERVER_MESSAGES.SERVER_TOPIC_UPDATE, update_topic);


//messagehandler.attachFunctionToMessageType ( message_handler.MESSAGETYPES.CLIENT_MESSAGES.CLIENT_MESSAGES.CLIENT_DEVICE_INIT, );
//network_module.abstract_network(update_topic, ['internet']);


function send_device_config_update ( ){
	//message_handler.feedMessage(get_client_config_update());
	event_emitter.emit(CONSTANTS.CLIENT_DEVICE_INIT, get_client_config_update());
}

function get_device_update_message ( ){
}

/**
	subscriptions array which maps the topic names to the devices for that subscription
**/
function add_subscription (id, subscriptions, callback ){
	var subscriptions_array = convert_to_string_array(subscriptions);
	for ( var subscription in subscriptions_array ){
		if (subscription_to_id[subscriptions_array[subscription]] === undefined){
			subscription_to_id[subscriptions_array[subscription]] = { };
		}
		subscription_to_id[subscriptions_array[subscription]][id] = true;
	}
	subscription_id_to_callback[subscription_count] = callback;
}

function remove_subscription (id){
	for ( var subscription in subscription_to_id ){
		if (subscription_to_id[subscription][id] !== undefined){
			delete subscription_to_id[subscription][id];
		}

		var is_empty = true;
		for ( var key in subscription_to_id[subscription]){
			if (subscription_to_id[subscription].hasOwnProperty(key)){
				is_empty = false;
			}
		}
		if ( is_empty){
			delete subscription_to_id[subscription];
		}
	}

	delete subscription_id_to_callback[id];
}





function get_id (){
	console.log('returning subscription_count');
	return subscription_count++;
}


/**
	Creates a new subscription to topics.  Callback is called when a new message is passed in.
**/

var subscription = function ( subscriptions, callback ){
	if (subscriptions === undefined || callback === undefined || typeof(callback) !=="function"){
		throw (new Error("parameters cannot be undefined"));
	}
	add_subscription( subscription_count, subscriptions, callback);
	send_device_config_update( );

	var id = get_id();

	/**
		Stops pemessages from being passed to the callback function.
		This also stops messages from being sent to the device at all.  Messages will not be 
		sent to this ip.
	**/

	this.stop = function(){
		console.log('removing subscription to '+id);
		remove_subscription(id);
		send_device_config_update();
	};
};




/**
	Creates a new publisher to topics.  Allows you to publish to topics.  
	Throws an error if the topic is set for exclusive access and it fails
**/
var publisher = function ( publication  ){

	// convert into array so we can treat the rest of the logic as if array
	if ( !Array.isArray(publication)){
		var temp_publication = publication;
		publication = [ ];
		publication.push(temp_publication);
	}

	for ( var i = 0 ; i < publication.length; i++){
		if (typeof(publication[i]) !== "string"){
			throw (new Error("publications must all be strings"));
		}
	}

	this._publications = publication;

	for ( var i = 0 ; i < publication.length ; i++){
		if ( publications.indexOf(publication[i]) > -1 ){
			publications.push(publication[i]);
		} 
	}
	send_device_config_update();
};

/**
	Publishes the topics to the main server.
**/

//@todo
publisher.prototype.publish =  function ( topic_content ){
		//var update_message = message_handler.getMessageBuilder(message_handler.MESSAGETYPES.CLIENT_MESSAGES.TOPIC_UPDATE);

};

/**
	You stop the ability, and responsibility of publishing.
	The advantage  of calling this is that if other devices want to publish to the topic,
	and exclusively, this helps them with that. 
**/
publisher.prototype.stop = function ( ){
	for ( var i = 0 ; i < this._publications ; i++ ){
		publications.splice(publications.indexOf(this.publications[i]),1);
	}
	send_device_config_update();
};




/**
	Helper function: 
	Converts to an array, or returns the array
	If the input consists of something which is not a string or array containing only strings, throws an error
**/
function convert_to_string_array ( element ){
	//@todo
	var array ;
	if (!Array.isArray(element)){
		array = [ ];
		array.push(element);
	}else{
		array = element;
	}
	return array;
}

var network = new network_module.abstract_network(message_handler.feedMessage.bind(message_handler),['internet'],true,true,true)

event_emitter.on(CONSTANTS.CLIENT_DEVICE_INIT, function ( message ){
	network.sendMessage(message, SERVER_IP, "internet");
});

//internal usage, should use event emitter
/*message_handler.attachFunctionToMessageType(message_handler.MESSAGETYPES.CLIENT_MESSAGES.CLIENT_DEVICE_INIT, function( message ){
	network.sendMessage(message, SERVER_IP, "internet");
});*/

message_handler.attachFunctionToMessageType(message_handler.MESSAGETYPES.SERVER_MESSAGES.SERVER_TOPIC_UPDATE, update_topic);


automate =  { };
automate.subscription = subscription;
automate.publisher = publisher;

module.exports = {
	subscription: subscription,
	publication: publisher,
	stoid: subscription_to_id,	// should not be in final api
	update: update_topic, 	// should not be in final api
	network: network,
	mh: message_handler,
	callbacks: subscription_id_to_callback // should not be in final api
};