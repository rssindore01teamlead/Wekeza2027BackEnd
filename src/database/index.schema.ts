import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

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
const DB = knex(awsConf);

export default DB;

// Table Names
import { ER_SIGNUP } from './signup.schema';
import { ER_ALPACA_ACC, } from './admin.schema';
import { ER_TRENDING_STOCKS } from './trending.schema';



export const T = {

  ER_SIGNUP,
  ER_ALPACA_ACC,
  ER_TRENDING_STOCKS,
};

// Creates the procedure that is then added as a trigger to every table
// Only needs to be run once on each postgres schema
export const createProcedure = async () => {

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

// const run = async () => {
//   console.log("create proc");
//   createProcedure();
// };
// run();
