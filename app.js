// const bodyParser = require('body-parser')
const express = require('express')
const { engine } = require('express-handlebars')

const app = express()
const port = 3000

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
// app.set('views', './views')
// app.use(bodyParser.urlencoded({ extend: true }))
app.use(express.urlencoded({ extended: true }))

// ?router區 需重構
app.get('/adminLogin', (req, res) => {
  res.render('admin-login')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/', (req, res) => {
  res.render('home')
})



app.listen(port, () => {
  console.log(`Game app is listening on port ${port}`)
})

