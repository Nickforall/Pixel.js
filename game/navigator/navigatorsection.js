class NavigatorSection {
    constructor(rooms, searchCode, query, actionType, modeType, closed) {
        this.rooms = rooms;
        this.searchCode = searchCode;
        this.query = query;
        this.actionType = actionType;
        this.modeType = modeType;
        this.closed = closed;
    }

    serialize(message) {
        message.writeString(this.searchCode); // navigator search code
        message.writeString(this.query); // search query returned?
        message.writeInt(this.actionType); // actionType, between 0 and 3
        message.writeBoolean(this.closed); // is closed?
        message.writeInt(this.modeType); // displaymode, between 0 and 3

        message.writeInt(this.rooms.length);
        for (const room of this.rooms) {
            room.serialize(message);
        }
    }
}

module.exports = NavigatorSection;
