import { Router } from 'express';

import { authRouter } from './auth.route';
import { locationRouter } from './location.route';
import { checkSession } from '../middleware/checkSession';


export const indexRouter = Router();

indexRouter.route('/')
  .get(
    (req, res) => res.json(200, 'Welcome to the endpoints')
  );

indexRouter.use('/auth', authRouter);

indexRouter.use('/locations', checkSession, locationRouter);

