const express = require('express')
const router = express.Router()
const adminController = require('../../controller/admin')

router.get('/home', adminController.homePage)
router.get('/addMember', adminController.addMemberPage)
router.post('/addMember', adminController.addMember)
router.get('/confirm/:account', adminController.confirmNewMember)
router.get('/edit/:account', adminController.editMemberPage)
router.put('/edit/:account', adminController.editMember)


module.exports = router