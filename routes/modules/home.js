const express = require('express')
const router = express.Router()
const { Op } = require("sequelize")
const db = require('../../models')
const User = db.User
const GameRecord = db.GameRecord
const GameLevel = db.GameLevel
const Level = db.Level
const Game = db.Game
const sequelize = db.sequelize

// 輸出各level的trail&point的函式
async function outputData(data) {

  const levelOneId = (await Level.findOne({ where: { level_name: 'level1' }, nest: true, raw: true })).id
  const levelTwoId = (await Level.findOne({ where: { level_name: 'level2' }, nest: true, raw: true })).id
  const levelThreeId = (await Level.findOne({ where: { level_name: 'level3' }, nest: true, raw: true })).id
  const levelFourId = (await Level.findOne({ where: { level_name: 'level4' }, nest: true, raw: true })).id

  const outPut = {
    levelOne: {
      trail: 0,
      pointCount: 0
    },
    levelTwo: {
      trail: 0,
      pointCount: 0
    },
    levelThree: {
      trail: 0,
      pointCount: 0
    },
    levelFour: {
      trail: 0,
      pointCount: 0
    },
    total: {
      trail: 0,
      pointCount: 0
    }
  }
  data.forEach(e => {
    switch (e.gameLevelId) {
      case levelOneId:
        outPut.levelOne.trail += 1
        outPut.levelOne.pointCount += Number(e.point)
        break
      case levelTwoId:
        outPut.levelTwo.trail += 1
        outPut.levelTwo.pointCount += Number(e.point)
        break
      case levelThreeId:
        outPut.levelThree.trail += 1
        outPut.levelThree.pointCount += Number(e.point)
        break
      case levelFourId:
        outPut.levelFour.trail += 1
        outPut.levelFour.pointCount += Number(e.point)
        break
    }
  })
  //! 可以再優化
  outPut.total.trail = (outPut.levelOne.trail + outPut.levelTwo.trail + outPut.levelThree.trail + outPut.levelFour.trail)
  outPut.total.pointCount = (outPut.levelOne.pointCount + outPut.levelTwo.pointCount + outPut.levelThree.pointCount + outPut.levelFour.pointCount)
  return outPut
}

router.get('/', async (req, res, next) => {
  try {
    const user = req.user
    const cardGame = await Game.findOne({ where: { game_name: 'Match 10 Card Game' }, nest: true, raw: true })
    const gameLevel = await GameLevel.findAll({
      where: {
        game_id: cardGame.id
      },
      nest: true,
      raw: true
    })
    const gameLevelIdArr = gameLevel.map(e => e.id)
    const cardGameRecords = await GameRecord.findAll({
      where: {
        user_id: user.id,
        game_level_id: {
          [Op.or]: gameLevelIdArr
        }
      },
      attributes: ['id', 'point', 'userId', 'gameLevelId', 'createdAt'],
      nest: true,
      raw: true
    })

    const data = await outputData(cardGameRecords)
    res.render('home', { data })
  } catch (err) {
    next(err)
  }

})


module.exports = router