const Composer = require('./composer');
const Outgoing = require('../outgoing');
const ServerMessage = require('../../networking/servermessage');

class InitializeMessengerComposer extends Composer {
    compose() {
        const message = new ServerMessage(Outgoing.InitializeMessengerComposer);

        message.writeInt(300); // friends limit for non-club members
        message.writeInt(0); // dead code in actionscript
        message.writeInt(500); // friends limit for club members

        message.writeInt(0); // length for an array of what looks like categories
        // int
        // string

        return message;
    }
}

class PlayerFriendsComposer extends Composer {
    constructor(friendlist) {
        super();

        this.list = friendlist;
    }

    compose() {
        const message = new ServerMessage(Outgoing.PlayerFriendsComposer);

        message.writeInt(300);
        message.writeInt(300);

        message.writeInt(this.list.length);
        for (const friend of this.list) {
            message.writeInt(friend.id);
            message.writeString(friend.name);
            message.writeInt(friend.gender.toUpperCase() === 'M' ? 0 : 1);
            message.writeBoolean(Pixel.getPlayerManager().getPlayer(friend.id) !== undefined);
            message.writeBoolean(false); // whether player is in a room
            message.writeString(friend.look);
            message.writeInt(0);
            message.writeString(friend.motto);
            message.writeString('');
            message.writeString('');
            message.writeBoolean(false);
            message.writeBoolean(false);
            message.writeBoolean(false);
            message.writeShort(0);
        }

        return message;
    }
}

class UpdateFriendComposer extends Composer {
    constructor(p) {
        super();

        this.player = p;
    }

    compose() {
        const message = new ServerMessage(Outgoing.UpdateFriendComposer);
        const buddy = this.player;

        message.writeInt(0);
        message.writeInt(1);
        message.writeInt(0);

        message.writeInt(buddy.id);
        message.writeString(buddy.name);
        message.writeInt(buddy.gender.toUpperCase() === 'M' ? 0 : 1);
        message.writeBoolean(Pixel.getPlayerManager().getPlayer(buddy.id) !== undefined);
        message.writeBoolean(false); // whether player is in a room
        message.writeString(buddy.figure);
        message.writeInt(0);
        message.writeString(buddy.motto);
        message.writeString('');
        message.writeString('');
        message.writeBoolean(false);
        message.writeBoolean(false);
        message.writeBoolean(false);
        message.writeShort(0);

        return message;
    }
}

class PlayerFriendRequestsComposer extends Composer {
    compose() {
        const message = new ServerMessage(Outgoing.PlayerFriendRequestsComposer);

        message.writeInt(0);
        message.writeInt(0);

        return message;
    }
}

module.exports.PlayerFriendRequestsComposer = PlayerFriendRequestsComposer;
module.exports.InitializeMessengerComposer = InitializeMessengerComposer;
module.exports.PlayerFriendsComposer = PlayerFriendsComposer;
module.exports.UpdateFriendComposer = UpdateFriendComposer;
