const cardGameController = {
  getlevelOne: async (req, res, next) => {
    try {
      res.render('cardgame-levelone')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = cardGameController