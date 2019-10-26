import { AntSqlModel } from '@antjs/ant-sql';

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

export { userModel };
