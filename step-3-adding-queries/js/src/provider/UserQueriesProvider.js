'use strict';

class UserQueriesProvider {

  /**
   * Injects queries in the user manager and returns the query managers generated.
   * @param { import('knex') } knex Knex instance.
   * @param { import('@antjs/ant-sql/src/api/AntSqlModelManager').AntSqlModelManager } antModelManager User manager
   * @param { import('@antjs/ant-sql/src/model/AntSqlModel').AntSqlModel } model User model
   * @returns { object } Queries object.
   */
  injectQueries(
    knex,
    antModelManager,
    model,
  ) {
    return {
      usersByUsernameQuery: this._addUsersByUsernameQuery(
        knex, antModelManager, model,
      ),
      usersStartingByLetterQuery: this._addUsersStartingByLetterQuery(
        knex, antModelManager, model,
      ),
    };
  }

  /**
   * Adds a "users by username" query.
   * @param { import('knex') } knex Knex instance.
   * @param { import('@antjs/ant-sql/src/api/AntSqlModelManager').AntSqlModelManager } userManager User manager
   * @param { import('@antjs/ant-sql/src/model/AntSqlModel').AntSqlModel } userModel User model
   * @returns { import('@antjs/ant-js/src/persistence/primary/query/SingleResultQueryManager') } Query manager created.
   */
  _addUsersByUsernameQuery(
    knex,
    userManager,
    userModel,
  ) {
    /**
     * Serachs for an user whose username is the username provided.
     * @param { object } params Query params
     * @returns { Promise<number> } Promise of id found.
     */
    const usersByUsername = (params) => {
      if (!params) {
        throw new Error('Expected params!');
      }
      /** @type string */
      const username = params.username;
      if (!username) {
        throw new Error('Expected an username!');
      }
      return knex
        .select(userModel.id)
        .from(userModel.tableName)
        .where('username', username)
        .first()
        .then(
          (result) => result ? result.id : null,
        );
    };

    return userManager.query({
      isMultiple: false,
      keyGen: (params) => 'user/name::' + params.letter,
      query: usersByUsername,
      reverseHashKey: 'user/name/reverse',
    });
  }

  /**
   * Adds a "users starting with letter" query.
   * @param { import('knex') } knex Knex instance.
   * @param { import('@antjs/ant-sql/src/api/AntSqlModelManager').AntSqlModelManager } userManager User manager
   * @param { import('@antjs/ant-sql/src/model/AntSqlModel').AntSqlModel } userModel User model
   * @returns { import('@antjs/ant-js/src/persistence/primary/query/MultipleResultQueryManager') } query manager created.
   */
  _addUsersStartingByLetterQuery(
    knex,
    userManager,
    userModel,
  ) {
    /**
     * Search fot users whose username starts with a letter.
     * @param { object } params Query params.
     * @returns { Promise<number[]> } Promise of ids found.
     */
    const usersStaringByLetterDBQuery = (params) => {
      if (!params) {
        throw new Error('Expected params!');
      }
      /** @type string */
      const letter = params.letter;
      if (!letter || letter.length !== 1) {
        throw new Error('Expected a letter!');
      }
      return knex
        .select(userModel.id)
        .from(userModel.tableName)
        .where('username', 'like', letter + '%')
        .then(
          (results) => results.map((result) => result.id),
        );
    };
    return userManager.query({
      isMultiple: true,
      keyGen: (params) => 'user/name-start::' + params.letter,
      query: usersStaringByLetterDBQuery,
      reverseHashKey: 'user/name-start/reverse',
    });
  }
}

module.exports = { UserQueriesProvider };
