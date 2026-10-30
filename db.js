const mysql = require('mysql2/promise');
require('dotenv').config();

const requiredConfig = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingConfig = requiredConfig.filter((key) => process.env[key] === undefined);

if (missingConfig.length > 0) {
    throw new Error(
        `Missing database configuration: ${missingConfig.join(', ')}. ` +
        'Copy .env.example to .env and set the values.'
    );
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;