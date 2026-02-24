import "dotenv/config";

class EnvConfig {
  public readonly PORT: number;
  public readonly MONGO_URI: string;

  constructor() {
    this.PORT = this.parsePort(process.env.PORT);
    this.MONGO_URI = this.parseMongoUri(process.env.MONGO_URI);
  }

  private parsePort(port?: string): number {
    if (!port) return 5000;
    const parsed = Number(port);

    if (Number.isNaN(parsed) || parsed <= 0) {
      throw new Error("Invalid PORT environment variable");
    }

    return parsed;
  }

  private parseMongoUri(uri: string | undefined): string {
    if (!uri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    return uri;
  }
}

export const envConfig = new EnvConfig();
