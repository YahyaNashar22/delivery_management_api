import mongoose from "mongoose";
import { envConfig } from "./envConfig.js";
export class Database {
    async connect() {
        try {
            const connection = await mongoose.connect(envConfig.MONGO_URI);
            console.log("Successfully connected to database", connection.connection.name);
        }
        catch (error) {
            console.error("MongoDB connection failed:", error);
            process.exit(1);
        }
    }
    async disconnect() {
        await mongoose.disconnect();
    }
}
