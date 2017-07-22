const RoomTile = require('./roomtile');

class Roomlayout {
    constructor(modelName, modelMap) {
        this.name = modelName;
        this.map = modelMap;
        this.size = 0;

        this.parse();
    }

    parse() {
        const mapArray = this.map.split('\r\n');
        this.tiles = [];

        this.sizeX = mapArray[0].length;
        this.sizeY = mapArray.length;

        for (let y = 0; y < mapArray.length; y++) {
            const row = mapArray[y];
            this.tiles[y] = [];

            for (let x = 0; x < row.length; x++) {
                const tile = row[x];
                let state = true;
                let height = 0;

                if (tile.toLowerCase() === 'x') {
                    state = false;
                    this.tiles[y][x] = null;
                } else {
                    height = parseInt(tile, 10);
                    this.tiles[y][x] = new RoomTile(x, y, height, state);
                }


                this.size += 1;
            }
        }
    }
}

module.exports = Roomlayout;
