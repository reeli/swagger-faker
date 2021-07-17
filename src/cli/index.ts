import fs from "fs";
import path from "path";
import prettier from "prettier";
import { program } from "commander";
import {readSwaggerFakerConfig, DEFAULT_CONFIG} from "./utils";
import {jsonServerGen} from "../json-server";

program
  .version("3.0.0", "-v, --version")
  .description("Generate mock data from swagger/openapi")
  .action(() => {
    const swaggerFakerConfig = readSwaggerFakerConfig();
    console.log(`Generate config to ${swaggerFakerConfig.outputFolder} folder successfully!`);
    jsonServerGen(swaggerFakerConfig);
  });

program
  .command("init")
  .description("create swagger-faker.config.json file")
  .action(() => {
    const file = path.resolve(process.cwd(), `./swagger-faker.config.json`);

    if (fs.existsSync(file)) {
      console.log(
        "Will do nothing, because you've already have a swagger-faker.config.json file in the root directory.",
      );
    } else {
      fs.writeFileSync(file, prettier.format(JSON.stringify(DEFAULT_CONFIG), { parser: "json" }));
    }
  });

program.parse(process.argv);
