'use strict';

const { SqlType } = require('@antjs/ant-sql');

const idColumn = {
  entityAlias: 'id',
  sqlName: 'id',
  type: SqlType.Integer,
};

const usernameColumn = {
  entityAlias: 'username',
  sqlName: 'username',
  type: SqlType.String,
};

const userModel = {
  columns: [
    idColumn,
    usernameColumn,
  ],
  id: 'id',
  keyGen: { prefix: 'user::' },
  tableName: 'User',
}

module.exports = { idColumn, userModel, usernameColumn };
