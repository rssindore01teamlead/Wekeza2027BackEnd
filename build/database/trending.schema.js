"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = exports.ER_TRENDING_STOCKS = void 0;
const index_schema_1 = __importDefault(require("./index.schema"));
exports.ER_TRENDING_STOCKS = 'trending_stocks';
const seed = async (dropFirst = false) => {
    try {
        if (dropFirst) {
            console.log('Dropping Tables');
            await index_schema_1.default.schema.dropTable(exports.ER_TRENDING_STOCKS);
            console.log('Dropped Tables');
        }
        console.log('Seeding Tables');
        await index_schema_1.default.schema.createTable(exports.ER_TRENDING_STOCKS, table => {
            table.increments('id');
            table.string('symbol');
            table.string('stock_name');
            table.date('created_at');
        });
        console.log('Finished Seeding Tables');
        console.log('Creating Triggers');
        await index_schema_1.default.raw(`
          CREATE TRIGGER update_timestamp
          BEFORE UPDATE
          ON ${exports.ER_TRENDING_STOCKS}
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
//# sourceMappingURL=trending.schema.js.map