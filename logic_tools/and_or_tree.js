
/* 
 Usage:

 topics = { 
 	humidity: 20,
 	temp: 70
 }
 var check_temp = function( topics ){
	return topics.humidity > 30;
 }

 var send_to_client = function (topics){
	/// stuff to send message here
 }
 node = new atom_node ('temperature > 10 check', check_temp, topics)
var temperature_atom = and_or_tree.get_atom_node (topics, check_temp, send_to_client, 'temperature_atom');
and_or_tree.evaluate();

and_or_tree.create_composite_node(callback_function, atoms[], tag);

ex). 
var close_door = function (){
	// code to close a door
}
and_or_tree.create_composite_node(close_door, [temperature_atom, humidity_atom,composite], 'door_close composite');

callbackfunction ( temperature_reference, humidity_reference, other_composite_references){
	
}


*/

var DEFAULT_NAME = 'default_name';
var and_or_tree = function ( ){
	this.atom_nodes = { };
	this.composite_nodes = { };
	this.atom_handle_counter = 0;
	this.composite_handle_counter = 0;
}

var atom_node = function( atom_name, eval_function, reference_data , callback){
	if (atom_name == undefined || eval_function == undefined || reference_data == undefined ){
		throw (new Error("parameters not defined"));
	}
	this.eval_function = eval_function;
	this.reference_data = reference_data;
	this.atom_name = atom_name;
	this.truth = false;
	this.callback = callback;
}

atom_node.prototype._classname = 'atom_node';



// true if any of the or children are true or all of the and children
var composite_node = function ( composite_node_name, or_children ) {
	this.or_children = or_children; // if any of the children are true this is true, this is an array of and lists
}


composite_node.prototype._classname = 'composite_node';



// @ returns a handle to the atom node
and_or_tree.prototype.get_atom_node = function ( reference_data, eval_function , callback_on_true, atom_name){
	if (eval_function == undefined){
		throw (new Error('must have a eval function defined'));
	}


	if (atom_name === undefined){
		atom_name = DEFAULT_NAME+this.atom_handle_counter;
	}
	var atom = new atom_node(atom_name,eval_function,reference_data, callback_on_true);
	this.atom_nodes[ this.atom_handle_counter ] = atom;
	this.atom_handle_counter ++;
	return (this.atom_handle_counter-1);
}


and_or_tree.prototype.evaluate_atom_nodes = function () {
	for ( atom_handle in this.atom_nodes ){
		var atom = this.atom_nodes[atom_handle];
		var truth = atom.eval_function(atom.reference_data);
		if (truth !=true && truth !=false){
			throw (new Error ('evaluation function for atom node '+atom.atom_name+ ' returned a value that was not true or false, actual value: '+truth));
		}

		atom.truth = truth;
		if (atom.truth){
			if (atom.callback != undefined ){
				atom.callback(atom.reference_data);
			}
		}
	}
}

and_or_tree.prototype.clear_atoms = function (){
	this.atom_nodes = { };
	this.atom_handle_counter = 0;
}

// callback function will fire 
// param or_children should be an array of and nodes
and_or_tree.prototype.create_composite_node = function ( callback, or_children, composite_node_name ){
	if (typeof(callback) !== "function"){
		throw (new Error("callback must be a function"));
	}

	for ( var list in or_children ){
		if (!Array.isArray(list)){
			throw (new Error("element or or_children must be arrays"));
		}
	}

	if ( composite_node_name == undefined){
		composite_node_name = DEFAULT_NAME+this.composite_handle_counter;
	}

	var composite_node = new composite_node( composite_node_name, or_children );
	this.composite_nodes[ this.composite_handle_counter] = composite_node;
	this.composite_handle_counter++;
	return (this.composite_handle_counter -1);
}



and_or_tree.prototype.toString = function(){
	string = "";
	for (atom in this.atom_nodes){
		string +='atom: '+atom;
		string +='value:  '+this.atom_nodes[atom];
	}
}




module.exports = and_or_tree;