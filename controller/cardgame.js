const cardGameController = {
  getCardGame: async (req, res, next) => {
    try {
      const cardGameLevel = Number(req.params.level)
      console.log('cardGameLevel', cardGameLevel)
      if (![1, 2, 3, 4].includes(cardGameLevel)) {
        res.redirect('/')
      }
      const user = req.user
      res.render('matchTenCardGame', { user, cardGameLevel })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = cardGameController