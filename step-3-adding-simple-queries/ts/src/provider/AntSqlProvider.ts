import { AntSqlManager } from '@antjs/ant-sql';
import { IAntSqlModelManager } from '@antjs/ant-sql/src/api/IAntSqlModelManager';
import { IUser } from '../entity/IUser';
import { knex } from './DBProvider';
import { userModel } from './ModelProvider';
import { redis } from './RedisProvider';
import { UserQueriesProvider } from './UserQueriesProvider';

const manager = new AntSqlManager().config({
  default: {
    knex: knex,
    redis: redis,
  },
});

const userManager = manager.get(userModel) as IAntSqlModelManager<IUser>;

const { userByUsernameQuery } = new UserQueriesProvider().injectQueries(
  knex, userManager, userModel,
);

export {
  manager,
  userManager,
  userByUsernameQuery,
};
