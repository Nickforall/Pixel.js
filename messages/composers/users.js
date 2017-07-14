const Composer = require('./composer');
const Outgoing = require('../outgoing');
const ServerMessage = require('../../networking/servermessage');
const moment = require('moment');

const Player = require('../../game/players/player');
const PlayerController = require('../../database/controllers/player');

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

        message.writeInt(7); // length of the list with perks

        message.writeString('CITIZEN');
        message.writeString('');
        message.writeBoolean(true);

        message.writeString('TRADE');
        message.writeString('');
        message.writeBoolean(true);

        message.writeString('NAVIGATOR_PHASE_ONE_2014');
        message.writeString('');
        message.writeBoolean(true);

        message.writeString('CAMERA');
        message.writeString('');
        message.writeBoolean(false);

        message.writeString('NAVIGATOR_PHASE_TWO_2014');
        message.writeString('');
        message.writeBoolean(true);

        message.writeString('MOUSE_ZOOM');
        message.writeString('');
        message.writeBoolean(true);

        message.writeString('HABBO_CLUB_OFFER_BETA');
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

    constructor(player, friendscount) {
        super(player);

        this.friendscount = friendscount;
    }

    compose() {
        const message = new ServerMessage(Outgoing.PlayerProfileComposer);

        message.writeInt(this.player.id);
        message.writeString(this.player.name);
        message.writeString(this.player.figure);
        message.writeString(this.player.motto);
        message.writeString(moment.unix(this.player.created).format('DD-MM-YYYY HH:mm:ss'));
        message.writeInt(0); // achievement score
        message.writeInt(this.friendscount); // friends
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

class ClubDataComposer extends Composer {
    // this packet is pretty vague, for all I know it expects a length to iterate over something
    // and it also wants some integer back

    constructor(int) {
        super();

        this.unknown = int;
    }

    compose() {
        const message = new ServerMessage(Outgoing.ClubDataComposer);

        // length of the iterated items
        message.writeInt(0);

        // the unknown int (possibly window identifier)
        message.writeInt(this.unknown);

        return message;
    }
}

class PlayerWardrobeComposer extends PlayerComposer {
    // this packet should send a player's saved
    // we have a placeholder to get changing looks to work

    compose() {
        const message = new ServerMessage(Outgoing.PlayerWardrobeComposer);

        message.writeInt(1);
        // iterate over wardrobe items
        message.writeInt(0); // length of looks

        return message;
    }

}

module.exports.PlayerComposer = PlayerComposer;

module.exports.PlayerDataComposer = PlayerDataComposer;
module.exports.PlayerPerksComposer = PlayerPerksComposer;
module.exports.PlayerHomeComposer = PlayerHomeComposer;
module.exports.PlayerCreditsComposer = PlayerCreditsComposer;
module.exports.PlayerProfileComposer = PlayerProfileComposer;
module.exports.PlayerClubComposer = PlayerClubComposer;
module.exports.ClubDataComposer = ClubDataComposer;
module.exports.PlayerWardrobeComposer = PlayerWardrobeComposer;
