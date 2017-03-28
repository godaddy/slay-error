# slay-error
Standard, sane defaults for HTTP errors in slay apps.

## Usage

You should use this within your `middlewares.js` in your Slay app

**middlewares.js**
``` js
module.exports = function (app, opts, done) {
  //
  // All your other middlewares first (most of the time)
  //

  //
  // Generally you want your error handling last.
  //
  app.use(require('slay-error')(app, { disableLog: false }));
};
```
In your application, when you pass an error to the `next(error)`
callback of a request handler, this middleware will handle the reporting
and response for that error in your application.
```
module.exports = function handler(req, res, next) {
  // if error
  next(new Error('let the middleware handle this'));
};
```

If the error that you pass to this middleware has a `location` property,
`res.location(error.location)` will be called for you.

If you don't want the error logged, you can use the option `disableLog:
true` or set the `log` property of the error to `false`.

You can also control the log level of the error using the level
property. So, if `level: 'info'` only `app.log.info` will be invoked
with the log message and metadata.

### Hint
In your application you can use a tool like [errs](https://www.npmjs.com/package/errs) that
will allow you to define the structure of errors, either with
pre-defined/registered errors or by passing all of the properties of the
error to `errs.create`
