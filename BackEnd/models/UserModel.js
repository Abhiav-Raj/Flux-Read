import mongoose from 'mongoose';

export default mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isEmailVerified: { type: Boolean, default: false },
  isMFAEnabled: { type: Boolean, default: false },
  city: { type: String },
  role: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Role", 
    required: true  // Ensure a role must always be assigned
  },
  age: { type: Number }
}));
