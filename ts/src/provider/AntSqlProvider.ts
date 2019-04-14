import { AntSqlManager } from '@antjs/ant-sql';
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

const userManager = manager.get<IUser>(userModel);

export {
  manager,
  userManager,
};
