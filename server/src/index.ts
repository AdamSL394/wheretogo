import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";
import express from 'express'
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();
  const em = orm.em.fork();



  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers:[HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    context: () => ({em : orm.em.fork()})
  })

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.get('/', (_,res)=> {
    res.send('Hello')
  })
  app.listen(4000,()=> {
    console.log('Server up and running at Port 4000')
  })


  // const post = em.create(Post, {title:' my first post '});
  // await em.persistAndFlush(post);

  await em.find(Post,{});
  // console.log(post)
};

main().catch((err) => {
  console.log(err);
});  
