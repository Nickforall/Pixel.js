const Composer = require('./composer');
const Outgoing = require('../outgoing');
const ServerMessage = require('../../networking/servermessage');

class GenericAlertComposer extends Composer {
    constructor(message) {
        super();
        this.alertMessage = message;
    }

    compose() {
        const message = new ServerMessage(Outgoing.GenericAlertComposer);
        message.writeString(this.alertMessage);
        return message;
    }

}

module.exports.GenericAlertComposer = GenericAlertComposer;
