const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

const Database = require('better-sqlite3');

const router = require('../lib/router.js');

chai.use(chaiHttp);

describe('Comments router', () => {
  it('Exposes router.api with the comments API', () => {
    expect(router.api).to.be.an('object');
  });

  let database;

  beforeEach(function () {
    database = new Database('test.db', {
      memory: true,
      verbose: console.log
    });
    router.api._db = database;
    router.api.init();
  })

  afterEach(() => {
    database.exec(`DROP TABLE IF EXISTS comments`);
  });

  it('GET / returns 404', (done) => {
    chai.request(router)
      .get('/')
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(404);
        done();
      })
  });

  it('GET /<id> returns an empty array for unknown subject_ids', (done) => {
    chai.request(router)
      .get('/21')
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array').with.lengthOf(0);
        done();
      })
  });

  it('GET /<id> returns all comments with specified subject id', (done) => {
    // Create three comments
    router.api.create({ subject_id: 21, body: 'a', author: 'b' });
    router.api.create({ subject_id: 21, body: 'a', author: 'b' });
    router.api.create({ subject_id: 21, body: 'a', author: 'b' });

    chai.request(router)
      .get('/21')
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array').with.lengthOf(3);
        done();
      })
  });

  it('PUT /<id> with a well-formed body creates a new comment', (done) => {
    chai.request(router)
      .put('/7')
      .type('form')
      .send({
        body: 'foo',
        author: 'bar'
      })
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(201);

        const arr = router.api.getBySubjectId(7);
        expect(arr).to.have.length(1);
        expect(arr[0]).to.have.property('body', 'foo');

        done();
      })
  });

  it('PUT /<id> with a malformed body returns 400', (done) => {
    chai.request(router)
      .put('/7')
      .type('form')
      .send({
        author: 'bar'
      })
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(400);
        done();
      })
  });
})

