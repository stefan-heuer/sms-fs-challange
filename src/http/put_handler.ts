import {assoc} from 'ramda';
import {RequestHandler, Request, Response} from 'express';
import { IConferenceEventRepository, ConferenceEventNotFoundError } from '../domain_contracts';
import { IErrorHttpHandler } from './transport_contracts';
import { IConferenceEvent } from '../domain_contracts';
import {toConferenceEventUpdate, toTransport} from './transport_domain_mapper'

/**
 * Creates the Http Request Handler to handle put requests
 *  When registering this with an Express#IRouterMatcher ypu need to define PathParams with param "id"
 * 
 *    E.G router.post('/part1/part2/:id')
 * 
 * @function createGetHandler
 * @param {ErrorHttpHandler} errorHandler 
 * @param {IConferenceEventRepository} repository access the backend 
 */
export function createPutHandler(errorHandler: IErrorHttpHandler, repository: IConferenceEventRepository): RequestHandler {

  const postHandler: RequestHandler = (req: Request, res: Response) => {

    try {
      const id = parseInt(req.params.id);

      if (id === NaN) {
        throw new ConferenceEventNotFoundError('Not Found');
      }

      const conferenceEvent = assoc('id', id, toConferenceEventUpdate(req.body));
      repository.update(conferenceEvent)
        .then((conferenceEventWithId) => {
          const httpBody = toTransport(conferenceEventWithId);
          console.dir(httpBody);
          res.json(httpBody);
        })
        .catch((e) => errorHandler(e, res));
    } catch (e) {
      errorHandler(e, res);
    }

  };

  return postHandler;

}