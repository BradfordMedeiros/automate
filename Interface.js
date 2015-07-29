var Interface  = function (){
	this.a = 2;

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
Interface.prototype.supportsInterface = function (inheritorclass, interfaceName){
	throw (new Error("OH MY GAWD FAIL"))
}

module.exports = Interface;