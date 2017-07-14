class Room {
    constructor(id, name, description, owner, capacity, category, score, tags, isPublic, state) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.owner = owner;
        this.capacity = capacity;
        this.category = category;
        this.score = score;
        this.tags = tags;
        this.isPublic = isPublic;
        this.state = state;
    }

    serialize(message) {
        message.writeInt(this.id);
        message.writeString(this.name);

        if (this.isPublic) {
            message.writeInt(0);
            message.writeString('');
        } else {
            message.writeInt(this.owner.id);
            message.writeString(this.owner.name);
        }

        message.writeInt(this.state);
        message.writeInt(0); // players in room
        message.writeInt(this.capacity);
        message.writeString(this.description);
        message.writeInt(0);
        message.writeInt(this.score);
        message.writeInt(0);
        message.writeInt(this.category);

        message.writeInt(this.tags.split(';').length);
        for (const tag of this.tags.split(';')) {
            message.writeString(tag);
        }

        let base = 0;
        if (false) base |= 2; // has guild
        if (false) base |= 4; // is promoted
        if (!this.isPublic) base |= 8;

        message.writeInt(base);
    }
}

module.exports = Room;
