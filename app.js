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
        res.send(data.posts[req.params.id-1])
       
    } else {
            res.status(404).send({error: `Choose a number between 1 and ${data.length}`})
        }
    })

app.post('/posts', (req, res) => {

    const newMessage = req.body.message
    const newPostId = (parseInt(data.posts[data.posts.length - 1].id)+1).toString()

    let newPost = {id: newPostId, message: newMessage}

    data.posts.push(newPost)

    res.status(201).send(newPost)

})

module.exports = app;
