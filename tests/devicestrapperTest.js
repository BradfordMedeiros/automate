
var assert = require("assert");
var FILEFINDER = '/.files';

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
	it ("general devicestrapper test, consider moving into seperate tests", function(){
		answer = func();
		assert.equal(answer, true);
	});

});