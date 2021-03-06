
/**
    This class is the central logic and runtime storage of the server program.
    It keeps track of connected devices and  topics they subscribe to and publish.
    It may also keep track of various other meta data.

    This is the place of the program which represents the main state of the devices connected
**/
   
var _ = require('underscore');     

var _devicestrapper = function (){

    this.devices = { };         // mapping of all the devices to their identifiers, network, subscriptions, publications, etc
    this.subscriptions  = { };  //  mapping of a subscription to an array of the device identifiers that subscribe to it
    this.last_topic_received = { };

    // This has various options to the program.  I no longer like this technique as it violates the module structure I want to use.
    // @todo:refactor:severity:minor
    // Consider updating this to either reference a file located within this module scope, or just pass in as parameters.
    this.options = require ('./config/options.js');
    
    // @todo:consider -- why are we using this over FS exactly?  Why are we saving this value to object state if it's only used twice max during a 
    // programs lifetime?
    var localStorage = require ('node-localstorage').LocalStorage;  // used so we can save / load to file
    this.local = new localStorage('./data');

    this.serialize_on_quit();   // start listening to serialize on quit signal
    this._deserializeData();    // load saved state of the data
};

/**
{   title:  "devicestrapper.createConfig",
    description: "This creates a configuration object which is used to add a device.   Feed this to _devicestrapper.addDevice",
    params: {
        identifier: "unique id for the device",
        network_interface: "the interface associated with the config for the device",
        subscriptions: "topics which the device subscribers to",
        publications: "topics which the device publishes to"
    },
    return: "a config which described the device"
}
**/
_devicestrapper.prototype.createConfig = function ( identifier, network_interface, subscriptions, publications ) {
    if (identifier === undefined || network_interface === undefined || subscriptions === undefined || publications === undefined || 
           (!Array.isArray(subscriptions) && subscriptions !==null )|| (!Array.isArray(publications) && publications !== null)){
        throw (new Error('Cannot create config:  arguments defined improperly'));
    }

    var config = {
        identifier: identifier,
        network_interface: network_interface,
        subscriptions: subscriptions,
        publications: publications
    };
    return config;
};


/**
{   title: "devicestrapper.addDevice documentation",
    description: "This adds a device, specified by a configuration object (creatable by devicestrapper.createConfig) to the object state.
    It adds to a devices map, which maps the identifier of the device (which what an identifier is can vary, but at the time
    of writing I use identifiers to be something tied to the network type.  For example, I use IP addresses for those that come
    in on an internet interface.  It may also use something like a bluetooth identifier for a bluetooth network, for example.

    Also adds to a subscription map.  This is a map of subscription values that point directly to all identifiers which subscribe to it.
    This makes it so we can quickly find the devices subscribing to a topic.",

    params: "a config which describes properties of the device",
    return: "void"
}
**/
_devicestrapper.prototype.addDevice = function ( config ){

    if (this.options.DEVICESTRAPPER_VERBOSE){
        console.log("adding device");
    }
    
    if (config.identifier === undefined ){
        throw ( new Error ("SOURCE IP NOT DEFINED") );
    }
    this.devices[config.identifier] = config;
   
    if (config.subscriptions !== null){
        this.addSubscriptions(config.identifier,config.subscriptions);
    }
};


/**
{   title: "devicestrapper.removeDevice",
    param: "the identifier associated with the device to remove",
    return: "void"
}
**/
_devicestrapper.prototype.removeDevice = function ( identifier ){
   if ( this.devices[identifier] === undefined ){
    return;
   }
   var device_subscriptions = this.devices[identifier].subscriptions;

   delete this.devices[identifier];
   for ( var subscription in device_subscriptions ){
        delete this.subscriptions[device_subscriptions[subscription]][identifier];
   }
};


/**
{   title: "devicestrapper.addSubscriptions"
    param: {
        identifier: "the unique id of the device",
        subscriptions: "the string of the subscription, or array of subscriptions to add to the device"
    },
    return: "void"
}
**/
_devicestrapper.prototype.addSubscriptions = function ( identifier , subscriptions ){
    if (subscriptions === null){
        throw (new Error('subscriptions cannot be null'));
    }  

    this._addGeneric (identifier, subscriptions, 'subscriptions'); 
    if (!Array.isArray(subscriptions)){
        var single_sub = subscriptions;
        subscriptions = [ ];
        subscriptions.push(single_sub);
    }  
    for ( var i = 0 ; i < subscriptions.length ; i++ ){
        if (this.subscriptions[subscriptions[i]] === undefined){
            this.subscriptions[subscriptions[i]] = { };
        }
        this.subscriptions[subscriptions[i]][identifier] = (this.devices[identifier]);
    }
};


