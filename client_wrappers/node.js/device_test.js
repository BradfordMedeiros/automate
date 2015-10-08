
var assert = require("assert");
var devices = require("./device.js");

describe ("device.js tests", function(){

	var device = new devices();
	it ("add subscriptions", function(){
		device.add_subscriptions (["fire","water"]);
		device.add_subscriptions("ice");
		var subscriptions = device.get_subscriptions();
		assert.equal(subscriptions.length, 3);
		assert.notEqual(subscriptions.indexOf("fire"), -1);
		assert.notEqual(subscriptions.indexOf("water"), -1);
		assert.notEqual(subscriptions.indexOf("ice"), -1);
	});

	it ("remove subscriptions", function(){
		device.remove_subscriptions(["ice","water"]);
		device.remove_subscriptions("notinarray");
		var subscriptions = device.get_subscriptions();
		assert.deepEqual(subscriptions, ["fire"]);
		device.remove_subscriptions("fire");
		assert.deepEqual(subscriptions, []);
	});

	it ("add publications", function(){
		device.add_publications (["fire","water"]);
		device.add_publications("ice");
		var publications = device.get_publications();
		assert.equal(publications.length, 3);
		assert.notEqual(publications.indexOf("fire"), -1);
		assert.notEqual(publications.indexOf("water"), -1);
		assert.notEqual(publications.indexOf("ice"), -1);

	});

	it ("remove publications", function(){
		device.remove_publications(["ice","water"]);
		device.remove_publications("notinarray");
		var publications = device.get_publications();
		assert.deepEqual(publications, ["fire"]);
		device.remove_publications("fire");
		assert.deepEqual(publications, []);
	});

});