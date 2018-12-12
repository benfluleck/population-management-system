import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import mongoose from 'mongoose';


import { indexRouter } from './routes/index';
import setGlobalMiddleware from './middleware/global';
import config from './config';


const isProduction = process.env.NODE_ENV === 'production';
const SESSION_LIFETIME = 60 * 60 * 1000 * 2;

const app = express();
const RedisStore = connectRedis(session);

setGlobalMiddleware(app);


mongoose.connect(config.url, {
  useCreateIndex: true,
  useNewUrlParser: true
});


mongoose.set('useFindAndModify', false);

export const mongooseConnection = mongoose.connection.once('open', () => {
  console.log('Connection to DB Initiated');
});

isProduction && app.set('trust proxy', 1);

app.use(session({
  store: new RedisStore({
    url: isProduction && process.env.REDISTOGO_URL
  }),
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: isProduction,
    maxAge: SESSION_LIFETIME,
    sameSite: true,
  }
}));

app.use('/api/v1', indexRouter);

app.get('/', (req, res) => {
  res.send(`<h1>Welcome To The Population Management System Application</h1>
            <h4>Please use PostMan and navigate to <code>/api/v1</code> to use the app</h4>
            <p>For any more info please visit <a href='https://github.com/benfluleck/population-management-system'>my Github page</a></P>
            <h4>Thanks  &#x1F600;</h4>`);

});

app.all('*', (req, res) => {
  res.status(404).send('Route Not Found');
});


export default app;
