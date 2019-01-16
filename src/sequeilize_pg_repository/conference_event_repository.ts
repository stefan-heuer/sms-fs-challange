import * as BluebirdPromise from 'bluebird';
import * as Debug from 'debug';
import * as R from 'ramda';
import * as Sequelize from 'sequelize';

import {IConferenceEventInstance,} from './contracts';

import {IConferenceEvent, IConferenceEventWithId, IConferenceEventUpdate, ConferenceEventValidationError,
  ConferenceEventExistsError, ConferenceEventNotFoundError, IConferenceEventRepository} from '../contracts';

import {ERROR_MESSAGES} from '../api_constants';

import {CONFERENCE_EVENT_MODEL_DEFINE_OPTIONS, CONFERENCE_EVENT_SCHEMA} from './db_schema';
import { PostgreSqlConnectionFactory } from './postgres_sql_connection_factory';

const debug: Debug.IDebugger = Debug('huf:ConferenceEvent_repository');

function isSequelizeConferenceEventModel(model: Sequelize.Model<IConferenceEventInstance, IConferenceEvent> | undefined | null):
  model is Sequelize.Model<IConferenceEventInstance, IConferenceEvent> {
    return !R.isNil(model);
}

function isIConferenceEventInstance(ConferenceEventInstance: IConferenceEventInstance | undefined | null):
  ConferenceEventInstance is IConferenceEventInstance {
    return !R.isNil(ConferenceEventInstance);
}

function isIConferenceEvent(conferenceEvent: IConferenceEvent  | undefined | null): conferenceEvent is IConferenceEvent  {

    return !R.isNil(conferenceEvent)
      && R.is(String, conferenceEvent.city)
      && R.is(Date, conferenceEvent.startDate)
      && R.is(Date, conferenceEvent.endDate)
      && R.is(Number, conferenceEvent.price)
      && R.is(String, conferenceEvent.status)
      && R.is(String, conferenceEvent.color);

}

/**
 * Turns an Array of IConferenceEventInstance into to an Array of IConferenceEvents
 * @function ConferenceEventInstance2ConferenceEvent
 * @param {IConferenceEventInstance | null} ConferenceEventInstance
 * @return {Array<IConferenceEvent>}
 */
const conferenceEventInstances2ConferenceEvents = <{(ConferenceEventInstances: Array<IConferenceEventInstance>): Array<IConferenceEvent>}>
  R.pipe(R.map(conferenceEventInstance2ConferenceEvent), R.filter(R.is(Object)));

/**
 * Turns an instance of IConferenceEventInstance to an instance of IConferenceEvent or returns null if ConferenceEventInstance
 *  is null or undefined
 * @function ConferenceEventInstance2ConferenceEvent
 * @param {IConferenceEventInstance | null} ConferenceEventInstance
 * @return {IConferenceEvent | null}
 */
function conferenceEventInstance2ConferenceEvent(conferenceEventInstance: IConferenceEventInstance | null | undefined ): IConferenceEventWithId | null {

  return isIConferenceEventInstance(conferenceEventInstance) ? {
    id: conferenceEventInstance.id,
    city: conferenceEventInstance.city,
    startDate: conferenceEventInstance.startDate,
    endDate: conferenceEventInstance.endDate,
    status: conferenceEventInstance.status,
    price: conferenceEventInstance.price,
    color: conferenceEventInstance.color,
  } : null;
}

/**
 * Provides access to persistent ConferenceEvent entities
 * @class ConferenceEventRepository
 */
export class ConferenceEventRepository implements IConferenceEventRepository {

  private schemaNotSynced: boolean = true;
  /**
   * DO NOT ACCESS for operating on the model. Use getter "ConferenceEventModel" instead.
   * @property _ConferenceEventModel
   * @type {Sequelize.Model<IConferenceEventInstance, IConferenceEvent>}
   */
  private _conferenceEventModel?: Sequelize.Model<IConferenceEventInstance, IConferenceEvent>;

  /**
   * Accessor to the sequilize ConferenceEvent  model. Should be used for each operation on this model.
   * @property ConferenceEventEventModel
   * @type {Sequelize.Model<IConferenceEventInstance, IConferenceEvent>}
   * @readonly
   */
  private get conferenceEventModel(): Sequelize.Model<IConferenceEventInstance, IConferenceEvent> {
    if (!isSequelizeConferenceEventModel(this._conferenceEventModel)) {
      throw new Error(`${ERROR_MESSAGES.INVALID_STATE}:_ConferenceEventModel_NOT_intitialized'`);
    }
    return this._conferenceEventModel;
  }

  constructor(private postgreSqlConnectionFactory: PostgreSqlConnectionFactory) { }

