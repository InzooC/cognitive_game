const express = require('express')
const router = express.Router()
const login = require('./modules/login')
const admin = require('./modules/admin')
const cardGame = require('./modules/cardgame')
const gameRecords = require('./modules/gameRecords')
const home = require('./modules/home')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')

router.use('/login', login)

router.use('/admin', authenticated, authenticatedAdmin, admin)

router.use('/gamerecords', gameRecords)

router.use('/game/cardgame', authenticated, authenticatedUser, cardGame)

router.use('/home', authenticated, authenticatedUser, home)

router.use('/', authenticated, authenticatedUser, (req, res) => {
  res.redirect('/home')
})
router.use('/', generalErrorHandler)

module.exports = router