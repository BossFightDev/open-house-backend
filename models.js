const mongoose = require('mongoose')
const Schema = mongoose.Schema
let config = ''
!process.env.MONGO? config = require('./config') : process.env.MONGO
const mongo = process.env.MONGO || config.mongoURL

mongoose.Promise = Promise
mongoose.connect(mongo, {useMongoClient: true})

const LeadSchema = new Schema({
  name: String,
  email: String,
  phone: Number,
  agent: String,
  source: String
})

Lead = mongoose.model("Lead", LeadSchema)

module.exports = {
  Lead,
}