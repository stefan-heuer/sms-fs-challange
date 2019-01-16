const PgTestUtil =  require('pg-test-util').default;
const pgConConf = require('./pg_connection_config');
const Sequelize = require('sequelize');
const ConferenceEventRepository = require('../../../dist/commonjs').ConferenceEventRepository;
const R = require('ramda');
const should = require('should');

process.env.PG_TEST_CONNECTION_STRING = `postgresql://${pgConConf.user
  }:${pgConConf.password}@${pgConConf.host}:${pgConConf.port}`;



describe('ConferenceEventRepository#get', () => {

  let dbName;
  const pgTestUtil = new PgTestUtil();
  
  let database;
  let conferenceEventRepo;

  const city1 = 'city1';
  const startDateStrg1 = '2019-08-24 14:00:00 +02:00';
  const startDate1 = new Date(startDateStrg1);
  const endDateStrg1 = '2019-08-25 14:00:00 +02:00';
  const endDate1 = new Date(endDateStrg1);
  const price1 = 1.1;
  const status1 = 'Once';
  const color1 = '#111';

  const city2 = 'city2';
  const startDateStrg2 = '2019-09-25 14:00:00 +02:00';
  const startDate2 = new Date(startDateStrg2);
  const endDateStrg2 = '2019-09-25 14:00:00 +02:00';
  const endDate2 = new Date(endDateStrg2);
  const price2 = 1.1;
  const status2 = 'Never';
  const color2 = '#222';

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

    const query1 = `insert into conference_event ("city", "startDate", "endDate", "price", "status", "color") VALUES ('${
      city1}', '${startDateStrg1}', '${endDateStrg1}', '${price1}', '${status1}', '${color1}')`;
    await database.query(query1);

    const query2 = `insert into conference_event ("city", "startDate", "endDate", "price", "status", "color") VALUES ('${
      city2}', '${startDateStrg2}', '${endDateStrg2}', '${price2}', '${status2}', '${color2}')`;
    await database.query(query2);
      
  });

  afterEach(async () => {
    await database.query('truncate table conference_event cascade');
    await conFactory.close();
  });
   
  it('successfully get all conferenceEvents in the database', async () => {

    const conferenceEvents = await conferenceEventRepo.getAll();

    should(conferenceEvents.length).equal(2);

    const expectedConferenceEvent1  = {
      id: 1,
      city: city1,
      startDate: startDate1,
      endDate: endDate1,
      price: price1,
      status: status1,
      color: color1,
    };

    const expectedConferenceEvent2  = {
      id: 2,
      city: city2,
      startDate: startDate2,
      endDate: endDate2,
      price: price2,
      status: status2,
      color: color2,
    };

    const ordereredConferenceEvents = R.sortBy((e) => e.id, conferenceEvents) 
    should(ordereredConferenceEvents[0]).deepEqual(expectedConferenceEvent1, 'Wrong data');
    should(ordereredConferenceEvents[1]).deepEqual(expectedConferenceEvent2, 'Wrong data');

  });

});

