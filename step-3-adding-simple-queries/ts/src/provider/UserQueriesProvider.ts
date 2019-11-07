import { ApiMultipleResultQueryManager, ApiSingleResultQueryManager } from '@antjs/ant-js';
import { ApiSqlModelManager } from '@antjs/ant-sql';
import * as Knex from 'knex';
import { IUser } from '../entity/IUser';
import { IQueryInjector } from './IQueryInjector';
import { usernameColumn } from './ModelProvider';

export class UserQueriesProvider implements IQueryInjector<IUser> {

  public injectQueries(
    _: Knex,
    antModelManager: ApiSqlModelManager<IUser>,
  ): { [key: string]: ApiMultipleResultQueryManager<IUser> | ApiSingleResultQueryManager<IUser>; } {
    return {
      userByUsernameQuery: this._addUserByUsernameQuery(
        antModelManager,
      ),
    };
  }

  private _addUserByUsernameQuery(
    userManager: ApiSqlModelManager<IUser>,
  ): ApiSingleResultQueryManager<IUser> {
    return userManager.query<number>(
      userManager.cfgGen.byUniqueField<number>(usernameColumn),
    );
  }
}
