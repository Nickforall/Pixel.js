const ClientMessage = require('./clientmessage');
const net = require('net');
const config = require('../config.json');
const GameClient = require('../game/gameclient');
const chalk = require('chalk');
const bufferHelpers = require('./bufferhelpers');

class GameServer {
    constructor() {
        this.tcp = net.createServer(this._socketConnectionHandler.bind(this));
    }

    _socketConnectionHandler(socket) {
        socket.gameclient = new GameClient(socket);
        socket.setKeepAlive(true);
        socket.setNoDelay(true);

        socket.on('data', this._socketDataHandler.bind(this, socket));
        socket.on('end', this._socketDisconnectHandler.bind(this, socket));
    }

    _socketDisconnectHandler(socket) {
        if (socket.gameclient.player) {
            console.log(`Disconnecting ${socket.gameclient.player.name}`);
        }

        socket.gameclient.disconnect();
    }

    _socketDataHandler(socket, data) {
        // transform buffer in our servermessage format
        let buffer = Buffer.from(data);

        // check if the client expects crossdomain shit
        const isXml = String.fromCharCode(bufferHelpers.read(buffer, 1, 0)[0]) === '<';
        if (isXml) {
            console.log('Sending crossdomain policy');
            socket.write('<?xml version="1.0"?>\r\n' +
                '<!DOCTYPE cross-domain-policy SYSTEM "/xml/dtds/cross-domain-policy.dtd">\r\n' +
                '<cross-domain-policy>\r\n' +
                '<allow-access-from domain="*" to-ports="1-31111" />\r\n' +
                '</cross-domain-policy>\0');
            socket.destroy();
            return;
        }

        // while the buffer has a length integer at the start
        while (buffer.length >= 4) {
            const length = bufferHelpers.read(buffer, 4, 0).readInt32BE() + 4;

            // handle a habbo packet
            this.handlePacket(buffer.slice(0, length), socket);

            buffer = buffer.slice(length);
        }
    }

    /**
     * Makes the server listen on a port
     * @param  {number} port Port number
     */
    listen(port) {
        this.tcp.listen({
            port: port,
            backlog: 10,
            exclusive: false,
        }, () => console.log('Currently listening socket server on port ::%s', port));
    }

    handlePacket(buffer, socket) {
        const packet = new ClientMessage(buffer);

        packet.readInt();
        const header = packet.readShort();

        packet.header = header;

        let color = chalk.yellow;
        if (Pixel.getPacketHandler().hasHandler(header)) color = chalk.green;

        if (config.logPackets && !(config.ignoredIncomingPackets.indexOf(header) > -1)) {
            console.log(color(`CLIENT => ${packet.header} -> ${packet.debugBody()}`));
        }

        if (Pixel.getPacketHandler().hasHandler(header)) {
            Pixel.getPacketHandler().executeHandler(packet, socket.gameclient);
        }
    }
}

module.exports = GameServer;
