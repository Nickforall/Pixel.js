const ServerMessage = require('../networking/servermessage');
const Composer = require('../messages/composers/composer');
const chalk = require('chalk');
const DiffieHellman = require('../crypto/dh');
const RC4 = require('../crypto/rc4');

class GameClient {
    constructor(socket) {
        this._socket = socket;
        this._machineId = null;
        this._player = null;
        this.initializedCrypto = false;

        this.diffieHellman = new DiffieHellman();
        this.diffieHellman.generateDH();
    }

    initRc4() {
        this.rc4client = new RC4(this.diffieHellman.getSharedKey().toByteArray(true));
        this.rc4server = new RC4(this.diffieHellman.getSharedKey().toByteArray(true));
        this.initializedCrypto = true;
    }

    set machineId(id) {
        this._machineId = id;
    }

    get player() {
        return this._player;
    }

    disconnect() {
        if (this._player) {
            Pixel.getPlayerManager().removePlayer(this._player);
        }

        if (!this._socket.destroyed) {
            this._socket.end();
            this._socket.destroy();
        }
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
            if (packet === null) return;
            throw new Error("Provided packet isn't a valid packet.");
        }

        let buffer = packet.buffer;

        if (this.initializedCrypto) {
            buffer = this.rc4server.parse(buffer);
        }

        this._socket.write(buffer);
        console.log(chalk.blue(`SERVER => ${packet.header} -> ${packet.debugBody()}`));
    }

    sendPackets(list) {
        const buffers = [];
        let size = 0;

        for (let packet of list) {
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
                if (packet === null) return;
                throw new Error("Provided packet isn't a valid packet.");
            }

            console.log(chalk.blue(`SERVER => ${packet.header} -> ${packet.debugBody()}`));

            const buf = packet.buffer;
            buffers.push(buf);

            size += buf.length;
        }

        let buffer = Buffer.concat(buffers, size);

        if (this.initializedCrypto) {
            buffer = this.rc4server.parse(buffer);
        }

        this._socket.write(buffer);
    }

    setPlayer(player) {
        this._player = player;
        this._player.gameClient = this;
        Pixel.getPlayerManager().registerOnlinePlayer(this._player);

        this._player.setOnline();
    }
}

module.exports = GameClient;
