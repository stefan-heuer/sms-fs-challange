const PgTestUtil =  require('pg-test-util').default;
const pgConConf = require('./pg_connection_config');
const Sequelize = require('sequelize');
const ConferenceEventNotFoundError = require('../../../dist/commonjs').ConferenceEventNotFoundError;

const ConferenceEventRepository = require('../../../dist/commonjs').ConferenceEventRepository;
const should = require('should');

process.env.PG_TEST_CONNECTION_STRING = `postgresql://${pgConConf.user
  }:${pgConConf.password}@${pgConConf.host}:${pgConConf.port}`;



describe('ConferenceEventRepository#get', () => {

  let dbName;
  const pgTestUtil = new PgTestUtil();
  
  let database;
  let conferenceEventRepo;

  const city = 'city';
  const startDateStrg = '2019-08-24 14:00:00 +02:00';
  const startDate = new Date(startDateStrg);
  const endDateStrg = '2019-08-25 14:00:00 +02:00';
  const endDate = new Date(endDateStrg);
  const price = 1.1;
  const status = 'Once';
  const color = '#111';

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
    const query = `insert into conference_event ("city", "startDate", "endDate", "price", "status", "color") VALUES ('${
      city}', '${startDateStrg}', '${endDateStrg}', '${price}', '${status}', '${color}')`;
    await database.query(query);
  });

  afterEach(async () => {
    await database.query('truncate table conference_event cascade');
    await conFactory.close();
  });
   
  it('successfully get', async () => {

    const expectedConferenceEvent  = {
      id: 1,
      city: city,
      startDate: startDate,
      endDate: endDate,
      price: price,
      status: status,
      color: color,
    };

    const conferenceEvent = await conferenceEventRepo.get(1)
    should(conferenceEvent).deepEqual(expectedConferenceEvent, 'Wrong data');
 
  });

  it('Reject with ConferenceEventNotFoundError if id is unknown', async() => {

    return conferenceEventRepo.get(9999)
      .then(should.fail)
      .catch(ConferenceEventNotFoundError, (e) => {
        console.log(e);
      });
 
  });

});

