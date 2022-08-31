const express = require('express')
const app = express()
const cors = require('cors')
const fs = require('fs');

app.use(cors())
app.use(express.json())

const fileName = './posts.json'
const data = require('./posts.json')


app.get('/', (req, res) => {
    res.send('Hello World')
})

//posts functions

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
    const emojiCount = [{"up":0, "down": 0, "favourite": 0}];
    const comments = [];


    let newPost = {id: newPostId, title: newTitle, description: newDesc, content: newContent, gif: newGif, emojiCount: emojiCount, comments: comments}

    // {"id": "newPostId", "title": "newTitle", "description": "newDesc", "content": "newContent", "gif": "newGif"}

    data.posts.push(newPost)
    
    fs.writeFile(fileName, JSON.stringify(data, null, 2), function writeJSON(err) {
      if (err) return console.log(err);
      console.log(JSON.stringify(data, null, 2));
      console.log('writing to ' + fileName);
    });

    res.status(201).send(newPost)

})

app.delete('/posts/:id', (req, res) => {
  
  const postIdx = parseInt(req.params.id) -1

  data.posts.splice(postIdx,1)

  fs.writeFile(fileName, JSON.stringify(data, null, 2), function writeJSON(err) {
    if (err) return console.log(err);
    console.log(JSON.stringify(data, null, 2));
    console.log('writing to ' + fileName);
  });

  res.status(204).send();
})

//comments functions

app.get('/posts/:id/comments', (req, res) => {

    res.json(data.posts[req.params.id-1].comments)
    
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

  fs.writeFile(fileName, JSON.stringify(data, null, 2), function writeJSON(err) {
    if (err) return console.log(err);
    console.log(JSON.stringify(data, null, 2));
    console.log('writing to ' + fileName);
  });

  res.status(201).send(newComment)

})

app.delete('/posts/:postId/comments/:commentId', (req, res) => {
  
  const postIdx = parseInt(req.params.postId) - 1
  const commentIdx = parseInt(data.posts[postIdx].comments[req.params.commentId-1])

  data.posts[postIdx].comments.splice(commentIdx,1)

  fs.writeFile(fileName, JSON.stringify(data, null, 2), function writeJSON(err) {
    if (err) return console.log(err);
    console.log(JSON.stringify(data, null, 2));
    console.log('writing to ' + fileName);
  });

  res.status(204).send();
})

//emoji functions

app.get('/posts/:id/emojis', (req, res) => {

  res.json(data.posts[req.params.id-1].emojis)
  
})


app.post('/posts/:postId/emojis/:emojiId', (req, res) => {
  
  let count = data.posts[req.params.postId-1].emojis[0];
  const emojiId = req.params.emojiId;

if (emojiId === 'up' || emojiId === 'down' || emojiId == 'favourite') {
  
  if (emojiId === 'up') {

    count.up += 1
    
  } else if (emojiId === 'down') {

    count.down += 1 
  
  } else if (emojiId === 'favourite') {

    count.favourite += 1

  }
} else {
    res.status(404).send({error: `Choose a between [up, down or favourite]`})
  }

  fs.writeFile(fileName, JSON.stringify(data, null, 2), function writeJSON(err) {
    if (err) return console.log(err);
    console.log(JSON.stringify(data, null, 2));
    console.log('writing to ' + fileName);
  });

  res.status(201).send(count)

})

module.exports = app;
