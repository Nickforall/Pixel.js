const Users = require('../composers/users');

function requestPlayerDataEvent(message, client) {
    const player = client.player;

    client.sendPacket(new Users.PlayerDataComposer(player));
    client.sendPacket(new Users.PlayerPerksComposer(player));
    client.sendPacket(new Users.PlayerHomeComposer(player));
}

function requestPlayerCurrencyEvent(message, client) {
    client.sendPacket(new Users.PlayerCreditsComposer(client.player));
}

module.exports.RequestPlayerDataEvent = requestPlayerDataEvent;
module.exports.RequestPlayerCurrencyEvent = requestPlayerCurrencyEvent;
