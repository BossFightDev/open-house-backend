const express = require('express')
const cloudinary = require('cloudinary')

const { cloudName, apiKey, apiSecret } = require('./config')
const { Property, Lead, OpenHouse, User } = require('./models')

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
})

const router = express.Router()

router.get('/listings', (req, res) => {
  res.send({ Success: 'clap clap'})
})
router.post('/user', (req, res) => {
  const {firstname, lastname, username, password, phonenumber, company }
})
router.post('/picture', (req, res)=> {
  cloudinary.uploader.upload(req.body.file, (result) => {
    console.log(result);
  })
})

module.exports = router