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
        message.writeInt(3); // respect available
        message.writeInt(3); // pet points
        message.writeBoolean(false);
        message.writeString('01-01-1970 00:00:00');
        message.writeBoolean(false);
        message.writeBoolean(false); // is safety locked message

        return message;
    }
}

class PlayerPerksComposer extends PlayerComposer {
    compose() {
        const message = new ServerMessage(Outgoing.PlayerPerksComposer);

        message.writeInt(15); // length of the list with perks

        message.writeString('USE_GUIDE_TOOL');
        message.writeString('requirement.unfulfilled.helper_level_4');
        message.writeBoolean(false);

        message.writeString('GIVE_GUIDE_TOURS');
        message.writeString('');
        message.writeBoolean(false);

        message.writeString('JUDGE_CHAT_REVIEWS');
        message.writeString('requirement.unfulfilled.helper_level_6');
        message.writeBoolean(false);

        message.writeString('VOTE_IN_COMPETITIONS');
        message.writeString('requirement.unfulfilled.helper_level_2');
        message.writeBoolean(true);

        message.writeString('CALL_ON_HELPERS');
        message.writeString('');
        message.writeBoolean(true);

        message.writeString('CITIZEN');
        message.writeString('');
        message.writeBoolean(true);

        message.writeString('TRADE');
        message.writeString('requirement.unfulfilled.no_trade_lock');
        message.writeBoolean(false);

        message.writeString('HEIGHTMAP_EDITOR_BETA');
        message.writeString('requirement.unfulfilled.feature_disabled');
        message.writeBoolean(true);

        message.writeString('BUILDER_AT_WORK');
        message.writeString('');
        message.writeBoolean(true);

        message.writeString('CALL_ON_HELPERS');
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

        message.writeString('NAVIGATOR_ROOM_THUMBNAIL_CAMERA');
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

class PlayerCurrencyComposer extends Composer {
    compose() {
        const message = new ServerMessage(Outgoing.PlayerCurrencyComposer);

        message.writeInt(0); // length of currency types

        return message;
    }
}

class PlayerCitizenshipComposer extends Composer {
    constructor(name) {
        super();

        this.name = name;
    }

    compose() {
        const message = new ServerMessage(Outgoing.PlayerCitizenshipComposer);

        message.writeString(this.name);
        message.writeInt(0); // level
        message.writeInt(0);

        return message;
    }
}

class PlayerPermissionsComposer extends PlayerComposer {
    compose() {
        const message = new ServerMessage(Outgoing.PlayerPermissionsComposer);

        message.writeInt(this.player.subscription.hasClub() ? 2 : 0);
        message.writeInt(1);
        message.writeBoolean(false); // is ambassador?

        return message;
    }
}

class PlayerUpdateLookComposer extends PlayerComposer {
    compose() {
        const message = new ServerMessage(Outgoing.PlayerUpdateLookComposer);

        message.writeString(this.player.figure);
        message.writeString(this.player.gender);

        return message;
    }
}

class NewUserIdentityComposer extends Composer {
    compose() {
        const message = new ServerMessage(Outgoing.NewUserIdentityComposer);

        message.writeInt(0);

        return message;
    }
}

class PlayerAchievementsComposer extends Composer {
    compose() {
        const message = new ServerMessage(Outgoing.PlayerAchievementsComposer);

        message.writeInt(0);
        message.writeString('');

        return message;
    }
}

class PlayerMenuSettingsComposer extends Composer {
    compose() {
        const message = new ServerMessage(Outgoing.PlayerMenuSettingsComposer);

        message.writeInt(100);
        message.writeInt(100);
        message.writeInt(100);
        message.writeBoolean(false);
        message.writeBoolean(false);
        message.writeBoolean(false);
        message.writeInt(1);
        message.writeInt(0);

        return message;
    }
}

class PlayerEffectListComposer extends Composer {
    compose() {
        const message = new ServerMessage(Outgoing.PlayerEffectListComposer);

        message.writeInt(0);

        return message;
    }
}

class PlayerClothesComposer extends Composer {
    compose() {
        const message = new ServerMessage(Outgoing.PlayerClothesComposer);

        message.writeInt(0);
        message.writeInt(0);

        return message;
    }
}

class PlayerFavoritesComposer extends Composer {
    compose() {
        const message = new ServerMessage(Outgoing.PlayerFavoritesComposer);

        message.writeInt(1000); // max rooms
        message.writeInt(0); // size

        return message;
    }
}

class PlayerAchievementScoreComposer extends Composer {
    constructor(score) {
        super();
        this.score = score;
    }

    compose() {
        const message = new ServerMessage(Outgoing.PlayerAchievementScoreComposer);

        message.writeInt(this.score);

        return message;
    }
}

module.exports.PlayerComposer = PlayerComposer;

module.exports.PlayerAchievementScoreComposer = PlayerAchievementScoreComposer;
module.exports.PlayerFavoritesComposer = PlayerFavoritesComposer;
module.exports.PlayerDataComposer = PlayerDataComposer;
module.exports.PlayerPerksComposer = PlayerPerksComposer;
module.exports.PlayerHomeComposer = PlayerHomeComposer;
module.exports.PlayerCreditsComposer = PlayerCreditsComposer;
module.exports.PlayerProfileComposer = PlayerProfileComposer;
module.exports.PlayerClubComposer = PlayerClubComposer;
module.exports.ClubDataComposer = ClubDataComposer;
module.exports.PlayerWardrobeComposer = PlayerWardrobeComposer;
module.exports.PlayerCurrencyComposer = PlayerCurrencyComposer;
module.exports.PlayerCitizenshipComposer = PlayerCitizenshipComposer;
module.exports.PlayerPermissionsComposer = PlayerPermissionsComposer;
module.exports.PlayerUpdateLookComposer = PlayerUpdateLookComposer;
module.exports.NewUserIdentityComposer = NewUserIdentityComposer;
module.exports.PlayerAchievementsComposer = PlayerAchievementsComposer;
module.exports.PlayerMenuSettingsComposer = PlayerMenuSettingsComposer;
module.exports.PlayerEffectListComposer = PlayerEffectListComposer;
module.exports.PlayerClothesComposer = PlayerClothesComposer;
