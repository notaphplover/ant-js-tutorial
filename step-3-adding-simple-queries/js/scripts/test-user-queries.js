#!/usr/bin/env node
const { userByUsernameQuery } = require('../src/provider/AntSqlProvider');
const { knex } = require('../src/provider/DBProvider');
const { redis } = require('../src/provider/RedisProvider');
const {
  createTable,
  deleteAllTables,
  insert,
} = require('./util/KnexUtils');

/**
 * @returns { Promise<any> }
 */
const asyncScript = async () => {
  console.log('Initializating redis and mysql...');
  // 1. Empty DB and redis.
  await Promise.all([
    deleteAllTables(knex),
    redis.flushall(),
  ]);
  const tableName = 'User';
  // 2. Create the user table
  await createTable(
    knex,
    tableName,
    {
      id: 'number',
      username: 'string',
    },
  );
  console.log('Done.');

  // 3. Insert a new user into the database
  const user1 = {
    id: 0,
    username: 'aaaaaa',
  };
  const user2 = {
    id: 1,
    username: 'aaaaab',
  };
  const user3 = {
    id: 2,
    username: 'baaaaa',
  };
  /** @type Array */
  const users = [
    user1,
    user2,
    user3,
  ];
  console.log('Inserting new users: ...');
  await Promise.all(users.map(
    (user) => insert(knex, tableName, user),
  ));
  console.log('Done.');
  // 4. Obtain users using the queries.
  const userWithUsernameBaaaaa = await userByUsernameQuery.get({
    username: 'baaaaa',
  });
  if (userWithUsernameBaaaaa && userWithUsernameBaaaaa.id === user3.id) {
    console.log('[Users with username \'baaaaa\'] The expected user was found!');
  } else {
    console.error('[Users with username \'baaaaa\'] The expected user was not found!');
  }

  process.exit();
}

asyncScript();
