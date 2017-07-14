const RoomFactory = require('../../database/factories/rooms');
const NavigatorSection = require('./navigatorsection');

class Navigator {
    getFilter(searchCode, player) {
        switch (searchCode) {
        case 'myworld_view':
            return this.myWorldFilter(player);
        default:
            return this.myWorldFilter(player);
        }
    }

    myWorldFilter(p) {
        return new Promise((resolve, reject) => {
            RoomFactory.getRoomsByPlayer(p).then((rooms) => {
                resolve([
                    new NavigatorSection(
                        rooms,
                        'my',
                        '',
                        0,
                        0,
                        false
                    )
                ]);
            }).catch((err) => {
                reject(err);
            });
        });
    }
}

module.exports = Navigator;
