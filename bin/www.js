const assert = require('assert');
const express = require('express');

const Database = require('better-sqlite3');
const commentsRouter = require('../lib/router.js');

const app = express();
//app.unset('powered by');

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


// Read command line arguments
assert(process.argv.length == 5, 'Missing arguments');
const [, , host, port, dbpath] = process.argv;

// Create production database
commentsRouter.api._db = new Database(dbpath); 
commentsRouter.api.init();

console.log('Using database file %s', dbpath);

// Start HTTP server
app.listen(port, host, (err) => {
  console.log('Listening on %s:%s', host, port);
});

