'use strict';

const { userModel } = require('./ModelProvider');

class UserQueriesProvider {

  /**
   * Injects queries in the user manager and returns the query managers generated.
   * @param { import('knex') } knex Knex instance.
   * @param { import('@antjs/ant-sql').ApiSqlModelManager } antModelManager User manager
   * @returns { object } Queries object.
   */
  injectQueries(
    knex,
    antModelManager,
  ) {
    return {
      usersByUsernameQuery: this._addUsersByUsernameQuery(
        knex, antModelManager,
      ),
      usersStartingByLetterQuery: this._addUsersStartingByLetterQuery(
        knex, antModelManager,
      ),
    };
  }

  /**
   * Adds a "users by username" query.
   * @param { import('knex') } knex Knex instance.
   * @param { import('@antjs/ant-sql').ApiSqlModelManager } userManager User manager
   * @returns { import('@antjs/ant-js').ApiSingleResultQueryManager } Query manager created.
   */
  _addUsersByUsernameQuery(
    knex,
    userManager,
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
      query: usersByUsername,
      queryKeyGen: (params) => 'user/name::' + params.letter,
      reverseHashKey: 'user/name/reverse',
    });
  }

  /**
   * Adds a "users starting with letter" query.
   * @param { import('knex') } knex Knex instance.
   * @param { import('@antjs/ant-sql').ApiSqlModelManager } userManager User manager.
   * @returns { import('@antjs/ant-js').ApiMultipleResultQueryManager } Query manager created.
   */
  _addUsersStartingByLetterQuery(
    knex,
    userManager,
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
      query: usersStaringByLetterDBQuery,
      queryKeyGen: (params) => 'user/name-start::' + params.letter,
      reverseHashKey: 'user/name-start/reverse',
    });
  }
}

module.exports = { UserQueriesProvider };
