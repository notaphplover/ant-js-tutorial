import { AntSqlManager, ApiSqlModelManager } from '@antjs/ant-sql';
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

const userManager = manager.get(userModel) as ApiSqlModelManager<IUser>;

const {
  usersByUsernameQuery,
  usersStartingByLetterQuery,
} = new UserQueriesProvider().injectQueries(
  knex, userManager,
);

export {
  manager,
  userManager,
  usersByUsernameQuery,
  usersStartingByLetterQuery,
};
