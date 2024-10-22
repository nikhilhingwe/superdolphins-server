import app from './app'
import config from './config/config'
import { connectToDatabase } from './services/databaseService';
import logger from './util/logger';

const server = app.listen(config.PORT)

// eslint-disable-next-line @typescript-eslint/no-floating-promises
;(async()=>{
    try {
        const connection = await connectToDatabase();
        logger.info('DATABASE_CONNECTION', {
            meta: {
                CONNECTION_NAME: connection.config.database
            }
        })
        logger.info('APPLICATION_STARTED', {
            meta: {
                PORT: config.PORT,
                SERVER_URL: config.SERVER_URL
            }
        })
    } catch (err) {
        logger.error('APPLICATION_ERROR', {meta: err})
        server.close((error)=>{
            if(error){
                logger.error('APPLICATION_ERROR', {meta: error})
            }
            process.exit(1)
        })
    }
})()