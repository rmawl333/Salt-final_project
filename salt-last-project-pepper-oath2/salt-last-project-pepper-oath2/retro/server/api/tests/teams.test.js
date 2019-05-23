const request = require('supertest');
const app = require('../../app');


describe('/api/teams', () => {

  test('Method should respond with status 200', (done) => {
    request(app).get('/api/teams')
      .then((res) => {
        expect(res.type).toBe('application/json');
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  test('/:teamId should respond with status 200', (done) => {
    request(app).get('/api/teams')
      .then((res) => {
        expect(res.type).toBe('application/json');
        expect(res.statusCode).toBe(200);
        done();
      });
  });


});
