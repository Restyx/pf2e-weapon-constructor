const { Client } = require('pg');

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

let query = client.query('SELECT boon_name, category, description FROM boons;')
    .then(res => console.log(res.rows[0]))
    .catch(err => console.error(err.stack))

exports.query = query;