const ServerMessage = require("../networking/servermessage");
const Composer = require("../messages/composers/composer");
const chalk = require('chalk');

class GameClient {
    constructor(socket) {
        this._socket = socket;
        this._machineId = null;
    }

    set machineId(id) {
        this._machineId = machineId;
    }

    sendPacket(packet) {
        if(packet instanceof Composer) {
            // make sure errors don't influence the whole process, only the socket causing it
            try {
                packet = packet.compose();
            } catch(error) {
                console.error(error);
                this._socket.end();
                this._socket.destroy();
                return;
            }
        }

        if(!packet instanceof ServerMessage) {
            throw new Error("Provided packet isn't a valid packet.");
        }

        this._socket.write(packet.buffer);
        console.log(chalk.blue("SERVER => " + packet.header + " -> " + packet.debugBody()))
    }
}

module.exports = GameClient;
