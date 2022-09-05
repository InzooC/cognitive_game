const db = require('../models')
const User = db.User
const { Op } = require('sequelize')

const adminController = {
  HomePage: async (req, res, next) => {
    try {

      //! 排除密碼
      const users = await User.findAll(
        {
          where: { role: { [Op.not]: 'admin' } },
          attributes: { exclude: 'password' },
          raw: true,
          nest: true
        })


      console.log(users)

      res.render('admin/admin-home', { users })
    } catch (err) { next(err) }
  },
  addMemberPage: async (req, res, next) => {
    try {
      res.send('addMemberPage')




    } catch (err) { next(err) }


  },
  addMember: async (req, res, next) => {
    try {
      res.send('addMember')




    } catch (err) { next(err) }


  },
  confirmNewMember: async (req, res, next) => {
    try {
      res.send('confirmNewMember')




    } catch (err) { next(err) }
  }
}


module.exports = adminController