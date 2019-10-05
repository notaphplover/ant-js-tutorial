'use strict';

const { AntSqlModel } = require('@antjs/ant-sql/src/model/AntSqlModel');

const userModel = new AntSqlModel(
  'id',
  { prefix: 'user::' },
  [{
    entityAlias: 'id',
    sqlName: 'id',
  }, {
    entityAlias: 'username',
    sqlName: 'username',
  }],
  'User',
);

module.exports = { userModel };
