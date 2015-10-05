
	var assert = require("assert");
	var FILEFINDER = '/.files.js';
        var files = require(process.env.HOME+FILEFINDER);
	var messaging = require (files.messaging);

describe ("MessageControl.js test - note: messagecontrol needs a reference to devicestrapper for these things to hold" , function () {
    var null_network = require (files.abstractnetwork);
 
    
    it ("message control passes CLIENT_DEVICE_INIT message successfully", function(){
        var mh =  new messaging.message_handler;
        var messagehandler = mh.getMessageHandlerInstance();
        var messagetype = messagehandler.MESSAGETYPES.CLIENT_MESSAGES.CLIENT_DEVICE_INIT;
        var ds = require((require(process.env.HOME+FILEFINDER)).devicestrapper);
        var devicestrapper = new ds();
        var mcpath = (require(process.env.HOME+FILEFINDER)).message_router;
        var message_control = (new (require(mcpath))(devicestrapper,null_network));

        var device_init_message = messagehandler.getMessageBuilder(messagetype).setSubscriptions(['temp','humidity']).setPublications(['width']).build();
        var device_init_message2 = messagehandler.getMessageBuilder(messagetype).setSubscriptions(['humidity']).setPublications(['width']).build();
        device_init_message.metadata.identifier = '192.158.32.244';
        device_init_message.metadata.network_interface = 'test_interface';
        device_init_message2.metadata.identifier = '28.29.43.212';
        device_init_message2.metadata.network_interface = 'test_interface';

        messagehandler.feedMessage(device_init_message);
        messagehandler.feedMessage(device_init_message);
        messagehandler.feedMessage(device_init_message);
        messagehandler.feedMessage(device_init_message2);

        var devices = devicestrapper.devices;
        var answer = { 
        '192.158.32.244': { 
                    identifier: '192.158.32.244',
                    network_interface: 'test_interface',
                    subscriptions: [ 'temp', 'humidity' ],
                    publications: [ 'width' ] 
                    },
        '28.29.43.212':   { 
                    identifier: '28.29.43.212',
                    network_interface: 'test_interface',
                    subscriptions: ['humidity'],
                    publications: [ 'width' ] 
                    } 
        }

         var subscriptions_answer = {
            temp: { 
            '192.158.32.244': { 
                    identifier: '192.158.32.244',
                    network_interface: 'test_interface',
                    subscriptions: [ 'temp', 'humidity' ],
                    publications: [ 'width' ] 
                },
          },
      humidity: 
        { '192.158.32.244': { identifier: '192.158.32.244',
                network_interface: 'test_interface',
                subscriptions: [ 'temp', 'humidity' ],
                publications: [ 'width' ] 
                },
           '28.29.43.212':   { identifier: '28.29.43.212',
                network_interface: 'test_interface',
                subscriptions: ['humidity'],
                publications: [ 'width' ] 
                } 
            }   
        }

        assert.deepEqual(answer,devices);
        assert.deepEqual(subscriptions_answer,devicestrapper.subscriptions);   
        devicestrapper.subscriptions['temp']['192.158.32.244'].network_interface = 'fake';
        assert.deepEqual(devicestrapper.subscriptions['temp']['192.158.32.244'].network_interface , devicestrapper.devices['192.158.32.244'].network_interface);
        messagehandler = undefined;
        
    });

    it ("message control pass REMOVE_DEVICE message to devicestrapper", function() {
        var mh =  new messaging.message_handler;
        var messagehandler = mh.getMessageHandlerInstance();
        var messagetype = messagehandler.MESSAGETYPES.CLIENT_MESSAGES.CLIENT_DEVICE_INIT;
        var ds = require((require(process.env.HOME+FILEFINDER)).devicestrapper);
        var devicestrapper = new ds();
        var mcpath = (require(process.env.HOME+FILEFINDER)).message_router;
        var message_control = (new (require(mcpath))(devicestrapper,null_network));

        var device_init_message = messagehandler.getMessageBuilder(messagetype).setSubscriptions(['temp','humidity']).setPublications(['width']).build();
        var device_init_message2 = messagehandler.getMessageBuilder(messagetype).setSubscriptions(['humidity']).setPublications(['width']).build();
        var remove_device = messagehandler.getMessageBuilder(messagehandler.MESSAGETYPES.CLIENT_MESSAGES.REMOVE_DEVICE).build();
        remove_device.metadata.identifier = "192.158.32.244";   // we do this because remove device normal just removes device for what interface it came in on


        device_init_message.metadata.identifier = '192.158.32.244';
        device_init_message.metadata.network_interface = 'test_interface';
        device_init_message2.metadata.identifier = '28.29.43.212';
        device_init_message2.metadata.network_interface = 'test_interface';

        messagehandler.feedMessage(device_init_message);
        messagehandler.feedMessage(device_init_message2);

        messagehandler.feedMessage(remove_device);  // this should remove "192.158.32.244";
        var devices = devicestrapper.get_connected_devices();
        assert.deepEqual(['28.29.43.212'], devices);


    });

    it ("TOPIC_UPDATE routes topic_update messages to devicestrapper and sends them to messagehandler" , function(){
    	fail();    
    });


});
