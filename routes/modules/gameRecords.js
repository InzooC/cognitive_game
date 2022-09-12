const express = require('express')
const router = express.Router()
const gameRecordsController = require('../../controller/game-record')

router.post('/cglevelone', gameRecordsController.cardGameLevelOne)
router.post('/cgleveltwo', gameRecordsController.cardGameLevelTwo)


module.exports = router