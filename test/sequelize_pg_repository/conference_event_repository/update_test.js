const PgTestUtil =  require('pg-test-util').default;
const pgConConf = require('./pg_connection_config');
const Sequelize = require('sequelize');
const ConferenceEventNotFoundError = require('../../../dist/commonjs').ConferenceEventNotFoundError;

const ConferenceEventRepository = require('../../../dist/commonjs').ConferenceEventRepository;
const should = require('should');

process.env.PG_TEST_CONNECTION_STRING = `postgresql://${pgConConf.user
  }:${pgConConf.password}@${pgConConf.host}:${pgConConf.port}`;



describe('ConferenceEventRepository#update', () => {

  let dbName;
  const pgTestUtil = new PgTestUtil();
  
  let database;
  let conferenceEventRepo;
  const city = 'city';
  const startDateStrg = '2019-08-24 14:00:00 +02:00';
  const endDateStrg = '2019-08-25 14:00:00 +02:00';
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
    await database.query('ALTER SEQUENCE conference_event_id_seq RESTART WITH 1'); 
    await conFactory.close();
  });
   
  it('successfully update all attributes', async () => {
    const id = 1;
    const conferenceEventUpdate = {
      id: id,
      city: 'city1',
      startDate: new Date(1111),
      endDate: new Date(2222),
      price: 4,
      status: 'Never',
      color: '#222',
    }

    const updatedConference = await conferenceEventRepo.update(conferenceEventUpdate);
    should(updatedConference).deepEqual(conferenceEventUpdate);
    const conferenceEvents = await database.query(`select * from conference_event where id = ${id}`);
    conferenceEventColumn = conferenceEvents[0];
    should(conferenceEventColumn.city).equal(conferenceEventUpdate.city);
    should(conferenceEventColumn.startDate.getTime()).equal(conferenceEventUpdate.startDate.getTime());
    should(conferenceEventColumn.endDate.getTime()).equal(conferenceEventUpdate.endDate.getTime());
    should(conferenceEventColumn.price).equal(conferenceEventUpdate.price);
    should(conferenceEventColumn.status).equal(conferenceEventUpdate.status);
    should(conferenceEventColumn.color).equal(conferenceEventUpdate.color);
  });

  it('successfully update some attributes', async () => {
    const id = 1;
    const conferenceEventUpdate = {
      id: id,
      price: 4,
      status: 'Never',
    }

    const expectedEventonference = 
    {
      id: id,
      city: city,
      price: 4,
      startDate: new Date(startDateStrg),
      endDate: new Date(endDateStrg),
      status: 'Never',
      color: color,
    }

    const updatedConference = await conferenceEventRepo.update(conferenceEventUpdate);
    should(updatedConference).deepEqual(expectedEventonference);
    const conferenceEvents = await database.query(`select * from conference_event where id = ${id}`);
    conferenceEventColumn = conferenceEvents[0];
    should(conferenceEventColumn.city).equal(expectedEventonference.city);
    should(conferenceEventColumn.startDate.getTime()).equal(expectedEventonference.startDate.getTime());
    should(conferenceEventColumn.endDate.getTime()).equal(expectedEventonference.endDate.getTime());
    should(conferenceEventColumn.price).equal(expectedEventonference.price);
    should(conferenceEventColumn.status).equal(expectedEventonference.status);
    should(conferenceEventColumn.color).equal(expectedEventonference.color);
  });


  it('Reject with ConferenceEventNotFoundError if id is unknown', async() => {
    const conferenceEventUpdate = {
      id: 999,
      price: 4,
      status: 'Never',
    }

    return conferenceEventRepo.update(conferenceEventUpdate)
      .then(should.fail)
      .catch(ConferenceEventNotFoundError, (e) => {
        console.log(e);
      });
 
  });

});

