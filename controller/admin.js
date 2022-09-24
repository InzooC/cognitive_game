const db = require('../models')
const User = db.User
const Class = db.Class
const { Op } = require('sequelize')
const bcrypt = require('bcrypt')
const dayjs = require('dayjs')
const { sequelize } = require('../models')

const adminController = {
  homePage: async (req, res, next) => {
    try {
      const users = await User.findAll(
        {
          where: { role: { [Op.not]: 'admin' } },
          attributes: {
            exclude: 'password',
            include: [
              [sequelize.literal(`(
                SELECT MAX(createdAt)
                FROM GameRecords
                WHERE
                    GameRecords.user_id = User.id
              )`),
                'lastTime'
              ]
            ]
          },
          include: [Class],
          raw: true,
          nest: true,
          order: [['classId', 'ASC'], ['account', 'ASC']]
        })
      users.forEach(user => {
        user.lastTime = user.lastTime ? dayjs(user.lastTime).format('YYYY/MM/DD aHH:mm') : null
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
      if ((newMember.name).trim().length === 0) {
        throw new Error('姓名無法為空白')
      }
      const accounts = await User.findAll({
        where: { role: { [Op.not]: 'admin' } },
        attributes: ['account'],
        raw: true,
        nest: true
      })
      const accountsNumber = await accounts.map((e) => { return Number(e.account) })
      let newAccount = generateAccount()
      function generateAccount() {
        return Math.floor(Math.random() * 899 + 100)
      }
      while (accountsNumber.includes(newAccount)) {  //當序號重複，重新將newAccount附值
        newAccount = generateAccount()
      }
      User.create({
        name: newMember.name,
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
  editMemberPage: async (req, res, next) => {
    try {
      const account = req.params.account
      const member = await User.findOne({ where: { account }, raw: true, nest: true })
      const classes = await Class.findAll({ raw: true, nest: true })
      const className = member.classId ? classes.find(e => e.id === member.classId).name : null
      const index = member.classId ? classes.findIndex(e => e.id === member.classId) : null

      if (index || index === 0) {
        classes.splice(index, 1)
      }
      res.render('admin/edit-member', { member, className, classes })
    } catch (err) { next(err) }
  },
  editMember: async (req, res, next) => {
    try {
      const memberData = req.body
      const account = req.params.account
      const member = await User.findOne({ where: { account } })
      await member.update({
        name: memberData.name || member.name,
        gender: memberData.gender || member.gender,
        classId: memberData.class || member.classId,
      })

      res.redirect('/admin/home')
    } catch (err) { next(err) }
  }
}


module.exports = adminController