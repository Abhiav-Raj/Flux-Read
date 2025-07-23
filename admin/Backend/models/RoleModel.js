import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["user", "admin"], // Enforcing only "user" or "admin" roles
    default: "user",
  },
});

const Role = mongoose.model('Role', roleSchema);

export default Role;
