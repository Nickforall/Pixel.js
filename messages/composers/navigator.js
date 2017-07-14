const Composer = require('./composer');
const Outgoing = require('../outgoing');
const ServerMessage = require('../../networking/servermessage');

class NavigatorMetaDataComposer extends Composer {
    compose() {
        const response = new ServerMessage(Outgoing.NavigatorMetaDataComposer);

        response.writeInt(4); // length of tabs
        response.writeString('official_view');
        response.writeInt(0);
        response.writeString('hotel_view');
        response.writeInt(0);
        response.writeString('roomads_view');
        response.writeInt(0);
        response.writeString('myworld_view');
        response.writeInt(0);

        return response;
    }
}

class NavigatorSearchResultComposer extends Composer {
    constructor(code, query, results) {
        super();

        this.code = code;
        this.query = query;
        this.results = results;
    }

    compose() {
        const response = new ServerMessage(Outgoing.NavigatorSearchResultComposer);

        response.writeString(this.code);
        response.writeString(this.query);

        response.writeInt(this.results.length);
        for (const section of this.results) {
            section.serialize(response);
        }

        return response;
    }
}

module.exports.NavigatorMetaDataComposer = NavigatorMetaDataComposer;
module.exports.NavigatorSearchResultComposer = NavigatorSearchResultComposer;
