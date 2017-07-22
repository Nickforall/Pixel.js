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

class NavigatorSettingsComposer extends Composer {
    compose() {
        const response = new ServerMessage(Outgoing.NavigatorSettingsComposer);

        response.writeInt(10); // x
        response.writeInt(10); // y
        response.writeInt(425); // width
        response.writeInt(535); // height
        response.writeBoolean(false);
        response.writeInt(0);

        return response;
    }
}

class RoomCategoriesComposer extends Composer {
    compose() {
        const response = new ServerMessage(Outgoing.RoomCategoriesComposer);
        response.writeInt(0); // length
        return response;
    }
}

class LiftedRoomsComposer extends Composer {
    compose() {
        const response = new ServerMessage(Outgoing.LiftedRoomsComposer);
        response.writeInt(0); // length
        return response;
    }
}

class CollapsedCategoryComposer extends Composer {
    compose() {
        const response = new ServerMessage(Outgoing.CollapsedCategoryComposer);
        response.writeInt(46); // length
        response.writeString('new_ads');
        response.writeString('friend_finding');
        response.writeString('staffpicks');
        response.writeString('with_friends');
        response.writeString('with_rights');
        response.writeString('query');
        response.writeString('recommended');
        response.writeString('my_groups');
        response.writeString('favorites');
        response.writeString('history');
        response.writeString('top_promotions');
        response.writeString('campaign_target');
        response.writeString('friends_rooms');
        response.writeString('groups');
        response.writeString('metadata');
        response.writeString('history_freq');
        response.writeString('highest_score');
        response.writeString('competition');
        response.writeString('category__Agencies');
        response.writeString('category__Role Playing');
        response.writeString('category__Global Chat & Discussi');
        response.writeString('category__GLOBAL BUILDING AND DE');
        response.writeString('category__global party');
        response.writeString('category__global games');
        response.writeString('category__global fansite');
        response.writeString('category__global help');
        response.writeString('category__Trading');
        response.writeString('category__global personal space');
        response.writeString('category__Habbo Life');
        response.writeString('category__TRADING');
        response.writeString('category__global official');
        response.writeString('category__global trade');
        response.writeString('category__global reviews');
        response.writeString('category__global bc');
        response.writeString('category__global personal space');
        response.writeString('eventcategory__Hottest Events');
        response.writeString('eventcategory__Parties & Music');
        response.writeString('eventcategory__Role Play');
        response.writeString('eventcategory__Help Desk');
        response.writeString('eventcategory__Trading');
        response.writeString('eventcategory__Games');
        response.writeString('eventcategory__Debates & Discuss');
        response.writeString('eventcategory__Grand Openings');
        response.writeString('eventcategory__Friending');
        response.writeString('eventcategory__Jobs');
        response.writeString('eventcategory__Group Events');
        return response;
    }
}

class UnknownRoomListComposer extends Composer {
    compose() {
        const response = new ServerMessage(Outgoing.UnknownRoomListComposer);

        response.writeInt(2);
        response.writeString('');

        response.writeInt(0);
        response.writeBoolean(true);

        response.writeInt(0);
        response.writeString('A');
        response.writeString('B');
        response.writeInt(1);
        response.writeString('C');
        response.writeString('D');
        response.writeInt(1);
        response.writeInt(1);
        response.writeInt(1);
        response.writeString('E');

        return response;
    }
}

class NavigatorSavedSearchesComposer extends Composer {
    compose() {
        const response = new ServerMessage(Outgoing.NavigatorSavedSearchesComposer);

        response.writeInt(4); // length of tabs
        response.writeInt(1);
        response.writeString('official');
        response.writeString('');
        response.writeString('');
        response.writeInt(2);
        response.writeString('recommended');
        response.writeString('');
        response.writeString('');
        response.writeInt(3);
        response.writeString('my');
        response.writeString('');
        response.writeString('');
        response.writeInt(4);
        response.writeString('favorites');
        response.writeString('');
        response.writeString('');

        return response;
    }
}

class NavigatorEventCategoryComposer extends Composer {
    compose() {
        const response = new ServerMessage(Outgoing.NavigatorEventCategoryComposer);
        response.writeInt(0); // length
        return response;
    }
}

module.exports.NavigatorMetaDataComposer = NavigatorMetaDataComposer;
module.exports.NavigatorSearchResultComposer = NavigatorSearchResultComposer;
module.exports.NavigatorSavedSearchesComposer = NavigatorSavedSearchesComposer;
module.exports.NavigatorSettingsComposer = NavigatorSettingsComposer;
module.exports.RoomCategoriesComposer = RoomCategoriesComposer;
module.exports.UnknownRoomListComposer = UnknownRoomListComposer;
module.exports.LiftedRoomsComposer = LiftedRoomsComposer;
module.exports.CollapsedCategoryComposer = CollapsedCategoryComposer;
module.exports.NavigatorEventCategoryComposer = NavigatorEventCategoryComposer;
