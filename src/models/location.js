import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const locationSchema = new Schema({
  malePopulation: { type: Number, default: 0 },
  femalePopulation: { type: Number, default: 0 },
  totalPopulation: { type: Number, default: 0 },
  locationName: { type: String, required: true },
  parentlocation: { type: ObjectId },
  childLocations: { type: Array }
});

export default mongoose.model('Location', locationSchema);
