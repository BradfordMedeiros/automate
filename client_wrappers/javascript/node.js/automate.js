

/**
  ! this is WIP and kind of messy atm .
  This should be basically a couple line class at the end where you just create an
  automate_common.js instance, and open up a network.abstract network server of the appropriate type

**/

var files = require(process.env.HOME+"/.files.js");
var SERVER_IDENTIFIER = "localhost";
var SERVER_NETWORK_INTERFACE = "internet";

var messaging = require(files.messaging);
var network = require(files.network);
var automate_common = require("./common/automate_common.js");


var message_handler = messaging.message_handler.getMessageHandlerInstance();

var abstract_network = new network.abstract_network(message_handler.feedMessage.bind(message_handler),['internet'],true,true,true);

var send_network_message = function(outbound_message){
	console.log(outbound_message);
	abstract_network.sendMessage(outbound_message,SERVER_IDENTIFIER,SERVER_NETWORK_INTERFACE);
}
var automate = new automate_common(send_network_message); // calls send_network_message when it wants to send 
															//something to the server

var update_automate = function(message){
	automate.feed_update_message(message);
}
message_handler.attachFunctionToMessageType(message_handler.MESSAGETYPES.SERVER_MESSAGES.SERVER_TOPIC_UPDATE,update_automate);


var subscription = function(subscription, callback){
	this.handle = automate.add_subscription(subscription, callback);
};
subscription.prototype.stop = function(){
	if (this.handle === undefined){
		throw (new Error("handle undefined.  Subscription was never initialized correctly"));
	}
	automate.remove_subscription(this.handle);
};


var publication = function (publication){
	this.handle = automate.add_publication(publication);
};
publication.prototype.stop = function(){
	if (this.handle === undefined){
		throw (new Error("handle undefined.  Publication was never initialized correctly"));
	}
	automate.remove_publication(this.handle);
};
publication.prototype.publish = function(body){
	automate.publish(this.handle, body);
};

var automate_ = {
	subscription: subscription,
	publication: publication	
};

module.exports  = automate_;