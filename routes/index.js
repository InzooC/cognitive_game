const express = require('express')
const router = express.Router()
const login = require('./modules/login')
const admin = require('./modules/admin')
const cardGame = require('./modules/cardgame')
const gameRecords = require('./modules/gameRecords')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')

router.use('/login', login)

// router.get('/admin/home', (req, res) => {
//   res.render('admin-home')
// })

router.use('/admin', authenticated, authenticatedAdmin, admin)


router.use('/gamerecords', gameRecords)

router.use('/game/cardgame', authenticated, authenticatedUser, cardGame)
// router.use('/game/cardgame', cardGame)


router.get('/', authenticated, authenticatedUser, (req, res) => {
  res.render('home')
})

router.use('/', generalErrorHandler)

module.exports = router