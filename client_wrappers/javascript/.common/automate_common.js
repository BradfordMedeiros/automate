


var automate_common = function ( message_handler ){
	this.message_handler = message_handler;
	this.publication_manager = publication_manager;
	this.subscription_manager = subscription_manager;
};

var publication_manager = function (){
	this.publications = { };
	this.id_to_publications = { };
	this.publications_count = 0;
	this.id_counter = 0;
};



publication_manager.prototype.get_publications = function(){

};

publication_manager.prototype.add_publication = function ( publication  ){

	var publications_array = convert_to_string_array(publication);
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
	var subscriptions_array = convert_to_string_array(subscriptions);
	for ( var subscription in subscriptions_array ){
		if (this.subscription_to_id[subscriptions_array[subscription]] === undefined){
			this.subscription_to_id[subscriptions_array[subscription]] = { };
		}
		this.subscription_to_id[subscriptions_array[subscription]][this.id_counter] = true;
	}
	this.subscription_id_to_callback[this.number_of_subscriptions] = callback;
	this.number_of_subscriptions++;
	this.id_counter++;
	return this.id_counter-1;
};

subscription_manager.prototype.remove_subscription = function (id){
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

module.exports = {
	subscription_manager: subscription_manager,
	publication_manager: publication_manager,

};


