const config = require('./utils/config')
const express = require('express') // express is a function
require('express-async-errors')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors()) // allow cross-origin resource sharing
app.use(express.static('dist')) // make Express show static content in the 'dist' directory
app.use(express.json()) // activate the Express json-parser. This must be here before the routers otherwise the request.body is undefined
app.use(middleware.requestLogger)

// the router is used if the URL starts with '/api/notes'
app.use('/api/notes', notesRouter)

// use middleware after routes
app.use(middleware.unknownEndpoint)
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(middleware.errorHandler)

module.exports = app
