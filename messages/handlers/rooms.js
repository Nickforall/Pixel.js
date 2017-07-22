const RoomFactory = require('../../database/factories/rooms');
const Rooms = require('../composers/rooms');
const ServerMessage = require('../../networking/servermessage');

function requestRoomDataEvent(message, client) {
    const id = message.readInt();
    const unknown = message.readInt();
    const unknown1 = message.readInt();

    RoomFactory.getRoomById(id).then((room) => {
        let boolValue = true;

        // i don't even know..
        if (unknown === 0 && unknown1 === 1) {
            boolValue = false;
        }

        client.sendPacket(new Rooms.RoomDataComposer(room, client.player, boolValue, true, 0));
    }).catch((err) => {
        console.error(err);
    });
}

function getRoomIgnoredEvent(message, client) {
    client.sendPacket(new Rooms.UnknownIgnoredNameArrayComposer());
}

function requestRoomLoadEvent(message, client) {
    const id = message.readInt();

    client.sendPacket(new Rooms.RoomTypeComposer(id));
    client.sendPacket(new Rooms.UnknownRoomContentComposer());
    client.sendPacket(new Rooms.RoomDoorPositionComposer());
    client.sendPacket(new Rooms.RoomScoreComposer(0, false));
    client.sendPacket(new Rooms.RoomPlayersComposer(client.player));
    client.sendPacket(new Rooms.RoomPlayersPositionComposer(client.player));
    client.sendPacket(new Rooms.RoomItemsComposer());
    client.sendPacket(new Rooms.RoomWallItemsComposer());
    client.sendPacket(new Rooms.RoomPaintComposer('landscape'));
    client.sendPacket(new Rooms.RoomThicknessComposer());
    client.sendPacket(new Rooms.RoomPlayersBadgesComposer());
    client.sendPacket(new Rooms.RoomRightsListComposer(id));
    client.sendPacket(new Rooms.UnknownRoomComposer1());
}

function requestRoomMapsEvent(message, client) {
    RoomFactory.getRoomById(1).then((room) => {
        client.sendPackets([
            new Rooms.RoomRelativeMapComposer(),
            new Rooms.RoomHeightmapComposer(),
            new Rooms.RoomDataComposer(room, client.player, true, false, 1)
        ]);
    }).catch((err) => {
        console.error(err);
    });
}

function roomChatEvent(message, client) {
    const string = message.readString();
    const args = string.split(' ');

    if (args[0] === ':composer') {
        args.shift();
        const header = parseInt(args.shift(), 10);
        if (!header) return;

        const newmessage = new ServerMessage(header);

        for (const arg of args) {
            const a = arg.split(':')[0];
            const b = arg.split(':')[1];

            if (!a || !b) return;

            switch (a) {
            case 'i': {
                const i = parseInt(b, 10);
                if (i) newmessage.writeInt(i);
                break;
            }
            case 'b': {
                newmessage.writeBool(b === '1');
                break;
            }
            case 's': {
                newmessage.writeString(b.replace(/\+/g, ' '));
                break;
            }
            default:
                return;
            }
        }

        client.sendPacket(newmessage);
    }
}

module.exports.RequestRoomDataEvent = requestRoomDataEvent;
module.exports.RequestRoomIgnoredListEvent = getRoomIgnoredEvent;
module.exports.RequestRoomLoadEvent = requestRoomLoadEvent;
module.exports.RequestRoomMapsEvent = requestRoomMapsEvent;
module.exports.RoomChatEvent = roomChatEvent;
