"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSource = void 0;
const constants_1 = require("./constants");
require("dotenv-safe/config");
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const hello_1 = require("./resolvers/hello");
const post_1 = require("./resolvers/post");
const user_1 = require("./resolvers/user");
const ioredis_1 = __importDefault(require("ioredis"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const typeorm_1 = require("typeorm");
Object.defineProperty(exports, "DataSource", { enumerable: true, get: function () { return typeorm_1.DataSource; } });
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
const path_1 = __importDefault(require("path"));
const Updoot_1 = require("./entities/Updoot");
const main = async () => {
    const AppDataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        url: process.env.DATABASE_URL,
        logging: true,
        entities: [Post_1.Post, User_1.User, Updoot_1.Updoot],
        subscribers: [],
        migrations: [path_1.default.join(__dirname, "/migrations/*")],
    });
    AppDataSource.initialize()
        .then(async () => {
        console.log("Data Source has been initialized!");
    })
        .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });
    const app = (0, express_1.default)();
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redisClient = new ioredis_1.default({ port: process.env.REDIS_URL });
    app.set('trust proxy', true);
    app.use((0, cookie_parser_1.default)());
    app.use((0, cors_1.default)({
        credentials: true,
        origin: [
            'https://studio.apollographql.com',
            'http://localhost:4000/graphql',
            'https://pasteaplace.com'
        ],
    }));
    app.set("proxy", 1);
    app.use((0, express_session_1.default)({
        name: constants_1.COOKIE_NAME,
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
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [hello_1.HelloResolver, post_1.PostResolver, user_1.UserResolver],
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
//# sourceMappingURL=index.js.map