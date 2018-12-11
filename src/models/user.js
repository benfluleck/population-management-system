import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model('User', userSchema);
