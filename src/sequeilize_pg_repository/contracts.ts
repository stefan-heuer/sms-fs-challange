import * as Sequelize from 'sequelize';
import {IConferenceEvent} from '../contracts';

export interface IConferenceEventInstance extends Sequelize.Instance<IConferenceEvent>, IConferenceEvent {}
export interface IVehicleModel extends Sequelize.Model<IConferenceEventInstance, IConferenceEvent> {}
export {IConferenceEvent} from '../contracts';
