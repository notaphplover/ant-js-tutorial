import { ApiMultipleResultQueryManager, ApiSingleResultQueryManager, Entity } from '@antjs/ant-js';
import { ApiSqlModelManager, SqlModel } from '@antjs/ant-sql';
import * as Knex from 'knex';

export interface IQueryInjector<TEntity extends Entity> {

  /**
   * Injects queries in an AntJS model manager.
   * @param knex Knex instance.
   * @param antModelManager ant model manager where the queries will be injected.
   * @param model Queries model.
   */
  injectQueries(
    knex: Knex,
    antModelManager: ApiSqlModelManager<TEntity>,
    model: SqlModel,
  ): { [key: string]: ApiMultipleResultQueryManager<TEntity> | ApiSingleResultQueryManager<TEntity> };
}
