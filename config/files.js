/*

** THIS FILE SHOULD ALWAYS BE LOCATED IN /config/ **
Config must be located in the root of the project folder

This file details the locations of other files.  It you should read this file to get the location of another file. Do not ever hardcode file locations except for this one.

*/

var PWD = process.env.HOME + '/Documents/automation/'

var filelocations = {
	options			: PWD +'config/options.js',

	// the root of the test folder.  
	tests			: PWD + 'tests/',

	autotester		: PWD + 'autotester.js',
	messagehandler  : PWD + 'messagehandler.js', 	
	messagetypes	: PWD + 'messagetypes.js'	
	
};

module.exports = filelocations;
