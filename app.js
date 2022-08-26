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

module.exports = app;
