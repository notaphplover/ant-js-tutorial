'use strict';

const { AntSqlManager } = require('@antjs/ant-sql');
const { knex } = require('./DBProvider');
const { userModel } = require('./ModelProvider');
const { redis } = require('./RedisProvider');
const { UserQueriesProvider } = require('./UserQueriesProvider');

const manager = new AntSqlManager();
manager.config({
  default: {
    knex: knex,
    redis: redis,
  },
});

const userManager = manager.get(userModel);

const {
  usersByUsernameQuery,
  usersStartingByLetterQuery,
} = new UserQueriesProvider().injectQueries(
  knex, userManager,
);

module.exports = {
  manager,
  userManager,
  usersByUsernameQuery,
  usersStartingByLetterQuery,
};
