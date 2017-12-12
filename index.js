const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const morgan = require('morgan')

const routes = require('./routes')
const PORT = process.env.PORT || 5000

const app = express()
app
  .use(bodyParser.urlencoded({extended: false }))
  .use(bodyParser.json())
  .use(morgan('dev'))
  .use(express.static(path.join(__dirname, 'public')))
  .use('/api', routes)
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
