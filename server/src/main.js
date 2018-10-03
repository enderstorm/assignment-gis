import Hapi from 'hapi';
import * as hapipino from 'hapi-pino';

const ENV = process.env.ENV || 'dev';

const config = require(`./../config/${ENV}.config.json`);

const server = new Hapi.Server({ port: config.PORT, host: 'localhost' });

const init = async () => {
  server.route({
    method: 'GET',
    path: '/',
    handler: (req, h) => ({ message: 'Hello Hapi .js' })
  });

  await server.register({
    plugin: hapipino,
    options: {
      prettyPrint: true,
      logEvents: ['response']
    }
  });

  await server.start();
  console.log('Server is running at:', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
