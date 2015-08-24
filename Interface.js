// Automatically add interfaces in interface folder
var INTERFACE_FOLDER = './Interfaces/'
var _ = require('underscore');


var _Interface  = function (){
	this.interfaces = {}

}




_Interface.prototype.getParameterNames = function( func ){
	var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
	var ARGUMENT_NAMES = /([^\s,]+)/g;	

	var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  	var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  	if(result === null){
  		result = [];
  	}
  	return result;
}

_Interface.prototype.isValidInterface = function (interface){

	// ensure the file name is not the swap file
	return ( (interface[interface.length-1] == '~')? false: true);
}

_Interface.prototype.getInterfaceModules = function ( ){
	return this.interfaces;
}


_Interface.prototype.refreshInterfaceModules = function (){
	
		this.interfaces = { };
		var fs = require('fs');
		var interfaceNames = fs.readdirSync( INTERFACE_FOLDER );
		for (var i = 0; i < interfaceNames.length; i ++){
			if ( this.isValidInterface(interfaceNames[i]) ){
				var module = require(INTERFACE_FOLDER+interfaceNames[i]);
				//this.interfaces[interfaceNames[i]] =(require(INTERFACE_FOLDER+interfaceNames[i]));
				if (module.name == undefined){
					throw (new Error("INTERFACES MUST HAVE NAME VALUE"))
				}

				this.interfaces[module.name] = module;

				
			}
		}


}


//*** _--> SHOULD LOOK IN FOLDER CALLED /INTERFACES
// load up different interface names and the functions required
//  put the thing at bottom to support it 

// I like the idea of this being checked in the classes wanting to be in the
// interface

//--> in the class trying to be part
// Object._interface = <InterfaceName>
// Interface.supportInterface(self,)

//@todo --> see if the functions you need are supported




var interfaces = new _Interface();
interfaces.refreshInterfaceModules();


var implementsInterface = function (object, interface){
	objectInst = new object();
	var interfaceToCheck = interfaces.interfaces[interface]
	if (interfaceToCheck == undefined){
		throw (new Error("Interface undefined"))
	}

	for (element in interfaceToCheck.functions){	// for every function
		var parameters = interfaces.getParameterNames(objectInst[element]);	// get paramets of function implementing interface
		if (! _.isEqual(interfaceToCheck.functions[element],parameters)){
			throw (new Error("does not implement interface properly"))
		}
	}
	delete objectInst;
}

//module.exports = _Interface;
module.exports = implementsInterface;