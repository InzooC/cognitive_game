const db = require('../models')
const User = db.User
const { Op } = require('sequelize')
const bcrypt = require('bcrypt')

const adminController = {
  HomePage: async (req, res, next) => {
    try {
      const users = await User.findAll(
        {
          where: { role: { [Op.not]: 'admin' } },
          attributes: { exclude: 'password' },
          raw: true,
          nest: true
        })
      res.render('admin/admin-home', { users })
    } catch (err) { next(err) }
  },
  addMemberPage: async (req, res, next) => {
    try {
      res.render('admin/add-member')
    } catch (err) { next(err) }


  },
  addMember: async (req, res, next) => {
    try {
      const newMember = req.body
      const accounts = await User.findAll({
        where: { role: { [Op.not]: 'admin' } },
        attributes: ['account'],
        raw: true,
        nest: true
      })
      const accountsNumber = await accounts.map((e) => { return Number(e.account) })
      console.log(accountsNumber)
      const newAccount = generateAccount(accountsNumber)
      function generateAccount(accountsNumber) {
        let newAccount = (Math.floor(Math.random() * 899) + 100)
        while (accountsNumber.includes(newAccount)) {
          generateAccount(accountsNumber)
        }
        if (!accountsNumber.includes(newAccount)) { return newAccount }
      }
      User.create({
        name: newMember.name,
        account: newAccount,
        password: await bcrypt.hash('123', 10),
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      })

      res.send('post addMember')

    } catch (err) { next(err) }


  },
  confirmNewMember: async (req, res, next) => {
    try {
      res.send('confirmNewMember')




    } catch (err) { next(err) }
  }
}


module.exports = adminController