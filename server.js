const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const methodOverride = require('method-override')
const session = require('express-session')
const passUserToView = require('./middleware/path-user-to-view')
const router = require('express').Router()
const morgan = require('morgan')
const mongoose = require('mongoose')
const port = process.env.port ? process.env.port : '4000'
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB: ', mongoose.connection.name)
})

//middleware
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
)

//Require controllers
const authCtrl = require('./controllers/auth')
const recipesCtrl = require('./controllers/recipes.js')
const ingredientsCtrl = require('./controllers/ingredients.js')
const isSignedIn = require('./middleware/is-signed-in')

app.use(passUserToView)
app.use('/auth', authCtrl)
app.use('/recipes', recipesCtrl)
app.use('/ingredients', ingredientsCtrl)

//port route
app.get('/', async (req, res) => {
  res.render('index.ejs')
})

app.listen(port, () => {
  console.log('Listening on port:', port)
})
module.exports = router
