const PacketHandler = require('./messages/packethandler');
const GameServer = require('./networking/gameserver');
const Database = require('./database/database');
const PlayerManager = require('./game/players/playermanager');

class Pixel {
    constructor() {
        this.packageHandler = new PacketHandler();
        this.gameServer = new GameServer();
        this.database = new Database();
        this.playerManager = new PlayerManager();

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

    getPlayerManager() {
        return this.playerManager;
    }
}

module.exports = Pixel;
