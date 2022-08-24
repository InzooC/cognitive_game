const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const db = require('../models')
const User = db.User

// 設定本地登入策略
passport.use(new LocalStrategy({
  usernameField: 'account',
  passwordField: 'password',
  passReqToCallback: true
},
  (req, account, password, cb) => {
    User.findOne({ where: { account } })
      .then(user => {
        if (!user) {
          return cb(null, false, req.flash('error_messages', '帳號或密碼錯誤！'))
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return cb(null, false, req.flash('error_messages', '帳號或密碼錯誤！'))
        }
        return cb(null, user)
      })
  }
))

// 設定序列化與反序列化
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id)
    .then(user => {
      user = user.toJSON()
      return cb(null, user)
    })
})

module.exports = passport