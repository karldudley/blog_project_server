const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

const data = require('./posts.json')


app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/posts', (req, res) => {
    res.json(data)
})

app.get('/posts/:id', (req, res) => {
    
    if (data.posts[req.params.id-1]) {
        res.json(data.posts[req.params.id-1])
       
    } else {
            res.status(404).send({error: `Choose a number between 1 and ${data.posts.length}`})
        }
    })


app.post('/posts', (req, res) => {

    const newPostId = (parseInt(data.posts[data.posts.length - 1].id)+1).toString();
    const newTitle = req.body.title;
    const newDesc = req.body.description;
    const newContent = req.body.content;
    const newGif = req.body.gif;
    const comments = [];


    let newPost = {id: newPostId, title: newTitle, description: newDesc, content: newContent, gif: newGif, comments: comments}

    // {"id": "newPostId", "title": "newTitle", "description": "newDesc", "content": "newContent", "gif": "newGif"}

    data.posts.push(newPost)

    res.status(201).send(newPost)

})

app.get('/posts/:id/comments', (req, res) => {


  if (data.posts[req.params.id-1].comments){
     
    res.json(data.posts[req.params.id-1].comments)
    
  } else {

    res.status(404).send({error: `Choose a number between 1 and ${data.posts.length}`})

  }

})

app.get('/posts/:postId/comments/:commentId', (req, res) => {

  if (data.posts[req.params.postId-1].comments[req.params.commentId-1]){
     
    res.json(data.posts[req.params.postId-1].comments[req.params.commentId-1])
    
  } else {

    res.status(404).send({error: `Choose a number between 1 and ${data.posts[req.params.postId-1].comments.length}`})

  }
})

app.post('/posts/:id/comments', (req, res) => {

  const newCommentId = (parseInt(data.posts[req.params.id-1].comments.length)+1).toString()
  const newCommentContent = req.body.comment;

  let newComment = {id: newCommentId, comment: newCommentContent}

  data.posts[req.params.id-1].comments.push(newComment)

    res.status(201).send(newComment)

})

app.delete('/posts/:id', (req, res) => {
  
  const post = data.posts[req.params.id-1];
  
  console.log(post)

  res.status(204).send();
})


module.exports = app;
