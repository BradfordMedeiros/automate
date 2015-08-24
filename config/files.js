/*

** THIS FILE SHOULD ALWAYS BE LOCATED IN /config/ **
Config must be located in the root of the project folder

This file details the locations of other files.  It you should read this file to get the location of another file. Do not ever hardcode file locations except for this one.

*/

var PWD = process.env.HOME + '/Documents/automationGIT/'

var filelocations = {


	// folders
	f_config  		: PWD + 'config/',

	// files - main project files
	abstractnetwork : PWD + 'abstractNetwork',
	bluetooth		: PWD + 'Bluetooth.js',
	interface		: PWD + 'Interface.js',
	internet 		: PWD + 'Internet.js',
	messagehandler  : PWD + 'messagehandler.js', 	
	messagetypes	: PWD + 'messagetypes.js',
	options			: PWD +'config/options.js',
	zigbee			: PWD + 'Zigbee.js',

	// files - test project files
	autotester		: PWD + 'autotester.js',

	// folders - test project files
	f_tests			: PWD + 'tests/'
	
};

module.exports = filelocations;
