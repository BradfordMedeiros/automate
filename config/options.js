/*
    Intermediate to standard out to have extra control
*/


var OPTIONS = {
    
    // used for extra verbosity in console.log messages
    DEVICESTRAPPER_VERBOSE: false,
    AUTOTESTER_VERBOSE: true,
    NETWORK_VERBOSE: true,
    WEBSERVER_VERBOSE: true,
    SCHEDULER_VERBOSE: false,


    WEBSERVER_ENABLED: true,

    

    // determines the rate the program will send messages to subscriber devices if no rate is specified
    DEFAULT_SENDING_SPEED: 0.01, 

    // the maximu  sending speed the program will send messages to devices, regardless of their requested speed
    MAX_SENDING_SPEED: 1/0,
    
    // topics which in addition to normaal behavior, will also contain special functionality (such as posting to facebook)
    SPECIAL_TOPICS: ['facebook','twitter' ],

    network_interfaces: {
        internet: true
    },

    interface_refresh_speed: 5, // check to see if interfaces are alive every X s -> calls isAvailable()
    request_port: 3821,      // port used to make message requests
    sends_messages_outbound: true,
    trigger_eval_period: 0.002 // how often triggers are evaluated

    
}



module.exports  = OPTIONS;
