const PacketHandler = require('./messages/packethandler');
const GameServer = require('./networking/gameserver');
const Database = require('./database/database');

class Pixel {
    constructor() {
        this.packageHandler = new PacketHandler();
        this.gameServer = new GameServer();
        this.database = new Database();

        this.gameServer.listen(30002);
    }

    getPacketHandler() {
        return this.packageHandler;
    }

    getGameServer() {
        return this.gameServer;
    }

    getDatabase() {
        return this.database;
    }
}

module.exports = Pixel;
