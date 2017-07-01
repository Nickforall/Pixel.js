const Composer = require("./composer");
const Outgoing = require("../outgoing");
const ServerMessage = require('../../networking/servermessage');

class MachineIdComposer extends Composer {
    constructor(machineid) {
        super();
        this.machineId = machineid;
    }

    compose() {
        let message = new ServerMessage(Outgoing.MachineIdComposer);
        message.writeString(this.machineIda);

        return message;
    }
}

module.exports.MachineIdComposer = MachineIdComposer;
