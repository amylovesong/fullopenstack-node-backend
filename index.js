const express = require('express') // express is a function
const app = express()

app.use(express.json()) // activate the Express json-parser

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
  // automatically set Content-Type to application/json, and the status code is 200
  response.json(notes) // automatically transform notes array to JSON formatted string
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  if (note) { // all JavaScript objects are truthy
    response.json(note)
  } else {
    // response.status(404).end() // custom status code and return to the request sender
    response.status(404).send(`No note found for id: ${id}, please check it`)
  }
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

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  }
  console.log('request.body', note);

  notes = notes.concat(note)

  response.json(note)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
