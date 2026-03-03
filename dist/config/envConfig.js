import "dotenv/config";
class EnvConfig {
    PORT;
    MONGO_URI;
    constructor() {
        this.PORT = this.parsePort(process.env.PORT);
        this.MONGO_URI = this.parseMongoUri(process.env.MONGO_URI);
    }
    parsePort(port) {
        if (!port)
            return 5000;
        const parsed = Number(port);
        if (Number.isNaN(parsed) || parsed <= 0) {
            throw new Error("Invalid PORT environment variable");
        }
        return parsed;
    }
    parseMongoUri(uri) {
        if (!uri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        return uri;
    }
}
export const envConfig = new EnvConfig();
