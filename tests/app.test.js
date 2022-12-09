const app = require('../app');
const request = require('supertest');
describe('test',function(){
    let server = null;

    beforeEach(function(done){
        server = app.listen(0,function(err){
            if(err){ return done(err); }
            done();
        });
    });

    afterEach(function(){
        server.close();
    });

    it("Is Server Started !! 200 status",(done)=>{
        request(app)
            .get('/')
            .expect(200,done);
    });

    it("is /users working?",(done)=>{
        request(app)
            .get('/users')
            .expect(200)
            .expect('respond with a resource', done);
    });


});
