const Composer = require('./composer');
const Outgoing = require('../outgoing');
const ServerMessage = require('../../networking/servermessage');

class RoomDataComposer extends Composer {
    constructor(room, player, unknownBool) {
        super();

        this.room = room;
        this.player = player;
        this.unknownBool = unknownBool;
    }

    compose() {
        const message = new ServerMessage(Outgoing.RoomDataComposer);

        message.writeBoolean(this.unknownBool);

        message.writeInt(this.room.id);
        message.writeString(this.room.name);

        if (this.room.isPublic) {
            message.writeInt(0);
            message.writeString('');
        } else {
            message.writeInt(this.room.ownerId);
            message.writeString(this.room.ownerName);
        }

        message.writeInt(this.room.state);
        message.writeInt(0); // players in room
        message.writeInt(this.room.capacity);
        message.writeString(this.room.description);
        message.writeInt(0);
        message.writeInt(2);
        message.writeInt(this.room.score);
        message.writeInt(this.room.category);

        message.writeInt(this.room.tags.split(';').length);
        for (const tag of this.room.tags.split(';')) {
            message.writeString(tag);
        }

        let base = 16;
        if (false) base |= 2; // has guild
        if (false) base |= 4; // is promoted
        if (!this.room.isPublic) base |= 8;

        message.writeInt(base);

        // if this is a guild, send guild stuff
        // if promoted, do promoted stuff

        message.writeBoolean(this.room.isPublic);
        message.writeBoolean(false); // staff pick
        message.writeBoolean(this.room.isPublic);
        message.writeBoolean(false); // idk?

        message.writeInt(1);
        message.writeInt(1);
        message.writeInt(1);

        message.writeBoolean(true); // has rights

        message.writeInt(1);
        message.writeInt(1);
        message.writeInt(1);
        message.writeInt(50);
        message.writeInt(2);

        return message;
    }
}

class UnknownIgnoredNameArrayComposer extends Composer {
    compose() {
        const message = new ServerMessage(126);
        message.writeInt(0); // length of list
        // array of strings
        return message;
    }
}

module.exports.RoomDataComposer = RoomDataComposer;
module.exports.UnknownIgnoredNameArrayComposer = UnknownIgnoredNameArrayComposer;
