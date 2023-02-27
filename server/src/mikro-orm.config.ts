import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { Options } from "@mikro-orm/core";
import path from 'path';
import { User } from "./entities/User";

const config: Options = {
    migrations:{
        path: path.join(__dirname,'./migrations'),
        glob: "!(*.d).{js,ts}",
    },
    entities: [Post,User],
    dbName: "wheretogo",
    user: "postgres",
    password: 'password',
    type: "postgresql",
    debug: !__prod__,
  };

  export default config;
  