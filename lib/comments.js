class Comments {
  constructor (opts={}) {
    this._db = opts.db;
  }

  init () {
    const stmt = this._db.prepare(`
      CREATE TABLE IF NOT EXISTS comments (
        subject_id INTEGER,
        body TEXT,
        author TEXT,
        email TEXT,
        created_at INTEGER DEFAULT (strftime('%s','now'))
      )`);
    stmt.run();
  }

  create (comment) {
    const def = {
      subject_id: null,
      body: '',
      author: '',
      email: null
    };
    comment = Object.assign(def, comment);

    if (!comment.subject_id) {
      throw new Error('Missing subject_id (target object ID)');
    }

    if (!comment.body) {
      throw new Error('Missing body');
    }

    if (!comment.author) {
      throw new Error('Missing author');
    }

    const stmt = this._db.prepare(`
      INSERT INTO comments (subject_id, body, author, email)
      VALUES (
        @subject_id,
        @body,
        @author,
        @email
      )
    `);
    stmt.run(comment);
  }

  getBySubjectId (subject_id) {
    const stmt = this._db.prepare(`
      SELECT * FROM comments
      WHERE subject_id = $subject_id
    `);
    return stmt.all({ subject_id });
  }
}

module.exports = Comments;

