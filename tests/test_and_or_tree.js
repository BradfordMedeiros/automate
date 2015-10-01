
var assert = require("assert");
var and_or_tree = new (require('../and_or_tree.js'));

describe("and_or_tree.js test, getting an atom node", function(){


	it ("error when no arguments providers to get atom", function(){
		var error = false;
		var atom_handle;
		try {
			atom_handle = and_or_tree.get_atom_node();

		}catch(e){
			error = true;
		}
		assert.equal(error,true);
	});

	it ("returns a unique handle back to the atom- tested by comparing 2 handles", function(){
		var x = { 
			a: 2,
			b: 3
		}
		var atom_handle = and_or_tree.get_atom_node(x, function( X ){
			X.a = 10;
			return true;
		});

		var atom_handle2 = and_or_tree.get_atom_node(x, function( X ){
			X.a = 10;
			return false;
		});
		assert.notEqual(atom_handle,undefined);
		assert.notEqual(atom_handle,atom_handle2);

	});
});

describe("and_or_tree.js test, evaluating an atom node", function(){
		var data = {
				x: 2,
				y: 3,
				other: 6
		};

		it ("does not call callback when node evaluates to false",function(){
			
			var manipulate_value = function(data){
				data.x = 8;
			}
			var atom_handle = and_or_tree.get_atom_node( data, function(data){
				return (data.other > 6);
			},manipulate_value);
			and_or_tree.evaluate_atom_nodes();
			assert.deepEqual(data,{
				x:2,
				y:3,
				other: 6
			});

			data.other = 7;
		});

		it ("callback called when the node evaluates to true",function(){
			and_or_tree.evaluate_atom_nodes();
			assert.deepEqual(data,{
				x:8,
				y:3,
				other:7
			});
		});

});

describe("and_or_tree.js reset test, ", function(){

})
describe("and_or_tree.js test, evaluating a composite node",function(){

});

