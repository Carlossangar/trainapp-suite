const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'trainapp.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

class Database {
    constructor() {
        this.db = null;
        this.init();
    }

    init() {
        this.db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
                return;
            }
            console.log('Connected to SQLite database');
            this.createTables();
        });

        this.db.configure('busyTimeout', 1000);
    }

    createTables() {
        const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
        this.db.exec(schema, (err) => {
            if (err) {
                console.error('Error creating tables:', err.message);
                return;
            }
            console.log('Database tables created/verified');
        });
    }

    run(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }

    get(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(query, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    all(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Database connection closed');
                    resolve();
                }
            });
        });
    }
}

module.exports = new Database();