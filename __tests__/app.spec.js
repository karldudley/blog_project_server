const request = require('supertest')
const app = require('../app')

describe('api server', () => {

  let api

  let testPost = {
    "title": "newTitle",
    "description": "newDesc",
    "content": "newContent",
    "gif": "newGif"
  }

  let testComment = {"comment": "testComment"}

  beforeAll(() => {
      api = app.listen(5000, () => {
            console.log('Test is running on port 5000')
      })
  })
  afterAll((done) => {

        console.log('Stopping test server')
        api.close(done);
  })
  it('It responds to GET / with 200 status',(done) => {

        request(api)
          .get ('/')
          .expect(200,done)
  })

   it('It responds to GET /posts with 200status', (done) => {

        request(api)
            .get('/posts')
            .expect(200,done)
  })

  it('It retrieves a POST by id with 200 status', (done) => {
        request(api)
            .get('/posts/1')
            .expect(200)
            .expect({
              "id": "1",
              "title": "Hello World",
              "description": "text",
              "content": "text",
              "gif": "url",
              "comments": [
                  {
                    "id": "1",
                    "comment": "text"
                  },
                  {
                    "id": "2",
                    "comment": "text"
                  },
                  {
                    "id": "3",
                    "comment": "text"
                  }
                ]
            }, done)
  })

  it('It responds to INEXISTENT post with 404', (done) => {

    request(api)
    .get('/posts/50')
    .expect(404, done)
  })

   it('It responds to GET /posts/:id/comments with 200 status', (done) => {
     request(api)
         .get('/posts/1/comments')
         .expect(200,done)
          
  })

   it('It retrieves a comment by id with 200 status',(done) => {
     request(api)
        .get('/posts/1/comments/1')
         .expect(200)
         .expect({
                "id": "1",
                "comment": "text"
              }, done)
  })

  it('It responds to INEXISTENT comment with 404', (done) => {

    request(api)
    .get('/posts/1/comments/50')
    .expect(404, done)
  })

  it('It responds to POST /posts with status 201', (done) => {
    request(api)
    .post('/posts')
    .send (testPost)
    .set('Accept', /application\/json/)
    .expect(201)
    .expect({id: '4', ...testPost, comments: []},done)
  })

  it('It responds to POST /posts/:id/comments with status 201', (done) => {

    request(api)
    .post('/posts/2/comments')
    .send (testComment)
    .set('Accept', /application\/json/)
    .expect(201)
    .expect({id: '3', ...testComment},done)

  })

 it('It responds to DELETE /post/:id with status 204', (done) => {

    request (api)
    .delete('/posts/1')
    .expect(204,done)
 })

 it('It responds to DELETE /post/:id/comments/:id with status 204', (done) => {

  request (api)
  .delete('/posts/1/comments/1')
  .expect(204,done)
})

})
