const Composer = require('./composer');
const Outgoing = require('../outgoing');
const ServerMessage = require('../../networking/servermessage');
const moment = require('moment');

const Player = require('../../game/players/player');

class PlayerComposer extends Composer {
    constructor(player) {
        super();

        this.player = player;

        if (!(player instanceof Player)) {
            throw new Error('Invalid parameter passed to PlayerDataComposer, expected player');
        }
    }
}

class PlayerDataComposer extends PlayerComposer {
    compose() {
        const message = new ServerMessage(Outgoing.PlayerDataComposer);

        message.writeInt(this.player.id);
        message.writeString(this.player.name);
        message.writeString(this.player.figure);
        message.writeString(this.player.gender.toUpperCase());
        message.writeString(this.player.motto);
        message.writeString(this.player.name);
        message.writeBoolean(false); // ?
        message.writeInt(0); // respect received
        message.writeInt(0); // respect available
        message.writeInt(0); // pet points
        message.writeBoolean(false);
        message.writeBoolean(false);
        message.writeString('01-01-1970 00:00:00');
        message.writeBoolean(false);

        return message;
    }
}

class PlayerPerksComposer extends PlayerComposer {
    compose() {
        const message = new ServerMessage(Outgoing.PlayerPerksComposer);

        message.writeInt(2); // length of the list with perks

        message.writeString('HABBO_CLUB_OFFER_BETA');
        message.writeString('');
        message.writeBoolean(true);

        message.writeString('NAVIGATOR_PHASE_TWO_2014');
        message.writeString('');
        message.writeBoolean(true);

        return message;
    }
}

class PlayerHomeComposer extends PlayerComposer {
    compose() {
        const message = new ServerMessage(Outgoing.PlayerHomeComposer);

        message.writeInt(this.player.home);
        message.writeInt(0); // idk

        return message;
    }
}

class PlayerCreditsComposer extends PlayerComposer {
    compose() {
        const message = new ServerMessage(Outgoing.PlayerCreditsComposer);

        message.writeString(`${this.player.credits}.0`);

        return message;
    }
}

class PlayerProfileComposer extends PlayerComposer {
    compose() {
        const message = new ServerMessage(Outgoing.PlayerProfileComposer);

        message.writeInt(this.player.id);
        message.writeString(this.player.name);
        message.writeString(this.player.figure);
        message.writeString(this.player.motto);
        message.writeString(moment.unix(this.player.created).format('DD-MM-YYYY HH:mm:ss'));
        message.writeInt(0); // achievement score
        message.writeInt(0); // friends
        message.writeBoolean(false); // is the requester friends?
        message.writeBoolean(false); // did the requester send friend request?
        message.writeBoolean(this.player.isOnline); // is the habbo online?

        message.writeInt(0); // amount of guilds
        // here you should iterate over guilds

        message.writeInt(0); // last online in seconds ago
        message.writeBoolean(true); // unknown

        return message;
    }
}

class PlayerClubComposer extends PlayerComposer {
    compose() {
        const message = new ServerMessage(Outgoing.PlayerClubComposer);

        message.writeString('club_habbo');

        if (this.player.subscription.hasClub()) {
            message.writeInt(this.player.subscription.days);
            message.writeInt(1);
            message.writeInt(this.player.subscription.months);
            message.writeInt(this.player.subscription.years);
        } else {
            message.writeInt(0);
            message.writeInt(7);
            message.writeInt(0);
            message.writeInt(1);
        }

        message.writeBoolean(true);
        message.writeBoolean(true);
        message.writeInt(0);
        message.writeInt(0);

        const remaining = (this.player.subscription.expiration * 1000) - Date.now();
        if (remaining > 0x7fffffff || remaining <= 0) {
            message.writeInt(0x7fffffff);
        } else {
            message.writeInt(remaining);
        }

        return message;
    }
}

module.exports.PlayerDataComposer = PlayerDataComposer;
module.exports.PlayerPerksComposer = PlayerPerksComposer;
module.exports.PlayerHomeComposer = PlayerHomeComposer;
module.exports.PlayerCreditsComposer = PlayerCreditsComposer;
module.exports.PlayerProfileComposer = PlayerProfileComposer;
module.exports.PlayerClubComposer = PlayerClubComposer;
