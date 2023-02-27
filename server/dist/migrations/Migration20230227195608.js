"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20230227195608 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20230227195608 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "user" drop constraint "user_password_unique";');
    }
    async down() {
        this.addSql('alter table "user" add constraint "user_password_unique" unique ("password");');
    }
}
exports.Migration20230227195608 = Migration20230227195608;
//# sourceMappingURL=Migration20230227195608.js.map