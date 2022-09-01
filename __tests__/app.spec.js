const request = require('supertest')
const app = require('../app')

describe('API server', () => {

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
  
  it('It responds to GET / with 200 status',(done) => {

        request(api)
          .get ('/')
          .expect(200,done)
  })

  describe('Test POSTS api', () => {

    let testPost = {
      "title": "newTitle",
      "description": "newDesc",
      "content": "newContent",
      "gif": "newGif"
    }

    
    it('It responds to GET /posts with 200status', (done) => {

        request(api)
            .get('/posts')
            .expect(200,done)
    })

    it('It retrieves a posts by id with 200 status', (done) => {
        request(api)
            .get('/posts/1')
            .expect(200)
            .expect({
              "id": "1",
              "title": "newTitle",
              "description": "newDesc",
              "content": "newContent",
              "gif": "newGif",
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
  
   it('It responds to GET /posts/:id with status 201 and first', (done) => {
  
    request (api)
    .delete('/posts/1')
    .expect(204,done)
    })

  it('It responds to POST /posts with status 201', (done) => {
    request(api)
    .post('/posts')
    .send (testPost)
    .set('Accept', /application\/json/)
    .expect(201)
    .expect({id: '3', ...testPost, emojis: [{up:0,down:0,favourite:0}], comments: []},done)
    })

    it('It responds to DELETE /post/:id with status 204', (done) => {

      request (api)
      .delete('/posts/1')
      .expect(204,done)
    })
})

  describe('Test COMMENTS api', () => {

    let testComment = {"comment": "testComment"}

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

   it('It responds to POST /posts/:id/comments with status 201', (done) => {

    request(api)
    .post('/posts/1/comments')
    .send (testComment)
    .set('Accept', /application\/json/)
    .expect(201)
    .expect({id: "2", ...testComment},done)

    })

    it('It responds to DELETE /post/:id/comments/:id with status 204', (done) => {

      request (api)
      .delete('/posts/1/comments/1')
      .expect(204,done)
    })
  })
 
  describe('Test EMOJIS api', () => {

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

    it('It responds to DELETE /posts/:id/emojis/up with status 204', (done) => {

      request(api)
      .delete('/posts/2/emojis/up')
      .set('Accept', /application\/json/)
      .expect(204,done)

    })

    it('It responds to DELETE /posts/:id/emojis/down with status 204', (done) => {

      request(api)
      .delete('/posts/2/emojis/down')
      .set('Accept', /application\/json/)
      .expect(204,done)

    })

    it('It responds to DELETE /posts/:id/emojis/favourite with status 204', (done) => {

      request(api)
      .delete('/posts/2/emojis/favourite')
      .set('Accept', /application\/json/)
      .expect(204,done)

    })

    it('It responds to inexistent DELETE emojis/:id with status 404', (done) => {
    
      request(api)
      .post('/posts/1/emojis/any')
      .set('Accept', /application\/json/)
      .expect(404, done)
    
    })
  })




})


