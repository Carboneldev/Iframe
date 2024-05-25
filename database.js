const sqlite3 = require('sqlite3').verbose();

let db;

function connectDatabase() {
    db = new sqlite3.Database('./mydatabase.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.error('Error opening database', err.message);
        } else {
            console.log('Connected to the SQLite database.');
            createTokenTable();
        }
    });
}

function createTokenTable() {
    db.run(`CREATE TABLE IF NOT EXISTS tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        access_token TEXT NOT NULL,
        refresh_token TEXT,
        expires_in INTEGER
    )`, [], (err) => {
        if (err) {
            console.error('Error creating token table', err.message);
        } else {
            console.log('Token table created or already exists');
        }
    });
}

function saveToken(access_token, refresh_token, expires_in) {
    const insertSql = `INSERT INTO tokens (access_token, refresh_token, expires_in) VALUES (?, ?, ?)`;
    db.run(insertSql, [access_token, refresh_token, expires_in], function(err) {
        if (err) {
            console.error('Error saving token:', err.message);
        } else {
            console.log('Token saved with ID:', this.lastID);
        }
    });
}

function closeDatabase() {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

module.exports = {
    connectDatabase,
    saveToken,
    closeDatabase
};