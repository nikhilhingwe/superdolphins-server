// db.ts
import mysql from 'mysql2/promise'
import config from '../config/config'

const connectionConfig = {
    host: config.HOST,
    user: config.USERNAME,
    password: config.PASSWORD,
    database: config.DATABASE
}





async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection(connectionConfig)
        // console.log('Connected to the database!');
        return connection
    } catch (error) {
        // console.error('Error connecting to the database:', error);
        throw error
    }
}

export { connectToDatabase }
