const PacketHandler = require('./messages/packethandler');
const GameServer = require('./networking/gameserver');
const Database = require('./database/database');
const Navigator = require('./game/navigator/navigator');
const PlayerManager = require('./game/players/playermanager');

class Pixel {
    constructor() {
        this.packageHandler = new PacketHandler();
        this.gameServer = new GameServer();
        this.database = new Database();
        this.playerManager = new PlayerManager();
        this.navigator = new Navigator();

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

    getNavigator() {
        return this.navigator;
    }
}

module.exports = Pixel;
