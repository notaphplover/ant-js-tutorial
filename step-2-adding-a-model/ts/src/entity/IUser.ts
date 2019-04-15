import { IEntity } from '@antjs/ant-js/src/model/IEntity';

export interface IUser extends IEntity {
  /**
   * User id.
   */
  id: number;
  /**
   * User alias.
   */
  username: string;
}
