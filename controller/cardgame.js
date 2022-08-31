const cardGameController = {
  getlevelOne: async (req, res, next) => {
    try {
      const user = req.user
      res.render('cardgame-levelone', { user })
    } catch (err) {
      next(err)
    }
  },
  getlevelTwo: async (req, res, next) => {
    try {
      const user = req.user
      res.render('cardgame-levelTwo', { user })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = cardGameController