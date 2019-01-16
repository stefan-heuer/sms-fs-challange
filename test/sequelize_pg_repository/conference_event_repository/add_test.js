const PgTestUtil =  require('pg-test-util').default;
const pgConConf = require('./pg_connection_config');
const Sequelize = require('sequelize');
const ConferenceEventRepository = require('../../../dist/commonjs').ConferenceEventRepository;
const ConferenceEventValidationError = require('../../../dist/commonjs').ConferenceEventValidationError;

const should = require('should');

process.env.PG_TEST_CONNECTION_STRING = `postgresql://${pgConConf.user
  }:${pgConConf.password}@${pgConConf.host}:${pgConConf.port}`;

describe('ConferenceEventRepository#add', () => {

  const city = 'city';
  const startDate = new Date(666666);
  const endDate = new Date(77777)
  const price = 1.5;
  const status = 'Once';
  const color = '#123';

  let dbName;
  const pgTestUtil = new PgTestUtil();
  
  let database;
  let conferenceEventRepo;

  before(async function () {
    this.timeout(10000);
    database = await pgTestUtil.createDatabase();
    dbName = database.name;
  });
  
  after(async () => {
    await pgTestUtil.dropDatabase(database); // To inspect without drop use: await pgTestUtil.disconnectAll({ disconnect: true });
    await pgTestUtil.disconnectAll({ disconnect: true });
  });

  let seqCon;
  const conFactory = {
    getConnection : () => {
  
      seqCon = seqCon === undefined ? new Sequelize(
        dbName,
        pgConConf.user,
        pgConConf.password,
        {host: pgConConf.host, port: pgConConf.port, dialect: 'postgres',}) : seqCon;
  
      return seqCon;
    },
    close : () => {
      return seqCon.close()
        .then(() => {
          seqCon = undefined;
        });
    }
  };
 
  beforeEach( async () => {
    conferenceEventRepo = new ConferenceEventRepository(conFactory);
    await conferenceEventRepo.initialize();
  });

  afterEach(async () => {
    await database.query('truncate table conference_event cascade');
    await conFactory.close();
  });
   
  it('add successfull', async () => {
    
    const newConferenceEvent = {
      city: city,
      startDate: startDate,
      endDate: endDate,
      price: price,
      status: status,
      color: color,
    }

    await conferenceEventRepo.add(newConferenceEvent);

    const conferenceEvents = await database.query('select * from conference_event');
    should(conferenceEvents.length).equal(1, 'wrong conferenceEvents.length');
    const conferenceEvent = conferenceEvents[0];
    should(conferenceEvent.city).equal(newConferenceEvent.city, 'wrong conferenceEvent.city');
    should(conferenceEvent.startDate.getTime()).equal(newConferenceEvent.startDate.getTime(), 'wrong conferenceEvent.startDate');
    should(conferenceEvent.endDate.getTime()).equal(newConferenceEvent.endDate.getTime(), 'wrong conferenceEvent.endDate');
    should(conferenceEvent.price).equal(newConferenceEvent.price, 'wrong conferenceEvent.price');
    should(conferenceEvent.status).equal(newConferenceEvent.status, 'wrong conferenceEvent.status');
    should(conferenceEvent.color).equal(newConferenceEvent.color, 'wrong conferenceEvent.color');
  });


  it('add rejects conferenceEventValidationError on missing city', async () => {
    
    const newConferenceEvent = {
      startDate: startDate,
      endDate: endDate,
      price: price,
      status: status,
      color: color,
    }

    return conferenceEventRepo.add(newConferenceEvent)
      .then(should.fail)
      .catch(ConferenceEventValidationError, async (e) => {
        const conferenceEvents = await database.query('select * from conference_event');
        should(conferenceEvents.length).equal(0, 'wrong conferenceEvents.length');
      });
    
  });

  it('add rejects conferenceEventValidationError on missing startDate', async () => {
    
    const newConferenceEvent = {
      city: city,
      endDate: endDate,
      price: price,
      status: status,
      color: color,
    }

    return conferenceEventRepo.add(newConferenceEvent)
      .then(should.fail)
      .catch(ConferenceEventValidationError, async (e) => {
        const conferenceEvents = await database.query('select * from conference_event');
        should(conferenceEvents.length).equal(0, 'wrong conferenceEvents.length');
      });
    
  });

  it('add rejects conferenceEventValidationError on missing endDate', async () => {
    
    const newConferenceEvent = {
      city: city,
      startDate: startDate,
      price: price,
      status: status,
      color: color,
    }

    return conferenceEventRepo.add(newConferenceEvent)
      .then(should.fail)
      .catch(ConferenceEventValidationError, async (e) => {
        const conferenceEvents = await database.query('select * from conference_event');
        should(conferenceEvents.length).equal(0, 'wrong conferenceEvents.length');
      });
    
  });

  it('add rejects conferenceEventValidationError on missing price', async () => {
    
    const newConferenceEvent = {
      city: city,
      startDate: startDate,
      endDate: endDate,
      status: status,
      color: color,
    }

    return conferenceEventRepo.add(newConferenceEvent)
      .then(should.fail)
      .catch(ConferenceEventValidationError, async (e) => {
        const conferenceEvents = await database.query('select * from conference_event');
        should(conferenceEvents.length).equal(0, 'wrong conferenceEvents.length');
      });
    
  });

  it('add rejects conferenceEventValidationError on missing status', async () => {
    
    const newConferenceEvent = {
      city: city,
      startDate: startDate,
      endDate: endDate,
      price: price,
      color: color,
    }

    return conferenceEventRepo.add(newConferenceEvent)
      .then(should.fail)
      .catch(ConferenceEventValidationError, async (e) => {
        const conferenceEvents = await database.query('select * from conference_event');
        should(conferenceEvents.length).equal(0, 'wrong conferenceEvents.length');
      });
    
  });

  it('add rejects conferenceEventValidationError on missing color', async () => {
    
    const newConferenceEvent = {
      city: city,
      startDate: startDate,
      endDate: endDate,
      price: price,
      status: status,
    }

    return conferenceEventRepo.add(newConferenceEvent)
      .then(should.fail)
      .catch(ConferenceEventValidationError, async (e) => {
        const conferenceEvents = await database.query('select * from conference_event');
        should(conferenceEvents.length).equal(0, 'wrong conferenceEvents.length');
      });
    
  });

});

