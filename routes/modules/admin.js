const express = require('express')
const router = express.Router()
const adminController = require('../../controller/admin')
const cardGameScoreController = require('../../controller/cardgame-score')
const gameRecordsController = require('../../controller/game-record')

router.get('/home', adminController.homePage)
router.get('/addMember', adminController.addMemberPage)
router.post('/addMember', adminController.addMember)
router.get('/confirm/:account', adminController.confirmNewMember)
router.get('/edit/:account', adminController.editMemberPage)
router.put('/edit/:account', adminController.editMember)


router.get('/api/cgScore/:userId', cardGameScoreController.getCgLevelOneData)

router.get('/cgScore/:userId', cardGameScoreController.getCgScorePage)

module.exports = router