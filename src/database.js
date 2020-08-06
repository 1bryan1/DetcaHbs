const mysql = require('mysql');
const { promisify } = require('util');

const { database } = require('./keys');
//const { connect } = require('./routes');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {
            console.error('Conexion a la base datos fue cerrada');
        }

        if (err.code == 'ER_CON_COUNT_ERROR') {
            console.error('Cuantas conexiones hay conectadas');
        }

        if (err.code == 'ECONNREFUSED') {
            console.error('Conexion a la base datos fue rechazada, Revisar nuevamente ');
        }
    }

    if (connection) connection.release();
    console.log('DB ha sido conectada exitosamente');
    return;
});

//promisify y pool querys a la BD
pool.query = promisify(pool.query);

module.exports = pool;