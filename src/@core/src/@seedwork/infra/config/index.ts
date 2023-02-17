import { config as readEnv } from "dotenv";
import { join } from "path";

type Config = {
    db: {
        vendor: any,
        host: string,
        logging: boolean
    }
}

function makeConfig(envFile): Config {
  const output = readEnv({ path: envFile });

  return {
    db: {
      vendor: output.parsed.DB_VENDOR as any,
      host: output.parsed.DB_HOST,
      logging: output.parsed.DB_LOGGING === "true",
    },
  };
}

//export const config = makeConfig(envFile);

const envTestingFile = join(__dirname, "../../../../.env.test");
export const configTest = makeConfig(envTestingFile);


// import { config as readEnv } from "dotenv";
// import { join } from "path";

// export class Config {
//   static env: any = {};
//   static db() {
//     Config.readEnv();

//       return {
//         dialect: 'sqlite',
//         host: Config.env.DB_HOST,
//         logging: Config.env.DB_LOGGING === 'true',
//       };
//   }

//   static readEnv() {
//     Config.env = readEnv({
//       path: join(__dirname, "../../../../.env.test"),
//     }).parsed;
//   }
// }