/**
{   title: "devicestapper.addPublications",
    params: {
        identifier: "identifier of device to add publications to",
        publications: "object or array of publications to add"
    },
    return: "void"
}
**/
_devicestrapper.prototype.addPublications = function (identifier , publications ){
    this._addGeneric (identifier, publications, 'publications');
};


/**
{   title: "devicestapper.removePublications",
    params: {
        identifier: "identifier of device to remove publications from",
        publications: "object or array of publications to remove"
    },
    return: "void"
}
**/
_devicestrapper.prototype.removePublications = function (identifier, publications ){
    if (publications === undefined){
        publications = this.devices[identifier].publications;   // if publications undefined remove them all
    }
    this._removeGeneric (identifier, publications, 'publications');
};


/**
{   title: "devicestapper.removeSubscriptions",
    params: {
        identifier: "identifier of device to remove subscriptions from",
        subscriptions "object or array of subscriptions to remove"
    },
    return: "void"
}
**/
_devicestrapper.prototype.removeSubscriptions = function (identifier , subscriptions){
    if (subscriptions === undefined){
        subscriptions = this.devices[identifier].subscriptions;
    }

    this._removeGeneric(identifier,subscriptions,'subscriptions');
};


//==========================================================================================================================
/**
{   title: "devicestrapper.get_network_interface",
    params: {
        identifier: "the id of the device to get network interface of"
    },
    return: "the network interface of the device"
}
**/
_devicestrapper.prototype.get_network_interface = function (identifier){
    if (identifier === undefined){
        throw (new Error("cannot get interface for non-existant device identifier: :"+identifier));
    }

    var network_interface  = this.devices[identifier].network_interface;

    if (network_interface === undefined){
        throw (new Error("no network interface for valid identifier, this shouldn't happen"));
    }
    return network_interface;
};


/**
{   title: "devicestrapper.get_connected_devices",
    params: "void",
    return: "an array of identifiers for connected devices"
}
**/
_devicestrapper.prototype.get_connected_devices = function (){
    var device_identifiers=  [];
    for ( var identifier in this.devices ){
        device_identifiers.push(identifier);
    }
    return device_identifiers;
};



/**
    @todo:feature:bug:severitymedium scope:easy -- make topics support single topic name (not as array)
{   title: "devicestapper.get_update_messages",
    description: gets the update topic messages to send to clients
    params: {
        topics: "a list of topics for which "
    },
    return: "a mapping between ips and the topic updates to send them
      ex  {
            '192.143.234': {
                fire: 21,
                ice: "wet"
            },
            "d2:42:34": {
                fire: 21
            }
          }
    "
}
**/

_devicestrapper.prototype.update_topics = function ( topics ){

    var client_messages = { };  // message to send to each client]
    var client_topics = { };


    this.update_last_topic_received (topics); // used so we know what was the value of the last topic published

   /* var resolved_topics_map ={} 
    topics.map(function(topic){
        this.resolve_topic_identifier_to_topics(resolved_topics).forEach(
            function(added_topic){
                resolved_topics[added_topic] = true;
            });

    });*/

  //  var resolved_topics = Object.keys(resolved_topics_map);

    for ( var topic in topics ){
        //var subscriptions = this.subscriptions[topic];  // for topic field name
        var subscriptions = this.resolve_topic_identifier_to_topics(topic)


        if (subscriptions === undefined){
            console.log('no subscription for topic '+topic);
            continue;
        }

        for ( var subscriber in subscriptions ){
            if (client_topics[subscriber] === undefined ){
                client_topics[subscriber]= { };
            }
            client_topics[subscriber][topic] = topics[topic]; // set value in client message for topic field
        } 
    }

    console.log("client topic are ")
    console.log(client_topics)
    return client_topics; 
};

/**
    Handles returning multiple subscriptions for each potential subscription 
    based upon regex symbols
**/
_devicestrapper.prototype.resolve_topic_identifier_to_topics = function(topic_identifier){
   
   console.log("topic_identifier: "+topic_identifier)


   var that = this;
   var keys = Object.keys(this.subscriptions).filter(topic => is_wildcard_match(topic_identifier,topic));
   var subscribers = { };
   console.log("keys are: ");
   console.log(keys);

   for (var key in keys){
        var thing = this.subscriptions[keys[key]]
        console.log("$")
        console.log(thing);
        var device = this.subscriptions[keys[key]].valueOf();
        var device_keys = Object.keys(device);
        for (var the_key in device_keys){
            subscribers[device_keys[the_key]] = device[device_keys[key]];
        }
        //subscribers = subscribers.concat(this.subscriptions[keys[key]]);
   }
   return subscribers;
};




