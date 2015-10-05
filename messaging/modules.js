
var messaging_module = {
    message_types : require("./message_types.js"),
    message_handler : new (require("./message_handler.js"))
};

module.exports = messaging_module;
