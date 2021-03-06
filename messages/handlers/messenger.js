const Messenger = require('../composers/messenger');
const PlayerController = require('../../database/controllers/player.js');

function initializeMessengerEvent(message, client) {
    client.sendPacket(new Messenger.InitializeMessengerComposer());

    PlayerController.getFriends(client.player.id).then((friends) => {
        client.sendPacket(new Messenger.PlayerFriendsComposer(friends));
    }).catch((err) => {
        console.error(err);
    });
}

function requestFriendRequestEvent(message, client) {
    client.sendPacket(new Messenger.PlayerFriendRequestsComposer());
}

module.exports.InitializeMessengerEvent = initializeMessengerEvent;
module.exports.RequestFriendRequestEvent = requestFriendRequestEvent;
