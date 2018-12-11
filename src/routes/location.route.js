import { Router } from 'express';

import { addLocation, getLocations, getLocation, updateLocation, deleteLocation } from '../controllers/location';
import { checkSession } from '../middleware/checkSession';

export const locationRouter = Router();

locationRouter.route('/')
  .get(getLocations)
  .post( checkSession, addLocation);

locationRouter.route('/:locationId')
  .get(getLocation)
  .put(updateLocation)
  .delete(deleteLocation)
