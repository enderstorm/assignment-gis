import Hapi from 'hapi';
import * as hapipino from 'hapi-pino';
import { Client } from 'pg';

import { queryTime } from './query';

const ENV = process.env.ENV || 'dev';

const config = require(`./../config/${ENV}.config.json`);

const server = new Hapi.Server({ port: config.SERVER.PORT, host: config.SERVER.HOST });

const db = new Client({
  user: config.DB.USERNAME,
  host: config.DB.HOST,
  database: config.DB.DB,
  password: config.DB.PASSWORD,
  port: config.DB.PORT
});

const init = async () => {


  await server.register({
    plugin: hapipino,
    options: {
      prettyPrint: true,
      logEvents: ['response']
    }
  });

  await db.connect();
  console.log(`[POSTGRES] Connected to ${db.database} at ${db.host}:${db.port}`);

  server.app.db = db;
  
  server.route({
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
      const time = await queryTime(db);
      return { time: time, a: 'dwad' }
    }
  });

  try {
    await server.start();
    console.log('[HAPI] Server is running at:', server.info.uri);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

init();
