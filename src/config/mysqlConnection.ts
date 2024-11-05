import mysql from 'mysql2/promise';
// import config from '../config/config';

const db = mysql.createPool({
    host: '173.231.207.59',
    user: 'superdolphins_2024',
    password: 'UmEI{Y?w%cc0',
    database: 'superdolphins_2024',
});

export default db;