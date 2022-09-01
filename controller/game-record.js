const db = require('../models')
const GameRecord = db.GameRecord
const GameLevel = db.GameLevel
const Game = db.Game
const Level = db.Level


const gameRecordsController = {
  cardGameLevelOne: async (req, res, next) => {
    console.log('成功到cardGameLevelOne')
    try {
      const cardGame = await Game.findOne({ where: { game_name: 'Match 10 Card Game' } })
      const level = await Level.findOne({ where: { level_name: 'level1' } })
      const gameLevel = await GameLevel.findOne({
        where: {
          game_id: cardGame.toJSON().id,
          level_id: level.toJSON().id
        }
      })
      const userId = req.user.id
      const record = await GameRecord.create({
        point: 50, // !還沒有用fetch成功傳point進來       
        userId,
        gameLevelId: gameLevel.toJSON().id
      })
      console.log('成功創建level1紀錄')
    } catch (err) {
      next(err)
    }
  },
  cardGameLevelTwo: async (req, res, next) => {
    console.log('成功到cardGameLevelTwo')
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
      const record = await GameRecord.create({
        point: 100, // !還沒有用fetch成功傳point進來       
        userId,
        gameLevelId: gameLevel.toJSON().id
      })
      console.log('成功創建level2紀錄')
    } catch (err) {
      next(err)
    }
  }

}

module.exports = gameRecordsController