import {IErrorHttpHandler} from './transport_contracts';
import {ConferenceEventNotFoundError, ConferenceEventValidationError} from '../domain_contracts';
import {ERROR_MESSAGES} from '../api_constants';
import {is} from 'ramda';

/** 
 * @function errorhandler
 * @implements IErrorHttpHandler
*/
export const errorHandler: IErrorHttpHandler = (error, httpResponse) => {

  if (is(ConferenceEventNotFoundError, error)) {
    console.error('Not Found Error', error);
    httpResponse.status(404);
    httpResponse.json({message: error.message});
  } else if (is(ConferenceEventValidationError, error)) {
    console.error('Bad Request Error', error);
    httpResponse.status(400);
    httpResponse.json({message: error.message});
  } else {
    console.error('Unhandled Error', error)
    httpResponse.status(500);
    httpResponse.json({message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR});
  }

}