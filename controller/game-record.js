const db = require('../models')
const GameRecord = db.GameRecord
const GameLevel = db.GameLevel
const Game = db.Game
const Level = db.Level

const gameRecordsController = {
  matchTenCardGame: async (req, res, next) => {
    try {
      const userId = req.user.id
      const body = req.body
      const level = 'level' + body.level
      console.log('level', level)
      //! 是否可用關聯簡化？
      const cardGame = await Game.findOne({ where: { game_name: 'Match 10 Card Game' } })
      const levelId = await Level.findOne({ where: { level_name: level } })
      const gameLevel = await GameLevel.findOne({
        where: {
          game_id: cardGame.toJSON().id,
          level_id: levelId.toJSON().id
        }
      })
      const record = await GameRecord.create({
        userId,
        point: Number(body.score),
        duration: Number(body.duration),
        gameLevelId: gameLevel.toJSON().id
      })
      console.log(`成功創建${level}紀錄`)
    } catch (err) {
      next(err)
    }
  }

}

module.exports = gameRecordsController