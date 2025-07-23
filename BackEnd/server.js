import dotenv from 'dotenv';
import connectDB from "./db/dbConnect.js";
import express from 'express';
import cors from 'cors';
import { routes } from './routes/indexRoutes.js';
import cookieParser from 'cookie-parser';

dotenv.config(); // Loads .env automatically
connectDB(); // Connect to Database

const app = express();

// Fix: CORS handling with default fallback
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true
}));

app.use(express.json({ limit: "14kb" }));
app.use(cookieParser());

routes(app);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}, URL: http://localhost:${PORT}/sayHello`);
});
