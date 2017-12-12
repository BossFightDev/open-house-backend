const express = require('express')
const { Lead } = require('./models')

const router = express.Router()

router.get('/listings', (req, res) => {
  res.send({ Success: 'clap clap'})
})

module.exports = router