const db = require('../models')
const GameRecord = db.GameRecord
const GameLevel = db.GameLevel
const Game = db.Game
const Level = db.Level


const gameRecordsController = {
  cardGameLevelOne: async (req, res, next) => {
    try {
      //! 是否可用關聯簡化？
      const cardGame = await Game.findOne({ where: { game_name: 'Match 10 Card Game' } })
      const level = await Level.findOne({ where: { level_name: 'level1' } })
      const gameLevel = await GameLevel.findOne({
        where: {
          game_id: cardGame.toJSON().id,
          level_id: level.toJSON().id
        }
      })
      const userId = req.user.id
      const body = req.body
      const record = await GameRecord.create({
        userId,
        point: Number(body.score),
        duration: Number(body.duration),
        gameLevelId: gameLevel.toJSON().id
      })
      console.log('成功創建level1紀錄')
    } catch (err) {
      next(err)
    }
  },
  cardGameLevelTwo: async (req, res, next) => {
    try {
      const cardGame = await Game.findOne({ where: { game_name: 'Match 10 Card Game' } })
      const level = await Level.findOne({ where: { level_name: 'level2' } })
      const gameLevel = await GameLevel.findOne({
        where: {
          game_id: cardGame.toJSON().id,
          level_id: level.toJSON().id
        }
      })
      const userId = req.user.id
      const body = req.body
      const record = await GameRecord.create({
        userId,
        point: Number(body.score),
        duration: Number(body.duration),
        gameLevelId: gameLevel.toJSON().id
      })
      console.log('成功創建level2紀錄')
    } catch (err) {
      next(err)
    }
  }

}

module.exports = gameRecordsController