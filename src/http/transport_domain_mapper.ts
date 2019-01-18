import {IConferenceEvent, IConferenceEventUpdate, Status} from '../domain_contracts';
import {is, assoc} from 'ramda';

export const toConferenceEvent = (transportPayload: any): IConferenceEvent => {

  return {
    city: transportPayload.city,
    startDate: new Date(transportPayload.start_date),
    endDate: new Date(transportPayload.end_date),
    price: parseInt(transportPayload.price),
    status: <Status>transportPayload.status,
    color: transportPayload.color,
  }
};

export const toConferenceEventUpdate = (transportPayload: any): IConferenceEventUpdate => {

  let update: IConferenceEventUpdate  = {id: transportPayload.id};

  if(is(String, transportPayload.city)) {
    update.city = transportPayload.city;
  }

  if(is(String, transportPayload.start_date)) {
    update.startDate = new Date(transportPayload.start_date);
  }

  if(is(String, transportPayload.end_date)) {
    update.endDate = new Date(transportPayload.start_date);
  }

  if(is(String, transportPayload.price)) {
    update.price = transportPayload.price.toString();
  }

  if(is(String, transportPayload.status)) {
    update.status = transportPayload.status;
  }

  if(is(String, transportPayload.color)) {
    update.color = transportPayload.color;
  }

  return update;
}

const dateString = (date: Date): string => {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

export const toTransport = (conferenceEvent: IConferenceEvent): any => {
  return {
    city: conferenceEvent.city,
    start_date: dateString(conferenceEvent.endDate),
    end_date: dateString(conferenceEvent.endDate),
    price: conferenceEvent.price.toString(),
    status: conferenceEvent.status,
    color: conferenceEvent.color,
  };
};