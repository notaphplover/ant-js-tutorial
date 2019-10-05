#!/usr/bin/env node
const { userManager } = require('../src/provider/AntSqlProvider');
const { knex } = require('../src/provider/DBProvider');
const { redis } = require('../src/provider/RedisProvider');
const {
  createTable,
  deleteAllTables,
  insert,
} = require('./util/KnexUtils');

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
  const user = {
    id: 0,
    username: 'Sample username',
  };
  console.log(`Inserting a new user: {
  id: ${user.id},
  username: ${user.username},
}...`);
  await insert(knex, tableName, user);
  console.log('Done.');

  // 4. Obtain the user from the user manager.
  console.log(`userManager: searching for an user with id equal to ${user.id}`);
  const userFound = await userManager.get(user.id);
  if (!userFound) {
    console.error('No user was found');
  }
  if (user.id === userFound.id && user.username === userFound.username) {
    console.log('The expected user was found!');
  } else {
    console.error(`An unexpected user was found: {
  id: ${userFound.id},
  username: ${userFound.username},
}`);
  }

  process.exit();
};

asyncScript();
