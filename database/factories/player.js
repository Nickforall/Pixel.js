const Player = require('../../game/players/player');

// NOTE: should reuse code here in some way.

function fromSSOTicket(ticket) {
    const connection = Pixel.getDatabase().connection;

    return new Promise((resolve, reject) => {
        connection.query({
            sql: 'SELECT * FROM `users` WHERE `sso` = ? LIMIT 1',
            values: [ticket],
        }, (error, results) => {
            if (error) {
                reject(error);
                return;
            }

            if (!results[0]) {
                reject(new Error('User not found'));
                return;
            }

            const sqlPlayer = results[0];

            resolve(new Player(
                sqlPlayer.id,
                sqlPlayer.nickname,
                sqlPlayer.motto,
                sqlPlayer.figure,
                sqlPlayer.gender,
                sqlPlayer.credits,
                sqlPlayer.homeroom_id,
                sqlPlayer.club_expiration
            ));
        });
    });
}

function fromId(id) {
    const connection = Pixel.getDatabase().connection;

    return new Promise((resolve, reject) => {
        connection.query({
            sql: 'SELECT * FROM `users` WHERE `id` = ? LIMIT 1',
            values: [id],
        }, (error, results) => {
            if (error) {
                reject(error);
                return;
            }

            if (!results[0]) {
                reject(new Error('User not found'));
                return;
            }

            const sqlPlayer = results[0];

            resolve(new Player(
                sqlPlayer.id,
                sqlPlayer.nickname,
                sqlPlayer.motto,
                sqlPlayer.figure,
                sqlPlayer.gender,
                sqlPlayer.credits,
                sqlPlayer.homeroom_id,
                sqlPlayer.club_expiration
            ));
        });
    });
}

module.exports = {
    fromSSOTicket: fromSSOTicket,
    fromId: fromId,
};
