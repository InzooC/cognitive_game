const express = require('express')
const { engine } = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')

const routes = require('./routes')
const passport = require('./config/passport')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')


app.use('/css', express.static('css'))
app.use('/servers', express.static('servers'))
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user || null
  next()
})

app.use(routes)

app.listen(port, () => {
  console.log(`Game app is listening on port ${port}`)
})

