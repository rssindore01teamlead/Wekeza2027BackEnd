
import DB from './index.schema';

export const ER_TRENDING_STOCKS = 'trending_stocks';

export const seed = async (dropFirst = false) => {

  try {

    if (dropFirst) {
      console.log('Dropping Tables');
      await DB.schema.dropTable(ER_TRENDING_STOCKS);
      console.log('Dropped Tables');
    }

    console.log('Seeding Tables');
    await DB.schema.createTable(ER_TRENDING_STOCKS, table => {
      table.increments('id');
      table.string('symbol');
      table.string('stock_name');
      table.date('created_at');
    });

    console.log('Finished Seeding Tables');
    console.log('Creating Triggers');
    await DB.raw(`
          CREATE TRIGGER update_timestamp
          BEFORE UPDATE
          ON ${ER_TRENDING_STOCKS}
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
