import { COOKIE_NAME, __prod__ } from './constants';
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import "dotenv-safe/config";
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import path from 'path';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { DataSource } from 'typeorm';
import { Post } from './entities/Post';
import { Updoot } from './entities/Updoot';
import { User } from './entities/User';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
;

declare module 'express-session' {
  export interface SessionData {
    userId: number;
    randomKey: string;
  }
}


const main = async () => {
  const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: true,
    entities: [Post, User, Updoot],
    migrations: [path.join(__dirname, "./migrations/*")],
  });


  AppDataSource.initialize()
    .then(async () => {
      console.log("Data Source has been initialized!")
      // await Post.delete({})
      // await AppDataSource.runMigrations()
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err)
    });

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = new Redis(process.env.REDIS_URL);

  app.use(cookieParser());
  app.use(
    cors({
      credentials: true,
      origin: [
        'https://studio.apollographql.com',
        'http://localhost:4000/graphql',
        'http://localhost:3000',
        'https://pasteaplace.com',
        'https://api.pasteaplace.com',
        process.env.CORS_ORIGIN
      ],
    })
  );
  app.set("trust proxy", 1);

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
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    persistedQueries: false,
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
        'https://api.pasteaplace.com/',
        'https://pasteaplace.com',
        process.env.CORS_ORIGIN
      ],
      credentials: true,
    },
  });

  app.get('/', (_, res) => {
    res.send('Hello ' + "port: " + process.env.PORT +
      "\n" + " CORS ORIGIN: " + process.env.CORS_ORIGIN + " "
      + process.env.DATABASE_URL +
      '\n Redis url ' + process.env.REDIS_URL
      + "\n Session secret " + process.env.SESSION_SECRET +
      "env" + process.env.NODE_ENV);
  });
  app.listen(process.env.PORT, () => {
    console.log('Server up and running at Port 4000');
  });
};

main().catch((err) => {
  console.log('Muah error', err);
});
export { DataSource };

