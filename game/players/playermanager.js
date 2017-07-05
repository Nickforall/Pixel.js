class PlayerManager {
    constructor() {
        this.onlinePlayers = {};
    }

    registerOnlinePlayer(player) {
        this.onlinePlayers[player.id] = player;
    }

    removePlayer(player) {
        delete this.onlinePlayers[player.id];
    }

    getPlayer(id) {
        return this.onlinePlayers[id];
    }
}

module.exports = PlayerManager;
