import * as BluebirdPromise from 'bluebird';

export enum Status {
  never = 'Never',
  once = 'Once',
  seldom = 'Seldom',
  often = 'Often',
  yearly = 'Yearly',
  weekly = 'Weekly',
  monthly = 'Monthly',
  daily = 'Daily' 
}

/**
 * Describes the datastructure of a conference event
 * @interface IConferenceEvent
 */
export interface IConferenceEvent {
  /**
   * The id of conferenceEvent
   * @type {number}
   */
  id?: number;

  /**
   * The vehicle id used by the customer system
   * @property externalVehicleRef
   * @type {String}
   */
  city: string,

  /**
   * The start date of the conference event
   * @property startDate
   * @type {Date}
   */
  startDate: Date,

  /**
   * The end date of the conference event
   * @property startDate
   * @type {Date}
   */
  endDate: Date,

  /**
   * The price of the conference event
   * @property startDate
   * @type {number}
   */
  price: number,

  /**
   * The status of the conference event
   * @property startDate
   * @type {number}
   */
  status: Status,

  /**
   * The color of the conference
   * @property startDate
   * @type {number}
   */
  color: string
}

/**
 * The Repository to access and write instances of IConferenceEvent
 * @interface IConferenceEventRepository
 */
export interface IConferenceEventRepository {

  /**
   * Adds a conferenceEvent to the data store
   * @method addConferenceEvent
   * @param conferenceEvent {IConferenceEvent} the conferenceEvent to add to the data store
   * @return BluebirdPromise<IConferenceEvent>
   * @throws {ConferenceEventValidationError} if conferenceEvent does not support all required propeties
   * @throws {ConferenceEventExistsError} if an conferenceEvent already extists in the system with
   *  tenandId and externalConferenceEventRef set to poroperties tenandId and externalConferenceEventRef
   *  of parameter conferenceEvent
   */
  add(conferenceEvent: IConferenceEvent): BluebirdPromise<void>;

  /**
   * Get an conferenceEvent by id
   * @method get
   * @param {number} id the id of the conferenceEvent
   * @return BluebirdPromise<IConferenceEvent> the instance of IConferenceEvent related to the passed externalConferenceEventRef
   */
  get(id: number): BluebirdPromise<IConferenceEvent>;

  /**
   * Get all conferenceEvents
   * @method get
   * @return BluebirdPromise<Array<IConferenceEvent>> resolves to an arrays of all conferenceEvents
   *  or to an arry of all conferenceEvents belonging to teh referenced tenant if parameter tentId is set
   */
  getAll(): BluebirdPromise<Array<IConferenceEvent>>;
}

class BaseError extends Error {
  constructor(message: string, private cause?: Error) {
    super(message);
  }
}

export class ConferenceEventValidationError extends BaseError {}
export class ConferenceEventNotFoundError extends BaseError {}
export class ConferenceEventExistsError extends BaseError {}