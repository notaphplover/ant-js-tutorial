import { AntSqlModel } from '@antjs/ant-sql/src/model/AntSqlModel';

const userModel = new AntSqlModel(
  'id',
  { prefix: 'user::' },
  [{
    entityAlias: 'id',
    sqlName: 'id',
  }],
  'User',
);

export { userModel };
