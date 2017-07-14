const Navigator = require('../composers/navigator');

function requestNavigatorDataEvent(message, client) {
    client.sendPacket(new Navigator.NavigatorMetaDataComposer());
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

module.exports.RequestNavigatorDataEvent = requestNavigatorDataEvent;
module.exports.SearchNavigatorEvent = searchNavigatorEvent;
