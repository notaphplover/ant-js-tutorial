import { IAntModelManager } from '@antjs/ant-js/src/api/IAntModelManager';
import { IEntity } from '@antjs/ant-js/src/model/IEntity';
import { IPrimaryQueryManager } from '@antjs/ant-js/src/persistence/primary/query/IPrimaryQueryManager';
import { IAntSqlModelConfig } from '@antjs/ant-sql/src/api/config/IAntSqlModelConfig';
import { IAntSqlModel } from '@antjs/ant-sql/src/model/IAntSqlModel';
import * as Knex from 'knex';

export interface IQueryInjector<TEntity extends IEntity> {

  /**
   * Injects queries in an AntJS model manager.
   * @param knex Knex instance.
   * @param antModelManager ant model manager where the queries will be injected.
   * @param model Queries model.
   */
  injectQueries(
    knex: Knex,
    antModelManager: IAntModelManager<TEntity, IAntSqlModelConfig>,
    model: IAntSqlModel,
  ): { [key: string]: IPrimaryQueryManager<TEntity> };
}
