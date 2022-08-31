const express = require('express')
const router = express.Router()
const cardGameController = require('../../controller/cardgame')

router.get('/levelone', cardGameController.getlevelOne)
router.get('/leveltwo', cardGameController.getlevelTwo)


module.exports = router