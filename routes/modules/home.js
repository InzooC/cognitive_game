const express = require('express')
const router = express.Router()
const db = require('../../models')
const User = db.User
const GameRecord = db.GameRecord
const GameLevel = db.GameLevel
const Level = db.Level
const Game = db.Game
const sequelize = db.sequelize

// 輸出trail&point的函式
function outputData(dataArr) {
  let trail = dataArr.length
  let pointCount = 0
  dataArr.forEach(e => {
    pointCount += Number(e.point)
  })
  return { trail: trail, pointCount: pointCount }
}

router.get('/', async (req, res, next) => {
  try {
    const user = req.user
    //! 是否可用關聯簡化？
    const cardGame = await Game.findOne({ where: { game_name: 'Match 10 Card Game' } })
    const level = await Level.findOne({ where: { level_name: 'level1' } })
    const gameLevel = await GameLevel.findOne({
      where: {
        game_id: cardGame.toJSON().id,
        level_id: level.toJSON().id
      },
      nest: true,
      raw: true
    })

    const leveloneRawData = await GameRecord.findAll({
      where: {
        user_id: user.id,
        game_level_id: gameLevel.id
      },
      attributes: ['id', 'point', 'userId', 'gameLevelId', 'createdAt'
        // [sequelize.literal('(SELECT COUNT(*) FROM GameRecords WHERE game_level_id = gameLevel)'), 'trailCount']  //!之後優化再直接撈次數
      ],
      nest: true,
      raw: true
    })
    // console.log('levelonedata', levelonedata)

    const data = outputData(leveloneRawData)
    console.log('data', data)
    res.render('home', { data })

  } catch (err) {
    next(err)
  }

})


module.exports = router