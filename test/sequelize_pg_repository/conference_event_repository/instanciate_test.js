'use strict';

const should = require('should');
const ConferenceEventRepository = require('../../../dist/commonjs/').ConferenceEventRepository;

describe('ConferenceEventRepository#constructor', () => {

  it('instanciate successfull', () => {
    const postgreSqlConnectionFactory = {};
    const conferenceEventRepositiory = new ConferenceEventRepository(postgreSqlConnectionFactory);
    should(conferenceEventRepositiory).instanceOf(ConferenceEventRepository);
    should(conferenceEventRepositiory.postgreSqlConnectionFactory).equal(postgreSqlConnectionFactory, 'wrong postgreSqlConnectionFactory');
  });

});
