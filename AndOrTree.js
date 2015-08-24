/*
	Usage:
	var AndOrTree = new require('AndOrTree.js');
	AndOrTree.or('a','b','c');
			a
		   / \
		  b   c

	AndOrTree.or('x','y','z')
		   x			a
		  / \  		   / \
		 y   z	      b   c

   AndOrTree.and('x','a','b'      )
	  	   x			a
	     / \ \  		   / \
	   y   z  a	      b   c
               \ 
				b

*/
var _node = function (id){
	this.id = id;
	this.children = []


}


var AndOrTree = function ( expression ){
	this.idcounter = 0;
	this.names = { };

	if ( expression != undefined ){
		this.createTreeFromExpression (expression);
	}
}



AndOrTree.prototype._createNode = function (name){
	name = name == undefined? 'node_'+this.idcounter : name;

	if (this.names[name] !=undefined ){
		throw (new Error('NAME_REUSE_ERROR'))
	}
	var newNode = new _node(this.idcounter);
	this.idcounter = this.idcounter + 1;
	newNode.name = name;
	this.names[name] = newNode
	return newNode;
}



AndOrTree.prototype.and = function (_result, _cause1, _cause2, _causeN){
	for (var i =0 ; i < arguments.length ; i++ ){
		if (this.names[arguments[i].name] == undefined){
			throw (new Error('INVALID_NODE_ERROR'))
		}
	}


}

AndOrTree.prototype.or = function (_result, _cause1, _cause2, _causeN){
	for (var i =0 ; i < arguments.length ; i++ ){
		if (this.names[arguments[i].name] == undefined){
			throw (new Error('INVALID_NODE_ERROR'))
		}
		

	}


	





}
	


AndOrTree.prototype.createTreeFromExpression = function ( expression ){
}

AndOrTree.prototype.toString = function (){

}

var tree = new AndOrTree();
a = tree._createNode('a');
b = tree._createNode('b');
c = tree._createNode('c');
d = tree._createNode('d');
e = tree._createNode('e');

tree.or(a,b,c,d)

var s = require('collection').Set;
var set = new s();
console.log(set)


/*
rules to consider:  ab + b = b

	x 					x
   / \ 				   	 \ 
  b   b   ==>  		  	  b
 /
a

        (x)	--> result

       /    \
 cause ->   (a)	(c)  x = ab + c
     /
  (b)

 */

 module.exports = AndOrTree;