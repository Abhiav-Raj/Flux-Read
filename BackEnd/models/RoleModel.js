import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ["user", "admin"],
  },
});

export default mongoose.model("Role", RoleSchema);
