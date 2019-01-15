'use strict';

const should = require('should');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
let PostgreSqlConnectionFactory;

const config = {
  host:'host',
  port: 1234,
  database: 'database',
  user: 'user',
  password: 'password'
};

describe('CommissioningMockRepositiory#config', () => {
  let postgreSqlConnectionFactory;
  let constructorSpy;
  let SequilizeMock;
  beforeEach(() => {

    constructorSpy = sinon.stub();

    class SequilizeMockClass {
      constructor(db, usr, psswd, opt) {
        constructorSpy(db, usr, psswd, opt);
      }
    }
    
    SequilizeMock = SequilizeMockClass; 
    PostgreSqlConnectionFactory = proxyquire('../../../dist/commonjs/sequeilize_pg_repository/postgres_sql_connection_factory', {
      'sequelize': SequilizeMock}).PostgreSqlConnectionFactory;

    postgreSqlConnectionFactory = new PostgreSqlConnectionFactory();
    postgreSqlConnectionFactory.config = config;
  });

  it('get connection with config property set', () => {

    postgreSqlConnectionFactory.config = config;
    const con1 = postgreSqlConnectionFactory.getConnection();
    should(con1).instanceOf(SequilizeMock);
    should(constructorSpy.calledOnce).equal(true, 'constructorSpy NOT called');
    should(constructorSpy.calledWith(config.database, config.user, config.password)).equal(true, 'constructorSpy called with wrong args');
    const con2 = postgreSqlConnectionFactory.getConnection(); 
    should(con2).equal(con1, 'wrong new con');
    should(constructorSpy.calledOnce).equal(true, 'constructorSpy called more than once');
    const con3 = postgreSqlConnectionFactory.getConnection(config);
    should(con3).equal(con1, 'wrong new con');

    should(constructorSpy.calledOnce).equal(true, 'constructorSpy called more than once');

    const newConfig = {
      host:'host',
      port: 1234,
      database: 'new database',
      user: 'user',
      password: 'password'
    };

    const con4 = postgreSqlConnectionFactory.getConnection(newConfig);
    should(con4).not.equal(con1, 'wrong old con');
    should(constructorSpy.calledTwice).equal(true, 'constructorSpy not called twice once');
    should(constructorSpy.calledWith(newConfig.database, newConfig.user, newConfig.password)).equal(true, 'constructorSpy called with wrong args');
  });

});
