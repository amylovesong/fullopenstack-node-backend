const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const Note = require('../models/note')

const app = require('../app')

// superagent object
const api = supertest(app)

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]

beforeEach(async () => {
  await Note.deleteMany({}) // clear out the database
  let noteObject = new Note(initialNotes[0])
  await noteObject.save()
  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})

test.only('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/) // the desired value is defined as regular expression or in short regex
})

test.only('there are two notes', async () => {
  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, initialNotes.length)
})

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(e => e.content)
  assert(contents.includes('HTML is easy'))
})

after(async () => {
  await mongoose.connection.close()
})
