const util = require('util');
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'blog'
});

pool.getConnection((err, connection) => {
    if(err)
        console.error("Connection Fail from your database");
    if(connection)
        connection.release();
    return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;