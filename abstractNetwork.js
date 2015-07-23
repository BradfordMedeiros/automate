 
var AbstractNetwork = function ( ){

}


// look at the device config, and decide how to send it. 

// look at eventEmitter --> it should send messages to 
// something this is listening to.  Should send messages, and
// the device config of where to send it to. 

AbstractNetwork.prototype.sendMessage = function ( message, deviceconfig ) {

}


// these things should probably just call other classes 
// should be something like:
// this.Bloothtooth.sendMessage (message, devicename);

AbstractNetwork.prototype.sendHttpMessage = function ( ){

}

AbstractNetwork.prototype.sendBluetoothMessage = function ( ){

}

AbstractNetwork.prototype.sendZigbeeMessage = function ( ){

}