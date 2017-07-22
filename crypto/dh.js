const jsbn = require('../lib/jsbn');

class DiffieHellman {
    generateDH(prime, generator, base) {
        if (!base) {
            base = 10;
        }

        if (prime) {
            this.prime = new jsbn.BigInteger(prime, base);
        } else {
            this.prime = new jsbn.BigInteger('114670925920269957593299136150366957983142588366300079186349531', 10);
        }

        if (generator) {
            this.generator = new jsbn.BigInteger(generator, base);
        } else {
            this.generator = new jsbn.BigInteger('1589935137502239924254699078669119674538324391752663931735947', 10);
        }

        this.privateKey = new jsbn.BigInteger(this.randomString(), 16);

        if (this.prime.compareTo(this.generator) === 1) {
            const temp = this.prime;
            this.prime = this.generator;
            this.generator = temp;
        }

        this.publicKey = this.generator.modPow(this.privateKey, this.prime);
    }

    generateSharedKey(clientKey, base) {
        if (!base) {
            base = 10;
        }

        this.publicClientKey = new jsbn.BigInteger(clientKey, base);
        this.sharedKey = this.publicClientKey.modPow(this.privateKey, this.prime);
    }

    randomString() {
        return (Math.floor(Math.random() * 1000000000000).toString(16)
            + Math.floor(Math.random() * 1000000000000).toString(16)
            + Math.floor(Math.random() * 1000000000000).toString(16));
    }

    getPrime() {
        return this.prime;
    }

    getGenerator() {
        return this.generator;
    }

    getPublicKey() {
        return this.publicKey;
    }

    getSharedKey() {
        return this.sharedKey;
    }
}

module.exports = DiffieHellman;
