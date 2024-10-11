import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'test',
    database: process.env.DB_NAME || 'test'
  },
  app: {
    port: process.env.PORT || 3005
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  }
};
