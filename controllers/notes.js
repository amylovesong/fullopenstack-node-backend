const notesRouter = require('express').Router()
const logger = require('../utils/logger')
// import the defined Note model
const Note = require('../models/note')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  // automatically set Content-Type to notesRouterlication/json, and the status code is 200
  // automatically transform notes array to JSON formatted string
  // automatically use the above defined toJSON when formatting notes array
  response.json(notes)
})

notesRouter.get('/:id', (request, response, next) => {
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

notesRouter.post('/', async (request, response, next) => {
  logger.info('request.headers', request.headers)
  // if the request headers' Content-Type is not 'notesRouterlication/json'，the request.body will be a empty JSON：'{}'
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  // note.save()
  //   .then(savedNote => {
  //   })
  //   .catch(error => next(error))

  const savedNote = await note.save()
  response.status(201).json(savedNote)
})

notesRouter.delete('/:id', (request, response, next) => {
  const id = request.params.id
  Note.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error)) // pass exceptions onto the error handler
})

notesRouter.put('/:id', (request, response, next) => {
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

module.exports = notesRouter
