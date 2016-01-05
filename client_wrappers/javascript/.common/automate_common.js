

var automate_common = function (){
	this.publication_manager = publication_manager;
	this.subscription_manager = subscription_manager;
};

var publication_manager = function (){

};



publication_manager.prototype.get_publications = function(){

};


var subscription_manager = function(){

	this.number_of_subscriptions = 0;
	this.subscription_to_id = { };
	this.subscription_id_to_callback = { };
};

subscription_manager.prototype.add_subscription = function (){
	//var subscriptions_array = 

};

subscription_manager.prototype.remove_subscription = function (id){

};



subscription_manager.prototype.get_subscriptions = function (){
	var subscriptions = [ ];
	for ( var field in this.subscription_to_id){
		subscriptions.push(field);
	}
	return subscriptions;
};


/**
	Helper function: 
	Converts to an array, or returns the array
	If the input consists of something which is not a string or array containing only strings, throws an error
**/

/*
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
};*/

module.exports = automate_common;


