'use strict';

class UserQueriesProvider {

  /**
   * Injects queries in the user manager and returns the query managers generated.
   * @param { import('knex') } _ Knex instance.
   * @param { import('@antjs/ant-sql/src/api/AntSqlModelManager').AntSqlModelManager } antModelManager User manager
   * @param { import('@antjs/ant-sql/src/model/AntSqlModel').AntSqlModel } model User model
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
   * @param { import('@antjs/ant-sql/src/api/IAntSqlModelManager').IAntSqlModelManager } userManager User manager
   * @param { import('@antjs/ant-sql/src/model/AntSqlModel').AntSqlModel } userModel User model
   * @returns { import('@antjs/ant-js/src/persistence/primary/query/SingleResultQueryManager') } Query manager created.
   */
  _addUserByUsernameQuery(userManager, userModel) {
    return userManager.query(userManager.cfgGen.byUniqueField(
      userModel.getColumn('username'),
    ));
  }
}

module.exports = { UserQueriesProvider };
