class Comments {
  constructor (opts) {
    this._db = opts.db || [];
  }

  create (comment) {
    comment = Object.assign({ oid: null, body: '', author: '' }, comment);

    if (!comment.oid) {
      throw new Error('Missing oid (target object ID)');
    }

    if (!comment.body) {
      throw new Error('Missing body');
    }

    if (!comment.author) {
      throw new Error('Missing author');
    }

    comment.createdAt = new Date();

    this._db.push(comment);
  }
}

module.exports = Comments;

