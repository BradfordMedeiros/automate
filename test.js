var baseObject  = function (self){
	objectName(self);
}

var objectName = function (self){
	self.a = 2;
}


var newObject = function(){
	new baseObject (this);
}


b = new newObject;
console.log(b);