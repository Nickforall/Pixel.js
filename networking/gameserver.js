const ClientMessage = require('./clientmessage');
const net = require('net');
const util = require('util');
const config = require("../config.json");
const GameClient = require('../game/gameclient');
const chalk = require('chalk');

class GameServer {
    constructor() {
        this.tcp = net.createServer(this._socketConnectionHandler.bind(this));
    }

    _socketConnectionHandler(socket) {
        socket.gameclient = new GameClient(socket);
        socket.setKeepAlive(true);
        socket.setNoDelay(true);

        socket.on('data', this._socketDataHandler.bind(this, socket));
    }

    _socketDataHandler(socket, data) {
        // transform buffer in our servermessage format
        let buffer = Buffer.from(data);
        buffer = new ClientMessage(buffer);

        // check if the client expects crossdomain shit
        const isXml = String.fromCharCode(buffer.readByte()) === "<";
        if(isXml) {
            console.log("Sending crossdomain policy")
            socket.write('<?xml version="1.0"?>\r\n' +
                '<!DOCTYPE cross-domain-policy SYSTEM "/xml/dtds/cross-domain-policy.dtd">\r\n' +
                '<cross-domain-policy>\r\n' +
                '<allow-access-from domain="*" to-ports="1-31111" />\r\n' +
                '</cross-domain-policy>\0');
            socket.destroy();
            return;
        }

        // make sure the buffer's offset is back at 0 if it's no xml
        buffer.resetIndex();

        // handle a habbo packet
        this.handlePacket(buffer, socket);
    }

    /**
     * Makes the server listen on a port
     * @param  {number} port Port number
     */
    listen(port) {
        this.tcp.listen({
            port: port,
            backlog: 10,
            exclusive: false
        }, () => console.log('Currently listening socket server on port ::%s', port));
    }

    handlePacket(packet, socket) {
        const length = packet.readInt();
        const header = packet.readShort();

        packet.header = header;

        var color = chalk.yellow
        if(Pixel.getPacketHandler().hasHandler(header))
            color = chalk.green

        if(config.logPackets && !config.ignoredIncomingPackets.indexOf(header) > -1)
            console.log(color("CLIENT => " + packet.header + " -> " + packet.debugBody()));

        if(Pixel.getPacketHandler().hasHandler(header)) {
            Pixel.getPacketHandler().executeHandler(packet, socket.gameclient);
        }
    }
}

module.exports = GameServer;
