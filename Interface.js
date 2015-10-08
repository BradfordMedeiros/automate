// Automatically add interfaces in interface folder
var INTERFACE_FOLDER = process.env.HOME+'/Documents/automationGIT/Interfaces/';
var _ = require('underscore');


var interface  = function (){};

/**
	checks whether or not the object satisfied the interface specified by the file path
	interfaces should be formatted as a json file like
	{
		name: <interface name>,
		functions:{
			<function_name0>: [param0, param1, etc],
			<function_name1>: [param0, etc],
			<function_name2>: []
		}	
	}
	
	Recommended to put name the interface interface.json and put it in the same module/directory
	of whatever will be using that interface
**/
interface.prototype.is_valid_interface = function (object, file_path){
	var local_interface = require (file_path);
	if ( local_interface.functions === undefined || local_interface.name === undefined){
		throw (new Error ("interface description defined improperly at "+file_path));
	}

	var functions = local_interface.functions;
	var functions_defined = true;
	for ( var func in functions ){
		if ( typeof (object[func]) === "function" ){
			var parameters = this._get_parameter_names(object[func]);
			if ( ! _.isEqual (parameters, functions[func]) ){
				functions_defined = false;
				break;
			}
		}else{
			functions_defined = false;
			break;
		}
	}
	return functions_defined;
};

/**
	Returns as an array the parameter names of the function definition.
**/
interface.prototype._get_parameter_names = function( func ){
	var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
	var ARGUMENT_NAMES = /([^\s,]+)/g;	

	var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  	var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  	if(result === null){
  		result = [];
  	}
  	return result;
};

module.exports = new interface();