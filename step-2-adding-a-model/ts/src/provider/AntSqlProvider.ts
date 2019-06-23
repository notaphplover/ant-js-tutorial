import { AntSqlManager } from '@antjs/ant-sql';
import { IAntSqlModelManager } from '@antjs/ant-sql/src/api/IAntSqlModelManager';
import { IUser } from '../entity/IUser';
import { knex } from './DBProvider';
import { userModel } from './ModelProvider';
import { redis } from './RedisProvider';

const manager = new AntSqlManager();
manager.config({
  default: {
    knex: knex,
    redis: redis,
  },
});

const userManager = manager.get(userModel) as IAntSqlModelManager<IUser>;

export {
  manager,
  userManager,
};
