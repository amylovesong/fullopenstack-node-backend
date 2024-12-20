require('dotenv').config() // import dotenv to enable access env variables
const express = require('express') // express is a function
const cors = require('cors')
const app = express()
// import the defined Note model
const Note = require('./models/note')

app.use(cors()) // allow cross-origin resource sharing
app.use(express.static('dist')) // make Express show static content in the 'dist' directory
app.use(express.json()) // activate the Express json-parser. This must be here before the routers otherwise the request.body is undefined

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

app.get('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  Note.findById(id)
    .then(note => {
      if (note) { // all JavaScript objects are truthy
        response.json(note)  
      } else {
        response.status(404).end() // custom status code and return to the request sender
      }      
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  Note.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error)) // pass exceptions onto the error handler
})

app.post('/api/notes', (request, response, next) => {
  console.log('request.headers', request.headers);
  // if the request headers' Content-Type is not 'application/json'，the request.body will be a empty JSON：'{}'
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important
  }

  // By default, the updatedNote receives the original document without the modifications.
  // Add the optional { new: true } parameter will cause the event handler to be called
  // with the new modified document instead of the original
  // Validations are not run by default when findByIdAndUpdate and related methods are executed, so modify the code like this:
  const options = { new: true, runValidators: true, context: 'query' }
  Note.findByIdAndUpdate(request.params.id, note, options)
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// use middleware after routes
app.use(unknownEndpoint)

// error handle middleware
const errorHandler = (error, request, response, next) => {
  // log the error
  console.error('errorHandler:', error.message)

  // handle a specified error
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message})
  }
  
  // pass the error forward
  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.POST
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
