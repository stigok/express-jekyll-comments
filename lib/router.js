const express = require('express');
const bodyParser = require('body-parser');

const router = express();
const Comments = require('./comments.js');

const urlencodedParser = bodyParser.urlencoded({ extended: false });
router.api = new Comments();

router.get('/:subject_id', (req, res, next) => {
  const result = router.api.getBySubjectId(req.params.subject_id);
  res.json(result);
});

router.put('/:subject_id', urlencodedParser, (req, res, next) => {
  try {
    router.api.create({
      subject_id: req.params.subject_id,
      body: req.body.body,
      author: req.body.author
    });
    res.sendStatus(201);
  }
  catch (err) {
    res.sendStatus(400);
  }
});

module.exports = router;

