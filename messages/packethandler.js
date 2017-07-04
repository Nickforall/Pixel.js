const Incoming = require('./incoming');
const Handshake = require('./handlers/handshake');
const Users = require('./handlers/users');

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
    }
}

module.exports = PacketHandler;
