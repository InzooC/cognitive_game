const express = require('express')
const router = express.Router()
const login = require('./modules/login')

router.use('/login', login)

router.get('/', (req, res) => {
  res.render('home')
})



module.exports = router