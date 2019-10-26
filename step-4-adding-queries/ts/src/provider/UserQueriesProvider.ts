import { ApiMultipleResultQueryManager, ApiSingleResultQueryManager } from '@antjs/ant-js';
import { ApiSqlModelConfig, ApiSqlModelManager, SqlModel } from '@antjs/ant-sql';
import * as Knex from 'knex';
import { IUser } from '../entity/IUser';
import { IQueryInjector } from './IQueryInjector';

export class UserQueriesProvider implements IQueryInjector<IUser> {

  public injectQueries(
    knex: Knex,
    antModelManager: ApiSqlModelManager<IUser>,
    model: SqlModel,
  ): { [key: string]: ApiMultipleResultQueryManager<IUser> | ApiSingleResultQueryManager<IUser>; } {
    return {
      usersByUsernameQuery: this._addUsersByUsernameQuery(
        knex, antModelManager, model,
      ),
      usersStartingByLetterQuery: this._addUsersStartingByLetterQuery(
        knex, antModelManager, model,
      ),
    };
  }

  private _addUsersByUsernameQuery(
    knex: Knex,
    userManager: ApiSqlModelManager<IUser>,
    userModel: SqlModel,
  ): ApiSingleResultQueryManager<IUser> {
    const usersByUsername = (params: any) => {
      if (!params) {
        throw new Error('Expected params!');
      }
      const username: string = params.username;
      if (!username) {
        throw new Error('Expected an username!');
      }
      return knex
        .select(userModel.id)
        .from(userModel.tableName)
        .where('username', username)
        .first()
        .then(
          (result: { id: number }) => result ? result.id : null,
        ) as unknown as Promise<number>;
    };

    return userManager.query<number>({
      isMultiple: false,
      query: usersByUsername,
      queryKeyGen: (params: any) => 'user/name::' + params.letter,
      reverseHashKey: 'user/name/reverse',
    });
  }

  private _addUsersStartingByLetterQuery(
    knex: Knex,
    userManager: ApiSqlModelManager<IUser>,
    userModel: SqlModel,
  ): ApiMultipleResultQueryManager<IUser> {
    const usersStaringByLetterDBQuery = (params: any) => {
      if (!params) {
        throw new Error('Expected params!');
      }
      const letter: string = params.letter;
      if (!letter || letter.length !== 1) {
        throw new Error('Expected a letter!');
      }
      return knex
        .select(userModel.id)
        .from(userModel.tableName)
        .where('username', 'like', letter + '%')
        .then(
          (results: Array<{ id: number }>) => results.map((result) => result.id),
        ) as unknown as Promise<number[]>;
    };
    return userManager.query<number[]>({
      isMultiple: true,
      query: usersStaringByLetterDBQuery,
      queryKeyGen: (params: any) => 'user/name-start::' + params.letter,
      reverseHashKey: 'user/name-start/reverse',
    });
  }
}
