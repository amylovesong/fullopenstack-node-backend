const express = require('express') // express is a function
const app = express()

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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
