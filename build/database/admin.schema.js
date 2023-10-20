"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = exports.ER_ALPACA_ACC = void 0;
const index_schema_1 = __importDefault(require("./index.schema"));
exports.ER_ALPACA_ACC = 'alpaca_acc';
const seed = async (dropFirst = false) => {
    try {
        if (dropFirst) {
            console.log('Dropping Tables');
            await index_schema_1.default.schema.dropTable(exports.ER_ALPACA_ACC);
            console.log('Dropped Tables');
        }
        console.log('Seeding Tables');
        await index_schema_1.default.schema.createTable(exports.ER_ALPACA_ACC, table => {
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
        await index_schema_1.default.raw(`
          CREATE TRIGGER update_timestamp
          BEFORE UPDATE
          ON ${exports.ER_ALPACA_ACC}
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
//# sourceMappingURL=admin.schema.js.map