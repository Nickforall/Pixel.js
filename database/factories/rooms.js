const Room = require('../../game/rooms/room');

class RoomFactory {

    static getRoomById(id) {
        const connection = Pixel.getDatabase().connection;

        return new Promise((resolve, reject) => {
            connection.query({
                sql: 'SELECT * FROM `rooms` INNER JOIN users ON rooms.owner_id = users.id WHERE rooms.id = ? LIMIT 1',
                values: [id],
            }, (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }

                const result = results[0];
                resolve(new Room(
                    result.id,
                    result.name,
                    result.description,
                    result.owner_id,
                    result.nickname,
                    result.capacity,
                    result.category,
                    result.score,
                    result.tags,
                    result.public === 1,
                    result.state
                ));
            });
        });
    }

    static getRoomsByPlayer(player) {
        const connection = Pixel.getDatabase().connection;

        return new Promise((resolve, reject) => {
            connection.query({
                sql: 'SELECT * FROM `rooms` WHERE `owner_id` = ?',
                values: [player.id],
            }, (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }

                const out = [];

                for (const result of results) {
                    out.push(new Room(
                        result.id,
                        result.name,
                        result.description,
                        player.id,
                        player.name,
                        result.capacity,
                        result.category,
                        result.score,
                        result.tags,
                        result.public === 1,
                        result.state
                    ));
                }

                resolve(out);
            });
        });
    }
}

module.exports = RoomFactory;
