const ServerMessage = require('../../networking/servermessage');
const Handshake = require("../composers/handshake");

function releaseEventHandler(message, client) {
    console.log("Client with release " + message.readString() + " connected on the client type " + message.readString())
}

//NOTE: this is not how packet sending should work but i wanted to go to bed

function machineIdEvent(message, client) {
    message.readString(); // don't do anything with the first string
    client.sendPacket(new Handshake.MachineIdComposer(message.readString()));
}

function authTicketEvent(message, client) {
    let composer = 2491;
    let packet = new ServerMessage(composer);

    // 'auth ok composer' can be empty
    client.sendPacket(packet)
}

module.exports.ReleaseEventHandler = releaseEventHandler;
module.exports.MachineIdEvent = machineIdEvent;
module.exports.AuthTicketEvent = authTicketEvent
