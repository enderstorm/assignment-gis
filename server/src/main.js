import Hapi from 'hapi';
import * as hapipino from 'hapi-pino';
import { Client } from 'pg';

import { queryTime, queryExample, puby, rails, within, boundaries, ubytovanie, near } from './query';

const ENV = process.env.ENV || 'dev';

const config = require(`./../config/${ENV}.config.json`);

const server = new Hapi.Server({
  port: config.SERVER.PORT,
  host: config.SERVER.HOST,
  routes: { cors: true }
});

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
      return { time: time, a: 'dwad' };
    }
  });

  server.route({
    method: 'GET',
    path: '/pg',
    handler: async (request, h) => {
      const result = await queryExample(db);
      return { result: result.rows };
    }
  });

  server.route({
    method: 'GET',
    path: '/puby',
    handler: async (request, h) => {
      const result = await puby(db);

      return { result: result.rows };
    }
  });

  server.route({
    method: 'GET',
    path: '/rails',
    handler: async (request, h) => {
      const result = await rails(db);

      return { result: result.rows };
    }
  });

  server.route({
    method: 'GET',
    path: '/within',
    handler: async (request, h) => {
      const { x, y } = request.query;
      const result = await within(db)({ x, y });

      return { result: result.rows };
    }
  });

  server.route({
    method: 'GET',
    path: '/kraje',
    handler: async (request, h) => {
      const result = await boundaries(db)();

      return { result: result ? result.rows : null };
    }
  });

  server.route({
    method: 'GET',
    path: '/ubytovanie',
    handler: async (request, h) => {
      const { boundaryId } = request.query;
      const result = await ubytovanie(db)({ boundaryId });

      return { result: result ? result.rows : null };
    }
  });

  server.route({
    method: 'GET',
    path: '/near',
    handler: async (request, h) => {
      const { buildingId } = request.query;
      const result = await near(db)({ buildingId });

      return { result: result ? result.rows : null };
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
