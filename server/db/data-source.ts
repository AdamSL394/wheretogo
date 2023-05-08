import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions= {
    type: 'postgres',
    host: 'localhost',
    username: "postgres",
    database: "wheretogo",
    port: 5432,
    entities: ["dist/entities/*.ts"],
    migrations: ["dist/migration/*.ts"],
}

const dataSource= new DataSource(dataSourceOptions);

export default dataSource