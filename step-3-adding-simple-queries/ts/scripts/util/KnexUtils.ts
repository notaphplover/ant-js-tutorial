import * as Knex from 'knex';

/**
 * Creates a new table in the database schema.
 * @param knex Knex instance.
 * @param name Name of the new table.
 * @param columns Columns to add.
 * @returns Promise of table created.
 */
const createTable = async (
  knex: Knex,
  name: string,
  columns: {[key: string]: 'number' | 'string' } = {},
): Promise<void> => {
  const tableExists = await knex.schema.hasTable(name);
  if (tableExists) { throw new Error(`Table ${name} already exists.`); }
  await knex.schema.createTable(name, (table) => {
    const addColumn = (name: string, type: 'number' | 'string') => {
      if ('number' === type) {
        table.integer(name);
      } else if ('string' === type) {
        table.string(name);
      }
    };
    for (const columnName in columns) {
      if (columns.hasOwnProperty(columnName)) {
        addColumn(columnName, columns[columnName]);
      }
    }
  });
};

/**
 * Deletes all the tables from the schema.
 * @param knex Knex instance.
 * @returns Promise of tables deleted.
 */
const deleteAllTables = async (knex: Knex): Promise<any> => {
  const tables = await listTables(knex);
  return Promise.all(tables.map((table) => knex.schema.dropTable(table)));
};

/**
 * Inserts an entity in a table.
 * @param knex Knex instance.
 * @param table table name.
 * @param entity Entity to insert.
 */
const insert = (knex: Knex, table: string, entity: any): Promise<any> => {
  return knex(table).insert(entity) as unknown as Promise<any>;
};

/**
 * Lists all tables of the database. Obtained from
 * https://github.com/tgriesser/knex/issues/360#issuecomment-406483016
 *
 * @param knex Knex instance.
 * @returns Tables found in the db schema.
 */
const listTables = (knex: Knex): Promise<string[]> => {
  let query: string;
  let bindings: string[];

  switch (knex.client.driverName) {
    case 'mssql':
      // tslint:disable-next-line:max-line-length
      query = 'SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' AND table_catalog = ?',
      bindings = [ knex.client.database() ];
      break;
    case 'mysql':
    case 'mysql2':
      query = 'SELECT table_name FROM information_schema.tables WHERE table_schema = ?';
      bindings = [ knex.client.database() ];
      break;
    case 'oracle':
    case 'oracledb':
      query = 'SELECT table_name FROM user_tables';
      break;
    case 'pg':
      // tslint:disable-next-line:max-line-length
      query = 'SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema() AND table_catalog = ?';
      bindings = [ knex.client.database() ];
      break;
    case 'sqlite3':
      query = 'SELECT name AS table_name FROM sqlite_master WHERE type=\'table\'';
      break;
    default:
      throw new Error(`Driver "${ knex.client.driverName }" not supported`);
  }

  return knex.raw(query, bindings).then((results) => {
    return results.rows.map((row: any) => row.table_name);
  }).catch((err) => {
    throw err;
  }) as unknown as Promise<string[]>;
};

export {
  createTable,
  deleteAllTables,
  insert,
  listTables,
};
