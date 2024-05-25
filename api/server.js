require('dotenv').config();
const express = require('express');
const axios = require('axios');
const qs = require('qs');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3001;

// Подключение к базе данных и создание таблицы для токенов
const db = new sqlite3.Database('./mydatabase.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createTokenTable();
    }
});

// Создание таблицы tokens
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

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Обработка OAuth callback от Pipedrive
app.get('/pipedrive/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) {
        return res.status(400).send('No authorization code provided.');
    }
    try {
        const data = qs.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: `${process.env.BASE_URL}/pipedrive/callback`,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });
        const config = {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        };
        const response = await axios.post('https://oauth.pipedrive.com/oauth/token', data, config);
        const { access_token, refresh_token, expires_in } = response.data;
        console.log('Access Token:', access_token);

        // Сохранение токена в базе данных
        db.run(`INSERT INTO tokens (access_token, refresh_token, expires_in) VALUES (?, ?, ?)`, [access_token, refresh_token, expires_in], function(err) {
            if (err) {
                console.error('Error saving token:', err.message);
                res.status(500).send('Failed to save token');
            } else {
                res.send('Authorization successful! You can close this tab.');
            }
        });
    } catch (error) {
        console.error('Error exchanging authorization code for access token:', error);
        res.status(500).send('An error occurred during the authorization process.');
    }
});

// Статическое предоставление файлов
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Закрытие базы данных при завершении работы сервера
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
        process.exit(0);
    });
});
