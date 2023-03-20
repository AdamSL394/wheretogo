// import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core"
import {Request, Response } from 'express'
import { DataSource } from 'typeorm';
import  Redis from 'ioredis'
// em: EntityManager<IDatabaseDriver<Connection>>
export type MyContext = {
     AppDataSource: DataSource
     req: Request,
     res: Response,
     redisClient: Redis
}