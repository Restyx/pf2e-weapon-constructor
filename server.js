const express = require('express');
const path = require('path');
const { Client } = require('pg');

const app = express();
app.listen(8080, '127.0.0.1');
app.use(express.static('data'));

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'password',
    database: 'workshop'
})

client.connect()
    .then(() => console.log('connection succeeded'))
    .catch(err => console.error(err.stack));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'html', 'index.html'));
});

app.get('/db', (req, res) => {
    let query = client.query('SELECT boon_name, category, description FROM boons ORDER BY category, boon_name ASC;')
        .then(result => res.json(result.rows))
        .catch(error => console.error(error.stack))
});