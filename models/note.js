const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: { // a specific validation rules for 'content' field
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

// modify the toJSON method to format the objects returned by database
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // console.log('transform before --> ', returnedObject)
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // console.log('transform after <--', returnedObject)
  }
})

// create Note model and export it
module.exports = mongoose.model('Note', noteSchema)
