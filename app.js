// const bodyParser = require('body-parser')
const express = require('express')
const { engine } = require('express-handlebars')


const app = express()
const port = 3000
const routes = require('./routes')

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
// app.set('views', './views')
// app.use(bodyParser.urlencoded({ extend: true }))
app.use(express.urlencoded({ extended: true }))




app.use(routes)
// ?router區 需重構




app.listen(port, () => {
  console.log(`Game app is listening on port ${port}`)
})

