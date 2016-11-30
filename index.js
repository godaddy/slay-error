module.exports = function (app, opts) {
  opts = opts || {};

  var env = app.config.get('NODE_ENV')
    || app.config.get('env')
    || 'development';

  return function (err, req, res, next) {
    if (!err) { return next(); }

    var msg = err.message || 'Unknown error';
    var meta = {
      title: 'Error executing API call',
      status: err.status || 500
    };

    //
    // This stack information only gets sent to our error logger
    // unless we are in development environment
    //
    meta.content = err.stack;
    var result = { message: msg };
    if (env === 'development') {
      result.stack = err.stack;
    }

    if (err.code) {
      meta.code = result.code = err.code;
    }

    if (!opts.disableLog || opts.log === false) {
      app.log.error(msg, meta);
    }

    res.status(meta.status).json(result);
  };
};
