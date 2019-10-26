import { ApiMultipleResultQueryManager, ApiSingleResultQueryManager } from '@antjs/ant-js';
import { ApiSqlModelManager, SqlModel } from '@antjs/ant-sql';
import * as Knex from 'knex';
import { IUser } from '../entity/IUser';
import { IQueryInjector } from './IQueryInjector';

export class UserQueriesProvider implements IQueryInjector<IUser> {

  public injectQueries(
    _: Knex,
    antModelManager: ApiSqlModelManager<IUser>,
    model: SqlModel,
  ): { [key: string]: ApiMultipleResultQueryManager<IUser> | ApiSingleResultQueryManager<IUser>; } {
    return {
      userByUsernameQuery: this._addUserByUsernameQuery(
        antModelManager, model,
      ),
    };
  }

  private _addUserByUsernameQuery(
    userManager: ApiSqlModelManager<IUser>,
    userModel: SqlModel,
  ): ApiSingleResultQueryManager<IUser> {
    return userManager.query<number>(
      userManager.cfgGen.byUniqueField<number>(userModel.getColumn('username')),
    );
  }
}
