const PacketHandler = require('./messages/packethandler');
const GameServer = require('./networking/gameserver');

class Pixel {
    constructor() {
        this.packageHandler = new PacketHandler();
        this.gameServer = new GameServer();

        this.gameServer.listen(30002);
    }

    getPacketHandler() {
        return this.packageHandler;
    }

    getGameServer() {
        return this.gameServer
    }
}

module.exports = Pixel;
