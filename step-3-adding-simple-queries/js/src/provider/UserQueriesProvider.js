'use strict';

class UserQueriesProvider {

  /**
   * Injects queries in the user manager and returns the query managers generated.
   * @param { import('knex') } _ Knex instance.
   * @param { import('@antjs/ant-sql').ApiSqlModelManager } antModelManager User manager
   * @param { import('@antjs/ant-sql').SqlModel } model User model
   * @returns { object } Queries object.
   */
  injectQueries(
    _,
    antModelManager,
    model,
  ) {
    return {
      userByUsernameQuery: this._addUserByUsernameQuery(
        antModelManager, model,
      ),
    };
  }

  /**
   * Adds a "users by username" query.
   * @param { import('@antjs/ant-sql').ApiSqlModelManager } userManager User manager
   * @param { import('@antjs/ant-sql').SqlModel } userModel User model
   * @returns { import('@antjs/ant-js').ApiSingleResultQueryManager } Query manager created.
   */
  _addUserByUsernameQuery(userManager, userModel) {
    return userManager.query(
      userManager.cfgGen.byUniqueField(userModel.getColumn('username')),
    );
  }
}

module.exports = { UserQueriesProvider };
