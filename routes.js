const express = require('express')
const cloudinary = require('cloudinary')
const multer = require('multer')
let config
!process.env.CNAME? config = require('./config') : null
const { Property, Lead, OpenHouse, User } = require('./models')
const cloud_name = process.env.CNAME || config.cloudName
const api_key = process.env.APIKEY || config.apiKey
const api_secret = process.env.APISECRET || config.apiSecret

// cloudinary.config({
//   cloud_name,
//   api_key,
//   api_secret,
// })

const upload = multer({ dest : './public/uploads'}).single('photo')

const router = express.Router()

router.get('/listings', (req, res) => {
  Property.find({}, (error, properties) => {
    if(error) {
      console.log(error)
      return
    }
    res.send({properties})
  })
})

router.post('/user', (req, res) => {
  const {firstName, lastName, username, password, phoneNumber, company } = req.body
  const companyPicture = ''
  const newUser = new User({firstname, lastname, username, password, phonenumber, company, companyPicture })
  newUser.save((error, user) => {
    if (error) {
      console.log(error);
      res.status(422)
      return
    }
    console.log(`***User added: ****${JSON.stringify(user)}`)
  })
})
router.post('/photo', function(req,res){
  const { MLS } = req.body
	upload(req, res, function(err){	
		if(err){
      console.log(`Err: ${err}`)
      return res.end("Error")};
		// console.log(req);
		// res.end("file uploaded")

		cloudinary.config({ 
	      cloud_name, 
	      api_key, 
	      api_secret
	    })

    cloudinary.uploader.upload(req.file.path, function(result) { 
      console.log(result);
      res.send(result)
      Property.findOne({id: MLS}, (error, property)=> {
        if(error) {
          res.status(422)
          console.log({error})
          return
        }
        property.images.push(result.uri)
        property.save((e, prop) => {
          if(e){
            console.log({e})
            return
          }
          console.log(`***Saved Property w/image: *** ${prop}`)
        })
      })
    })
   })	
})
router.post('/property', (req, res) => {
  const { address, beds, baths, sqft, price } = req.body
  const images = [];

  const newProperty = new Property({address, beds, baths, sqft, price, images})
  newProperty.save((error, property) => {
    if (error) {
      console.log(error);
      res.status(422)
      return
    }
    console.log(`***Property added: ****${JSON.stringify(property)}`);
  })
})
router.post('/propertypic', (req,res) => {
  const { MLS } = req.body
  Property.findOne({id: MLS}, (error, property) => {
    if(error){
      console.log(`***PropertyPicError: *** ${error}`);
      return
    }
    res.json({images: property.images})
  })
})

router.post('/newOpenHouse', (req, res)=> {
  const { MLS, date, image, phoneQ,
          agentQ, sourceQ, imageQ,
          priceQ, bedBathQ, squareftQ,
          hashtagQ, hashtags} = req.body
  const leads = []
  const property = MLS
  const newOpenHouse = new OpenHouse({ 
    property, date, image, phoneQ,
    agentQ, sourceQ, imageQ,
    priceQ, bedBathQ, sqftQ,
    hashtagQ, hashtags, leads})
  newOpenHouse.save((error, openHouse)=> {
    if(error) {
      res.status(422)
      console.log(`***newOpenHouseError: *** ${error}`);
    }
    res.send({openHouse})
  })
})

router.post('/addlead', (req, res) => {
  const {openHouseId, name, email, phone, agent, source } = req.body
  const newLead = new Lead({ name, email, phone, agent, source })
  OpenHouse.findOne({id: openHouseId}, (error, openHouse) => {
    if(error) {
      console.log(`***Error in addlead: *** ${error}`);
      return
    }
    newLead.save((err, lead)=> {
      if(err){
        console.log(`***addlead save error: ${err}**`);
        return
      }
      openHouse.leads.push(lead.id)
      openHouse.save((e, openhouse) => {
        if(e){
          console.log(`***Error in saving openHouse: ${e}***`);
          return
        }
        console.log(`***Saved OpenHouse: ${openhouse}`);
      })
    })
  })
})
router.post('/openhouses', (req, res) => {
  const { userId } = req.body
  User.findOne({id: userId})
    .populate('openHouses')
    .exec((error, user)=> {
      if(error) {
        console.log(`Error in finding openhouses: ${error}`);
        return
      }
      res.send({openhouses: user.openhouses})
    })
})

router.post('/leads', (req, res) => {
  const { openHouseId } = req.body
  OpenHouse.findOne({id: openHouseId})
    .populate('leads')
    .exec((error, openHouse)=> {
      if(error) {
        console.log(`Error in finding leads: ${error}`);
        return
      }
      res.json({leads: openHouse.leads})
    })
})

module.exports = router