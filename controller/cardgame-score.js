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
  getCgLevelOneData: async (req, res, next) => {
    try {
      //! 變項?： range(下拉式), level or all(標籤)
      //! 先做level1, 所有資料
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
      let date = sevenDate() //找出近七天的日期
      function sevenDate() { //找出包含今天的前妻天，以及今天後一天作為range(含下不含上)
        let value = []
        for (i = -1; i < 7; i++) {
          value.unshift(dayjs().subtract(i, 'day').format('YYYY-MM-DD'))
        }
        return value
      }

      //! 用rawSQL 以日期為range撈特定使用者料
      const data = await sequelize.query(
        // !目前以日期艘人，含下不含上
        `SELECT *
        FROM GameRecords 
        WHERE  
          (created_at >= CAST('${date[0]}' AS DATE)) 
          AND(created_at <= CAST('${date[date.length - 1]}' AS DATE))
          AND (user_id = ${userId})
        ORDER BY created_at ASC;`
        , { raw: true, nest: true, type: sequelize.QueryTypes.SELECT }
      )

      const formatData = data.map(function (e) {
        return {
          id: e.id,
          duration: Number(e.duration),
          date: dayjs(e.created_at).format('YYYY-MM-DD')
        }
      })

      const renewData = checkData(formatData) //選出每日最佳成績
      function checkData(formatData) { //雙箭頭兩倆比對，刪除比較大的資料。
        let renewData = formatData  //! 這個做法在大資料會影響速度，之後優化
        formatData.forEach((e, index) => {
          for (let i = formatData.length - 1; i > 0; i--) {
            if (e.date === formatData[i].date && e.id !== formatData[i].id && (e.duration < formatData[i].duration || e.duration === formatData[i].duration)) {
              renewData.splice(i, 1)
            }
          }
        })
        return renewData
      }
      date.pop()//date去掉最後一個不包含在內的“上限”
      const finalData = createdFinalData(renewData, date)
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