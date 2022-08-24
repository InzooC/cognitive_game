const express = require('express')
const router = express.Router()
const login = require('./modules/login')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')

router.use('/login', login)

// router.get('/admin/home', (req, res) => {
//   res.render('admin-home')
// })

router.get('/admin/home', authenticated, authenticatedAdmin, (req, res) => {
  res.render('admin-home')
})


router.get('/', authenticated, authenticatedUser, (req, res) => {
  res.render('home')
})

router.use('/', generalErrorHandler)

module.exports = router