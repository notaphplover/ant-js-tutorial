'use strict';

const { usernameColumn } = require('./ModelProvider');

class UserQueriesProvider {

  /**
   * Injects queries in the user manager and returns the query managers generated.
   * @param { import('knex') } _ Knex instance.
   * @param { import('@antjs/ant-sql').ApiSqlModelManager } antModelManager User manager
   * @returns { object } Queries object.
   */
  injectQueries(
    _,
    antModelManager,
  ) {
    return {
      userByUsernameQuery: this._addUserByUsernameQuery(
        antModelManager,
      ),
    };
  }

  /**
   * Adds a "users by username" query.
   * @param { import('@antjs/ant-sql').ApiSqlModelManager } userManager User manager
   * @returns { import('@antjs/ant-js').ApiSingleResultQueryManager } Query manager created.
   */
  _addUserByUsernameQuery(userManager) {
    return userManager.query(
      userManager.cfgGen.byUniqueField(usernameColumn),
    );
  }
}

module.exports = { UserQueriesProvider };
