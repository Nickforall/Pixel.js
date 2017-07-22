// const Incoming = require('./incoming');
const Handshake = require('./handlers/handshake');
const HotelView = require('./handlers/hotelview');
const Users = require('./handlers/users');
const Messenger = require('./handlers/messenger');
const Navigator = require('./handlers/navigator');
const Rooms = require('./handlers/rooms');
const Incoming = require('./incoming');

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
        this.addHandler(Incoming.InitializeCryptoEvent, Handshake.InitializeCryptoEvent);
        this.addHandler(Incoming.GenerateSecretKeyEvent, Handshake.GenerateSecretKeyEvent);
        this.addHandler(Incoming.ReleaseEventHandler, Handshake.ReleaseEventHandler);
        this.addHandler(Incoming.MachineIdEvent, Handshake.MachineIdEvent);
        this.addHandler(Incoming.AuthTicketEvent, Handshake.AuthTicketEvent);
        this.addHandler(Incoming.PingEvent, Handshake.PingEvent);

        // users
        this.addHandler(Incoming.RequestPlayerDataEvent, Users.RequestPlayerDataEvent);
        this.addHandler(Incoming.RequestPlayerCurrencyEvent, Users.RequestPlayerCurrencyEvent);
        this.addHandler(Incoming.RequestPlayerProfileEvent, Users.RequestPlayerProfileEvent);
        this.addHandler(Incoming.RequestPlayerClubDataEvent, Users.RequestPlayerClubDataEvent);
        this.addHandler(Incoming.RequestPlayerWardrobeEvent, Users.RequestPlayerWardrobeEvent);
        this.addHandler(Incoming.GetClubDataEvent, Users.GetClubDataEvent);
        this.addHandler(Incoming.RequestCitizenshipEvent, Users.RequestCitizenshipEvent);
        this.addHandler(Incoming.UpdateLookEvent, Users.UpdateLookEvent);
        this.addHandler(Incoming.RequestPlayerMenuSettingsEvent,
           Users.RequestPlayerMenuSettingsEvent);

        // hotel view
        this.addHandler(Incoming.HotelViewDataEvent, HotelView.HotelViewDataEvent);
        this.addHandler(Incoming.RequestBonusRareEvent, HotelView.RequestBonusRareEvent);

        // messenger
        this.addHandler(Incoming.InitializeMessengerEvent, Messenger.InitializeMessengerEvent);
        this.addHandler(Incoming.RequestFriendRequestEvent, Messenger.RequestFriendRequestEvent);

        // rooms
        this.addHandler(Incoming.RequestRoomDataEvent, Rooms.RequestRoomDataEvent);
        this.addHandler(Incoming.RequestLoadRoomEvent, Rooms.RequestRoomLoadEvent);
        this.addHandler(Incoming.RequestRoomMapsEvent, Rooms.RequestRoomMapsEvent);
        this.addHandler(Incoming.RoomChatEvent, Rooms.RoomChatEvent);

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
