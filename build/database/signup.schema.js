"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = exports.ER_SIGNUP = void 0;
const index_schema_1 = __importDefault(require("./index.schema"));
exports.ER_SIGNUP = 'signup';
const seed = async (dropFirst = false) => {
    try {
        if (dropFirst) {
            await index_schema_1.default.schema.dropTable(exports.ER_SIGNUP);
        }
        await index_schema_1.default.schema.createTable(exports.ER_SIGNUP, table => {
            table.increments('user_id');
            table.string('fname');
            table.string('lname');
            table.string('email');
            table.string('password');
            table.string('investing_type');
            table.string('job_title');
            table.string('annual_income');
            table.string('liquid_asset');
            table.string('funding_account');
            table.string('phone_no');
            table.string('street_address');
            table.string('city');
            table.string('state');
            table.string('postal_code');
            table.string('country');
            table.boolean('basic_info').defaultTo('false');
            table.string('profilepic');
            table.boolean('is_deleted').defaultTo('false');
            table.timestamps(false, true);
        });
        console.log('Finished Seeding Tables');
        console.log('Creating Triggers');
        await index_schema_1.default.raw(`
          CREATE TRIGGER update_timestamp
          BEFORE UPDATE
          ON ${exports.ER_SIGNUP}
          FOR EACH ROW
          EXECUTE PROCEDURE update_timestamp();
        `);
        console.log('Finished Creating Triggers');
    }
    catch (error) {
        console.log(error);
    }
};
exports.seed = seed;
// const run = async () => {
//   //createProcedure();
//   seed();
// };
// run();
//# sourceMappingURL=signup.schema.js.map