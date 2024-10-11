import 'reflect-metadata';
import http from 'http';
import stoppable from 'stoppable';
import { MigrationExecutor } from 'typeorm';

import config from './config';

import { AppDataSource } from './data-source';
import { connection } from './index';
import app from './app';
import router from './routes';

const runMigrations = async () => {
  console.log('Running pending migrations');
  const executor = new MigrationExecutor(
    AppDataSource,
    AppDataSource.createQueryRunner()
  );

  await executor.executePendingMigrations();
};

const startServer = async () => {
  const server = stoppable(http.createServer(app));
  server.listen(config.app.port, () => {
    console.log('Server started on port', config.app.port);
  });

  process.on('SIGTERM', async () => {
    console.log('Gracefully shutting down server');

    // wait for readiness probe to start failing before stopping the server
    await new Promise(resolve => setTimeout(resolve, 15 * 1000));
    server.stop(() => {
      console.log('Server stopped');
      setTimeout(() => process.exit(0), 1000);
    });
  });
};

const start = async () => {
  try {
    await connection();
    app.use(router);
    await runMigrations();
    await startServer();
    // await createSuperAdmin();
  } catch (e) {
    console.log('Error starting server', e);
    process.exit(1);
  }
};

export default start();
