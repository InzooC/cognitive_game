const express = require('express')
const router = express.Router()

router.get('/home', (req, res) => {
  res.render('admin/admin-home')
})


module.exports = router