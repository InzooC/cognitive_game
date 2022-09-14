const express = require('express')
const router = express.Router()
const cardGameController = require('../../controller/cardgame')

router.get('/:level', cardGameController.getCardGame)


module.exports = router