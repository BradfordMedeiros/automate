
var router = function (  mapping_function){
	this.message_handler = (require(process.env.HOME+'/.files.js')).messagehandler;

}

module.exports = router;