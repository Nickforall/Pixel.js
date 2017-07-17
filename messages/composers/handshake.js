const Composer = require('./composer');
const Outgoing = require('../outgoing');
const ServerMessage = require('../../networking/servermessage');

class MachineIdComposer extends Composer {
    constructor(machineid) {
        super();
        this.machineId = machineid;
    }

    compose() {
        const message = new ServerMessage(Outgoing.MachineIdComposer);
        message.writeString(this.machineId);

        return message;
    }
}

class UnknownQuestComposer extends Composer {
    compose() {
        // this composer has most likely something to do with quests and
        // perhaps the seasonal calender.

        const message = new ServerMessage(Outgoing.UnknownQuestComposer);
        message.writeBoolean(false);

        return message;
    }
}

class SessionRightsComposer extends Composer {
    compose() {
        const message = new ServerMessage(Outgoing.SessionRightsComposer);

        message.writeBoolean(true);
        message.writeBoolean(true);
        message.writeBoolean(true);

        return message;
    }
}

class UnknownComposer2 extends Composer {
    compose() {
        const message = new ServerMessage(Outgoing.UnknownComposer2);

        message.writeBoolean(true);

        return message;
    }
}

class DebuggerEnabledComposer extends Composer {
    compose() {
        const message = new ServerMessage(Outgoing.DebuggerEnabledComposer);

        message.writeBoolean(true);

        return message;
    }
}

module.exports.MachineIdComposer = MachineIdComposer;
module.exports.UnknownQuestComposer = UnknownQuestComposer;
module.exports.SessionRightsComposer = SessionRightsComposer;
module.exports.UnknownComposer2 = UnknownComposer2;
module.exports.DebuggerEnabledComposer = DebuggerEnabledComposer;
