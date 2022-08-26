const request = require('supertest')
const app = require('../app')

describe('api server', () => {

    let api

    beforeAll(() => {
        api = app.listen(5000, () => {
            console.log('Test is running on port 5000')
        })
    })

    afterAll((done) => {

        console.log('Stopping test server')
        api.close(done);
    })

    it('It responds to get / with 200 status', (done) => {

        request(api)
          .get ('/')
          .expect(200,done)
    })

    it('It responds to get /posts with 200 status', (done) => {

        request(api)
            .get('/posts')
            .expect(200,done)
    })

    it('It responds to get /posts/:id with 200 status', (done) => {
        request(api)
            .get('/posts/1')
            .expect(200)
            .expect({
                "id": "1",
                "message": "Hello World"
            }, done)
    })
})
