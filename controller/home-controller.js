const dayjs = require('dayjs')
const { Op } = require("sequelize")
const db = require('../models')
const GameRecord = db.GameRecord
const GameLevel = db.GameLevel
const Level = db.Level
const Game = db.Game

const homeController = {
  homePage: async (req, res, next) => {
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
        attributes: ['id', 'duration', 'point', 'userId', 'gameLevelId', 'createdAt'],
        nest: true,
        raw: true
      })
      const data = await outputData(cardGameRecords)
      res.render('home', { data, member: user })
    } catch (err) {
      next(err)
    }
  }
}

//! 輸出各level的trail&point的函式  可以把程式打包
async function outputData(data) {
  const levelOneId = (await Level.findOne({ where: { level_name: 'level1' }, nest: true, raw: true })).id
  const levelTwoId = (await Level.findOne({ where: { level_name: 'level2' }, nest: true, raw: true })).id
  const levelThreeId = (await Level.findOne({ where: { level_name: 'level3' }, nest: true, raw: true })).id
  const levelFourId = (await Level.findOne({ where: { level_name: 'level4' }, nest: true, raw: true })).id
  const defaultDuration = 3600
  const outPut = {
    levelOne: {
      trail: 0,
      pointCount: 0,
      duration: defaultDuration,
      lastTime: 0,
    },
    levelTwo: {
      trail: 0,
      pointCount: 0,
      duration: defaultDuration,
      lastTime: 0
    },
    levelThree: {
      trail: 0,
      pointCount: 0,
      duration: defaultDuration,
      lastTime: 0
    },
    levelFour: {
      trail: 0,
      pointCount: 0,
      duration: defaultDuration,
      lastTime: 0
    },
    total: {
      trail: 0,
      pointCount: 0,
      lastTime: '製作中'
    }
  }
  data.forEach(e => {
    switch (e.gameLevelId) {
      case levelOneId:
        outPut.levelOne.trail += 1
        outPut.levelOne.pointCount += Number(e.point)
        if (Number(e.duration) < outPut.levelOne.duration) {
          outPut.levelOne.duration = Number(e.duration)
        }
        if (e.createdAt > outPut.levelOne.lastTime) {
          outPut.levelOne.lastTime = e.createdAt
        }
        break
      case levelTwoId:
        outPut.levelTwo.trail += 1
        outPut.levelTwo.pointCount += Number(e.point)
        if (Number(e.duration) < outPut.levelTwo.duration) {
          outPut.levelTwo.duration = Number(e.duration)
        }
        if (e.createdAt > outPut.levelTwo.lastTime) {
          outPut.levelTwo.lastTime = e.createdAt
        }
        break
      case levelThreeId:
        outPut.levelThree.trail += 1
        outPut.levelThree.pointCount += Number(e.point)
        if (Number(e.duration) < outPut.levelThree.duration) {
          outPut.levelThree.duration = Number(e.duration)
        }
        if (e.createdAt > outPut.levelThree.lastTime) {
          outPut.levelThree.lastTime = e.createdAt
        }
        break
      case levelFourId:
        outPut.levelFour.trail += 1
        outPut.levelFour.pointCount += Number(e.point)
        if (Number(e.duration) < outPut.levelFour.duration) {
          outPut.levelFour.duration = Number(e.duration)
        }
        if (e.createdAt > outPut.levelFour.lastTime) {
          outPut.levelFour.lastTime = e.createdAt
        }
        break
    }
  })
  //! 可以再優化
  outPut.total.trail = (outPut.levelOne.trail + outPut.levelTwo.trail + outPut.levelThree.trail + outPut.levelFour.trail)
  outPut.total.pointCount = (outPut.levelOne.pointCount + outPut.levelTwo.pointCount + outPut.levelThree.pointCount + outPut.levelFour.pointCount)
  outPut.total.lastTime = data.length > 0 ? dayjs(data[data.length - 1].createdAt).format('YYYY/MM/DD ahh:mm') : '尚未挑戰'

  //! 因為在forEach內無法使用async函式
  //! 所以在最後新增transformedTime資料
  if (outPut.levelOne.trail > 0) {
    outPut.levelOne.transformedTime = await utility.transformTime(outPut.levelOne.duration)
    outPut.levelOne.lastTime = dayjs(outPut.levelOne.lastTime).format('YYYY/MM/DD ahh:mm')
  } else {
    outPut.levelOne.transformedTime = '尚未挑戰'
    outPut.levelOne.lastTime = '尚未挑戰'
  }
  if (outPut.levelTwo.trail > 0) {
    outPut.levelTwo.transformedTime = await utility.transformTime(outPut.levelTwo.duration)
    outPut.levelTwo.lastTime = dayjs(outPut.levelTwo.lastTime).format('YYYY/MM/DD ahh:mm')
  } else {
    outPut.levelTwo.transformedTime = '尚未挑戰'
    outPut.levelTwo.lastTime = '尚未挑戰'
  }
  if (outPut.levelThree.trail > 0) {
    outPut.levelThree.transformedTime = await utility.transformTime(outPut.levelThree.duration)
    outPut.levelThree.lastTime = dayjs(outPut.levelThree.lastTime).format('YYYY/MM/DD ahh:mm')
  } else {
    outPut.levelThree.transformedTime = '尚未挑戰'
    outPut.levelThree.lastTime = '尚未挑戰'
  }
  if (outPut.levelFour.trail > 0) {
    outPut.levelFour.transformedTime = await utility.transformTime(outPut.levelFour.duration)
    outPut.levelFour.lastTime = dayjs(outPut.levelFour.lastTime).format('YYYY/MM/DD ahh:mm')
  } else {
    outPut.levelFour.transformedTime = '尚未挑戰'
    outPut.levelFour.lastTime = '尚未挑戰'
  }
  return outPut
}

// 時間轉換工具
const utility = {
  async transformTime(duration) {
    let minute = 0
    let second = 0
    if (duration < 60) {
      second += duration
      return `${second}秒`
    } else {
      minute += (Math.floor(duration / 60))
      second += (duration % 60)
      return `${minute}分${second}秒`
    }
  }
}

module.exports = homeController
