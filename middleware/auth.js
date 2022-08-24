const authenticated = (req, res, next) => {
  if (req.isAuthenticated(req)) {
    return next()
  }
  req.flash('success_messages', '請輸入帳密進行登入')
  res.redirect('/login/user')
}
const authenticatedAdmin = (req, res, next) => {
  const user = req.user
  if (user.role === 'admin') {
    return next()
  }
  return res.redirect('/login/admin')
}
const authenticatedUser = (req, res, next) => {
  const user = req.user
  if (user.role === 'user') {
    return next()
  }
  return res.redirect('/login/user')
}

module.exports = {
  authenticated, authenticatedAdmin, authenticatedUser
}