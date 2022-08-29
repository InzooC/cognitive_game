const db = require('../models')
const GameRecord = db.GameRecord


const gameRecordsController = {
  cardGameLevelOne: async (req, res, next) => {
    console.log('成功到cardGameLevelOne')
    try {
      const userId = req.user.id
      const record = await GameRecord.create({  //! 改一下創建紀錄的內容
        point: 50,
        userId: 18,
        gameLevelId: 34
      })
      console.log('成功創建紀錄')
    } catch (err) {
      next(err)
    }
  }

}

module.exports = gameRecordsController