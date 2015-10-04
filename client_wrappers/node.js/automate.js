
var automate = {
	count : 0
};

automate.add_subscription = function ( ){

}

automate.add_publication = function () {

}

automate.remove_subscription = function (){

}

automate.remove_publication = function  (){

}


/**
	Creates a new subscription to topics.  Callback is called when a new message is passed in.
**/
var subscription = function ( subscriptions, callback ){

}

/**
	Stops messages from being passed to the callback function.
	This also stops messages from being sent to the device at all.  Messages will not be 
	sent to this ip.
**/
subscription.prototype.terminate = function ( ){

}

/**
	Creates a new publisher to topics.  Allows you to publish to topics.  
	Throws an error if the topic is set for exclusive access and it fails
**/
var publisher = function ( publications  ){

}

/**
	Publishes the topics to the main server.
**/
publisher.prototype.publish =  function ( topic_content ){

}

/**
	You stop the ability, and responsibility of publishing.
	The advantage  of calling this is that if other devices want to publish to the topic,
	and exclusively, this helps them with that. 
**/
publisher.prototype.terminate = function ( ){

}


subscription.prototype.automate = automate;



module.exports = {
	subscription: subscription
};