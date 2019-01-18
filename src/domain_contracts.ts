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
 * @extends {IConferenceEvent}
 */
export interface IConferenceEventWithId extends IConferenceEvent {
  id: number;
}

/**
 * Describes the domain object used to update a conference event
 *  refer too {IConferenceEvent} for property description
 * @interface IConferenceEventUpdate
 */
export interface IConferenceEventUpdate {
  id: number;
  city?: string,
  startDate?: Date,
  endDate?: Date,
  price?: number,
  status?: Status,
  color?: string
}

/**
 * The Repository to access and write instances of IConferenceEvent
 * abstracting the concrete technique to store the data
 * 
 * @interface IConferenceEventRepository
 */
export interface IConferenceEventRepository {

  /**
   * Adds a conferenceEvent to the data store
   * @method addConferenceEvent
   * @param conferenceEvent {IConferenceEvent} the conferenceEvent to add to the data store
   * @return BluebirdPromise<number> the id of the created conference event
   * @throws {ConferenceEventValidationError} if conferenceEvent does not support all required propeties
   */
  add(conferenceEvent: IConferenceEvent): BluebirdPromise<number>;

  /**
   * Get a conferenceEvent by id
   * @method get
   * @param {number} id the id of the conferenceEvent
   * @return BluebirdPromise<IConferenceEvent> the instance of IConferenceEvent related to the passed id
   * @throws {ConferenceEventNotFoundError} if no conference event is related to the id passed
   */
  get(id: number): BluebirdPromise<IConferenceEventWithId>;

  /**
   * Get all conferenceEvents
   * @method get
   * @return BluebirdPromise<Array<IConferenceEvent>> resolves to an arrays of all conferenceEvents
   */
  getAll(): BluebirdPromise<Array<IConferenceEventWithId>>;

  /**
   * Delete a conferenceEvent by id
   * @method get
   * @param {number} id the id of the conferenceEvent
   * @return BluebirdPromise<void>
   * @throws {ConferenceEventNotFoundError} if no conference event is related to the id passed
   */
  delete(id: number): BluebirdPromise<void>;

  /**
   * Update a conferenceEvent with update info passed
   * @method update
   * @param {IConferenceEventUpdate} conferenceEventUpdate the update info
   * @return BluebirdPromise<IConferenceEventWithId> a promise that resolves to the updated conference event
   * @throws {ConferenceEventNotFoundError} if no conference event is related to the id passed
   */
  update(conferenceEventUpdate: IConferenceEventUpdate): BluebirdPromise<IConferenceEventWithId>; 
}

class BaseError extends Error {
  constructor(message: string, private cause?: Error) {
    super(message);
  }
}

export class ConferenceEventValidationError extends BaseError {}
export class ConferenceEventNotFoundError extends BaseError {}
