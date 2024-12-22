const logger = require('./logger')

// define a middleware function
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// error handle middleware
const errorHandler = (error, request, response, next) => {
  // log the error
  logger.error('errorHandler:', error.message)

  // handle a specified error
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  // pass the error forward
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
