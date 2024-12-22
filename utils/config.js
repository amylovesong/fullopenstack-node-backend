require('dotenv').config() // import dotenv to enable access env variables

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
    MONGODB_URI,
    PORT
}
