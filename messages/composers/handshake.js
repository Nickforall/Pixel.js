const Composer = require('./composer');
const Outgoing = require('../outgoing');
const ServerMessage = require('../../networking/servermessage');

class CryptoComposer extends Composer {
    constructor(prime, generator) {
        super();
        this.p = prime;
        this.g = generator;
    }

    compose() {
        const message = new ServerMessage(Outgoing.CryptoComposer);
        message.writeString(this.p);
        message.writeString(this.g);

        return message;
    }
}

class SecretKeyComposer extends Composer {
    constructor(key) {
        super();
        this.key = key;
    }

    compose() {
        const message = new ServerMessage(Outgoing.SecretKeyComposer);
        message.writeString(this.key);
        message.writeBoolean(true);

        return message;
    }
}

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

class PongComposer extends Composer {
    constructor(index) {
        super();
        this.i = index;
    }

    compose() {
        const message = new ServerMessage(Outgoing.PongComposer);

        message.writeInt(this.i);

        return message;
    }
}

class UnknownInventoryComposer extends Composer {
    compose() {
        const message = new ServerMessage(Outgoing.UnknownInventoryComposer);

        message.writeInt(0);
        // this packet wants a list of strings

        return message;
    }
}

module.exports.CryptoComposer = CryptoComposer;
module.exports.SecretKeyComposer = SecretKeyComposer;
module.exports.MachineIdComposer = MachineIdComposer;
module.exports.UnknownQuestComposer = UnknownQuestComposer;
module.exports.SessionRightsComposer = SessionRightsComposer;
module.exports.UnknownComposer2 = UnknownComposer2;
module.exports.DebuggerEnabledComposer = DebuggerEnabledComposer;
module.exports.PongComposer = PongComposer;
module.exports.UnknownInventoryComposer = UnknownInventoryComposer;
