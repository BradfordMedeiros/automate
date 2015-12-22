
var automate = require("../automate.js");

var count = 0;
var get_next_parameter = function ( ){
	count++;
	return {
		temperature: count
	}
};

var update_temperature = function ( x ){
	Console.log(x);
};



var temperature_subscription = new automate.subscription("temperature", update_temperature);
var temperature_publication = new automate.publication("temperature");

var publish = function () {
	temperature_publication.publish ( get_next_parameter( ));	
};

setInterval( publish,1);