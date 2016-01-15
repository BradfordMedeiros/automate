

/**
  ! this is WIP and kind of messy atm .
  This should be basically a couple line class at the end where you just create an
  automate_common.js instance, and open up a network.abstract network server of the appropriate type

**/

var files = require(process.env.HOME+"/.files.js");
var network = require(files.network);

var update= function(x){
	console.log(x);
};
var an = new network.abstract_network(update,['internet'],true,true,true);




var subscription = function(subscription, callback){
	this.handle = subscription_manager.add_subscription(subscription,callback);
};
subscription.prototype.stop = function(){
	subscription_manager.remove_subscription(this.handle);
};


var publication = function (publication){
	this.handle = publication_manager.add_publication(publication);
};
publication.prototype.stop = function(){
	publication_manager.remove_publication(this.handle);
};
publication.prototype.publish = function(){

};

var automate = {
	subscription: subscription,
	publication: publication,

	// do not expose these guys.  This is only here for debugging during dev of this file purposes
	p: publication_manager,
	s: subscription_manager
};

module.exports  = automate;