import dotenv from 'dotenv';

dotenv.config();


const env = process.env.NODE_ENV || 'development';

const configEnvironment = {
  development: {
    url: process.env.DEVELOPMENT_URL,
  },
  test: {
    url: process.env.TEST_URL || 'localhost'
  },
  production: {
    url: process.env.PRODUCTION_URL
  }
};


export default { ...configEnvironment[env] };
