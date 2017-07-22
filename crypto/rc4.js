class RC4 {
    constructor(key) {
        this.table = [];

        if (key) {
            this.init(key);
        }
    }

    init(key) {
        this.table = [];
        this.key = key;
        this.i = 0;
        while (this.i < 256) {
            this.table.push(this.i++);
        }

        this.i = 0;
        this.j = 0;
        const k = key.length;
        while (this.i < 256) {
            this.j = (((this.j + this.table[this.i]) + key[this.i % k]) % 256);
            this.swap(this.i++, this.j);
        }
        this.i = 0;
        this.j = 0;
    }

    swap(a, b) {
        const k = this.table[a];
        this.table[a] = this.table[b];
        this.table[b] = k;
    }

    parse(b) {
        const result = new Buffer(b.length);

        for (let a = 0; a < b.length; a++) {
            this.i = ((this.i + 1) % 256);
            this.j = ((this.j + this.table[this.i]) % 256);
            this.swap(this.i, this.j);
            const k = ((this.table[this.i] + this.table[this.j]) % 256);
            result[a] = (b[a] ^ this.table[k]);
        }
        return result;
    }
}

module.exports = RC4;
