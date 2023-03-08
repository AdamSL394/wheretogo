"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20230303063459 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20230303063459 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" text not null, "password" text not null);');
        this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
        this.addSql('alter table "user" add constraint "user_password_unique" unique ("password");');
    }
    async down() {
        this.addSql('drop table if exists "user" cascade;');
    }
}
exports.Migration20230303063459 = Migration20230303063459;
//# sourceMappingURL=Migration20230303063459.js.map