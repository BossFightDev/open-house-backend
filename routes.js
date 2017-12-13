const express = require('express')
const cloudinary = require('cloudinary')
let config
!process.env.CNAME? config = require('./config') : null
const { Property, Lead, OpenHouse, User } = require('./models')
const cloud_name = process.env.CNAME || config.cloudName
const api_key = process.env.APIKEY || config.apiKey
const api_secret = process.env.APISECRET || config.apiSecret

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
})

const router = express.Router()

router.get('/listings', (req, res) => {
  res.send({ Success: 'clap clap'})
})
router.post('/user', (req, res) => {
  const {firstname, lastname, username, password, phonenumber, company } = req.body
})
router.post('/picture', (req, res)=> {
  cloudinary.uploader.upload(req.body.file, (result) => {
    console.log(result);
  })
})

module.exports = router