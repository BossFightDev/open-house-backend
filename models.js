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
  MLS: Number,
})

const LeadSchema = new Schema({
  name: {
    required: true,
    type: String,
  },
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
  date: {
    required: true,
    type: Date,
  },
  guests:{
    type: Number,
  },
  image: {
    required: true,
    type: String,
  },
  phoneQ:{
    required: trues,
    type: Boolean,
  },
  agentQ: {
    required: true,
    type: Boolean,
  },
  sourceQ: {
    required: true,
    type: Boolean,
  },
  suggestQ: {
    required: true,
    type: Boolean,
  },
  imageQ: {
    required: true,
    type: Boolean,
  },
  priceQ: {
    required: true,
    type: Boolean,
  },
  bedBathQ: {
    required: true,
    type: Boolean,
  },
  sqftQ: {
    required: true,
    type: Boolean,
  },
  hashtagQ: {
    required: true,
    type: Boolean,
  },
  hashtags:[String],
  leads: [{
    type: Schema.Types.ObjectId,
    ref: "Lead"
  }]
})

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  username: {
    required: true,
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: Number,
  company: String,
  companyPicture: String,
  email: String,
  openHouses: [{
    type: Schema.Types.ObjectId,
    ref: "OpenHouse"
  }]
})

Property = mongoose.model("Property", PropertySchema)
Lead = mongoose.model("Lead", LeadSchema)
OpenHouse = mongoose.model("OpenHouse", OpenHouseSchema)
User = mongoose.model("User", UserSchema)

module.exports = {
  Property,
  Lead,
  OpenHouse,
  User
}