const assume = require('assume');
const { spy, stub } = require('sinon');
const error = require('./');

describe('slay-error', function () {
  let app, req, res, next;

  this.beforeEach(function () {
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

  it('handles circular references in metadata', function (done) {
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
    res.json = assert;

    middleware(err, req, res, next);
    assume(next.callCount).equals(0);

    function assert() {
      done();
    }
  });

  it('skips logging if disableLog is true', function (done) {
    const middleware = error(app, { disableLog: true });
    const err = new Error('test');
    res.json = assert;

    middleware(err, req, res, next);
    assume(next.callCount).equals(0);

    function assert() {
      assume(app.log.error.callCount).equals(0);
      done();
    }
  });
});
