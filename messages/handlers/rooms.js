const RoomFactory = require('../../database/factories/rooms');
const Rooms = require('../composers/rooms');

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

module.exports.RequestRoomDataEvent = requestRoomDataEvent;
module.exports.RequestRoomIgnoredListEvent = getRoomIgnoredEvent;
