const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  const levelone = {
    trail: 5,
    point: 6
  }



  res.render('home', { levelone })
})


module.exports = router