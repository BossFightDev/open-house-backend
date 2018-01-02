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

const sendUserError = (err, res) => {
  res.status(422);
  if (err && err.message) {
    res.json({
      message: err.message,
      stack: err.stack,
    });
    return
  }
  res.json(err);
}

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

router.post('/findProperty', (req, res) => {
  const { MLS } = req.body
  Property.findOne({ MLS }, (error, property) => {
    if(error) {
      console.log(error)
      return
    }
    console.log(`***Successful property search***`)
    res.send({property})
  })
})

router.post('/user', (req, res) => {
  const {firstName, lastName, username, password, phoneNumber, company } = req.body
  const companyPicture = 'http://res.cloudinary.com/bossfight/image/upload/v1513200109/ybknnlqfa0pmwaztokcc.jpg'
  const newUser = new User({firstName, lastName, username, password, phoneNumber, company, companyPicture })
  newUser.save((error, user) => {
    if (error) {
      console.log(error);
      res.status(422)
      return
    }
    console.log(`***User added: ****${JSON.stringify(user)}`)
  })
})

router.post('/login', (req, res) => {
  const { username, password } = req.body
  if (password === "") {
    sendUserError("Please input a valid password", res);
    return;
  }
  User.findOne({username})
    .populate({
      path: 'openHouses',
      // Get friends of friends - populate the 'friends' array for every friend
      populate: { 
        path: 'property',
        model: 'Property'
      }
    })
    .exec((error, user)=> {
      if (error) {
        console.log(error);
        res.status(422)
        return
      }
      console.log({user})
      user.password === password ? res.send(user) : res.send({err: 'Please use correct credentials'})
    })

})

router.post('/photo', (req,res) => {
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
      Property.findOne({MLS}, (error, property)=> {
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
  const { address, beds, baths, sqft, price, MLS } = req.body
  const images = [];

  const newProperty = new Property({address, beds, baths, sqft, price, images, MLS})
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
  Property.findOne({MLS}, (error, property) => {
    if(error){
      console.log(`***PropertyPicError: *** ${error}`);
      return
    }
    res.json({images: property.images})
  })
})

router.post('/newOpenHouse', (req, res)=> {
  const { uId, id, date, image, phoneQ,
          agentQ, sourceQ, suggestQ, imageQ,
          priceQ, bedBathQ, sqftQ,
          hashtagQ, hashtags} = req.body
  const leads = []
  const guests = 0
  console.log(`id`)
  const property = id
  console.log(`PROPERTY: ${property}`)
  const newOpenHouse = new OpenHouse({ 
    date, guests, image, phoneQ,
    agentQ, sourceQ, suggestQ, imageQ,
    priceQ, bedBathQ, sqftQ,
    hashtagQ, hashtags, leads})
    newOpenHouse.property = id
  newOpenHouse.save((error, openHouse)=> {
    if(error) {
      res.status(422)
      console.log(`***newOpenHouseError: *** ${error}`);
      return
    }
    res.send({openHouse})
    User.findOne({id: uId}, (err, user) => {
      if(err) {
        res.status(422)
        console.log(`***Trouble finding user: *** ${err}`)
        return
      }
      user.openHouses.push(openHouse.id)
      user.save((e, user)=> {
        if(e) {
          res.status(422)
          console.log(`error saving user in newOpenHouse: ${e}`)
          return;
        }
        console.log(user.openHouses)
      })
    })
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
      if(!openHouse.guests) openHouse.guests = 1
      else{
      let { guests } = openHouse
        console.log('guests ' + openHouse.guests)
        guests++
        openHouse.guests = guests;
      }
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
  const { uID } = req.body
  User.findOne({id: uID})
  .populate({
    path: 'openHouses',
    // Get friends of friends - populate the 'friends' array for every friend
    populate: { 
      path: 'leads',
      model: 'Lead'
    }
  })
    .exec((error, user)=> {
      if(error) {
        console.log(`Error in finding leads: ${error}`);
        return
      }
      res.json({user})
    })
})

module.exports = router