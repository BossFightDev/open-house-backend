const express = require('express')
const router = express.router()

router.get('/listings', (req, res) => {
  res.send({ Success: 'clap clap'})
})

module.exports = router