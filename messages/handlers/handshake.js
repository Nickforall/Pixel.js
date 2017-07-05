const ServerMessage = require('../../networking/servermessage');
const Handshake = require('../composers/handshake');
const PlayerFactory = require('../../database/factories/player');
const Outgoing = require('../outgoing');

function releaseEventHandler(message) {
    console.log(`Client with release ${message.readString()} connected on the client type ${message.readString()}`);
}

function machineIdEvent(message, client) {
    message.readString(); // don't do anything with the first string
    client.sendPacket(new Handshake.MachineIdComposer(message.readString()));
}

function authTicketEvent(message, client) {
    const ticket = message.readString();

    PlayerFactory.fromSSOTicket(ticket).then((player) => {
        client.sendPacket(new ServerMessage(Outgoing.PlayerAuthOkComposer));
        client.setPlayer(player);
    }).catch((err) => {
        console.error(err);
        client.disconnect();
    });
}

module.exports.ReleaseEventHandler = releaseEventHandler;
module.exports.MachineIdEvent = machineIdEvent;
module.exports.AuthTicketEvent = authTicketEvent;
