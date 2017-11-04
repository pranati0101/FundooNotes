var server=require('../server')
var chai=require('chai');
var expect=require('chai').expect;
var decribe=require('mocha').describe;
var request = require("request");
var mocha=require('mocha');
var chaiHttp = require('chai-http');
var should = chai.should();
var fs=require('fs')
chai.use(chaiHttp);

/**
 * shows home page
 */
describe('indexPage api', function(){
    it('should display home page', function(callback){
      chai.request(server)
          .get("/home")
          .end(function(err, res){
              res.should.have.status(200);
              // console.log(res.body);
              // console.log(res.body.text);
              // res.body.should.be.a('html')
              // expect(res.render).to.be.true;
              // var rawPug = fs.readFileSync('./app/views/login.pug').toString();
              // console.log(res.text);
              // console.log(rawPug.convertToHtml(),"pug..");
              // res.body.should.equal(rawPug.pug());
            callback();
          });
    });
});
