// header options tests

process.env.NODE_ENV = 'test';

var _ = require('lodash'),
    Chance = require('chance'),
    chance = new Chance(),
    expect = require('chai').expect,
    methods = require('methods'),
    request = require('supertest');

describe('request options forced', function() {
  var app;

  before(function(done) {
    app = require('./helpers/app')({
      defaultHeaders: {
        "default1": "default1_value"
      },
      forwardHeaders: ["forward1"],
      forceRequestDefaults: true,
      requestDefaults: {json: true}
    });
    done();
  });

  after(function(done) {
    app.server.close(done);
  });

  describe('json true/false', function() {
      it('attempts false Header contains content-type application/json', function(done) {
          request(app)
              .post('/batch')
              .send({
                getHeader: {
                  json: false,
                  method: 'GET',
                  url: 'http://localhost:3000/header/accept'
                }
              })
              .expect(200, function(err, res) {
                //console.log("Response body is: ", res.body)
                //console.log("Response headers is: ", res.headers)
                expect(err).to.not.exist;
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('getHeader');
                expect(res.body.getHeader).to.have.property('body');
                expect(res.body.getHeader.body).to.have.property('name');
                expect(res.body.getHeader.body.name).to.be.equal('accept')
                expect(res.body.getHeader.body.value).to.be.equal('application/json');
                expect(res.body.getHeader.headers).to.have.property('content-type');
                expect(res.body.getHeader.headers['content-type']).to.be.equal('application/json; charset=utf-8')
                done();
              });
      });

      it('is not defined Header contains content-type application/json', function(done) {
          request(app)
              .post('/batch')
              .send({
                getHeader: {
                  method: 'GET',
                  url: 'http://localhost:3000/header/accept'
                }
              })
              .expect(200, function(err, res) {
                //console.log("Response body is: ", res.body)
                //console.log("Response headers is: ", res.headers)
                expect(err).to.not.exist;
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('getHeader');
                expect(res.body.getHeader).to.have.property('body');
                expect(res.body.getHeader.body).to.have.property('name');
                expect(res.body.getHeader.body.name).to.be.equal('accept')
                expect(res.body.getHeader.body.value).to.be.equal('application/json');
                expect(res.body.getHeader.headers).to.have.property('content-type');
                expect(res.body.getHeader.headers['content-type']).to.be.equal('application/json; charset=utf-8')
                done();
              });
      });
  });

});



describe('request options not forced', function() {
  var app;

  before(function(done) {
    app = require('./helpers/app')({
      defaultHeaders: {
        "default1": "default1_value"
      },
      forwardHeaders: ["forward1"],
      requestDefaults: {json: true}
    });
    done();
  });

  after(function(done) {
    app.server.close(done);
  });

  describe('json true/false', function() {
    it('request set false Header does not contain content-type application/json', function(done) {
      request(app)
        .post('/batch')
        .send({
          getHeader: {
            json: false,
            method: 'GET',
            url: 'http://localhost:3000/header/accept'
          }
        })
        .expect(200, function(err, res) {
          //console.log("Response body is: ", res.body)
          //console.log("Response headers is: ", res.headers)
          expect(err).to.not.exist;
          // the 'accept' should not equal in the request header, our server returns 404 in this case
          expect(res.body.getHeader.statusCode).to.be.equal(404);
          done();
        });
    });

    it('request set true Header contains content-type application/json', function(done) {
      request(app)
        .post('/batch')
        .send({
          getHeader: {
            method: 'GET',
            json: true,
            url: 'http://localhost:3000/header/accept'
          }
        })
        .expect(200, function(err, res) {
          //console.log("Response body is: ", res.body)
          //console.log("Response headers is: ", res.headers)
          expect(err).to.not.exist;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('getHeader');
          expect(res.body.getHeader).to.have.property('body');
          expect(res.body.getHeader.body).to.have.property('name');
          expect(res.body.getHeader.body.name).to.be.equal('accept')
          expect(res.body.getHeader.body.value).to.be.equal('application/json');
          expect(res.body.getHeader.headers).to.have.property('content-type');
          expect(res.body.getHeader.headers['content-type']).to.be.equal('application/json; charset=utf-8')
          done();
        });
    });
  });

});


