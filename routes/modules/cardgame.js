const express = require('express')
const router = express.Router()
const cardGameController = require('../../controller/cardgame-levelone')

router.get('/levelone', cardGameController.getlevelOne)


module.exports = router