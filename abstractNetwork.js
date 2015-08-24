 
var FILEFINDER = '/.files'



var AbstractNetwork = function ( onMessageReceived ){
	if (onMessageReceived == undefined){
		throw (new Error("must define a function to call when a message is received"))
	}
	var internet =  new (require(require(process.env.HOME+FILEFINDER).internet))();
	this.networkInterfaces = { };
	this.networkInterfaces[internet.getNetworkID()] = internet;
	this.onMessageReceived = onMessageReceived;

	// probably want to refactor so we say something like 
	// interface = require(interface.js);  
	// networkmods = interface.network_interfaces;
	// for (every in network mods)

}

// sends message to device defined by device config
AbstractNetwork.prototype.sendMessage = function ( message, deviceconfig ) {
	var interface = deviceconfig.network_interface
	if (interface == undefined){
		throw (new Error('interface must be defined in device config message'));
	}
	this.networkInterfaces[deviceconfig.network_interface].sendMessage(message);
}

// called by attached network interfaces.  They will call this function when they receive a new message.  
AbstractNetwork.prototype._receivedInboundMessage = function (message){
	console.log('got message \n  '+message);
}


var log = function(x){
	console.log(x);
}
var an = new AbstractNetwork(log);


