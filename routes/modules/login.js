const express = require('express')
const router = express.Router()
const passport = require('passport')
const loginController = require('../../controller/login-controller')
const { generalErrorHandler } = require('../../middleware/error-handler')



router.get('/admin', loginController.adminLoginPage)
router.post('/admin', passport.authenticate('local', { failureRedirect: '/login/admin', failureFlash: true }), loginController.adminLogin)
router.get('/user', loginController.userLoginPage)
router.post('/user', passport.authenticate('local', { failureRedirect: '/login/user', failureFlash: true }), loginController.userLogin)

router.post('/logout', loginController.logout)

module.exports = router