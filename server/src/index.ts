import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";
import express from 'express'
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();
  const em = orm.em.fork();



  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers:[HelloResolver],
      validate: false
    })
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
