const ServerMessage = require('../networking/servermessage');
const Composer = require('../messages/composers/composer');
const chalk = require('chalk');

class GameClient {
    constructor(socket) {
        this._socket = socket;
        this._machineId = null;
        this._player = null;
    }

    set machineId(id) {
        this._machineId = id;
    }

    get player() {
        return this._player;
    }

    disconnect() {
        this._socket.end();
        this._socket.destroy();
    }

    sendPacket(packet) {
        if (packet instanceof Composer) {
            // make sure errors don't influence the whole process, only the socket causing it
            try {
                packet = packet.compose();
            } catch (error) {
                console.error(error);
                this.disconnect();
                return;
            }
        }

        if (!(packet instanceof ServerMessage)) {
            throw new Error("Provided packet isn't a valid packet.");
        }

        this._socket.write(packet.buffer);
        console.log(chalk.blue(`SERVER => ${packet.header} -> ${packet.debugBody()}`));
    }

    setPlayer(player) {
        this._player = player;
    }
}

module.exports = GameClient;
