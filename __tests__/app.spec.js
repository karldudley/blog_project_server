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

  // test GET for Posts
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
              "emojis": [
                {
                  "up": 0,
                  "down": 0,
                  "favourite": 0
                }
              ],
              "comments": [{
                "id": "1",
                "comment": "text"
              }]
            }, done)
  })

  it('It responds to INEXISTENT post with 404', (done) => {

    request(api)
    .get('/posts/50')
    .expect(404, done)
  })

  //test GET for Comments
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

  // test POST for posts and comments
  it('It responds to POST /posts with status 201', (done) => {
    request(api)
    .post('/posts')
    .send (testPost)
    .set('Accept', /application\/json/)
    .expect(201)
    .expect({id: '3', ...testPost, emojis: [{up:0,down:0,favourite:0}], comments: []},done)
  })

  it('It responds to POST /posts/:id/comments with status 201', (done) => {

    request(api)
    .post('/posts/1/comments')
    .send (testComment)
    .set('Accept', /application\/json/)
    .expect(201)
    .expect({id: "2", ...testComment},done)

  })

  //test DELETE for Posts and Comments
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

//test GET and POST for Emojis

it('It responds to GET /posts/:id/emojis with 200 status', (done) => {

  request(api)
      .get('/posts/1/emojis')
      .expect(200,done)
})

it('It responds to POST /posts/:id/emojis/UP with status 201 and count = 1', (done) => {

    request(api)
    .post('/posts/1/emojis/up')
    .set('Accept', /application\/json/)
    .expect(201)
    .expect({
      "up": 1,
      "down": 0,
      "favourite": 0
    },done)
})

it('It responds to POST /posts/:id/emojis/DOWN with status 201 and count = 1', (done) => {

  request(api)
  .post('/posts/1/emojis/down')
  .set('Accept', /application\/json/)
  .expect(201)
  .expect({
    "up": 1,
    "down": 1,
    "favourite": 0
  },done)
})

it('It responds to POST /posts/:id/emojis/FAVOURITE with status 201 and count = 1', (done) => {

  request(api)
  .post('/posts/1/emojis/favourite')
  .set('Accept', /application\/json/)
  .expect(201)
  .expect({
    "up": 1,
    "down": 1,
    "favourite": 1
  },done)
})

it('It responds to inexistent POST emojis/:id with status 404', (done) => {

  request(api)
  .post('/posts/1/emojis/any')
  .set('Accept', /application\/json/)
  .expect(404, done)

})
})
