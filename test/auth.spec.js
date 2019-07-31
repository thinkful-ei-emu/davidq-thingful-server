/* global supertest */
const app = require('../src/app');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const knex = require('knex');
const helpers = require('./test-helpers');



describe('Login behaves as expected',()=>{

  let db;

  const {
    testThings,
    testUsers,
  } = helpers.makeThingsFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));
  describe('when the username and password is correct',()=>{
    beforeEach('insert into db',()=>{
      helpers.seedThingsTables(
        db,
        testUsers,
        testThings
      );
    });
    it('response with a 200',()=>{
      return supertest(app).post('/api/login')
        .set({'Content-Type':'application/json'})
        .send({user_name:'dunder-mifflin',password:'password'})
        .expect(200); 
    });
    it('generates a valid token',()=>{
      return supertest(app).post('/api/login')
        .set({'Content-Type':'application/json'})
        .send({user_name:'dunder-mifflin',password:'password'})
        .expect(200);
    });
  });
  describe('when the info is wrong',()=>{
    let keys = ['user_name','password'];
    keys.forEach((key)=>{
      it(`reposnes 401 when ${key} is missing`,()=>{
        let auth = {user_name:'dunder-mifflin',password:'password'};
        delete auth[key];
        return supertest(app).post('/api/login')
          .set({'Content-type':'application/json'})
          .send(auth)
          .expect(401,{error:'your username or password is invalid'});
      });
    });
  });
});