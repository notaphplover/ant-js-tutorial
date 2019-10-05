/**
 * Creates a new table in the database schema.
 * @param { import('knex') } knex Knex instance.
 * @param { string } name Name of the new table.
 * @param { object } columns Columns to add.
 * @returns { Promise<void> } Promise of table created.
 */
const createTable = async (
  knex,
  name,
  columns = {},
) => {
  const tableExists = await knex.schema.hasTable(name);
  if (tableExists) { throw new Error(`Table ${name} already exists.`); }
  await knex.schema.createTable(name, (table) => {
    /**
     * Adds a column to the table.
     * @param {string} name Name of the column.
     * @param {string} type Type of the column.
     */
    const addColumn = (name, type) => {
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
}

/**
 * Deletes all the tables from the schema.
 * @param { import('knex') } knex Knex instance.
 * @returns { Promise<any> } Promise of tables deleted.
 */
const deleteAllTables = async (knex) => {
  const tables = await listTables(knex);
  return Promise.all(tables.map((table) => knex.schema.dropTable(table)));
};

/**
 * Inserts an entity in a table.
 * @param { import('knex') } knex Knex instance.
 * @param { string } table table name.
 * @param { Promise<any> } entity Entity to insert.
 */
const insert = (knex, table, entity) => {
  return knex(table).insert(entity);
};

/**
 * Lists all tables of the database. Obtained from
 * https://github.com/tgriesser/knex/issues/360#issuecomment-406483016
 *
 * @param { import('knex') } knex Knex instance.
 * @returns { Promise<string[]> } Tables found in the db schema.
 */
const listTables = (knex) => {
  /** @type string */
  let query;
  /** @type string[] */
  let bindings;

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
    return results.rows.map((row) => row.table_name);
  }).catch((err) => {
    throw err;
  });
};

module.exports = {
  createTable,
  deleteAllTables,
  insert,
  listTables,
}
