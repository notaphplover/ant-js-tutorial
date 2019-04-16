#!/usr/bin/env node
import { IUser } from '../src/entity/IUser';
import {
  usersByUsernameQuery,
  usersStartingByLetterQuery,
} from '../src/provider/AntSqlProvider';
import { knex } from '../src/provider/DBProvider';
import { redis } from '../src/provider/RedisProvider';
import {
  createTable,
  deleteAllTables,
  insert,
} from './util/KnexUtils';

const asyncScript = async (): Promise<any> => {
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
  const users: IUser[] = [
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
  const usersStartingByA: IUser[] = await usersStartingByLetterQuery.get({
    letter: 'a',
  }) as IUser[];
  if (!usersStartingByA) {
    console.error('No users starting with a were found!');
  }
  const containsUser = (id: number, users: IUser[]) => {
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

  const userWithUsernameBaaaaa: IUser = await usersByUsernameQuery.get({
    username: 'baaaaa',
  }) as IUser;
  if (userWithUsernameBaaaaa && userWithUsernameBaaaaa.id === user3.id) {
    console.log('[Users with username \'baaaaa\'] The expected user was found!');
  } else {
    console.error('[Users with username \'baaaaa\'] The expected user was not found!');
  }

  process.exit();
};

asyncScript();
