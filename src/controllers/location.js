import mongoose from 'mongoose';

import Location from '../models/location';
import CheckNumber from '../validators/checkNumber';
import calculateTotalPopulation from '../helpers/totalPopulation';

const ObjectId = mongoose.Types.ObjectId;

export const addLocation = async (req, res) => {
  try {
    const {
      malePopulation, femalePopulation, locationName,
      parentLocation,
    } = req.body;


    if (!CheckNumber(malePopulation) || !CheckNumber(femalePopulation)) {
      return res.status(400).json({ status: 'error', message: "Both Population should be numbers" });
    }

    const totalPopulation = calculateTotalPopulation(malePopulation, femalePopulation);
    const locationExists = await Location.findOne({ locationName });

    if (locationExists) {
      return res.status(409).json({ status: 'error', message: "This location already exists please make it unique" });
    }

    if (parentLocation) {
      const parentLocationExists = await Location.findOneAndUpdate({ _id: parentLocation }, {
        $inc:
        {
          malePopulation,
          femalePopulation,
          totalPopulation
        }
      })
      if (!parentLocationExists) {
        return res.status(404).json({ status: 'error', message: "This Parent Location does not exist" });
      }
    }


    const newLocation = new Location({
      malePopulation: malePopulation.trim(),
      femalePopulation: femalePopulation.trim(),
      totalPopulation,
      locationName: locationName.trim(),
      parentLocation,
    })
    const newLocationQuery = await newLocation.save();

    const { _doc: {  ...response } } = newLocationQuery

    res.status(201).json({ status: 'success', message: 'Location Successfully Created', data: response });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message })
  }

}


export const getLocations = async (req, res) => {
  try {
    const allLocations = await Location.find({})
    res.status(200).json({ status: 'success', message: 'Locations Successfully Retrieved', data: allLocations })
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message })
  }
}

export const getLocation = async (req, res) => {
  try {
    const { locationId } = req.params;

    const locationExists = await Location.findById({ _id: locationId })

    if (!locationExists) {
      return res.status(404).json({ status: 'error', message: "This Location does not exist" });
    }
    Location.aggregate([
      {
        $match: {
          $or: [
            { _id: ObjectId(locationId) },
            { parentLocation: ObjectId(locationId) }

          ]
        }
      }
    ])
      .then((allLocations) => {
        res.status(200).json({ status: 'success', message: 'Location Successfully Retrieved', data: allLocations })
      })
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message })
  }
}

export const updateLocation = async (req, res) => {
  try {
    const { locationId } = req.params;
    const {
      malePopulation,
      femalePopulation,
      locationName,
      parentLocation,
    } = req.body;


    const locationExists = await Location.findById({ _id: locationId })

    if (!locationExists) {
      return res.status(404).json({ status: 'error', message: "This Location does not exist" });
    }

    let totalPopulation;

    if (locationExists.malePopulation !== malePopulation || locationExists.femalePopulation !== femalePopulation) {
      totalPopulation = calculateTotalPopulation(malePopulation, femalePopulation)
    }

    const data = {
      malePopulation, femalePopulation, locationName,
      parentLocation, totalPopulation,
    }

    if (!locationExists.parentLocation) {
      return res.status(403).json({ status: 'error', message: "You cannot update root locations" });
    }

    if (parentLocation) {
      const parentLocationExists = await Location.findOne({ _id: parentLocation })

      if (!parentLocationExists) {
        return res.status(404).json({ status: 'error', message: "This Parent Location does not exist" });
      }
    }

    const updatedLocation = await Location.findByIdAndUpdate({ _id: locationId }, { $set: data }, { new: true })


    res.status(200).json({ status: 'success', message: 'Location Successfully Updated, Please update the Root', data: updatedLocation });

  }
  catch (error) {
    res.status(400).json({ status: 'error', message: error.message })
  }

}

export const deleteLocation = async (req, res) => {
  try {
    const { locationId } = req.params;

    const locationExists = await Location.findById({ _id: locationId })

    if (!locationExists.parentLocation) {
      return res.status(403).json({ status: 'error', message: "You cannot delete a root locations" });
    }

    await Location.findByIdAndDelete({ _id: locationId }, async (err, response) => {
      if (response) {
        const parentLocationExists = await Location.findOneAndUpdate({ _id: response.parentLocation }, {
          $inc:
          {
            malePopulation: (-Number(response.malePopulation)),
            femalePopulation: (-Number(response.femalePopulation)),
            totalPopulation: (-Number(response.totalPopulation))
          }
        })

        if (!parentLocationExists) {
          return res.status(404).json({ status: 'error', message: "This Parent Location does not exist" });
        }
        res.status(200).json({ status: 'success', message: 'Location Successfully Deleted' });

      } else {
        return res.status(404).json({ status: 'error', message: "This Location does not exist" });
      }


    })

  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message })

  }
}