function is_wildcard_match(str, rule) {
  return globStringToRegex(rule).test(str);
}

function globStringToRegex(str) {
    return new RegExp(preg_quote(str).replace(/\\\*/g, '.*').replace(/\\\?/g, '.'), 'g');
}
function preg_quote (str, delimiter) {
    // http://kevin.vanzonneveld.net
    // +   original by: booeyOH
    // +   improved by: Ates Goral (http://magnetiq.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: preg_quote("$40");
    // *     returns 1: '\$40'
    // *     example 2: preg_quote("*RRRING* Hello?");
    // *     returns 2: '\*RRRING\* Hello\?'
    // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
    // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'
    return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
}

_devicestrapper.prototype.update_last_topic_received = function (topics) {

    for (var topic in topics){
        if (this.last_topic_received[topic] === undefined){
            this.last_topic_received[topic] = { };
        }
        this.last_topic_received[topic].value = topics[topic];

        // Gets UTC time
        this.last_topic_received[topic].time = new Date().toISOString().replace('T', ' ').substr(0, 19)
    }
};

_devicestrapper.prototype.get_last_topic_update_received = function ( topic ){
    
    var that = this;

    var topic_array = [].concat(topic);
    var update = { };
    topic_array.map(function(the_topic){
        if (that.last_topic_received[the_topic] === undefined){
            throw (new Error("topic is undefined: "+the_topic));
        }
        update[the_topic] = that.last_topic_received[the_topic];
    });

    return update;
};





/**
@todo:feature
{   title: "devicestapper.is_valid_update",
    params: "void",
    return: "void"
}
**/
_devicestrapper.prototype.get_is_valid_update = function (){
    console.log("WARNING FUNCTION IS UNCODED.  CODE THIS TO CHECK PUBLICATIONS B4 SENDING");
    return true;
};


//-----------------------------------------------------------------------------------
// all methods below are private, helper functions for stuff
//-----------------------------------------------------------------------------------


_devicestrapper.prototype._addGeneric = function ( identifier , fields, type ){

    if ( this.devices[identifier] === undefined ){
        throw ( new Error ("DEVICE NOT DEFINED: in adding subscriptions:  identifier = "+identifier ));
    }
    
    if (fields === undefined ){
        throw ( new Error ("SUBSCRIPTIONS NOT DEFINED: in adding fields: = "+fields) );
    }
    
    var config = this.devices[identifier];
    if ( config !== undefined ){
    
        if (config[type] ===  undefined ){
            config[type] = [];
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
};


// remove subscription to the config file of the device.  Subscriptions can be single element or an array
_devicestrapper.prototype._removeGeneric = function ( identifier, fields, type ){
    if ( this.devices[identifier] === undefined ){
        throw ( new Error ("DEVICE NOT DEFINED: in removing subscriptions:  ip = "+ip) );
    }
    
    var config = this.devices[identifier];

    if (!Array.isArray(fields)){
        var field = fields;
        fields = [];
        fields.push(field);
    }
    this._removeArraySubset(config[type],fields);

    // remove from the array linking subcriptions to devices
    if (type == 'subscriptions'){
        for ( var i = 0 ; i < fields.length ; i++ ){  
        console.log(fields[i]);  
            delete this.subscriptions[fields[i]][identifier];
        }
    }
};

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
};



/////////SERIALIZATION/////////////////////////////////////////////////


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
};

// saves data to file device_config in data folder to restore info about devices 
_devicestrapper.prototype._serializeData = function (){

    this.local.setItem('device_config', JSON.stringify(this.devices) );    
    if (this.options.DEVICESTRAPPER_VERBOSE){
        console.log("Serializing Data: Device Config");
    }

};

// loads device config file in devices
_devicestrapper.prototype._deserializeData = function (){
    this.devices = JSON.parse(this.local.getItem('device_config')); 
    if (this.devices === null){
        this.devices = { };
    }
    
    if (this.options.DEVICESTRAPPER_VERBOSE){
       console.log("deSerializing Data: Device Config");

    }

};




module.exports = _devicestrapper;
