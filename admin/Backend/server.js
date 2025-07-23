import dotenv from 'dotenv';
dotenv.config();  // ✅ Ensure dotenv loads the variables correctly

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from "./db/dbConnect.js";
import { routes } from './routes/indexRoutes.js';
import Role from './models/RoleModel.js';  // Add Role model import

// Connect to the database
connectDB(); // ✅ Connect to the database

// Create default roles if they don't exist
const createDefaultRoles = async () => {
  try {
    // Check if the 'user' role exists
    const userRole = await Role.findOne({ name: 'user' });
    if (!userRole) {
      const newUserRole = new Role({ name: 'user' });
      await newUserRole.save();
      console.log('User role created');
    }

    // Check if the 'admin' role exists
    const adminRole = await Role.findOne({ name: 'admin' });
    if (!adminRole) {
      const newAdminRole = new Role({ name: 'admin' });
      await newAdminRole.save();
      console.log('Admin role created');
    }

  } catch (err) {
    console.error('Error inserting roles:', err);
  }
};

// Call this function after connecting to the database
createDefaultRoles();

const app = express();

// ✅ Proper CORS setup
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST',"PUT", "DELETE"],
    credentials: true
}));

app.use(express.json({ limit: "14kb" }));
app.use(cookieParser());
routes(app);

const PORT = process.env.PORT || 8082;

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT} | URL: http://localhost:${PORT}/admin`);
});
