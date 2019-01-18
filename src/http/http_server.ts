import {Express} from 'express';
import {IRouter} from 'express';
import {Server} from 'http';
import * as bodyParser from 'body-parser';
import { IHttpHandlerRegistration, HttpMethod } from './transport_contracts';

/**
 * @class HttpServer
 * wraps Express server and router 
 */
export class HttpServer {

  private serv?: Server;
  private handlerRegistrations: Array<IHttpHandlerRegistration>
  //public router: IRouter<any> = createRouter();
  
  /**
   * @constructor
   * @param {Express} app the expres app
   * @param router {IRouter} the router
   * @param {Array<IHttpHandlerRegistration} handlerRegistrations the handlers to register
   *  for http method and resours 
   */
  constructor (
    private app: Express,
    private router: IRouter<any>,
    ...handlerRegistrations : Array<IHttpHandlerRegistration>) {
      this.handlerRegistrations = handlerRegistrations;
    }

  /**
   * @method initialize
   */
  public initialize() {

    this.app.use(bodyParser.json());

    this.handlerRegistrations.forEach((handlerRegistration) => {
      this.registerHandlerRegistration(handlerRegistration);
    });

    this.app.use('/api', this.router);
    this.app.set('port', process.env.PORT || 8000);
  }

  private registerHandlerRegistration(handlerRegistration: IHttpHandlerRegistration) {
    const resource = handlerRegistration.resource;
    const requestHandler = handlerRegistration.requestHandler;

    console.log(`register route ${resource} for method ${handlerRegistration.method}`)
    switch(handlerRegistration.method) {
      case HttpMethod.post:
        this.router.post(resource, requestHandler);
        break;
      case HttpMethod.put:
        this.router.put(resource, requestHandler);
        break;
      case HttpMethod.get:
        this.router.get(resource, requestHandler);
        break;
      case HttpMethod.delete:
        this.router.delete(resource, requestHandler);
        break;
      default:
        throw new RangeError(`Unknown methed ${handlerRegistration.method}`);
    }
  }

  /**
   * starts listening on for http requests
   * @method start
   */
  start() {
    const port = this.app.get('port');

    this.serv = this.app.listen(port, function() {
      console.log(`Express server listening on port ${port}`)
    })

  }

  close() {
    this.serv.close(function() {
      console.log(`Express server endet listening.`)
    });
  }

}

