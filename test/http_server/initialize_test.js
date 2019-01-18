'use strict';

const should = require('should');
const HttpSrever = require('../../dist/commonjs/').HttpServer;
const sinon = require('sinon');

describe('HttpServer#initialize', () => {
  
  let httpServer;
  let app;
  let router;

  beforeEach(() => {

    router = {
      post: sinon.stub(),
      put: sinon.stub(),
      get: sinon.stub(),
      delete: sinon.stub(),
    };

    app = {use: sinon.stub(), set: sinon.stub()};

  })

  it('initialize successfull', () => {

    const reg1 = {method: 'post', resource: 'res1', requestHandler: () => {} };
    const reg2 = {method: 'post', resource: 'res2', requestHandler: () => {} };
    const reg3 = {method: 'put', resource: 'res3', requestHandler: () => {} };
    const reg4 = {method: 'get', resource: 'res4', requestHandler: () => {} };
    const reg5 = {method: 'delete', resource: 'res5', requestHandler: () => {} };

    const httpServer = new HttpSrever(app, router, reg1, reg2, reg3, reg4, reg5);
    httpServer.initialize();

    should(router.post.calledTwice).equal(true);
    should(router.post.calledWith(reg1.resource, reg1.requestHandler)).equal(true);
    should(router.post.calledWith(reg2.resource, reg2.requestHandler)).equal(true);

    should(router.put.calledOnce).equal(true);
    should(router.put.calledWith(reg3.resource, reg3.requestHandler)).equal(true);

    should(router.get.calledOnce).equal(true);
    should(router.get.calledWith(reg4.resource, reg4.requestHandler)).equal(true);

    should(router.delete.calledOnce).equal(true);
    should(router.delete.calledWith(reg5.resource, reg5.requestHandler)).equal(true);


  });

  it('initialize with wrong method', () => {

    const reg = {method: 'wrong', resource: 'res', requestHandler: () => {} };
    const httpServer = new HttpSrever(app, router, reg)
    try {
      httpServer.initialize();
    } catch (e) {
      should(e).instanceOf(RangeError);
      return;
    }
    should.fail('No RangeError');

  });

});
