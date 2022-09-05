const express = require('express')
const router = express.Router()
const adminController = require('../../controller/admin')

router.get('/home', adminController.HomePage)
router.get('/addMember', adminController.addMemberPage)
router.post('/addMember', adminController.addMember)
router.get('/addMember', adminController.confirmNewMember)


module.exports = router