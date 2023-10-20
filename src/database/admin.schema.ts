
import DB from './index.schema';

export const ER_ALPACA_ACC = 'alpaca_acc';

export const seed = async (dropFirst = false) => {

  try {

    if (dropFirst) {
      console.log('Dropping Tables');
      await DB.schema.dropTable(ER_ALPACA_ACC);
      console.log('Dropped Tables');
    }

    console.log('Seeding Tables');
    await DB.schema.createTable(ER_ALPACA_ACC, table => {
      table.increments('al_acc_id');
      table.bigInteger('user_id');
      table.string('al_id');
      table.string('al_account_number');
      table.string('al_status');
      table.string('al_crypto_status');
      table.string('al_currency');
      table.string('al_last_equity');
      table.string('al_created_at');
      table.boolean('is_deleted').defaultTo('false');
      table.timestamps(false, true);
    });

    console.log('Finished Seeding Tables');
    console.log('Creating Triggers');
    await DB.raw(`
          CREATE TRIGGER update_timestamp
          BEFORE UPDATE
          ON ${ER_ALPACA_ACC}
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
