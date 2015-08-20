/*

** THIS FILE SHOULD ALWAYS BE LOCATED IN /config/ **
Config must be located in the root of the project folder

This file details the locations of other files.  It you should read this file to get the location of another file. Do not ever hardcode file locations except for this one.

*/

var PWD = process.env.HOME + '/Documents/automation/'

var filelocations = {

	// folders
	tests			: PWD + 'tests/',
	config  		: PWD + 'config/',

	// files
	abstractnetwork : PWD + 'abstractNetwork',
	autotester		: PWD + 'autotester.js',
	bluetooth		: PWD + 'Bluetooth.js',
	interface		: PWD + 'Interface.js',
	internet 		: PWD + 'Internet.js',
	messagehandler  : PWD + 'messagehandler.js', 	
	messagetypes	: PWD + 'messagetypes.js',
	options			: PWD +'config/options.js',
	zigbee			: PWD + 'Zigbee.js'
	
	
};

module.exports = filelocations;
