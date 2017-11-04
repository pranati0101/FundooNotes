var server=require('../server')
var chai=require('chai');
var expect=require('chai').expect;
var decribe=require('mocha').describe;
var request = require("request");
var mocha=require('mocha');
var chaiHttp = require('chai-http');
var should = chai.should();
var fs=require('fs');
var request = require('supertest');
chai.use(chaiHttp);

/**
 * create new note
 */
describe('should insert new document in cards collection in fundooDB', function(){
  //let's set up the data we need to pass to the login method
  const userCredentials = {
    email: 'pranati0101@gmail.com',
    password: 'Pranati0101'
  }
  //this test says: make a POST to the /login route with the email: sponge@bob.com, password: garyTheSnail
  //after the POST has completed, make sure the status code is 200
  //also make sure that the user has been directed to the /home pages
  //now let's login the user before we run any tests
  var authenticatedUser = request.agent(server);
  before(function(done){
    authenticatedUser
      .post('/loginLocal')
      .send(userCredentials)
      .end(function(err, response){
        expect(response.statusCode).to.equal(302);
        expect('Location', '/profile');
        done();
      });
  });
    it('should create new note', function(callback){
      chai.request(server)
          .post("/createCard")
          .send({
            title:"title1",
            text:"text1"
            })
          .end(function(err, res){
              res.should.have.status(302);
            callback();
          });
    });
});
