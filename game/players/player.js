const Alerts = require('../../messages/composers/alerts');
const PlayerSubscription = require('./playersubscription');

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
}

module.exports = Player;
