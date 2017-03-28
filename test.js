const assume = require('assume');
const error = require('./');

const app = {
  config: {
    get: function () { return 'test'; }
  },
  log: {
    info: function () {},
    error: function () {}
  }
};

describe('slay-error', function () {
  it('is a function', function () {
    assume(error).is.a('function');
  });

  it('returns a function', function () {
    const middleware = error(app);
    assume(middleware).is.a('function');
    assume(middleware.length).equals(4);
  });
});
