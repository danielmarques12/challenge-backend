import express from 'express';
import path from 'path';
import cors from 'cors';
import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
    this.server.use(cors());

    // Be very careful using cors, due to safety reasons.
    // If using this, make sure to only use it when in local development mode.
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
