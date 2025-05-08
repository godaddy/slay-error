const { describe, it, beforeEach, mock } = require('node:test');
const assert = require('node:assert');
const error = require('./');

describe('slay-error', function () {
  let app, req, res, next;

  beforeEach(function () {
    app = {
      config: {
        get: function () { return 'test'; }
      },
      log: {
        info: mock.fn(),
        error: mock.fn()
      }
    };
    req = {};
    res = {
      status: mock.fn(function() { return this; }),
      json: mock.fn()
    };
    next = mock.fn();
  });

  it('is a function', function () {
    assert.strictEqual(typeof error, 'function');
  });

  it('returns a function', function () {
    const middleware = error(app);
    assert.strictEqual(typeof middleware, 'function');
    assert.strictEqual(middleware.length, 4);
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

    middleware(err, req, res, next);
    assert.strictEqual(res.json.mock.calls.length, 1);
  });

  it('skips logging if disableLog is true', async function () {
    const middleware = error(app, { disableLog: true });
    const err = new Error('test');

    middleware(err, req, res, next);
    assert.strictEqual(app.log.error.mock.calls.length, 0);
  });
});
