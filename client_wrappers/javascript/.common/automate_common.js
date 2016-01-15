
/**
		This is a common class to be used for the node.js code and javascript code.  Should be converted via browserify.
		This means WE DO NOT DO ANYTHING IN HERE THAT WONT RUN IN A BROWSER

**/


var messaging = require("/home/samantha/Documents/automationGIT/messaging/modules.js"); 
/* I would prefer to use the .files module reference here but browserify apparently resolves
 by doing some sort of inspection.  Because I resolve the paths at runtime, browserify cannot resolve
 and I don't feel like wasting my time on some module crap for something that might be resolved by them later
 slash something that might not matter much.  Maybe use proper npm stuff lol.*/


var update_topic = function(x){
	console.log("$");
};

var message_handler = messaging.message_handler.getMessageHandlerInstance();
message_handler.attachFunctionToMessageType(message_handler.MESSAGETYPES.SERVER_MESSAGES.SERVER_TOPIC_UPDATE, update_topic);


// sendout(message) should send the message to the server
// inbound function should be called e
var automate_common = function ( sendoutfunction, inboundfunction ){
	this.message_handler = message_handler;
	this.publication_manager = publication_manager;
	this.subscription_manager = subscription_manager;

	this.send_message_to_server = sendoutfunction;  // call this function to send messages to the server
};

/**
	this function gets called when the client has messages from the server
**/
automate_common.feed_message = function(inbound_message){

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
	message_handler: message_handler

};


