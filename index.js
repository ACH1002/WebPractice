const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')
const schema = mongoose.Schema
mongoose.connect('mongodb+srv://anchanho1002:abcd1234@webpractice.5tbhzp2.mongodb.net/?retryWrites=true&w=majority', {

}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))



app.get('/', (req, res) => res.send('Hello World 안녕'))

app.listen(port, () => console.log("Example app listening on port ${port}!"))