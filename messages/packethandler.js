const Incoming = require('./incoming');
const Handshake = require('./handlers/handshake');
const HotelView = require('./handlers/hotelview');
const Users = require('./handlers/users');
const Messenger = require('./handlers/messenger');
const Navigator = require('./handlers/navigator');
const Rooms = require('./handlers/rooms');


class PacketHandler {
    constructor() {
        this.packets = {};

        this.registerHandlers();
    }

    getPacket(header) {
        if (this.packets[header]) return this.packets[header];

        return null;
    }

    hasHandler(header) {
        return this.packets[header] !== undefined;
    }

    addHandler(header, handler) {
        this.packets[header] = handler;
    }

    executeHandler(message, client) {
        if (!this.hasHandler(message.header)) return;
        this.packets[message.header].call({}, message, client);
    }

    registerHandlers() {
        // handshake
        this.addHandler(Incoming.ReleaseEventHandler, Handshake.ReleaseEventHandler);
        this.addHandler(Incoming.MachineIdEvent, Handshake.MachineIdEvent);
        this.addHandler(Incoming.AuthTicketEvent, Handshake.AuthTicketEvent);

        // users
        this.addHandler(Incoming.RequestPlayerDataEvent, Users.RequestPlayerDataEvent);
        this.addHandler(Incoming.RequestPlayerCurrencyEvent, Users.RequestPlayerCurrencyEvent);
        this.addHandler(Incoming.RequestPlayerProfileEvent, Users.RequestPlayerProfileEvent);
        this.addHandler(Incoming.RequestPlayerClubDataEvent, Users.RequestPlayerClubDataEvent);
        this.addHandler(Incoming.RequestPlayerWardrobeEvent, Users.RequestPlayerWardrobeEvent);
        this.addHandler(Incoming.GetClubDataEvent, Users.GetClubDataEvent);
        this.addHandler(Incoming.RequestCitizenshipEvent, Users.RequestCitizenshipEvent);

        // hotel view
        this.addHandler(Incoming.HotelViewDataEvent, HotelView.HotelViewDataEvent);
        this.addHandler(Incoming.RequestBonusRareEvent, HotelView.RequestBonusRareEvent);

        // messenger
        this.addHandler(Incoming.InitializeMessengerEvent, Messenger.InitializeMessengerEvent);

        // rooms
        this.addHandler(Incoming.RequestRoomDataEvent, Rooms.RequestRoomDataEvent);
        this.addHandler(1371, Rooms.RequestRoomIgnoredListEvent);

        // Navigator
        this.addHandler(Incoming.RequestNavigatorDataEvent, Navigator.RequestNavigatorDataEvent);
        this.addHandler(Incoming.SearchNavigatorEvent, Navigator.SearchNavigatorEvent);
        this.addHandler(Incoming.RequestNavigatorSettingsEvent,
            Navigator.RequestNavigatorSettingsEvent);
        this.addHandler(Incoming.GetRoomCategoriesEvent, Navigator.GetRoomCategoriesEvent);
        this.addHandler(Incoming.RequestPromotedRoomsEvent, Navigator.RequestPromotedRoomsEvent);
    }
}

module.exports = PacketHandler;
