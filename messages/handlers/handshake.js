const ServerMessage = require('../../networking/servermessage');
const Handshake = require('../composers/handshake');
const PlayerFactory = require('../../database/factories/player');
const Outgoing = require('../outgoing');
const Users = require('../composers/users');

function initializeCryptoEvent(message, client) {
    client.sendPacket(new Handshake.CryptoComposer(
        Pixel.getGameServer().rsa.sign(client.diffieHellman.getPrime().toString()),
        Pixel.getGameServer().rsa.sign(client.diffieHellman.getGenerator().toString())
    ));
}

function generateSecretKeyEvent(message, client) {
    const key = message.readString();

    if (key.length !== 256) {
        return;
    }

    client.sendPacket(new Handshake.SecretKeyComposer(
        Pixel.getGameServer().rsa.sign(client.diffieHellman.getPublicKey().toString())
    ));
    client.diffieHellman.generateSharedKey(Pixel.getGameServer().rsa.decrypt(key));
    client.initRc4();
}

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
        // client.sendPacket(new ServerMessage(Outgoing.PlayerAuthOkComposer));
        client.setPlayer(player);

        // these are packets that we need in order for the client to work, but
        // probably shouldn't be here.
        client.sendPackets([
            new ServerMessage(Outgoing.PlayerAuthOkComposer),
            new Users.PlayerHomeComposer(player),
            new Users.PlayerPermissionsComposer(client.player),
            new Handshake.SessionRightsComposer(),
            new Handshake.DebuggerEnabledComposer(),
            new Users.PlayerEffectListComposer(),
            new Users.PlayerClothesComposer(),
            new Users.PlayerFavoritesComposer()
        ]);
    }).catch((err) => {
        console.error(err);
        client.disconnect();
    });
}

function pingEvent(message, client) {
    client.sendPacket(new Handshake.PongComposer(message.readInt()));
}

module.exports.InitializeCryptoEvent = initializeCryptoEvent;
module.exports.GenerateSecretKeyEvent = generateSecretKeyEvent;
module.exports.ReleaseEventHandler = releaseEventHandler;
module.exports.MachineIdEvent = machineIdEvent;
module.exports.AuthTicketEvent = authTicketEvent;
module.exports.PingEvent = pingEvent;
