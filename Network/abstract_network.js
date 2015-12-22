


var path = require ("path");
var interface_checker =  require( (require (process.env.HOME+"/.files.js")).interface);
//interface_checker.isValidInterface(__dirname+"/interface.json");

var AbstractNetwork = function ( onMessageReceived ,  interfaces_request, inbound_on, outbound_on, is_client){


	if (onMessageReceived === undefined){
		throw (new Error("must define a function to call when a message is received"));
	}
        if ( typeof(interfaces_request) != 'string' && !Array.isArray(interfaces_request)){
		throw (new Error("interfaces defined incorrectly"));
	}
        if ( interfaces_request.length === 0){
		throw (new Error ("interfaces must contain at least one interface, use string 'NO_INTERFACE' to specify no network interfaces"));
	}
	if ( is_client === undefined){
		throw (new Error ("is client must be defined"));
	}

	this.onMessageReceived = onMessageReceived;

	this.is_client = is_client;
	this.isLoaded = false;
	this.network_interfaces = { };
	this.interfaces_request = interfaces_request; // a request to turn on the following interfaces	
	if ( !Array.isArray (this.interfaces_request) && interfaces_request !== "NO_INTERFACE" ){
		this.interfaces_request = [];
		this.interfaces_request.push(interfaces_request);
	}

	// add code here to check that we did not request any interfaces that cannot be turned on 
	console.log("requesting interfaces:  "+JSON.stringify(this.interfaces_request));

	if (inbound_on === undefined){
		inbound_on = true;
	}

	if (outbound_on === undefined){
		outbound_on = true;
	}

	console.log(this);
	this.load_network_interfaces( inbound_on, outbound_on );

	this.sendsMessagesOutbound = outbound_on;
	
	// is client allows us to send client messages outbound
	if (is_client !== undefined){
		if (is_client === true || is_client === false){
			this.is_client = is_client;
		}else{
			throw (new Error ('client must be true/false/undefined (default to false'));
		}
	}else{
		this.is_client = false;
	}
};

// sends message to device defined by device config
AbstractNetwork.prototype.sendMessage = function ( message, identifier, network_interface ) {
	console.log("send message called!");
	if (message === undefined || identifier === undefined || network_interface === undefined){
		throw (new Error("paramers incorrectly defined in AbstractNetwork::sendMessage"));
	}
	if (message.type != 'server' && this.is_client !== true){
		throw (new Error ('cannot send client messages outbound'));
	}

	if (!this.sendsMessagesOutbound){
		return;
	}
	var response = this.network_interfaces[network_interface].send_message(message, identifier, network_interface);
	return response;
};

// called by attached network interfaces.  They will call this function when they receive a new message.  
AbstractNetwork.prototype._receivedInboundMessage = function (message){
	console.log('got message \n  '+message);
	this.onMessageReceived(message);
};

/**
	initailizes the network interfaces: saves network Ids, turns then on
**/
AbstractNetwork.prototype.load_network_interfaces = function ( inbound_on, outbound_on){

	console.log('loading interfaces');
 	console.log("attempting to load:  "+JSON.stringify(this.interfaces_request));
	if (this.isLoaded || this.interfaces_request == "NO_INTERFACE" ){
		return;
	}

	var interfaces  = [ ];

    if (this.interfaces_request.indexOf('internet') > -1 ){	
    	console.log("$$$"+this.is_client);
	    var internet =  new (require("./internet.js"))(this.is_client);
	    interfaces.push(internet);
	    console.log("Loading Interface: internet");
	}

	for (var i = 0 ;i < interfaces.length; i++){
		if ( !interface_checker.is_valid_interface(interfaces[i],__dirname+"/interface.json")){
			throw (new Error ("Invalid interface defined"));
		}
		this.network_interfaces[interfaces[i].get_network_id()] = interfaces[i];
		this.network_interfaces[interfaces[i].get_network_id()].set_on_message_received (this.onMessageReceived);
		this.network_interfaces[interfaces[i].get_network_id()].turn_on_interface( inbound_on, outbound_on );
	}

	this.isLoaded = true;
	console.log("finished sending requests to load");
};




AbstractNetwork.prototype.deload_network_interfaces = function(){
	if (!this.isLoaded || this.requested_interface === "NO_INTERFACE" ){
		return;
	}

	for (var interface in this.network_interfaces){
		console.log("deloading interface: "+interface);
		this.network_interfaces[interface].deload();
	}
	this.isLoaded = false;
};



module.exports = AbstractNetwork;





