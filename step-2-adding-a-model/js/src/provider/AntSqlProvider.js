'use strict';

const { AntSqlManager } = require('@antjs/ant-sql');
const { knex } = require('./DBProvider');
const { userModel } = require('./ModelProvider');
const { redis } = require('./RedisProvider');

const manager = new AntSqlManager();
manager.config({
  default: {
    knex: knex,
    redis: redis,
  },
});

const userManager = manager.get(userModel);

module.exports = {
  manager,
  userManager,
};
