
// BASIC ELEMENTARY TESTS
var FILEFINDER = '/.files.js';

var testsuite = new Array();
/////////TEST0/////////////////////////////////
var test0 = { };
test0.id = "MessageControl:  CLIENT: Client Device Init";
test0.func = function ( ){

	var mh =  require (require (process.env.HOME+FILEFINDER).messagehandler);
	var messagehandler = (new mh()).getMessageHandlerInstance();

	var messagetype = messagehandler.MESSAGETYPES.CLIENT_MESSAGES.CLIENT_DEVICE_INIT;
	var ds = require((require(process.env.HOME+FILEFINDER)).devicestrapper);
	var devicestrapper = new ds();

	var mcpath = (require(process.env.HOME+FILEFINDER)).messagecontrol;
	var message_control = (new (require(mcpath))(devicestrapper));


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
		'192.158.32.244': { identifier: '192.158.32.244',
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

   	var subscriptions_answer = {
   		temp: { 
   			'192.158.32.244': { identifier: '192.158.32.244',
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

 	var _ = require('underscore');
 	var device_equal = _.isEqual(answer,devices);
 	var subscriptions_equal = _.isEqual(subscriptions_answer,devicestrapper.subscriptions); 	
 	devicestrapper.subscriptions['temp']['192.158.32.244'].network_interface = 'fake';
 	var isreference = _.isEqual(devicestrapper.subscriptions['temp']['192.158.32.244'].network_interface , devicestrapper.devices['192.158.32.244'].network_interface);
 	return (device_equal && subscriptions_equal && isreference);
}

test0.answer = true;
testsuite.push(test0);

/////////TEST1/////////////////////////////////
var test1 = { };
test1.id = "MessageControl:  CLIENT: Remove Device";
test1.func = function ( ){
  var mh =  require (require (process.env.HOME+FILEFINDER).messagehandler);
  var messagehandler = (new mh()).getMessageHandlerInstance();

  var messagetype_add = messagehandler.MESSAGETYPES.CLIENT_MESSAGES.CLIENT_DEVICE_INIT;
  var ds = require((require(process.env.HOME+FILEFINDER)).devicestrapper);
  var devicestrapper = new ds();

  var mcpath = (require(process.env.HOME+FILEFINDER)).messagecontrol;
  var message_control = (new (require(mcpath))(devicestrapper));

  // add device
  var device_init_message = messagehandler.getMessageBuilder(messagetype_add).setSubscriptions(['temp','humidity']).setPublications(['width']).build();
  device_init_message.metadata.identifier = '192.158.32.244';
  device_init_message.metadata.network_interface = 'test_interface';
  messagehandler.feedMessage(device_init_message);
  var device_subs = device_init_message.body.subscriptions;
  //remove device
  var messagetype_remove = messagehandler.MESSAGETYPES.CLIENT_MESSAGES.REMOVE_DEVICE;
  var device_remove_message = messagehandler.getMessageBuilder(messagetype_remove).build();
  device_remove_message.metadata.identifier = '192.158.32.244';
  device_remove_message.metadata.network_interface = 'test_interface';

  messagehandler.feedMessage(device_remove_message);
  var device_removed = (devicestrapper.devices['192.158.32.244'] == undefined);
  var subs_removed = true;
 for (subscription in device_subs){
      if (devicestrapper.subscriptions[device_subs[subscription]]['192.158.32.244'] != undefined){
         console.log(device_subs[subscription]+ 'not removed')
         subs_removed = false;
      }
 }

  return [device_removed,subs_removed]
}

test1.answer = [true ,true];
testsuite.push(test1);

/////////TEST2/////////////////////////////////
var test2 = { };
test2.id = "MessageControl:  CLIENT: REMOVE DEVICE";
test2.func = function ( ){

	return false;
}

test2.answer = true;
testsuite.push(test2);

/////////TEST3////////////////////////////////
var test3 = { };
test3.id = "MessageControl:  CLIENT: Service Request";
test3.func = function ( ){

	return false;
}

test3.answer = true;
testsuite.push(test3);





module.exports = testsuite;


