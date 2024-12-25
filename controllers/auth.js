const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs')
})

router.post('/sign-up', async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username })
  if (userInDatabase) {
    return res.render('auth/sign-up.ejs')
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.render('auth/sign-up.ejs')
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  const newUser = new User({
    username: req.body.username,
    password: hashedPassword
  })
  await newUser.save()
  res.redirect('/auth/sign-in')
})

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs')
})

router.post('/sign-in', async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username })
  if (!userInDatabase) {
    return res.render('auth/sign-in.ejs')
  }

  const validPassword = await bcrypt.compare(
    req.body.password,
    userInDatabase.password
  )
  if (!validPassword) {
    return res.render('auth/sign-in.ejs')
  }

  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id
  }
  res.redirect('/')
})

router.get('/sign-out', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
})

module.exports = router
