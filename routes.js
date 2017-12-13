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
  res.send({ Success: 'clap clap'})
})
router.post('/user', (req, res) => {
  const {firstname, lastname, username, password, phonenumber, company } = req.body
})
router.post('/photo', function(req,res){
	upload(req, res, function(err){		
		if(err){
      console.log(`Err: ${err}`)
      return res.end("Error")};
		console.log(req);
		res.end("file uploaded")

		cloudinary.config({ 
	      cloud_name, 
	      api_key, 
	      api_secret
	    })

    cloudinary.uploader.upload(req.file.path, function(result) { 
      console.log(result);
        // //create an urembo product
        // var photo = new Photo();
        //   photo.name = req.body.name;
        //   photo.picture = result.url;
        //   photo.place = req.body.place;
        //   photo.city = req.body.city;
        // //save the product and check for errors
        // photo.save(function(err, photos){
        //   if(err) 
        //     res.send(err);
        //   res.json({ message: 'photographed place created.'});
        //   console.log(photos);
        // });
    })

   })	
})

module.exports = router