'use strict';

const should = require('should');
const PostgreSqlConnectionFactory = require('../../../dist/commonjs').PostgreSqlConnectionFactory;

describe('CommissioningMockRepositiory#config', () => {
  let postgreSqlConnectionFactory;
  beforeEach(() => {
    postgreSqlConnectionFactory = new PostgreSqlConnectionFactory();
  });

  it('config successfull', () => {
    const config = {};
    postgreSqlConnectionFactory.config = config;
    should(postgreSqlConnectionFactory.config).equal(config, 'wrong config');
  });

});
