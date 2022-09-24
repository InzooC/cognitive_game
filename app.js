const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const routes = require('./routes')
const passport = require('./config/passport')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

const { create } = require('express-handlebars')
const helpers = create({ helpers: handlebarsHelpers })

app.engine('handlebars', helpers.engine)
app.set('view engine', 'handlebars')
app.set('views', './views')

app.use('/css', express.static('css'))
app.use('/servers', express.static('servers'))
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(methodOverride('_method'))

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

