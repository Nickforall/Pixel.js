const RoomFactory = require('../../database/factories/rooms');
const Rooms = require('../composers/rooms');
const Outgoing = require('../outgoing');
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

        client.sendPacket(new Rooms.RoomDataComposer(room, client.player, boolValue));
    }).catch((err) => {
        console.error(err);
    });
}

function getRoomIgnoredEvent(message, client) {
    client.sendPacket(new Rooms.UnknownIgnoredNameArrayComposer());
}

function requestRoomLoadEvent(message, client) {
    const id = message.readInt();

    RoomFactory.getRoomById(id).then((room) => {
        client.sendPacket(new Rooms.RoomPlayersComposer(client.player));
        client.sendPacket(new Rooms.RoomPlayersPositionComposer(client.player));
        client.sendPacket(new Rooms.RoomPlayersComposer(client.player));
        client.sendPacket(new Rooms.RoomPlayersPositionComposer(client.player));
        client.sendPacket(new Rooms.RoomItemsComposer());
        client.sendPacket(new Rooms.RoomWallItemsComposer());
        client.sendPacket(new Rooms.RoomOwnerComposer(true, id));
        client.sendPacket(new Rooms.RoomPaintComposer('landscape'));
        client.sendPacket(new Rooms.RoomScoreComposer(0, false));
        client.sendPacket(new Rooms.RoomThicknessComposer());
        client.sendPacket(new Rooms.RoomDataComposer(room, client.player, true));
        client.sendPacket(new Rooms.RoomPlayersBadgesComposer());
        client.sendPacket(new Rooms.RoomEventMessageComposer());
        client.sendPacket(new Rooms.RoomRightsListComposer(id));

        client.sendPacket(new ServerMessage(Outgoing.RoomOpenComposer));
    }).catch((err) => {
        console.error(err);
    });
}

function requestRoomMapsEvent(message, client) {
    client.sendPacket(new Rooms.RoomHeightmapComposer());
    client.sendPacket(new Rooms.RoomRelativeMapComposer());
}

module.exports.RequestRoomDataEvent = requestRoomDataEvent;
module.exports.RequestRoomIgnoredListEvent = getRoomIgnoredEvent;
module.exports.RequestRoomLoadEvent = requestRoomLoadEvent;
module.exports.RequestRoomMapsEvent = requestRoomMapsEvent;
