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
  app.use(require('slay-error')(app));
};
```
