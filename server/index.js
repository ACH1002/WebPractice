const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
const schema = mongoose.Schema
const bodyParser = require('body-parser')
const {auth} = require('./middleware/auth')
const {User} = require("./models/user")
const config = require('./config/key')
const cookieParser = require('cookie-parser')


//application/x-www-form-urlencoded 분석 후 가져옴
app.use(bodyParser.urlencoded({extended: true}))

//application/json 분석 후 가져옴
app.use(bodyParser.json())

app.use(cookieParser());

mongoose.connect(config.mongoURI, {})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))



app.get('/', (req, res) => res.send('Hello World 안녕하세요'))

app.get('/api/hello', (req,res) => {


  res.send("안녕하세요 ~")
})


app.post('/api/users/register', async (req, res) => {
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

app.post('/api/users/login', async (req, res) => {
  try {
      // 요청된 이메일을 데이터베이스에서 찾기
      const user = await User.findOne({ email: req.body.email })

      if (!user) {
          return res.json({
              loginSuccess: false,
              message: "제공된 이메일에 해당하는 유저가 없습니다."
          })
      }

      // 요청된 이메일이 DB에 있다면 Password가 일치한지 확인
      const isMatch = await user.comparePassword(req.body.password)

      if (!isMatch) {
          return res.json({
              loginSuccess: false,
              message: "비밀번호가 틀렸습니다."
          })
      }

      // Password가 일치하다면 토큰 생성
      await user.generateToken()

      // 토큰을 저장
      res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
  } catch (err) {
      return res.status(500).json({ error: "서버 오류가 발생했습니다." })
  }
})

app.get('/api/users/auth', auth, (req, res) => {

  //여기까지 미들웨어를 통과했다는 얘기는 Authentication이 true라는 의미
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastName: req.user.lastName,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.user._id }, { token: '' })

    if (!user) {
      return res.json({ success: false, error: '유저를 찾을 수 없습니다.' })
    }

    return res.status(200).send({ success: true })
  } catch (err) {
    return res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' })
  }
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))