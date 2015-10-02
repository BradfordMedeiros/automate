
var FILEFINDER = '/.files'



var AbstractNetwork = function ( onMessageReceived ,  inbound_on , outbound_on, is_client){

	if (onMessageReceived == undefined){
		throw (new Error("must define a function to call when a message is received"))
	}
	this.onMessageReceived = onMessageReceived;


	this.isLoaded = false;
	this.network_interfaces = { };

	if (inbound_on == undefined){
		inbound_on = true;
	}

	if (outbound_on == undefined){
		outbound_on = true;
	}
	this.load_network_interfaces( inbound_on, outbound_on );

	this.sendsMessagesOutbound = (require(require(process.env.HOME+FILEFINDER).options)).sends_messages_outbound;
	
	// is client allows us to send client messages outbound
	if (is_client !=undefined){
		if (is_client == true || is_client == false){
			this.is_client = is_client;
		}else{
			throw (new Error ('client must be true/false/undefined (default to false'))
		}
	}else{
		is_client = false;
	}
}

// sends message to device defined by device config
AbstractNetwork.prototype.sendMessage = function ( message, deviceconfig ) {
	if (message == undefined || deviceconfig.identifier == undefined || deviceconfig.network_interface == undefined){
		throw (new Error("paramers incorrectly defined in AbstractNetwork::sendMessage"));
	}
	if (message.type != 'server' && this.is_client !=true){
		throw (new Error ('cannot send client messages outbound'));
	}

	if (!this.sendsMessagesOutbound){
		return;
	}
	this.network_interfaces[deviceconfig.network_interface].sendMessage(message,deviceconfig);
}

// called by attached network interfaces.  They will call this function when they receive a new message.  
AbstractNetwork.prototype._receivedInboundMessage = function (message){
	console.log('got message \n  '+message);
	this.onMessageReceived(message);
}

/**
	initailizes the network interfaces: saves network Ids, turns then on
**/
AbstractNetwork.prototype.load_network_interfaces = function ( inbound_on, outbound_on ){

	if (this.isLoaded){
		return;
	}

	var internet =  new (require(require(process.env.HOME+FILEFINDER).internet))();

	var interfaces = new Array();
	interfaces.push(internet);

	for (var i = 0 ;i < interfaces.length; i++){
		this.network_interfaces[interfaces[i].getNetworkID()] = interfaces[i];
		this.network_interfaces[interfaces[i].getNetworkID()].setOnMessageReceived (this.onMessageReceived);
		this.network_interfaces[interfaces[i].getNetworkID()].turn_on_interface( inbound_on, outbound_on );
	}

	this.isLoaded = true;
}




AbstractNetwork.prototype.deload_network_interfaces = function(){
	if (!this.isLoaded){
		return;
	}

	for (interface in this.network_interfaces){
		this.network_interfaces[interface].deload();
	}
	this.isLoaded = false;
}

module.exports = AbstractNetwork;





