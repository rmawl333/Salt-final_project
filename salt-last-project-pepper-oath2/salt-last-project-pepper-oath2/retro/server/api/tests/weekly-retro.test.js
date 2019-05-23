const request = require('supertest');
const app = require('../../app');


describe('weekly-retro api', () => {
  test('GET /:teamId should respond with status 200', (done) => {
    request(app).get('/api/teams')
      .then((res) => {
        expect(res.type).toBe('application/json');
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  test('GET /:teamId/:postId should respond with status 200', (done) => {
    request(app).get('/api/teams')
      .then((res) => {
        expect(res.type).toBe('application/json');
        expect(res.statusCode).toBe(200);
        done();
      });
  });
});
