const Composer = require('./composer');
const Outgoing = require('../outgoing');
const ServerMessage = require('../../networking/servermessage');

class HotelViewDataComposer extends Composer {
    constructor(data1, data2) {
        super();

        this.data1 = data1;
        this.data2 = data2;
    }

    compose() {
        const message = new ServerMessage(Outgoing.HotelViewDataComposer);

        message.writeString(this.data1);
        message.writeString(this.data2);

        return message;
    }
}

module.exports.HotelViewDataComposer = HotelViewDataComposer;
