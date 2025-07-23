import mongoose from 'mongoose';
import { DB_NAME } from '../utils/constants.js';

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`\n✅ DB Connected successfully`);
        console.log(`🔗 DB Host: ${connectionInstance.connection.host}`);

        // Enable debugging during development
        if (process.env.NODE_ENV === "development") {
            mongoose.set("debug", true);
        }
        
    } catch (error) {
        console.error("❌ ERROR While Connecting to Database: ", error.message);
        process.exit(1);
    }
}

export default connectDB;
