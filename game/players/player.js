const Alerts = require('../../messages/composers/alerts');
const Messenger = require('../../messages/composers/messenger');
const PlayerSubscription = require('./playersubscription');
const PlayerController = require('../../database/controllers/player');

class Player {
    constructor(id, name, motto, figure, gender, credits, home, club, created) {
        this.id = id;
        this.name = name;
        this.motto = motto;
        this.figure = figure;
        this.gender = gender;
        this.credits = credits;
        this.home = home;
        this.subscription = new PlayerSubscription(club);
        this.created = created;

        this.isOnline = false;
        this.gameClient = null;
    }

    sendAlert(message) {
        if (this.gameClient) {
            this.gameClient.sendPacket(new Alerts.GenericAlertComposer(message));
        }
    }

    setOnline() {
        this.isOnline = true;
        console.log(this instanceof Player);
        this.sendPacketToFriends(new Messenger.UpdateFriendComposer(this));
    }

    sendPacketToFriends(packet) {
        PlayerController.getFriends(this.id).then((friends) => {
            for (const friend of friends) {
                if (Pixel.getPlayerManager().getPlayer(friend.id) !== undefined) {
                    Pixel.getPlayerManager().getPlayer(friend.id).gameClient.sendPacket(packet);
                }
            }
        }).catch((err) => {
            console.error(err);
        });
    }
}

module.exports = Player;
