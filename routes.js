const express = require('express')
const router = express.Router()

router.get('/listings', (req, res) => {
  res.send({ Success: 'clap clap'})
})

module.exports = router