import { ApiSqlModel, SqlColumn, SqlType } from '@antjs/ant-sql';

export const idColumn: SqlColumn = {
  entityAlias: 'id',
  sqlName: 'id',
  type: SqlType.Integer,
};

export const usernameColumn: SqlColumn = {
  entityAlias: 'username',
  sqlName: 'username',
  type: SqlType.String,
};

export const userModel: ApiSqlModel = {
  columns: [
    idColumn,
    usernameColumn,
  ],
  id: 'id',
  keyGen: { prefix: 'user::' },
  tableName: 'User',
};
