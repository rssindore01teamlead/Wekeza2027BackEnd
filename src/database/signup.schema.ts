
import DB from './index.schema';

export const ER_SIGNUP = 'signup';

export const seed = async (dropFirst = false) => {

  try {

    if (dropFirst) {
      await DB.schema.dropTable(ER_SIGNUP);
    }

    await DB.schema.createTable(ER_SIGNUP, table => {
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
    await DB.raw(`
          CREATE TRIGGER update_timestamp
          BEFORE UPDATE
          ON ${ER_SIGNUP}
          FOR EACH ROW
          EXECUTE PROCEDURE update_timestamp();
        `);

    console.log('Finished Creating Triggers');
  } catch (error) {
    console.log(error);
  }
};

// const run = async () => {
//   //createProcedure();
//   seed();
// };
// run();
