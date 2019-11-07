import { ApiMultipleResultQueryManager, ApiSingleResultQueryManager } from '@antjs/ant-js';
import { ApiSqlModelManager } from '@antjs/ant-sql';
import * as Knex from 'knex';
import { IUser } from '../entity/IUser';
import { IQueryInjector } from './IQueryInjector';
import { userModel, usernameColumn } from './ModelProvider';

export class UserQueriesProvider implements IQueryInjector<IUser> {

  public injectQueries(
    knex: Knex,
    antModelManager: ApiSqlModelManager<IUser>,
  ): { [key: string]: ApiMultipleResultQueryManager<IUser> | ApiSingleResultQueryManager<IUser>; } {
    return {
      usersByUsernameQuery: this._addUsersByUsernameQuery(
        knex, antModelManager,
      ),
      usersStartingByLetterQuery: this._addUsersStartingByLetterQuery(
        knex, antModelManager,
      ),
    };
  }

  private _addUsersByUsernameQuery(
    knex: Knex,
    userManager: ApiSqlModelManager<IUser>,
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
        .where(usernameColumn.sqlName, username)
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
        .where(usernameColumn.sqlName, 'like', letter + '%')
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
