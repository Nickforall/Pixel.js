const mysql = require('mysql');
const config = require('../config.json');

class Database {
    constructor() {
        this.isConnected = false;
        this._connection = mysql.createConnection({
            host: config.mysql.host,
            user: config.mysql.user,
            password: config.mysql.pass,
            database: config.mysql.db,
        });

        this._connection.connect(() => {
            console.log('Database connected!');
            this.isConnected = true;
        });
    }

    get connection() {
        return this._connection;
    }

    end() {
        this._connection.end();
    }
}

module.exports = Database;
