import * as Knex from 'knex';

const knex = Knex({
  client: 'pg',
  connection: {
    database : 'antsqltest',
    host : 'ant_db',
    password : 'antpassword',
    user : 'antuser',
  },
  version: '11.2',
});

export { knex };
