import mongoose from "mongoose";
import { envConfig } from "./envConfig.js";

export class Database {
  public async connect(): Promise<void> {
    try {
      const connection = await mongoose.connect(envConfig.MONGO_URI);
      console.log(
        "Successfully connected to database",
        connection.connection.name,
      );
    } catch (error) {
      console.error("MongoDB connection failed:", error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }
}
