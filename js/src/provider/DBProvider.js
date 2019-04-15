'use strict';
const Knex = require('knex');

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

module.exports = { knex };
