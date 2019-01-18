import {PostgreSqlConnectionFactory, ConferenceEventRepository} from './sequeilize_pg_repository';
import * as express from 'express';
import { Router as createRouter } from 'express';

import {
    HttpServer,
    createPostHandler,
    createGetHandler,
    createPutHandler,
    createDeleteHandler,
    errorHandler,
    IHttpHandlerRegistration,
    HttpMethod
} from './http';


/**
 * instanciate and initialize all classes and start the service
 */
function bootstrap() {

    const psqlConFactory = new PostgreSqlConnectionFactory();

    psqlConFactory.config = {
        host: 'localhost',
        port: 5432,
        database: 'conferences_event',
        user: 'conferences_event_repository',
        password:'password'
    };

    const repository = new ConferenceEventRepository(psqlConFactory);
    repository.initialize();
    
    const postHandler = createPostHandler(errorHandler, repository);
    const getHandler = createGetHandler(errorHandler, repository);
    const putHandler = createPutHandler(errorHandler, repository);
    const deleteHandler = createDeleteHandler(errorHandler, repository);

    const httpServer = new HttpServer(
        express(),
        createRouter(),
        {method: HttpMethod.post, resource: '/conference', requestHandler: postHandler},
        {method: HttpMethod.get, resource: '/conference/:id', requestHandler: getHandler},
        {method: HttpMethod.put, resource: '/conference/:id', requestHandler: putHandler},
        {method: HttpMethod.delete, resource: '/conference/:id', requestHandler: deleteHandler}
    );

    httpServer.initialize();

    httpServer.start();
}

bootstrap();