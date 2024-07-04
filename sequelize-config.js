const dotenv = require('dotenv');

switch (process.env.NODE_ENV) {
  case 'production':
    dotenv.config({ path: '.env.production' });
    break;
  case 'test':
    dotenv.config({ path: '.env.test' });
    break;
  default:
    dotenv.config({ path: '.env' });
}

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
};
