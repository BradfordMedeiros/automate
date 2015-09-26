// config :config: 
/*    sourceipaddress:
    devicename:
    subscriptions []: 
    publishers[] : ooo
    acceptsdata : true/false
    
   */ 

/*
   Class to manage the state of devices connected. 

*/
   
var _ = require('underscore');     



//topicmanager should go in here
var _devicestrapper = function (){
    console.log('changes made');
    var events = require('events');

    this.devices = { };  // mapping of all the devices to their identifiers, network, subscriptions, publications, etc
    this.subscriptions  = { }; //  mapping of a subscription to an array of the device identifiers that subscribe to it



    this.options = require ('./config/options.js');
    
    var localStorage = require ('node-localstorage').LocalStorage;  // used so we can save/load to file
    this.local = new localStorage('./data');
    this.messagehandler = (new (new require((require(process.env.HOME+'/.files.js')).messagehandler))).getMessageHandlerInstance();

    this.serialize_on_quit();                        // start listening to serialize on quit signal
    this._deserializeData();                      // load saved state of the data


}



_devicestrapper.prototype.createConfig = function ( identifier, network_interface, subscriptions, publications ) {
    if (identifier == undefined || network_interface == undefined || subscriptions === undefined || publications === undefined || 
           (!Array.isArray(subscriptions) && subscriptions !=null )|| (!Array.isArray(publications) && publications !=null)){
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
    this.devices[config.identifier] = config;
   
    if (config.subscriptions !=null){
        this.addSubscriptions(config.identifier,config.subscriptions);
    }
}

/*
// removes the device sppecified by the ip address*/
_devicestrapper.prototype.removeDevice = function ( identifier ){
   if ( this.devices[identifier] == undefined ){
    return;
   }
   var device_subscriptions = this.devices[identifier].subscriptions;

   delete this.devices[identifier];
   for ( subscription in device_subscriptions ){
        delete this.subscriptions[device_subscriptions[subscription]][identifier];
   }
}

/*



// adds subscription to the config file of the device.  Subscriptions can be single element or an array*/
_devicestrapper.prototype.addSubscriptions = function ( identifier , subscriptions ){
    if (subscriptions == null){
        throw (new Error('subscriptions cannot be null'));
    }  
    this._addGeneric (identifier, subscriptions, 'subscriptions'); 
    if (!Array.isArray(subscriptions)){
        var single_sub = subscriptions;
        subscriptions = new Array();
        subscriptions.push(single_sub);
    }  
    for ( var i = 0 ; i < subscriptions.length ; i++ ){
        if (this.subscriptions[subscriptions[i]] == undefined){
            this.subscriptions[subscriptions[i]] = { }
        }
        this.subscriptions[subscriptions[i]][identifier] = (this.devices[identifier]);
    }
}


_devicestrapper.prototype.addPublications = function (identifier , publications ){
    this._addGeneric (identifier, publications, 'publications');
}

_devicestrapper.prototype.removePublications = function (identifier, publications ){
    if (publications == undefined){
        publications = this.devices[identifier].publications;   // if publications undefined remove them all
    }
    this._removeGeneric (identifier, publications, 'publications');
}



_devicestrapper.prototype.removeSubscriptions = function (identifier , subscriptions){
    if (subscriptions == undefined){
        subscriptions = this.devices[identifier].subscriptions;
    }

    this._removeGeneric(identifier,subscriptions,'subscriptions');
}


/*
    
*/

//@todo right now
_devicestrapper.prototype.get_update_messages = function ( topics ){

    var client_to_update = { };

    var client_messages = { };  // message to send to each client]
    var client_topics = { };

    for ( topic in topics ){
        var subscriptions = this.subscriptions[topic];  // for topic field name
        console.log('subscriptions is: '+subscriptions);
        if (subscriptions == undefined){
            console.log('no subscriptions for topic '+topic);
            continue;
        }
        /*for ( var i = 0 ; i < subscriptions.length ; i++ ){     // add topic content to each device message
            console.log('added : '+topics[topic]+" to "+subscriptions[i]);
        }*/

        for ( subscriber in subscriptions ){
           /* if (client_topics[subscriptions[subscriber]] == undefined){
                client_topics[subscriptions[subscriber]] = { };
            }*/

            if (client_topics[subscriber] == undefined ){
                client_topics[subscriber]= { };
            }

            client_topics[subscriber][topic] = topics[topic]; // set value in client message for topic field
            console.log('added:  '+topics[topic] + 'to ' + subscriptions[subscriber]+ '('+subscriber+')');
        } 
    }

   /* for (topic in client_topics){
        console.log(client_topics[topic]);
    }*/

    //var update_message = this.messagehandler.getMessageBuilder(this.messagehandler.MESSAGETYPES.SERVER_MESSAGES.SERVER_TOPIC_UPDATE);

    return client_topics; 

}


///////////////////////////////////////////////////////////////
// all methods below are private

_devicestrapper.prototype._addGeneric = function ( identifier , fields, type ){

    if ( this.devices[identifier] == undefined ){
        throw ( new Error ("DEVICE NOT DEFINED: in adding subscriptions:  identifier = "+identifier ));
    }
    
    if (fields == undefined ){
        throw ( new Error ("SUBSCRIPTIONS NOT DEFINED: in adding fields: = "+fields) );
    }
    
    var config = this.devices[identifier];
    if ( config != undefined ){
    
        if (config[type] ==  undefined ){
            config[type] = new Array();
        }
        
        if (Array.isArray (fields) ){
            for ( var i = 0; i < fields.length; i++){
                if (! _.contains (config[type],fields[i] )){
                    config[type].push(fields[i]);
                }
            }
        }else{
            if (! _.contains (config[type], fields )){
                config[type].push(fields);
           }
        }
    }
}


// remove subscription to the config file of the device.  Subscriptions can be single element or an array
_devicestrapper.prototype._removeGeneric = function ( identifier, fields, type ){
    if ( this.devices[identifier] == undefined ){
        throw ( new Error ("DEVICE NOT DEFINED: in removing subscriptions:  ip = "+ip) );
    }
    
    var config = this.devices[identifier];
    this._removeArraySubset(config[type],fields)

    // remove from the array linking subcriptions to devices
    if (type == 'subscriptions'){
        for ( var i = 0 ; i < fields.length ; i++ ){  
        console.log(fields[i]);  
            delete this.subscriptions[fields[i]][identifier];
        }
    }
}

_devicestrapper.prototype._removeArraySubset = function (targetArray, subset){
    var i = targetArray.length, j = subset.length;

     while( i-- ) {
        while( j--) {
            if( targetArray[i] === subset[j] ) {
                targetArray.splice(i,1);
                break; 
                }
             }
        j = subset.length;
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
_devicestrapper.prototype.serialize_on_quit = function (){
    var events = require ('events');
    process.eventEmitter = new events.EventEmitter();
    var that = this;
    
    process.eventEmitter.on('quitsignal', function (){
        that._serializeData();
    }.bind(this));
    
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
        this.devices = { };
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