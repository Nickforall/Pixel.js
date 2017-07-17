const ServerMessage = require('../../networking/servermessage');
const Handshake = require('../composers/handshake');
const PlayerFactory = require('../../database/factories/player');
const Outgoing = require('../outgoing');
const Users = require('../composers/users');

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

        // these are packets that we need in order for the client to work, but
        // probably shouldn't be here.
        client.sendPacket(new Handshake.UnknownQuestComposer());
        client.sendPacket(new Users.PlayerPermissionsComposer(client.player));
        client.sendPacket(new Users.NewUserIdentityComposer());
        client.sendPacket(new Handshake.SessionRightsComposer());
        client.sendPacket(new Users.PlayerAchievementsComposer());
        client.sendPacket(new ServerMessage(Outgoing.UnknownComposer1));
        client.sendPacket(new Handshake.UnknownComposer2());
        client.sendPacket(new Handshake.DebuggerEnabledComposer());
        client.sendPacket(new ServerMessage(Outgoing.InventoryRefreshComposer));
    }).catch((err) => {
        console.error(err);
        client.disconnect();
    });
}

module.exports.ReleaseEventHandler = releaseEventHandler;
module.exports.MachineIdEvent = machineIdEvent;
module.exports.AuthTicketEvent = authTicketEvent;
