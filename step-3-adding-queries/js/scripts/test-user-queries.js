#!/usr/bin/env node
const {
  usersByUsernameQuery,
  usersStartingByLetterQuery,
} = require('../src/provider/AntSqlProvider');
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
  /** @type Array */
  const usersStartingByA = await usersStartingByLetterQuery.get({
    letter: 'a',
  });
  if (!usersStartingByA) {
    console.error('No users starting with a were found!');
  }
  /**
   * Checks if a user is in an array of users.
   * @param {number} id Id of the user to check.
   * @param {Array} users Users array.
   * @returns {boolean}
   */
  const containsUser = (id, users) => {
    for (const user of users) {
      if (id === user.id) { return true; }
    }
    return false;
  };

  if (
    containsUser(user1.id, usersStartingByA)
    && containsUser(user2.id, usersStartingByA)
    && !containsUser(user3.id, usersStartingByA)
  ) {
    console.log('[Users starting by \'a\'] The expected users were found!');
  } else {
    console.error('[Users starting by \'a\'] The query did not find the expected users');
  }

  const userWithUsernameBaaaaa = await usersByUsernameQuery.get({
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
