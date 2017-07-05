const MessengerBuddy = require('../../game/players/messengerbuddy');

class PlayerController {
    static getFriends(id) {
        const connection = Pixel.getDatabase().connection;

        return new Promise((resolve, reject) => {
            connection.query({
                sql: 'SELECT u1.id AS u1_id, u2.id AS u2_id, u1.nickname AS u1_nickname, u2.nickname AS u2_nickname, u1.motto AS u1_motto, u2.motto AS u2_motto, u1.figure AS u1_figure, u2.figure AS u2_figure, u1.gender AS u1_gender, u2.gender AS u2_gender FROM `user_relationships` JOIN users u1 ON user_relationships.userid_0 = u1.id JOIN users u2 ON user_relationships.userid_1 = u2.id',
                values: [id, id],
            }, (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }

                const out = [];

                for (const result of results) {
                    if (result.u1_id === id) {
                        out.push(new MessengerBuddy(
                            result.u2_id,
                            result.u2_nickname,
                            result.u2_motto,
                            result.u2_figure,
                            result.u2_gender
                        ));
                    } else {
                        out.push(new MessengerBuddy(
                            result.u1_id,
                            result.u1_nickname,
                            result.u1_motto,
                            result.u1_figure,
                            result.u1_gender
                        ));
                    }
                }

                resolve(out);
            });
        });
    }
}

module.exports = PlayerController;
