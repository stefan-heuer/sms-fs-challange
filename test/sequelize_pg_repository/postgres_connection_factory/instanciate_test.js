'use strict';

const should = require('should');
const PostgreSqlConnectionFactory = require('../../../dist/commonjs/').PostgreSqlConnectionFactory;

describe('PostgreSqlConnectionFactory#constructor', () => {

  it('instanciate successfull', () => {
    const postgreSqlConnectionFactory = new PostgreSqlConnectionFactory();
    should(postgreSqlConnectionFactory).instanceOf(PostgreSqlConnectionFactory);
  });

});
