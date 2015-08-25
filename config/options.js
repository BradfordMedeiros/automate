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

    // the port used for post messages 
    NETWORK_PORT: 80,

    // determines the rate the program will send messages to subscriber devices if no rate is specified
    DEFAULT_SENDING_SPEED: 0.01, 

    // the maximu  sending speed the program will send messages to devices, regardless of their requested speed
    MAX_SENDING_SPEED: 1/0,
    
    // topics which in addition to normaal behavior, will also contain special functionality (such as posting to facebook)
    SPECIAL_TOPICS: ['facebook','twitter' ],

    interface_refresh_speed: 5 // check to see if interfaces are alive every X s



    
}



module.exports  = OPTIONS;
