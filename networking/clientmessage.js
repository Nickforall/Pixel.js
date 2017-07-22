class ClientMessage {
    constructor(source) {
        if (!Buffer.isBuffer(source)) {
            throw (new Error('Source must be a valid Buffer!'));
        }

        this._source = source;
        this._length = source.length;
        this._offset = 0;
        this._header = -1;
    }

    /**
     * Gets the raw buffer
     * @return {Buffer} The buffer containing raw bytes of the data from the net
     */
    get source() {
        return this._source;
    }

    /**
     * Gets the length of the packet
     * @return {number} length
     */
    get length() {
        return this._length;
    }

    /**
     * Gets the current index we're reading
     * @return {number} current index we're reading
     */
    get index() {
        return this._offset;
    }

    /**
     * Gets the header of this serverMessage
     * @return {number}
     */
    get header() {
        return this._header;
    }

    set header(header) {
        this._header = header;
    }

    /**
     * Resets the index to 0
     */
    resetIndex() {
        this._offset = 0;
    }

    /**
     * Reads an x amount of bytes from the buffer
     * @param  {number} size the amount of bytes to read
     * @return {Buffer}      new buffer with the read bytes
     */
    read(size) {
        const buffer = this.source.slice(this._offset, this._offset + size);
        this._offset += size;
        return buffer;
    }

    /**
     * Read a single byte from buffer
     * @return {byte}
     */
    readByte() {
        return this.read(1)[0];
    }

    /**
     * Reads an int32 from this serverMessage
     * @return {number} int32 from serverMessage
     */
    readInt() {
        return this.read(4).readInt32BE();
    }

    /**
     * Reads a short (int16) from this serverMessage
     * @return {number} short from serverMessage
     */
    readShort() {
        return this.read(2).readInt16BE();
    }

    /**
     * Reads a string from this serverMessage
     * @return {string} string from serverMessage
     */
    readString() {
        const stringLength = this.readShort();
        return this.read(stringLength).toString('utf8');
    }

    /**
     * Reads a boolean from this serverMessage
     * @return {boolean} boolean from serverMessage
     */
    readBoolean() {
        return this.readByte() === 1;
    }

    debugBody() {
        // make a somewhat readable output text
        const bufferText = this.source.slice(6).toString('utf8');
        let outputText = '';

        for (let i = 0; i < bufferText.length; i++) {
            if (bufferText.charCodeAt(i) < 0x20 || bufferText.charCodeAt(i) > 126) {
                outputText += `[${bufferText.charCodeAt(i)}]`;
            } else {
                outputText += bufferText[i];
            }
        }

        return outputText;
    }
}

module.exports = ClientMessage;
