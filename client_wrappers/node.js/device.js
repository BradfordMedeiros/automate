
var device = function () {
	this.subscriptions = [ ];
	this.publications = [ ];
};

/**
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

device.prototype.add_subscriptions =  function ( subscriptions ){
	var subscriptions_to_add = convert_to_string_array( subscriptions );
	for ( var element in subscriptions_to_add ){
		this.subscriptions.push(subscriptions_to_add[element]);
	}
};

device.prototype.remove_subscriptions = function ( subscriptions ) {
	var subscriptions_to_remove = convert_to_string_array(subscriptions);
	for ( var element in subscriptions_to_remove ){
		var index = this.subscriptions.indexOf(subscriptions_to_remove[element]);
		if (index > -1 ){
			this.subscriptions.splice(index,1);
		}
	}
};

device.prototype.get_subscriptions = function ( ){
	return this.subscriptions;
};

device.prototype.add_publications = function  ( publications ){
	var publications_to_add = convert_to_string_array(publications);
	for ( var element in publications_to_add ){
		this.publications.push(publications_to_add[element]);
	}
};

device.prototype.remove_publications = function ( publications ){
	var publications_to_remove = convert_to_string_array(publications);
	for ( var element in publications_to_remove ){
		var index = this.publications.indexOf(publications_to_remove[element]);
		if (index > -1 ){
			this.publications.splice(index ,1);
		}
	}
};

device.prototype.get_publications = function ( ){
	return this.publications;
};


module.exports = device;