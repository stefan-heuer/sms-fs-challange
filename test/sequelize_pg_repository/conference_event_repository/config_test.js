'use strict';

const should = require('should');
const ConferenceEventRepository = require('../../../dist/commonjs/').ConferenceEventRepository;

describe('ConferenceEventRepository#config', () => {
  let conferenceEventRepositiory;
  beforeEach(() => {
    conferenceEventRepositiory = new ConferenceEventRepository();
  });

  it('config successfull', () => {
    const config = {};
    conferenceEventRepositiory.config = config;
    should(conferenceEventRepositiory.config).equal(config, 'wrong config');
  });

});
