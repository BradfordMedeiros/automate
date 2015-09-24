
//var MAIN_PATH = (require(process.env.HOME + '/.files.js')).enumerated_interfaces;

var enabled_interfaces = {
	internet: {
		path: '/Internet.js',
		enabled: true
	},
	debug_network: {
		path: '/debug_network.js',
		enabled: true
	}

}

module.exports = enabled_interfaces;
