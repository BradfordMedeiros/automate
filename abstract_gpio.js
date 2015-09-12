/*
	Considerations: 
	Allow more than one gpio interface (i think it's a good idea)
	How to translate gpio mappings?  
	maybe something like:
	gpio[device_name].write_pin (8);
	ex) 


*/
var system_gpio = function ( ){


}

// think about this one, doesn't make too much sense right now
// we probably need to write and read pins in different orders for multiple function types
system_gpio.prototype.reserve_pins_for_function = function ( device, pin_set, function_name, function  ){

}

system_gpio.prototype.get_device_functions = function ( device ){
	
}

system_gpio.prototype.write_pin = function ( pin_number ){

}

system_gpio.prototype.read_pin = function ( pin_number ){

}

system_gpio.prototype.get_available_pins = function ( device ) {

}

system_gpio.prototype.is_pin_locked = function ( device, pin_number ){

}

system_gpio.prototype.lock_pin = function ( device, pin_number ){

}



// system_gpio.lock_pin('arduino',9);
// system_gpio.get_available_pins('mbed');
	// => [1,2,3,4,6,10];
// system_gpio.lock_pin('arduino',10);
// system_gpio.get_available_pins('mbed');
	// =? [1,2,3,4,6]


