const Navigator = require('../composers/navigator');

function requestNavigatorDataEvent(message, client) {
    client.sendPacket(new Navigator.NavigatorMetaDataComposer());
    client.sendPacket(new Navigator.LiftedRoomsComposer());
    client.sendPacket(new Navigator.CollapsedCategoryComposer());
    client.sendPacket(new Navigator.NavigatorSavedSearchesComposer());
    client.sendPacket(new Navigator.NavigatorEventCategoryComposer());
}

function searchNavigatorEvent(message, client) {
    const code = message.readString();
    const query = message.readString();

    Pixel.getNavigator().getFilter(code, client.player).then((rooms) => {
        client.sendPacket(new Navigator.NavigatorSearchResultComposer(code, query, rooms));
    }).catch((err) => {
        console.error(err);
    });
}

function requestNavigatorSettingsEvent(message, client) {
    client.sendPacket(new Navigator.NavigatorSettingsComposer());
}

function getRoomCategoriesEvent(message, client) {
    client.sendPacket(new Navigator.RoomCategoriesComposer());
}

function requestPromotedRoomsEvent(message, client) {
    client.sendPacket(new Navigator.UnknownRoomListComposer());
}

module.exports.RequestNavigatorDataEvent = requestNavigatorDataEvent;
module.exports.SearchNavigatorEvent = searchNavigatorEvent;
module.exports.RequestNavigatorSettingsEvent = requestNavigatorSettingsEvent;
module.exports.GetRoomCategoriesEvent = getRoomCategoriesEvent;
module.exports.RequestPromotedRoomsEvent = requestPromotedRoomsEvent;
