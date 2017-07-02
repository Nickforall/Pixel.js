class ServerMessage {
    constructor(header) {
        this._source = Buffer.alloc(0);
        this._offset = 0;
        this.header = header;

        this.writeInt(0);
        this.writeShort(header);
    }

    get buffer() {
        // set buffer's length (-4 bytes for the int32 that represents length) on the first int
        this._source.writeInt32BE(this._source.length - 4, 0);
        // make a copy so offsets can't be fucked up on later code
        return Buffer.from(this._source);
    }

    write(buffer) {
        if (!Buffer.isBuffer(buffer)) {
            throw (new Error('Buffer must be a valid Buffer!'));
        }

        this._source = Buffer.concat([this._source, buffer]);
        this._offset += buffer.length;
    }

    writeByte(byte) {
        const buf = Buffer.alloc(1);
        buf.writeInt8(byte);
        buf.write(buf);
    }

    writeBoolean(boolean) {
        this.writeByte(boolean ? 1 : 0);
    }

    writeInt(int) {
        const buf = Buffer.alloc(4);
        buf.writeInt32BE(int);
        this.write(buf);
    }

    writeShort(short) {
        const buf = Buffer.alloc(2);
        buf.writeInt16BE(short);
        this.write(buf);
    }

    writeString(str) {
        const length = Buffer.alloc(2);
        length.writeInt16BE(str.length);
        this.write(length);
        this.write(Buffer.from(str, 'utf8'));
    }

    debugBody() {
        // make a somewhat readable output text
        const bufferText = this.buffer.toString('utf8');
        let outputText = '';

        for (let i = 0; i < bufferText.length; i++) {
            if (bufferText.charCodeAt(i) <= 0x1f) {
                outputText += `[${bufferText.charCodeAt(i)}]`;
            } else {
                outputText += bufferText[i];
            }
        }

        return outputText;
    }
}

module.exports = ServerMessage;
