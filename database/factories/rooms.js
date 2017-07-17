const Room = require('../../game/rooms/room');

class RoomFactory {

    static getRoomById(id) {
        const connection = Pixel.getDatabase().connection;

        return new Promise((resolve, reject) => {
            connection.query({
                sql: 'SELECT rooms.id, name, description, owner_id, capacity, category, score, tags, public, state, room_owner.nickname AS owner_name FROM `rooms` JOIN `users` room_owner ON rooms.owner_id = room_owner.id WHERE rooms.id = ? LIMIT 1',
                values: [id],
            }, (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }

                const result = results[0];

                if (!result) {
                    reject(new Error('Unknown Room id'));
                    return;
                }

                resolve(new Room(
                    result.id,
                    result.name,
                    result.description,
                    result.owner_id,
                    result.owner_name,
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
