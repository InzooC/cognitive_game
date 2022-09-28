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
  getCgData: async (req, res, next) => {
    try {
      //! 變項?： range(下拉式), level or all(標籤)
      //! 先做level1, 所有資料
      const range = Number(req.query.range)
      const level2 = req.query.level
      console.log('range', range)
      console.log('level-query', level2)

      let level = 'level1' //進入此頁面都先使用level1
      const userId = req.params.userId
      // 先撈７天的資料
      //用dayjs訂出近七天的日期
      // 用每天去撈最低duration的資料
      //! 之後用rawSQL來簡化code
      const cardGame = await Game.findOne({ where: { game_name: 'Match 10 Card Game' }, attributes: ['id'], raw: true, nest: true })
      const levelId = await Level.findOne({ where: { level_name: level }, attributes: ['id'], raw: true, nest: true })
      const gameLevel = await GameLevel.findOne({
        where: {
          game_id: cardGame.id,
          level_id: levelId.id
        }, raw: true, nest: true
      })
      let date = range === 'total' ? null : dateFn(range) //依range找出日期
      console.log('date', date)
      function dateFn(mount) { //找出包含今天的前mount天，以及今天後一天作為range(含下不含上)
        let value = []
        for (i = -1; i < mount; i++) {
          value.unshift(dayjs().subtract(i, 'day').format('YYYY-MM-DD'))
        }
        return value
      }

      // 用rawSQL 以日期為range撈特定使用者料
      let rawData
      if (date.length === 0) {
        rawData = await sequelize.query(
          // 含下不含上, 撈最所以有資料
          `SELECT *
        FROM GameRecords 
        WHERE  
          user_id = ${userId}
        ORDER BY created_at ASC;`
          , { raw: true, nest: true, type: sequelize.QueryTypes.SELECT }
        )
      } else {
        rawData = await sequelize.query(
          // 以日期搜資料，含下不含上,  以日期為range撈特定使用者料
          `SELECT *
        FROM GameRecords
        WHERE
          (created_at >= CAST('${date[0]}' AS DATE))
          AND(created_at <= CAST('${date[date.length - 1]}' AS DATE))
          AND (user_id = ${userId})
        ORDER BY created_at ASC;`
          , { raw: true, nest: true, type: sequelize.QueryTypes.SELECT }
        )
      }

      const formatData = rawData.map(function (e) { //轉換格式
        return {
          id: e.id,
          duration: Number(e.duration),
          date: dayjs(e.created_at).format('YYYY-MM-DD')
        }
      })
      console.log('formatData', formatData)

      const renewData = checkData(formatData) //選出每日最佳成績
      function checkData(data) {
        let arr = data
        for (let i = arr.length - 1; i > 0; i--) {
          if (arr[i].date === arr[i - 1].date && (arr[i].duration > arr[i - 1].duration || arr[i].duration === arr[i - 1].duration)) {
            arr.splice(i - 1, 1)
          } else if (arr[i].date === arr[i - 1].date && arr[i].duration < arr[i - 1].duration) {
            arr.splice(i, 1)
          }
        }
        return arr
      }
      console.log('renewData', renewData)

      let finalData = []
      if (date.length === 0) { // 沒有限定日期範圍時，直接轉成finalData
        renewData.forEach(e => {
          finalData.push({ createdAt: e.date, duration: e.duration })
        })
      } else { //有限定日期範圍時
        date.pop()//date去掉最後一個不包含在內的“上限”
        finalData = createdFinalData(renewData, date)
        function createdFinalData(renewData, dates) { //把有的直塞進去，沒有的留null
          let tempArr = []
          dates.forEach((e, index) => {
            tempArr.push({ createdAt: e, duration: null })
            renewData.forEach(i => {
              if (i.date === e) {
                tempArr[index].duration = i.duration
              }
            })
          })
          return tempArr
        }
      }
      console.log('finalData', finalData)

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