require('dotenv').config() // import dotenv to enable access env variables
const express = require('express') // express is a function
const cors = require('cors')
const app = express()
// import the defined Note model
const Note = require('./models/note')

app.use(cors()) // allow cross-origin resource sharing
app.use(express.static('dist')) // make Express show static content in the 'dist' directory
app.use(express.json()) // activate the Express json-parser

// define a middleware function
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
} 

// use the middleware above
app.use(requestLogger)

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get('/', (request, response) => {
  // automatically set Content-Type to text/html, and the status code is 200
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    // automatically set Content-Type to application/json, and the status code is 200
    // automatically transform notes array to JSON formatted string
    // automatically use the above defined toJSON when formatting notes array
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  Note.findById(id).then(note => {
    response.json(note)
  })

  // if (note) { // all JavaScript objects are truthy
  //   response.json(note)
  // } else {
  //   // response.status(404).end() // custom status code and return to the request sender
  //   response.status(404).send(`No note found for id: ${id}, please check it`)
  // }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id))) // mapping the notes to ids and finding out the largest number
    : 0 // '...' is the 'three dot' spread syntax
  
  return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
  console.log('request.headers', request.headers);
  // if the request headers' Content-Type is not 'application/json'，the request.body will be a empty JSON：'{}'
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ // code 400 means 'bad request'
      error: 'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// use middleware after routes
app.use(unknownEndpoint)

const PORT = process.env.POST
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
