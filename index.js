/* eslint-disable max-statements */
const { decycle } = require('json-decycle');

module.exports = function (app, opts) {
  opts = opts || {};

  const env = app.config.get('NODE_ENV')
    || app.config.get('env')
    || 'development';

  return function (err, req, res, next) {
    if (!err) { return next(); }

    const msg = err.message || 'Unknown error';
    const meta = {
      title: 'Error executing API call',
      status: err.status || 500
    };

    //
    // This stack information only gets sent to our error logger
    // unless we are in development environment
    //
    meta.content = JSON.stringify(
      Object.keys(err).reduce((memo, prop) => {
        memo[prop] = err[prop];
        return memo;
      }, {}),
      decycle()
    );

    const result = { message: msg };
    if (env === 'development') {
      result.content = meta.content;
      result.stack = err.stack;
    }

    if (err.code) {
      meta.code = result.code = err.code;
    }

    // errors with redirects
    if (err.location && !res.headersSent) {
      res.location(err.location);
    }

    if (err.log !== false && !opts.disableLog) {
      app.log[err.level || 'error'](msg, meta);
    }

    res.status(meta.status).json(result);
  };
};
