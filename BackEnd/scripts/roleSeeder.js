import mongoose from "mongoose";
import dotenv from "dotenv";
import Role from "../models/RoleModel.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

const insertRoles = async () => {
  try {
    await connectDB(); // Ensure DB is connected

    const roles = ["user", "admin"];

    for (const role of roles) {
      const existingRole = await Role.findOne({ name: role });
      if (!existingRole) {
        await Role.create({ name: role });
        console.log(`✅ Role "${role}" inserted`);
      } else {
        console.log(`⚠️ Role "${role}" already exists`);
      }
    }

    mongoose.connection.close(); // Close DB connection after seeding
    console.log("🌱 Role seeding completed!");
  } catch (error) {
    console.error("Error inserting roles:", error);
  }
};

insertRoles();
