const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

// access database url from the local .env file
const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)    
  })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean
})

// modify the toJSON method to format the objects returned by database
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    console.log('transform before --> ', returnedObject)
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    console.log('transform after <--', returnedObject)
  }
})

// create Note model and export it
module.exports = mongoose.model('Note', noteSchema)
