const Users = require('../composers/users');
const PlayerFactory = require('../../database/factories/player');

function requestPlayerDataEvent(message, client) {
    const player = client.player;

    client.sendPacket(new Users.PlayerDataComposer(player));
    client.sendPacket(new Users.PlayerPerksComposer(player));
    client.sendPacket(new Users.PlayerHomeComposer(player));
}

function requestPlayerCurrencyEvent(message, client) {
    client.sendPacket(new Users.PlayerCreditsComposer(client.player));
}

function requestPlayerProfileEvent(message, client) {
    const id = message.readInt();

    if (Pixel.getPlayerManager().getPlayer(id) !== undefined) {
        client.sendPacket(new Users.PlayerProfileComposer(Pixel.getPlayerManager().getPlayer(id)));
    } else {
        PlayerFactory.fromId(id).then((player) => {
            client.sendPacket(new Users.PlayerProfileComposer(player));
        }).catch((err) => {
            console.error(err);
        });
    }
}

module.exports.RequestPlayerDataEvent = requestPlayerDataEvent;
module.exports.RequestPlayerCurrencyEvent = requestPlayerCurrencyEvent;
module.exports.RequestPlayerProfileEvent = requestPlayerProfileEvent;
