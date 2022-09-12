const cardGameController = {
  getlevelOne: async (req, res, next) => {
    try {
      const user = req.user
      const cgLevelOne = true
      res.render('matchTenCardGame', { user, cgLevelOne })
    } catch (err) {
      next(err)
    }
  },
  getlevelTwo: async (req, res, next) => {
    try {
      const user = req.user
      const cgLevelTwo = true
      res.render('matchTenCardGame', { user, cgLevelTwo })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = cardGameController