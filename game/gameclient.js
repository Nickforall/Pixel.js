class GameClient {
    constructor(socket) {
        this._socket = socket;
    }

    sendPacket(packet) {
        this._socket.write(packet.buffer);

        console.log("Server => " + packet.header + " -> " + packet.debugBody())
    }
}

module.exports = GameClient;
