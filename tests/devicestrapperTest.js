
var assert = require("assert");
var FILEFINDER = '/.files.js';

var func = function(){
	var ds = require((require(process.env.HOME+FILEFINDER)).devicestrapper);
	var devicestrapper = new ds();

	config1 = devicestrapper.createConfig('192.161.1.2','internet',['temperature','humidity'],['wetness']);
	config2 = devicestrapper.createConfig('192.161.1.2','internet',['temperature','wetness'],['duh']);

	devicestrapper.addDevice(config1);
	devicestrapper.addDevice(config2);
	devicestrapper.addSubscriptions('192.161.1.2',['hello','okay']);
	devicestrapper.addSubscriptions('192.161.1.2',['bing bong','okay']);

	device = devicestrapper.devices['192.161.1.2'];
	try {
		devicestrapper.addSubscriptions('192.1.1.2',['hello']);
		return false;	// if gets to here, it didn't successfully error
	}catch(e){
	}

	devicestrapper.addPublications('192.161.1.2',['blue'])


	identifier = device.identifier;
	subscriptions = device.subscriptions;
	publications = device.publications;
	interface = device.network_interface;

	if (identifier != '192.161.1.2'){
		return false;
	}

	if (interface !='internet'){
		return false;
	}

	_=  require('underscore');

	if ( !_.isEqual(subscriptions, ['temperature','wetness','hello','okay','bing bong'])){
		return false;
	}

	devicestrapper.addPublications('192.161.1.2',['blue'])
	if ( !_.isEqual(publications, ['duh','blue'])){
		return false;
	}

	devicestrapper.removePublications ('192.161.1.2',['blue']);
	publications = devicestrapper.devices['192.161.1.2'].publications;
	if ( !_.isEqual(publications, ['duh'])){
		return false;
	}

	devicestrapper.removeSubscriptions('192.161.1.2');
	if (devicestrapper.devices['192.161.1.2'].subscriptions.length > 0) {
		return false;
	}


	devicestrapper.removePublications('192.161.1.2');
	if (devicestrapper.devices['192.161.1.2'].publications.length > 0) {
		return false;
	}
	return true;
}

describe ("devicestrapper test" , function(){
	it ("general devicestrapper test", function(){
		answer = func();
		assert.equal(answer, true);
	});

	it("get_update_topic -- returns topics, and only the topics, that should be sent out to devices", function(){
		var ds = require((require(process.env.HOME+FILEFINDER)).devicestrapper);
		var devicestrapper = new ds();
		config1 = devicestrapper.createConfig('192.161.1.2','internet',['temperature','ice','humidity'],['wetness']);
		config2 = devicestrapper.createConfig('192.161.1.3','internet',['temperature','ice','fire','wetness'],['duh']);
		devicestrapper.addDevice(config1);
		devicestrapper.addDevice(config2);
		var updates = devicestrapper.update_topics({
			temperature: 30,
			ice: 10
		});
		
		var expected_update = { 
			'192.161.1.2': { temperature: 30, ice: 10 },
  			'192.161.1.3': { temperature: 30, ice: 10 } 
  		}
  		assert.deepEqual(updates, expected_update);

	});

	it ("remove device " , function(){
		var ds = require((require(process.env.HOME+FILEFINDER)).devicestrapper);
		var devicestrapper = new ds();
		config1 = devicestrapper.createConfig('192.161.1.2','internet',['temperature','ice','humidity'],['wetness']);
		config2 = devicestrapper.createConfig('192.161.1.3','internet',['temperature','ice','fire','wetness'],['duh']);
		devicestrapper.addDevice(config1);
		devicestrapper.addDevice(config2);
		devicestrapper.removeDevice('192.161.1.3'); 
		var devices = devicestrapper.get_connected_devices();
  		assert.deepEqual(devices , ['192.161.1.2']);	
  		devicestrapper.removeDevice('192.161.1.2'); 
  		devices = devicestrapper.get_connected_devices();
  		assert.deepEqual(devices, []);
	});

	



	
});

