'use strict';

const { AntSqlModel } = require('@antjs/ant-sql/src/model/AntSqlModel');

const userModel = new AntSqlModel('id', { prefix: 'user::' }, 'User');

module.exports = { userModel };
