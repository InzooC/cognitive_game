const loginController = {
  adminLoginPage: (req, res, next) => {
    // req.flash('success_messages', '輸入帳密進行登入')
    res.render('admin-login')
  },
  adminLogin: (req, res, next) => {
    req.flash('success_messages', '成功登入')
    res.redirect('/admin/home')
  },
  logout: (req, res, next) => {
    req.logout(function (err) {
      if (err) { return next(err) }
      req.flash('success_messages', '登出成功！')
      res.redirect('/login/user')
    })
  },
  userLoginPage: (req, res, next) => {
    res.render('login')
  },
  userLogin: (req, res, next) => {
    req.flash('success_messages', '成功登入')
    res.redirect('/home')
  }
}

module.exports = loginController
