const express = require('express')
const router = express.Router()
const gameRecordsController = require('../../controller/game-record')

router.post('/matchTenCardGame', gameRecordsController.matchTenCardGame)


module.exports = router