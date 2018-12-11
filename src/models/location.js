import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export const locationSchema = new Schema({
  malePopulation: { type: Number, default: 0 },
  femalePopulation: { type: Number, default: 0 },
  totalPopulation: { type: Number, default: 0 },
  locationName: { type: String, required: true },
  parentLocation: { type: ObjectId, ref: 'Location', required: false },
});


export default mongoose.model('Location', locationSchema);
