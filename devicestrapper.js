// config :config: 
/*    sourceipaddress:
    devicename:
    subscriptions []: 
    publishers[] : 
    acceptsdata : true/false
    
   */ 

/*
   This class is used for the general state of the application.  It knows info about what devices are hooked up, and schedules request 
   for messages to be forwared to the appropriate subscribers.  

   This program is based upon topics.  You can publish to a topic, and/or subscribe to it. PUblishers publish info about a topic (send) and 
   subscribers listen to that info.  

*/
   
var _ = require('underscore');     


var _devicestrapper = function (){
    

    this.devices = {};
    this.options = require ('./config/options.js');
    
    var localStorage = require ('node-localstorage').LocalStorage;  // used so we can save/load to file
    this.local = new localStorage('./data');

    this._listenForQuit();                        // start listening to serialize on quit signal
    this._deserializeData();                      // load saved state of the data
    
    
}

_devicestrapper.prototype.createConfig = function ( identifier, network_interface, subscriptions, publications ) {
    if (identifier == undefined || network_interface == undefined || subscriptions == undefined || publications == undefined || 
           !Array.isArray(subscriptions) || !Array.isArray(publications)){
        throw (new Error('Cannot create config:  arguments defined improperly'))
    }

    var config = {
        identifier: identifier,
        network_interface: network_interface,
        subscriptions: subscriptions,
        publications: publications
    }
    return config;
}


// BASIC EDIT DEVICE OPERATIONS
{

_devicestrapper.prototype.addDevice = function ( config ){
    if (this.options.DEVICESTRAPPER_VERBOSE){
        console.log("adding device");
    }
    
    
    if (config.identifier == undefined ){
        throw ( new Error ("SOURCE IP NOT DEFINED") );
    }

    this.devices = { };
    this.devices[config.identifier] = config;

}

/*
// removes the device sppecified by the ip address*/
_devicestrapper.prototype.removeDevice = function ( identifier ){
   delete this.devices[identifier];
}

/*



// adds subscription to the config file of the device.  Subscriptions can be single element or an array*/
_devicestrapper.prototype.addSubscriptions = function ( identifier , subscriptions ){

    
    if ( this.devices[identifier] == undefined ){
        throw ( new Error ("DEVICE NOT DEFINED: in adding subscriptions:  ip = "+ip ));
    }
    
    if (subscriptions == undefined ){
        throw ( new Error ("SUBSCRIPTIONS NOT DEFINED: in adding subscriptions: subscriptions = "+subscriptions) );
    }
    
    var config = this.devices[identifier];
    if ( config != undefined ){
    
        if (config.subscriptions ==  undefined ){
            config.subscriptions = new Array();
        }
        
        if (Array.isArray (subscriptions) ){
            for ( var i = 0; i < subscriptions.length; i++){
                if (! _.contains (config.subscriptions,subscriptions[i] )){
                    config.subscriptions.push(subscriptions[i]);
                }
            }
        }else{
            if (! _.contains (config.subscriptions,subscriptions )){
                config.subscriptions.push(subscriptions);
           }
        }
    }
    process.eventEmitter.emit('devicestrapper:deviceupdate', this.devices);

}


// remove subscription to the config file of the device.  Subscriptions can be single element or an array
_devicestrapper.prototype.removeSubscriptions = function ( identifier, subscriptions ){
    if ( this.devices[identifier] == undefined ){
        throw ( new Error ("DEVICE NOT DEFINED: in removing subscriptions:  ip = "+ip) );
    }
    
    
    var config = this.devices[identifier];
    
    if ( config != undefined ){
    
        if (Array.isArray (subscriptions) ){
            for ( var i = 0; i < subscriptions.length; i++){
                
                this._removeSingleSubscription ( identifier, subscriptions[i] );
            }
        }else{
            this._removeSingleSubscription ( identifier, subscriptions);
        }
    }
    

}

_devicestrapper.prototype._removeSingleSubscription = function ( identifier, subscription ){
    
    var config = this.devices[identifier];
    var i = config.subscriptions.indexOf(subscription);
    if ( i < 0){
        throw ( new Error ("INVALID REMOVAL OF SUBSCRIPTIONS (check arguments) removing Subscriptions:  ip = "+ip) );
    }
    if ( i > -1 && config.subscriptions.length > 1){
        config.subscriptions.splice(i,1);
    }else if (config.subscriptions.length == 1 && i > -1){
        delete config.subscriptions;
    }
    
}


/*
        NEED TO DO SAME FOR PUBLICATIONS
*/



}




/////////SERIALIZATION/////////////////////////////////////////////////


{

// Starts listening for the quitsignal.  If it gets it serialized data. 
// Does not end the program
_devicestrapper.prototype._listenForQuit = function (){
    var events = require ('events');
    process.eventEmitter = new events.EventEmitter();
    var that = this;
    
    process.eventEmitter.on('quitsignal', function (){
        that._serializeData();
    });
    
    if (this.options.DEVICESTRAPPER_VERBOSE){
        console.log("listen for quit init");
    }
    
    
// should call serialize data here
}

// saves data to file device_config in data folder to restore info about devices 
_devicestrapper.prototype._serializeData = function (){
    this.local.setItem('device_config', JSON.stringify(this.devices) );    
    if (this.options.DEVICESTRAPPER_VERBOSE){
        console.log("Serializing Data: Device Config");
    }

}

// loads device config file in devices
_devicestrapper.prototype._deserializeData = function (){
    this.devices = JSON.parse(this.local.getItem('device_config')); 
    if (this.devices == null){
        delete this.devices;
    }
    
    if (this.options.DEVICESTRAPPER_VERBOSE){
       console.log("deSerializing Data: Device Config");

    }

}

}


_devicestrapper.prototype.getString = function (){
    return this.devices;
}


module.exports = _devicestrapper;