const Users = require('../composers/users');
const PlayerFactory = require('../../database/factories/player');
const config = require('../../config.json');
const PlayerController = require('../../database/controllers/player');
const chalk = require('chalk');

function requestPlayerDataEvent(message, client) {
    const player = client.player;

    client.sendPacket(new Users.PlayerDataComposer(player));
    client.sendPacket(new Users.PlayerPerksComposer(player));
    client.sendPacket(new Users.PlayerHomeComposer(player));

    if (config.welcomeAlert.enabled) {
        player.sendAlert(config.welcomeAlert.message);
    }
}

function requestPlayerCurrencyEvent(message, client) {
    client.sendPacket(new Users.PlayerCreditsComposer(client.player));
    client.sendPacket(new Users.PlayerCurrencyComposer(client.player));
}

function requestPlayerProfileEvent(message, client) {
    const id = message.readInt();

    if (Pixel.getPlayerManager().getPlayer(id) !== undefined) {
        client.sendPacket(new Users.PlayerProfileComposer(Pixel.getPlayerManager().getPlayer(id)));
    } else {
        PlayerFactory.fromId(id).then((player) => {
            PlayerController.getFriendCount(player.id).then((count) => {
                client.sendPacket(new Users.PlayerProfileComposer(player, count));
            });
        }).catch((err) => {
            console.error(err);
        });
    }
}

function requestPlayerClubDataEvent(message, client) {
    client.sendPacket(new Users.PlayerClubComposer(client.player));
}

function requestPlayerWardrobeEvent(message, client) {
    client.sendPacket(new Users.PlayerWardrobeComposer(client.player));
}

function getClubDataEvent(message, client) {
    client.sendPacket(new Users.ClubDataComposer(message.readInt()));
}

function requestCitizenshipEvent(message, client) {
    client.sendPacket(new Users.PlayerCitizenshipComposer(message.readString()));
}

function updateLookEvent(message, client) {
    const gender = message.readString();
    const look = message.readString();

    if (gender !== 'M' && gender !== 'F') {
        console.log(chalk.red(`Possible scripting attempt from ${client.player.name} `
            + `#(${client.player.id}). Expected either M/F as gender, but got ${gender}`));
        return;
    }

    PlayerController.updateLook(client.player.id, gender, look).then(() => {
        client.player.gender = gender;
        client.player.figure = look;

        client.sendPacket(new Users.PlayerUpdateLookComposer(client.player));
    }).catch((err) => {
        console.error(err);
        client.player.sendAlert('Could not update your look, try again later...');
    });
}

module.exports.RequestPlayerDataEvent = requestPlayerDataEvent;
module.exports.RequestPlayerCurrencyEvent = requestPlayerCurrencyEvent;
module.exports.RequestPlayerProfileEvent = requestPlayerProfileEvent;
module.exports.RequestPlayerClubDataEvent = requestPlayerClubDataEvent;
module.exports.RequestPlayerWardrobeEvent = requestPlayerWardrobeEvent;
module.exports.GetClubDataEvent = getClubDataEvent;
module.exports.RequestCitizenshipEvent = requestCitizenshipEvent;
module.exports.UpdateLookEvent = updateLookEvent;
