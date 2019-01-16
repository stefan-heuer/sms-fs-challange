import {INTEGER, FLOAT, DATE, DefineAttributes, DefineOptions, STRING} from 'sequelize';

import { IConferenceEventInstance } from './contracts';

const CITY_STING_LENGTH = 255;
const COLOR_STRING_LENGTH = 8;
const STATUS_STRING_LEGTH = 16;

const CONFERENCE_EVENT_SCHEMA: DefineAttributes = {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  city: {
    type: STRING(CITY_STING_LENGTH),
    allowNull: false,
  },
  startDate: {
    type: DATE,
  },
  endDate: {
    type: DATE,
  },
  price: {
    type: FLOAT,
    allowNull: false,
  },
  color: {
    type: STRING(COLOR_STRING_LENGTH),
    allowNull: false,
  },
  status: {
    type: STRING(STATUS_STRING_LEGTH),
    allowNull: false,
  }
};

const CONFERENCE_EVENT_MODEL_DEFINE_OPTIONS: DefineOptions<IConferenceEventInstance> = {
  tableName: 'conference_event',
  timestamps: false,
  underscored: true
};

export {
  CONFERENCE_EVENT_SCHEMA,
  CONFERENCE_EVENT_MODEL_DEFINE_OPTIONS,
};