  /**
   * initialize the repository
   * @method initialize
   * @return {BluebirdPromise<void>}
   */
  public initialize(): BluebirdPromise<void> {
    debug('TraceIn initialize');
    debug('Repository sucessfully initialized checking schema sync');
    debug(`Flags schemaNotSynced: ${this.schemaNotSynced}! So sync schema ${this.schemaNotSynced}`);
    return this.schemaNotSynced ? this.defineModelAndSyncSchema() : BluebirdPromise.resolve(this.defineModel());
  }

  /**
   * @method add
   * @override IConferenceEventRepository#add
   */
  public add(ConferenceEvent: IConferenceEvent): BluebirdPromise<void> {
    return !isIConferenceEvent(ConferenceEvent) ?
      BluebirdPromise.reject(new ConferenceEventValidationError('INVALID_IConferenceEvent'))
      : BluebirdPromise.try(async() => {
        const ConferenceEventInstance = await this.conferenceEventModel.build(ConferenceEvent);
        await ConferenceEventInstance.save();
      })
      .catch(Sequelize.UniqueConstraintError, (cause) => {
        throw new ConferenceEventExistsError('REFERNCED_ConferenceEvent_EXTSTS', cause);
      })
      .catch(Sequelize.ValidationError, (cause) => {
        throw new ConferenceEventValidationError(cause.message, cause);
      });
  }

  /**
   * @method getByConferenceEventId
   * @override IConferenceEventRepository#get
   */
  public get(id: number): BluebirdPromise<IConferenceEventWithId> {

    return BluebirdPromise.try(async() => {

      const conferenceEventInstance = await this.conferenceEventModel.findById(id);
      const conferenceEvent = conferenceEventInstance2ConferenceEvent(conferenceEventInstance);
      if (!isIConferenceEvent(conferenceEvent)) {
        throw new ConferenceEventNotFoundError(`UNKNOWN_ConferenceEvent_REFERENCE-Id: ${id}`);
      }

      return conferenceEvent;
    });

  }

  /**
   * @override IConferenceEventService#getAll
   * @method getAll
   */
  public getAll(): BluebirdPromise<Array<IConferenceEventWithId>> {
    return BluebirdPromise.try(async() => {
      const ConferenceEventInstances = this.conferenceEventModel.findAll();
      // @ts-ignore
      return conferenceEventInstances2ConferenceEvents(ConferenceEventInstances);
    });
  }

  /**
   * @override IConferenceEventService#update
   * @method update
   */
  update(conferenceEventUpdate: IConferenceEventUpdate): BluebirdPromise<IConferenceEventWithId> {
    return BluebirdPromise.try(async() => {

      const id = conferenceEventUpdate.id;
      const conferenceEvent = await this.conferenceEventModel.findById(id);

      if(R.isNil(conferenceEvent)) {
        throw new ConferenceEventNotFoundError(`UNKNOWN_ConferenceEvent_REFERENCE-Id: ${id}`);
      }

      const conferenceEventInstance = await conferenceEvent.updateAttributes(conferenceEventUpdate);
      return conferenceEventInstance2ConferenceEvent(conferenceEventInstance);
    });
  } 

  /**
   * @override IConferenceEventService#delete
   * @method delete
   */
  public delete(id: number): BluebirdPromise<void> {
    return BluebirdPromise.try(async() => {
      const deleted = await this.conferenceEventModel.destroy({where: { id: id }});
      if(deleted === 0) {
        throw new ConferenceEventNotFoundError(`UNKNOWN_ConferenceEvent_REFERENCE-Id: ${id}`);
      }
    });
  }


  /**
   * The getter to the sequelize connectiuon used by the repository to access the db backend
   * @property
   * @private
   * @type {Sequelize.Sequelize}
   */
  private get connection(): Sequelize.Sequelize {
    return this.postgreSqlConnectionFactory.getConnection();
  }

  /**
   * Defines the model of the repository woithout syncing the database
   * @method defineModel
   * @return {void}
   */
  private defineModel(): void {

    this._conferenceEventModel = this.connection
      .define<IConferenceEventInstance, IConferenceEvent>('ConferenceEvent', CONFERENCE_EVENT_SCHEMA, CONFERENCE_EVENT_MODEL_DEFINE_OPTIONS);
  }

  /**
   * Defines the repositoriy`s model and synchronizes database schema
   * DO NOT CALL IN PRODUCTION!!!
   * @method defineModelAndSyncSchema
   */
  private defineModelAndSyncSchema(): BluebirdPromise<void> {

    return BluebirdPromise.try(async() => {
      this.schemaNotSynced = false;
      this._conferenceEventModel = this.connection
      .define<IConferenceEventInstance, IConferenceEvent>('ConferenceEvent', CONFERENCE_EVENT_SCHEMA, CONFERENCE_EVENT_MODEL_DEFINE_OPTIONS);
      await this.conferenceEventModel.sync();
    });

 }

}
