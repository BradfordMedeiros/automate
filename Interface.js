// Automatically add interfaces in interface folder
var INTERFACE_FOLDER = './Interfaces/'

var Interface  = function (){


	console.log('-----------------');
	//console.log(interfaces)
		console.log('-----------------');

/*	for ( interface in interfaces ){
		this.addInterface ( interface );
	}*/

}

Interface.prototype.isValidInterface = function (interface){

	// ensure the file name is not the swap file
	return ( (interface[interface.length-1] == '~')? false: true);
}

Interface.prototype.getInterfaceModules = function ( ){
	return this.interfaces;
}


Interface.prototype.refreshInterfaceModules = function (){
		this.interfaces = { };

		var fs = require('fs');
		var interfaceNames = fs.readdirSync( INTERFACE_FOLDER );
		for (var i = 0; i < interfaceNames.length; i ++){
			if ( this.isValidInterface(interfaceNames[i]) ){
				this.interfaces[interfaceNames[i]] =(require(INTERFACE_FOLDER+interfaceNames[i]));
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




var interfaces = new Interface();
interfaces.refreshInterfaceModules();

var implementsInterface = function (object, interfaces){
	for (func in object){
		if ( typeof (func) ==  'function' ){
			console.log(func)
		}
	}
}


module.exports = implementsInterface;