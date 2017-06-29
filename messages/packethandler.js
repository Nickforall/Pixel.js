const Incoming = require('./incoming');
const Handshake = require('./handlers/handshake');

class PacketHandler {
    constructor() {
        this.packets = {};

        this.registerHandlers();
    }

    getPacket(header) {
        if(this.packets[header]) return this.packets[header];

        return null;
    }

    hasHandler(header) {
        return this.packets[header] !== undefined
    }

    addHandler(header, handler) {
        this.packets[header] = handler;
    }

    executeHandler(message, client) {
        if(!this.hasHandler(message.header)) return;
        this.packets[message.header].call({}, message, client);
    }

    registerHandlers() {
        this.addHandler(Incoming.ReleaseEventHandler, Handshake.ReleaseEventHandler);
        this.addHandler(Incoming.MachineIdEvent, Handshake.MachineIdEvent);
        this.addHandler(Incoming.AuthTicketEvent, Handshake.AuthTicketEvent);
    }
}

module.exports = PacketHandler;
