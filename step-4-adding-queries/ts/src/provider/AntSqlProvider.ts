import { AntSqlManager } from '@antjs/ant-sql';
import { IAntSqlModelManager } from '@antjs/ant-sql/src/api/IAntSqlModelManager';
import { IUser } from '../entity/IUser';
import { knex } from './DBProvider';
import { userModel } from './ModelProvider';
import { redis } from './RedisProvider';
import { UserQueriesProvider } from './UserQueriesProvider';

const manager = new AntSqlManager();
manager.config({
  default: {
    knex: knex,
    redis: redis,
  },
});

const userManager = manager.get(userModel) as IAntSqlModelManager<IUser>;

const {
  usersByUsernameQuery,
  usersStartingByLetterQuery,
} = new UserQueriesProvider().injectQueries(
  knex, userManager, userModel,
);

export {
  manager,
  userManager,
  usersByUsernameQuery,
  usersStartingByLetterQuery,
};
