const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash) // the password hash is saved to the database, so use the bcrypt.compare() to check if the password is correct

  if (!(user && passwordCorrect)) {
    return response.status(401).json({ // 401 means unauthorized
      error: !user ? `user '${username}' not existed` : 'invalid password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  // create the user token by jsonwebtoken.sign() and digitally signed using the env variable SECRET
  // the digital signature ensures that only parties who know the secret can generate a valid token
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    {
      expiresIn: 60 * 60 // unit: seconds
    }
  )

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
