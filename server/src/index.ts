// import { MikroORM } from '@mikro-orm/core';
import { COOKIE_NAME, __prod__ } from './constants';
// import mikroOrmConfig from './mikro-orm.config';
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
    username: 'postgres',
    password: 'password',
    database: 'wheretogo',
    synchronize: true,
    logging: true,
    entities: [Post,User],
    subscribers: [],
    migrations: [],
  });

  AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    }) 

  // const orm = await MikroORM.init(mikroOrmConfig);
  // await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = new Redis();

  app.set('trust proxy', true);
  app.use(cookieParser());
  app.use(
    cors({
      credentials: true,
      origin: [
        'https://studio.apollographql.com',
        'http://localhost:4000/graphql',
        'http://localhost:3000',
      ],
    })
  );

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
      secret: 'keyboard cat',
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
  app.listen(4000, () => {
    console.log('Server up and running at Port 4000');
  });
};

main().catch((err) => {
  console.log(err);
});
export { DataSource };

