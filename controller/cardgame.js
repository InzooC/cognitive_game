const cardGameController = {
  getlevelOne: async (req, res, next) => {
    try {
      const user = req.user
      const cgLevelOne = true
      res.render('cardgame-levelone', { user, cgLevelOne })
    } catch (err) {
      next(err)
    }
  },
  getlevelTwo: async (req, res, next) => {
    try {
      const user = req.user
      const cgLevelTwo = true
      res.render('cardgame-levelTwo', { user, cgLevelTwo })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = cardGameController