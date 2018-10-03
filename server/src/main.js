import Hapi from 'hapi';
import * as hapipino from 'hapi-pino';

const server = new Hapi.Server({ port: 12345, host: 'localhost' });

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
