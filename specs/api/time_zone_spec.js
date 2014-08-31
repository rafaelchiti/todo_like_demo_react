require('../spec_helper.js');
var TimeZone = require('../../shared/models/time_zone');
var User = require('../../shared/models/user');
var request = require('superagent');
var expect = require('chai').expect;
var moment = require('moment');

describe('API', function() {
  var url = 'http://localhost:3000/api';
  var unauthorizedRequest;
  var authorizedRequest;


  describe('TimeZones', function() {

    describe('without credentials', function() {
      var doneCb;

      function expectResponse(err, res) {
        if (err) done(err);
        expect(res.status).to.equal(401);
        doneCb();
      };

      it('#GET:time-zones returns 401', function(done) {
        doneCb = done;
        unauthorizedRequest = request.get(url + '/time-zones');
        unauthorizedRequest.end(expectResponse);
      });

      it('#POST:time-zones returns 401', function(done) {
        doneCb = done;
        unauthorizedRequest = request.post(url + '/time-zones');
        unauthorizedRequest.end(expectResponse);
      });

      it('#DELETE:time-zones/:id returns 401', function(done) {
        doneCb = done;
        unauthorizedRequest = request.del(url + '/time-zones/1');
        unauthorizedRequest.end(expectResponse);
      });

    });

    describe('with wrong credentials', function() {
      var doneCb;

      function expectResponse(err, res) {
        if (err) done(err);
        expect(res.status).to.equal(401);
        doneCb();
      };

      it('#GET:time-zones returns 401', function(done) {
        doneCb = done;
        unauthorizedRequest = request.get(url + '/time-zones').auth('wrong', 'credentials');
        unauthorizedRequest.end(expectResponse);
      });

      it('#POST:time-zones returns 401', function(done) {
        doneCb = done;
        unauthorizedRequest = request.post(url + '/time-zones').auth('wrong', 'credentials');
        unauthorizedRequest.end(expectResponse);
      });

      it('#DELETE:time-zones/:id returns 401', function(done) {
        doneCb = done;
        unauthorizedRequest = request.del(url + '/time-zones/1').auth('wrong', 'credentials');
        unauthorizedRequest.end(expectResponse);
      });

    });

    describe('with valid user', function() {

      beforeEach(function() {
          authorizedRequest = request.post(url + '/time-zones').auth('rafael', 'chiti');
      });

      describe('Create', function() {

        describe('with missing parameters', function() {
          it('returns 422', function(done) {
            authorizedRequest
            .send({name: 'Argentina'})
            .end(function(err, res) {
              if (err) done(err);
              expect(res.status).to.equal(422);
              done();
            });
          });
        });

        describe('with valid parameters', function() {
          it('returns 200', function(done) {
            authorizedRequest
            .send({name: 'Buenos Aires', cityName: 'BUE', gmtOffset: '-3'})
            .end(function(err, res) {
              if (err) done(err);
              expect(res.status).to.equal(200);
              done();
            });
          });
        });

        describe('with non numeric offset', function() {
          it('returns 422', function(done) {
            authorizedRequest
            .send({name: 'Argentina', cityName: 'ARG', gmtOffset: 'xzy'})
            .end(function(err, res) {
              if (err) done(err);
              expect(res.status).to.equal(422);
              done();
            });
          });
        });

        describe('with out of range offset number', function() {
          it('returns 422', function(done) {
            authorizedRequest
            .send({name: 'Argentina', cityName: 'ARG', gmtOffset: '20'})
            .end(function(err, res) {
              if (err) done(err);
              expect(res.status).to.equal(422);
              done();
            });
          });
        });
      });


      describe('Destroy', function() {

        describe('with a non-existing id', function() {
          it('returns 404', function(done) {
            request.del(url + '/time-zones/112313')
            .auth('rafael', 'chiti')
            .end(function(err, res) {
              if(err) done(err);
              expect(res.status).to.equal(404);
              done();
            });
          });
        });

        describe('with a valid id of the current user', function() {
          var timeZoneId = null;

          beforeEach(function(done) {
            User.findOne({username: 'rafael'}, function(err, user) {
              if (err) done(err);
              TimeZone.create({
                name: 'Buenos Aires',
                cityName: 'BUE',
                gmtOffset: -4,
                userId: user._id
              }, function(err, timeZone) {
                if (err) done(err);
                timeZoneId = timeZone._id;
                done();
              })
            });
          });

          afterEach(function(done) {
            TimeZone.remove({_id: timeZoneId}, function(err) {
              if (err) done(err);
              done();
            });
          });

          it('returns 200', function(done) {
            request.del(url + '/time-zones/' + timeZoneId)
            .auth('rafael', 'chiti')
            .end(function(err, res) {
              if (err) done(err);
              expect(res.status).to.equal(200);
              done();
            });
          });
        });
      });


    });
  });
});
