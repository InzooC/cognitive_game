const express = require('express')
const router = express.Router()

router.get('/admin', (req, res) => {
  res.render('admin-login')
})

router.get('/user', (req, res) => {
  res.render('login')
})


module.exports = router