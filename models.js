const mongoose = require('mongoose')
const Schema = mongoose.Schema
let config = ''
!process.env.MONGO? config = require('./config') : process.env.MONGO
const mongo = process.env.MONGO || config.mongoURL

mongoose.Promise = Promise
mongoose.connect(mongo, {useMongoClient: true})


const PropertySchema = new Schema({
  address: String,
  beds: Number,
  baths: Number,
  sqft: Number,
  images: [String],
  price: Number,
})

const LeadSchema = new Schema({
  name: String,
  email: String,
  phone: Number,
  agent: String,
  source: String
})
const OpenHouseSchema = new Schema({
  property: {
    type: Schema.Types.ObjectId,
    ref: "Property"
  },
  date: Date,
  guests: Number,
  image: String,
  phoneq: Boolean,
  agentq: Boolean,
  sourceq: Boolean,
  imageq: Boolean,
  priceq: Boolean,
  bedbathq: Boolean,
  squareftq: Boolean,
  hashtagsq: Boolean,
  hashtags:[String],
  leads: [{
    type: Schema.Types.ObjectId,
    ref: "Lead"
  }]
})

const UserSchema = new Schema({
  firstname: String,
  lastname: String,
  username: String,
  password: String,
  phonenumber: Number,
  company: String,
  companypicture: String,
  email: String,
  openhouses: [{
    type: Schema.Types.ObjectId,
    ref: "OpenHouse"
  }]
})

Property = mongoose.model("Property", PropertySchema)
Lead = mongoose.model("Lead", LeadSchema)
OpenHouse = mongoose.model("OpenHouse", OpenHouseSchema),
User = mongoose.model("User", UserSchema)

module.exports = {
  Property,
  Lead,
  OpenHouse,
  User
}