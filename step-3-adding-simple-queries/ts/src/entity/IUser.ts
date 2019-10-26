import { Entity } from '@antjs/ant-js';

export interface IUser extends Entity {
  /**
   * User id.
   */
  id: number;
  /**
   * User alias.
   */
  username: string;
}
