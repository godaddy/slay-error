const { describe, it, beforeEach } = require('node:test');
const assume = require('assume');
const { spy, stub } = require('sinon');
const error = require('./');

describe('slay-error', function () {
  let app, req, res, next;

  beforeEach(function () {
    app = {
      config: {
        get: function () { return 'test'; }
      },
      log: {
        info: function () {},
        error: spy()
      }
    };
    req = {};
    res = {
      status: stub().returnsThis(),
      json: spy()
    };
    next = spy();
  });

  it('is a function', function () {
    assume(error).is.a('function');
  });

  it('returns a function', function () {
    const middleware = error(app);
    assume(middleware).is.a('function');
    assume(middleware.length).equals(4);
  });

  it('handles circular references in metadata', async function () {
    const middleware = error(app);
    const err = {
      response: {
        status: 500,
        headers: {}
      },
      request: {
        method: 'GET',
        url: 'https://some.url/',
        headers: {}
      }
    };
    err.response.request = err.request;
    err.request.response = err.response;

    // Replace callback assertion with a promise
    const assertPromise = new Promise(resolve => {
      res.json = resolve;
    });

    middleware(err, req, res, next);
    assume(next.callCount).equals(0);

    // Wait for the assertion to be called
    await assertPromise;
  });

  it('skips logging if disableLog is true', async function () {
    const middleware = error(app, { disableLog: true });
    const err = new Error('test');

    // Replace callback assertion with a promise
    const assertPromise = new Promise(resolve => {
      res.json = () => {
        assume(app.log.error.callCount).equals(0);
        resolve();
      };
    });

    middleware(err, req, res, next);
    assume(next.callCount).equals(0);

    // Wait for the assertion to be called
    await assertPromise;
  });
});
