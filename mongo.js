const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2] // access command line parameter

const url = `mongodb+srv://amylovesong:${password}@cluster-fullstackopen.kfrpj.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster-fullstackopen`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is easy',
  important: true
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})