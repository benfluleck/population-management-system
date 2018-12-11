import dotenv from 'dotenv';

dotenv.config();


const env = process.env.NODE_ENV || 'development';

const configEnvironment = {
  development: {
    url: process.env.DEVELOPMENT_URL,
  }
};


module.exports = { ...configEnvironment[env] };
