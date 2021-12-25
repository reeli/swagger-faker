import jsonServer from "json-server";
import fs from "fs";
import { SwaggerFakerConfig } from "common";

export const startServer = (swaggerFakerConfig: SwaggerFakerConfig) => {
  const config = {
    db: `${swaggerFakerConfig.outputFolder}/db.json`,
    middlewares: `${swaggerFakerConfig.outputFolder}/middlewares`,
    port: swaggerFakerConfig.port,
  };
  const server = jsonServer.create();
  const router = jsonServer.router(config.db);
  const defaultMiddlewares = jsonServer.defaults();
  const middlewares = fs
    .readdirSync(config.middlewares)
    .map((v) => require(`${process.cwd()}/${config.middlewares}/${v}`));

  server.use(defaultMiddlewares);
  server.use(middlewares);
  server.use(router);

  server.listen(config.port, () => {
    console.log(`
    JSON Server is running...
  
    Home:
    http://localhost:${config.port}
  `);
  });
};
