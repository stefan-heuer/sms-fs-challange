import {RequestHandler, Response} from 'express';

/**
 * Evaluates an error to respond with an http response code
 * @interface ErrorHttpHandler
 * @param {Error} error the error to evaluate
 * @param {Response} httpResponse the http response
 *  instance used to send the response
 */
export interface IErrorHttpHandler {
  (error: Error, httpResponse: Response): void;
}

export enum HttpMethod {
  post = 'post',
  put = 'put',
  get = 'get',
  delete = 'delete',
}

/**
 * Describes the registrattion of an http handler for a resouce an http method
 * @interface IHttpHandlerRegistration
 */
export interface IHttpHandlerRegistration {
  method: HttpMethod;
  resource: string;
  requestHandler: RequestHandler;
}
