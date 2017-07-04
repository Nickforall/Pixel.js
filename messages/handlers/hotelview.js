const HotelView = require('../composers/hotelview');

function hotelViewDataEvent(message, client) {
    const data = message.readString();

    if (data.indexOf(';') > -1) {
        const parts = data.split(';');

        for (const s of parts) {
            if (s.indexOf(',') > -1) {
                client.sendPacket(new HotelView.HotelViewDataComposer(s, s.split(',')[s.split(',').length - 1]));
            } else {
                client.sendPacket(new HotelView.HotelViewDataComposer(data, data));
            }

            // loop only once because otherwhise i break shit
            break;
        }
    } else {
        client.sendPacket(new HotelView.HotelViewDataComposer(data, data.split(',')[data.split(',').length - 1]));
    }
}

module.exports.HotelViewDataEvent = hotelViewDataEvent;
