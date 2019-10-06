import { IPrimaryQueryManager } from '@antjs/ant-js/src/persistence/primary/query/IPrimaryQueryManager';
import { IAntSqlModelManager } from '@antjs/ant-sql/src/api/IAntSqlModelManager';
import { IAntSqlModel } from '@antjs/ant-sql/src/model/IAntSqlModel';
import * as Knex from 'knex';
import { IUser } from '../entity/IUser';
import { IQueryInjector } from './IQueryInjector';

export class UserQueriesProvider implements IQueryInjector<IUser> {

  public injectQueries(
    _: Knex,
    antModelManager: IAntSqlModelManager<IUser>,
    model: IAntSqlModel,
  ): { [key: string]: IPrimaryQueryManager<IUser>; } {
    return {
      userByUsernameQuery: this._addUserByUsernameQuery(
        antModelManager, model,
      ),
    };
  }

  private _addUserByUsernameQuery(
    userManager: IAntSqlModelManager<IUser>,
    userModel: IAntSqlModel,
  ): IPrimaryQueryManager<IUser> {
    return userManager.query<number>(
      userManager.cfgGen.byUniqueField<number>(userModel.getColumn('username')),
    ) as IPrimaryQueryManager<IUser>;
  }
}
