const ServerMessage = require('../../networking/servermessage');
const Handshake = require('../composers/handshake');
const PlayerFactory = require('../../database/factories/player');
const util = require('util');

function releaseEventHandler(message) {
    console.log(`Client with release ${message.readString()} connected on the client type ${message.readString()}`);
}

// NOTE: this is not how packet sending should work but i wanted to go to bed

function machineIdEvent(message, client) {
    message.readString(); // don't do anything with the first string
    client.sendPacket(new Handshake.MachineIdComposer(message.readString()));
}

function authTicketEvent(message, client) {
    const composer = 2491;
    const packet = new ServerMessage(composer);

    const ticket = message.readString();

    PlayerFactory.fromSSOTicket(ticket).then((player) => {
        console.log(util.inspect(player));
    }).catch((err) => {
        console.error(err);
        client.disconnect();
    });

    // 'auth ok composer' can be empty
    client.sendPacket(packet);
}

module.exports.ReleaseEventHandler = releaseEventHandler;
module.exports.MachineIdEvent = machineIdEvent;
module.exports.AuthTicketEvent = authTicketEvent;
