import {RequestHandler, Request, Response} from 'express';
import { IConferenceEventRepository, ConferenceEventNotFoundError } from '../domain_contracts';
import {IErrorHttpHandler} from './transport_contracts';
import {toTransport} from './transport_domain_mapper'

/**
 * Creates the Http Request Handler to handle get requests
 *  When registering this with an Express#IRouterMatcher ypu need to define PathParams with param "id"
 * 
 *    E.G router.get('/part1/part2/:id')
 * 
 * @function createGetHandler
 * @param {ErrorHttpHandler} errorHandler 
 * @param {IConferenceEventRepository} repository access the backend 
 */
export function createGetHandler(errorHandler: IErrorHttpHandler, repository: IConferenceEventRepository): RequestHandler {

  const getHandler: RequestHandler = (req: Request, res: Response) => {

    try {
      const id = parseInt(req.params.id);

      if (id === NaN) {
        throw new ConferenceEventNotFoundError('Not Found');
      }

      repository.get(id)
        .then((conferenceEvent) => {
          const httpBody = toTransport(conferenceEvent);
          res.status(200);
          res.json(httpBody);
        })
        .catch((e) => errorHandler(e, res));
    } catch (e) {
      errorHandler(e, res);
    }
 
  };

  return getHandler;
}
