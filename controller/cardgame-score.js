const db = require('../models')
const User = db.User
const GameRecord = db.GameRecord
const GameLevel = db.GameLevel
const Game = db.Game
const Level = db.Level
const { Op } = require('sequelize')
const { sequelize } = require('../models')
const dayjs = require('dayjs')

const cardGameScoreController = {
  getCgScorePage: async (req, res, next) => {
    try {
      //! 變項?： range(下拉式), level or all(標籤)
      //! 先做level1, 所有資料
      const id = Number(req.params.userId)
      const user = await User.findByPk(id, {
        attributes: { exclude: 'password' },
        raw: true, next: true
      })
      res.render('admin/admin-cgscore', { user })
    } catch (err) {
      next(err)
    }
  },
  getCgLevelOneData: async (req, res, next) => {
    try {
      // const range = req.query.range //!目前還沒用上
      let level = 'level1' //進入此頁面都先使用level1
      const userId = req.params.userId
      // 先撈７天的資料
      //用dayjs訂出近七天的日期
      // 用每天去撈最低duration的資料
      //! 用rawSQL來簡化code
      const cardGame = await Game.findOne({ where: { game_name: 'Match 10 Card Game' }, attributes: ['id'], raw: true, nest: true })
      const levelId = await Level.findOne({ where: { level_name: level }, attributes: ['id'], raw: true, nest: true })
      const gameLevel = await GameLevel.findOne({
        where: {
          game_id: cardGame.id,
          level_id: levelId.id
        }, raw: true, nest: true
      })

      let date = []
      function sevenDate() {
        for (i = 0; i < 7; i++) {
          date.push(dayjs().subtract(i, 'day').format('YYYY-MM-DD'))
        }
      }
      sevenDate()

      const data = await GameRecord.findAll({  //!撈全部資料的方法, 之後研究日期range來撈
        where: { userId, gameLevelId: gameLevel.id },
        attributes: ['userId', 'duration', 'gameLevelId', 'createdAt', 'id'],
        order: [['createdAt', 'ASC']],
        raw: true,
        nest: true
      })

      const formatData = data.map(function (value) {
        return {
          id: value.id,
          duration: Number(value.duration),
          date: dayjs(value.createdAt).format('YYYY-MM-DD')
        }
      })

      const renewData = checkData(formatData) //選出每日最佳成績
      console.log('renewData', renewData)

      const finalData = createdFinalData(renewData, date) //把有的直塞進去，沒有的留null
      console.log('finalData', finalData)

      function checkData(formatData) { //雙箭頭兩倆比對，刪除比較大的資料。
        let renewData = formatData
        formatData.forEach((e, index) => {
          for (let i = formatData.length - 1; i > 0; i--) {
            if (e.date === formatData[i].date && e.id !== formatData[i].id && (e.duration < formatData[i].duration || e.duration === formatData[i].duration)) {
              renewData.splice(i, 1)
            }
          }
        })
        return renewData
      }

      function createdFinalData(renewData, dates) { //把有的直塞進去，沒有的留null
        let tempData = []
        dates.forEach((e, index) => {
          tempData.push({ createdAt: e, duration: null })
          renewData.forEach(i => {
            if (i.date === e) {
              tempData[index].duration = i.duration
            }
          })
        })
        return tempData
      }
      console.log('成功進到getCgLevelOneData router')
      res.json({
        status: 'success',
        message: '成功取得CgLevelOneData',
        data: finalData
      })

    } catch (err) {
      next(err)
    }
  }
}


module.exports = cardGameScoreController