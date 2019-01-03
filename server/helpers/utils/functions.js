const jwt = require('jsonwebtoken')

const signToken = (user) => {
  return jwt.sign({ user }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRE })
}

module.exports = { signToken }
