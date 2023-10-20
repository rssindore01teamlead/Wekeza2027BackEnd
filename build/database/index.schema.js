"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProcedure = exports.T = void 0;
const knex_1 = __importDefault(require("knex"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const awsConf = {
    client: 'pg',
    debug: true,
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    },
    searchPath: ['public'],
};
const DB = knex_1.default(awsConf);
exports.default = DB;
// Table Names
const signup_schema_1 = require("./signup.schema");
const admin_schema_1 = require("./admin.schema");
const trending_schema_1 = require("./trending.schema");
exports.T = {
    ER_SIGNUP: signup_schema_1.ER_SIGNUP,
    ER_ALPACA_ACC: admin_schema_1.ER_ALPACA_ACC,
    ER_TRENDING_STOCKS: trending_schema_1.ER_TRENDING_STOCKS,
};
// Creates the procedure that is then added as a trigger to every table
// Only needs to be run once on each postgres schema
const createProcedure = async () => {
    await DB.raw(`
      CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER
      LANGUAGE plpgsql
      AS
      $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$;
    `);
};
exports.createProcedure = createProcedure;
// const run = async () => {
//   console.log("create proc");
//   createProcedure();
// };
// run();
//# sourceMappingURL=index.schema.js.map