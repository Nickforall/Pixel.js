const Room = require('../../game/rooms/room');

class RoomFactory {
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
                        player,
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
