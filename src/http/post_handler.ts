import {RequestHandler, Request, Response} from 'express';
import { IConferenceEventRepository } from '../domain_contracts';
import { IErrorHttpHandler } from './transport_contracts';
import {toConferenceEvent} from './transport_domain_mapper'

/**
 * Creates the Http Request Handler to handle post requests
 *  When registering this with an Express#IRouterMatcher ypu need to define PathParams with param "id"
 * 
 *    E.G router.post('/part1/part2/:id')
 * 
 * @function createGetHandler
 * @param {ErrorHttpHandler} errorHandler 
 * @param {IConferenceEventRepository} repository access the backend 
 */
export function createPostHandler(errorHandler: IErrorHttpHandler, repository: IConferenceEventRepository): RequestHandler {

  const postHandler: RequestHandler = (req: Request, res: Response) => {

    try {
      console.log(req.body)
      const conferenceEvent = toConferenceEvent(req.body);
      console.log(conferenceEvent);
      repository.add(conferenceEvent)
        .then((id) => {
          res.status(201);
          res.json({id: id});
        })
        .catch((e) => errorHandler(e, res));
    } catch (e) {
      errorHandler(e, res);
    }

  };

  return postHandler;

}