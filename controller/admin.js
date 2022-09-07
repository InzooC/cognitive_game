const db = require('../models')
const User = db.User
const Class = db.Class
const { Op } = require('sequelize')
const bcrypt = require('bcrypt')
const { raw } = require('body-parser')

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
      const classes = await Class.findAll({ raw: true, nest: true })
      res.render('admin/add-member', { classes })
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
      let newAccount = generateAccount()
      function generateAccount() {
        return Math.floor(Math.random() * 9)
      }
      while (accountsNumber.includes(newAccount)) {
        newAccount = generateAccount()
      }

      User.create({
        name: newMember.name,
        birthday: newMember.birthday,
        gender: newMember.gender,
        classId: newMember.class,
        account: newAccount,
        password: await bcrypt.hash('123', 10),
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      })
      res.redirect(`/admin/confirm/${newAccount}`)
    } catch (err) { next(err) }
  },
  confirmNewMember: async (req, res, next) => {
    try {
      const account = req.params.account
      const member = await User.findOne({ where: { account }, raw: true, nest: true })
      const className = await Class.findByPk(member.classId, { attributes: ['name'], raw: true, nest: true })
      res.render('admin/confirm-newmember', { member, className: className.name })
    } catch (err) { next(err) }
  },
  editMember: async (req, res, next) => {
    try {
      const account = req.params.account
      const member = await User.findOne({ where: { account }, raw: true, nest: true })
      const classes = await Class.findAll({ raw: true, nest: true })
      const className = member.classId ? classes.find(e => e.id === member.classId).name : null
      const index = member.classId ? classes.findIndex(e => e.id === member.classId) : null
      if (index) {
        classes.splice(index, 1)
      }
      res.render('admin/edit-member', { member, className, classes })
    } catch (err) { next(err) }
  }
}


module.exports = adminController