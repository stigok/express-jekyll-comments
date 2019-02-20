const assert = require('assert');

const Comments = require('../lib/comments.js');
const Database = require('better-sqlite3');

describe('Comments', function () {
  let api;
  let database;

  beforeEach(function () {
    database = new Database('test.db', {
      memory: true,
      verbose: console.log
    });
    api = new Comments({ db: database });
    api.init();
  })

  afterEach(() => {
    const tables = database.prepare(`
      SELECT name FROM sqlite_master WHERE type='table'
    `).all();

    tables.forEach((table) => {
        database.exec(`DROP TABLE '${table.name}'`);
      });
  });

  it('Initializes database table on init()', () => {
    const stmt = database.prepare(`
      SELECT COUNT(*) AS numrows
      FROM sqlite_master
      WHERE type='table' AND name='comments'`);
    const { numrows } = stmt.get();
    assert.strictEqual(numrows, 1);
  })

  it('Accepts a comment with a subject_id, body and an author', () => {
    api.create({ subject_id: 21, body: 'hello', author: 'me' });
    const stmt = database.prepare(`
      SELECT COUNT(*) AS numrows FROM comments
    `);
    const { numrows } = stmt.get();
    assert.strictEqual(numrows, 1);
  })

  it('getBySubjectId() returns all comments for a subject', () => {
    api.create({ subject_id: 42, body: 'a', author: 'b' });
    api.create({ subject_id: 42, body: 'a', author: 'b' });
    api.create({ subject_id: 42, body: 'a', author: 'b' });

    const comments = api.getBySubjectId(42);
    assert(Array.isArray(comments), 'Did not return an array');
    assert.strictEqual(comments.length, 3);
  })

  it('Rejects comments without a subject_id (target object id)', () => {
    assert.throws(() => {
      api.create({ body: 'hello', author: 'me' });
    }, /missing subject_id/i );
  })

  it('Rejects comments without a body', () => {
    assert.throws(() => {
      api.create({ subject_id: 21, author: 'me' });
    }, /missing body/i );
  })

  it('Rejects comments without an author', () => {
    assert.throws(() => {
      api.create({ subject_id: 21, body: 'hello' });
    }, /missing author/i );
  })

  it('Optionally saves email address of author', () => {
    api.create({ subject_id: 1, body: 'a', author: 'foo', email: 'foo@bar.com' });
    const com = api.getBySubjectId(1)[0];
    assert.strictEqual(com.email, 'foo@bar.com');
  })

  it('A comment id exists on returned comments', () => {
    api.create({ subject_id: 21, body: 'hello', author: 'me' });
    const com = api.getBySubjectId(21)[0];
    assert.notStrictEqual(com.comment_id, undefined, 'Property not defined');
    assert.notStrictEqual(com.comment_id, null, 'Property is not populated');
  })

  it('A creation date exists on returned comments', () => {
    api.create({ subject_id: 21, body: 'hello', author: 'me' });
    const com = api.getBySubjectId(21)[0];
    assert.notStrictEqual(com.created_at, undefined, 'Property not defined');
    assert.notStrictEqual(com.created_at, null, 'Property is not populated');
  })

  it.skip('Comments are indexed by subject_id');
})

