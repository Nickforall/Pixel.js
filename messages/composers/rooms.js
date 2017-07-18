const Composer = require('./composer');
const Outgoing = require('../outgoing');
const ServerMessage = require('../../networking/servermessage');
const RoomLayout = require('../../game/rooms/roomlayout');
const RoomTile = require('../../game/rooms/roomtile');

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

class RoomHeightmapComposer extends Composer {
    compose() {
        const message = new ServerMessage(Outgoing.RoomHeightmapComposer);

        message.writeBoolean(true);
        message.writeInt(-1); // unknown
        message.writeString('xxxxxxxxxxxx\rxxxx00000000\rxxxx00000000\rxxxx00000000\rxxxx00000000\rxxxx00000000\rxxxx00000000\rxxxx00000000\rxxxx00000000\rxxxx00000000\rxxxx00000000\rxxxx00000000\rxxxx00000000\rxxxx00000000\rxxxxxxxxxxxx\rxxxxxxxxxxxx');

        return message;
    }
}

class RoomRelativeMapComposer extends Composer {
    constructor() {
        super();

        this.layout = new RoomLayout(
            'model_a',
            'xxxxxxxxxxxx\r\nxxxx00000000\r\nxxxx00000000\r\nxxxx00000000\r\nxxxx00000000\r\nxxxx00000000\r\nxxxx00000000\r\nxxxx00000000\r\nxxxx00000000\r\nxxxx00000000\r\nxxxx00000000\r\nxxxx00000000\r\nxxxx00000000\r\nxxxx00000000\r\nxxxxxxxxxxxx\r\nxxxxxxxxxxxx'
        );
    }

    compose() {
        const message = new ServerMessage(Outgoing.RoomRelativeMapComposer);

        message.writeInt(this.layout.size / this.layout.sizeY);
        message.writeInt(this.layout.size);

        for (let y = 0; y < this.layout.tiles.length; y++) {
            const row = this.layout.tiles[y];
            for (let x = 0; x < row.length; x++) {
                const tile = row[x];

                if (tile instanceof RoomTile) {
                    message.writeShort(tile.height);
                } else {
                    message.writeShort(0x7fff);
                }
            }
        }

        return message;
    }
}

class RoomPlayersComposer extends Composer {
    constructor(player) {
        super();

        this.player = player;
    }

    compose() {
        // For now we just push our own user

        const message = new ServerMessage(Outgoing.RoomPlayersComposer);

        message.writeInt(1);

        message.writeInt(this.player.id);
        message.writeString(this.player.name);
        message.writeString(this.player.motto);
        message.writeString(this.player.figure);
        message.writeInt(0);
        message.writeInt(3); // x
        message.writeInt(5); // y
        message.writeString('0.0'); // z
        message.writeInt(2);
        message.writeInt(1);
        message.writeString(this.player.gender);
        message.writeInt(-1);
        message.writeInt(-1);
        message.writeString('');
        message.writeString('');
        message.writeInt(0);
        message.writeBoolean(true);

        return message;
    }
}

class RoomPlayersPositionComposer extends Composer {
    constructor(player) {
        super();

        this.player = player;
    }

    compose() {
        const message = new ServerMessage(Outgoing.RoomPlayersPositionComposer);

        message.writeInt(1);

        message.writeInt(0);
        message.writeInt(3);
        message.writeInt(5);
        message.writeString('0.0');
        message.writeInt(2);
        message.writeInt(2);
        message.writeString('/flatctrl 5/');

        return message;
    }
}

class RoomItemsComposer extends Composer {
    compose() {
        const message = new ServerMessage(Outgoing.RoomItemsComposer);

        message.writeInt(0);
        message.writeInt(0);

        return message;
    }
}

class RoomWallItemsComposer extends Composer {
    compose() {
        const message = new ServerMessage(Outgoing.RoomWallItemsComposer);

        message.writeInt(0);
        message.writeInt(0);

        return message;
    }
}

class RoomOwnerComposer extends Composer {
    constructor(isOwner, roomId) {
        super();

        this.isOwner = isOwner;
        this.id = roomId;
    }

    compose() {
        const message = new ServerMessage(Outgoing.RoomOwnerComposer);

        message.writeInt(this.id);
        message.writeBoolean(this.isOwner);

        return message;
    }
}

class RoomPaintComposer extends Composer {
    constructor(type) {
        super();

        this.type = type;
    }

    compose() {
        const message = new ServerMessage(Outgoing.RoomPaintComposer);

        message.writeString(this.type);
        message.writeString('0.0');

        return message;
    }
}

class RoomScoreComposer extends Composer {
    constructor(amount, canVote) {
        super();

        this.amount = amount;
        this.can = canVote;
    }

    compose() {
        const message = new ServerMessage(Outgoing.RoomScoreComposer);

        message.writeInt(this.amount);
        message.writeBoolean(this.can);

        return message;
    }
}

class RoomThicknessComposer extends Composer {
    compose() {
        const message = new ServerMessage(Outgoing.RoomThicknessComposer);

        message.writeBoolean(false);
        message.writeInt(0);
        message.writeInt(0);

        return message;
    }
}

class RoomRightsComposer extends Composer {
    compose() {
        const message = new ServerMessage(Outgoing.RoomRightsComposer);

        message.writeInt(0);

        return message;
    }
}

class RoomRightsListComposer extends Composer {
    constructor(roomId) {
        super();

        this.roomId = roomId;
    }

    compose() {
        const message = new ServerMessage(Outgoing.RoomRightsListComposer);

        message.writeInt(this.roomId);
        message.writeInt(0);

        return message;
    }
}

class RoomPlayersBadgesComposer extends Composer {
    compose() {
        const message = new ServerMessage(Outgoing.RoomPlayersBadgesComposer);

        message.writeInt(0);

        return message;
    }
}

class RoomEventMessageComposer extends Composer {
    compose() {
        const message = new ServerMessage(Outgoing.RoomEventMessageComposer);

        message.writeInt(-1);
        message.writeInt(-1);
        message.writeString('');
        message.writeInt(0);
        message.writeInt(0);
        message.writeString('');
        message.writeString('');
        message.writeInt(0);
        message.writeInt(0);

        return message;
    }
}

module.exports.RoomDataComposer = RoomDataComposer;
module.exports.UnknownIgnoredNameArrayComposer = UnknownIgnoredNameArrayComposer;
module.exports.RoomHeightmapComposer = RoomHeightmapComposer;
module.exports.RoomPlayersComposer = RoomPlayersComposer;
module.exports.RoomRelativeMapComposer = RoomRelativeMapComposer;
module.exports.RoomItemsComposer = RoomItemsComposer;
module.exports.RoomWallItemsComposer = RoomWallItemsComposer;
module.exports.RoomOwnerComposer = RoomOwnerComposer;
module.exports.RoomPaintComposer = RoomPaintComposer;
module.exports.RoomScoreComposer = RoomScoreComposer;
module.exports.RoomPlayersPositionComposer = RoomPlayersPositionComposer;
module.exports.RoomThicknessComposer = RoomThicknessComposer;
module.exports.RoomRightsComposer = RoomRightsComposer;
module.exports.RoomPlayersBadgesComposer = RoomPlayersBadgesComposer;
module.exports.RoomEventMessageComposer = RoomEventMessageComposer;
module.exports.RoomRightsListComposer = RoomRightsListComposer;
