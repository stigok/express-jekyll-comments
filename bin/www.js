const assert = require('assert');
const express = require('express');

const Database = require('better-sqlite3');
const commentsRouter = require('../lib/router.js');

const app = express();
//app.unset('powered by');

// Create production database
commentsRouter.api._db = new Database('/tmp/express-comments.db'); 
commentsRouter.api.init();

app.use('/comments', commentsRouter);

app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    res.sendStatus(500);
  }
  else {
    res.sendStatus(404);
  }
});

console.log(process.argv)
assert(process.argv.length == 4, 'Missing arguments');

const [, , port, host] = process.argv;
app.listen(port, host, (err) => {
  console.log('Listening on %s:%s', host, port);
});

