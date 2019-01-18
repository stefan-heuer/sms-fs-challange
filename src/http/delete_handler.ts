import {RequestHandler, Request, Response} from 'express';
import { IConferenceEventRepository, ConferenceEventNotFoundError} from '../domain_contracts';
import {IErrorHttpHandler} from './transport_contracts';

/**
 * Creates the Http Request Handler to handle delete requests
 *  When registering this with an Express#IRouterMatcher ypu need to define PathParams with param "id"
 * 
 *    E.G router.delete('/part1/part2/:id')
 * 
 * @function createDeleteHandler
 * @param {ErrorHttpHandler} errorHandler 
 * @param {IConferenceEventRepository} repository access the backend 
 */
export function createDeleteHandler(errorHandler: IErrorHttpHandler, repository: IConferenceEventRepository): RequestHandler {

  const deleteHandler: RequestHandler =  (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      if (id === NaN) {
        throw new ConferenceEventNotFoundError('Not Found');
      }

      repository.delete(id)
        .then(() => res.send(200))
        .catch((e) => errorHandler(e, res));
    } catch (e) {
      errorHandler(e, res);
    }
  };

  return deleteHandler; 

}


