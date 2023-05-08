// import { MikroORM } from '@mikro-orm/core';
import { COOKIE_NAME, __prod__ } from './constants';
// import mikroOrmConfig from './mikro-orm.config';
import "dotenv-safe/config"
import express from 'express';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import { MyContext } from './types';
import { DataSource } from 'typeorm';
import { Post } from './entities/Post';
import { User } from './entities/User';
import path from 'path';
import { Updoot } from './entities/Updoot';

declare module 'express-session' {
  export interface SessionData {
    userId: number;
    randomKey: string;
  }
}

const main = async () => {

   const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    url: process.env.DATABASE_URL,
    // synchronize: true,
    logging: true,
    entities: [Post,User, Updoot],
    subscribers: [],
    migrations: [path.join(__dirname, "/migrations/*")],
  });

  AppDataSource.initialize()
    .then(async () => {
        console.log("Data Source has been initialized!")
        //await Post.delete({})
       // await AppDataSource.runMigrations()
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err) 
    }) 
   
  // const orm = await MikroORM.init(mikroOrmConfig);
  // await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = new Redis({port: process.env.REDIS_URL as unknown as number});

  app.set('trust proxy', true);
  app.use(cookieParser());
  app.use(
    cors({
      credentials: true,
      origin: [
        'https://studio.apollographql.com',
        'http://localhost:4000/graphql',
        process.env.CORS_ORIGIN as string
      ],
    })
  );
  app.set("proxy" , 1);
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 + 10,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET as string,
      resave: false,
    })
  );
// em: orm.em.fork(),
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redisClient,
      AppDataSource
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: [
        'https://studio.apollographql.com',
        'http://localhost:4000/graphql',
        'http://localhost:3000',
      ],
      credentials: true,
    },
  });

  app.get('/', (_, res) => {
    res.send('Hello');
  });
  app.listen(process.env.PORT, () => {
    console.log('Server up and running at Port 4000');
  });
};

main().catch((err) => {
  console.log(err);
});
export { DataSource };

