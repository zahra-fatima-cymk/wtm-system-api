require('dotenv').config();

const common = {
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
};

module.exports = {
  development: {
    ...common,
    database: process.env.DB_NAME || 'wtm',
    logging: console.log,
  },
  test: {
    ...common,
    database: process.env.DB_NAME_TEST || 'wtm_test',
    logging: false,
  },
  production: {
    ...common,
    database: process.env.DB_NAME || 'wtm',
    logging: false,
  },
};
