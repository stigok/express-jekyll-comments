const assert = require('assert');

const Comments = require('../lib/comments.js');

describe('Comments', function () {
  let api;

  beforeEach(function () {
    api = new Comments({ db: [] });
  })

  it('Accepts a comment with an oid, body and an author', () => {
    api.create({ oid: 21, body: 'hello', author: 'me' });
    assert(api._db.length == 1);
  })

  it('Rejects comments without an oid (target object id)', () => {
    assert.throws(() => {
      api.create({ body: 'hello', author: 'me' });
    }, /missing oid/i );
  })

  it('Rejects comments without a body', () => {
    assert.throws(() => {
      api.create({ oid: 21, author: 'me' });
    }, /missing body/i );
  })

  it('Rejects comments without an author', () => {
    assert.throws(() => {
      api.create({ oid: 21, body: 'hello' });
    }, /missing author/i );
  })

  it('A creation date is automatically added to a new comment', () => {
    api.create({ oid: 21, body: 'hello', author: 'me' });
    assert(api._db[0].createdAt, 'Missing createdAt property');
  })
})

