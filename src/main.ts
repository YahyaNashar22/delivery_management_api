import { App } from "./app.js";
import { Database } from "./config/database.js";
import { envConfig } from "./config/envConfig.js";

async function bootstrap() {
  const database = new Database();
  await database.connect();

  const server = new App();
  server.listen(envConfig.PORT);
}

bootstrap();
