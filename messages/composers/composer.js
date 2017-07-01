const ServerMessage = require("../../networking/servermessage");

class Composer {
    compose() {
        return new ServerMessage(0);
    }
}

module.exports = Composer;
