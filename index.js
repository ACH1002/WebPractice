const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')
const schema = mongoose.Schema
const bodyParser = require('body-parser')
const {User} = require("./models/user")

//application/x-www-form-urlencoded 분석 후 가져옴
app.use(bodyParser.urlencoded({extended: true}))

//application/json 분석 후 가져옴
app.use(bodyParser.json())

mongoose.connect('mongodb+srv://anchanho1002:abcd1234@webpractice.5tbhzp2.mongodb.net/?retryWrites=true&w=majority', {

}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))



app.get('/', (req, res) => res.send('Hello World 안녕'))


app.post('/register', async (req, res) => {
  //회원가입 할 때 필요한 정보들을 client에서 가져와서 DB에 넣어준다


  const user = new User(req.body)

  const result = await user.save().then(()=>{
    res.status(200).json({
      success: true
    })
  }).catch((err)=>{
    res.json({ success: false, err })
  })
})


app.listen(port, () => console.log("Example app listening on port ${port}!"))