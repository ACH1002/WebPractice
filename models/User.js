const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//10자리 암호생성
const saltRounds = 10

const userSchema = mongoose.Schema({

  name: {
  
  type: String,
  
  maxlength: 50
  
  },
  
  email: {
  
  type: String,
  
  trim: true,
  
  unique: 1
  
  },
  
  password: {
  
  type: String,
  
  minlength: 5
  
  },
  
  lastname: {
  
  type: String,
  
  maxlength: 50
  
  },
  
  role: {
  
  type: Number,
  
  default: 0
  
  },
  
  image: String,
  
  token: {
  
  type: String
  
  },
  
  tokenExp: {
  
  type: Number
  
  }
  
  })

//save 전에 실행
userSchema.pre('save', function( next ){
  var user = this
  //비밀번호를 교체하는 경우에만
  if(user.isModified('password')){
  //비밀번호를 암호화
    bcrypt.genSalt(saltRounds, function(err, salt){
      if(err) return next(err) //next를 할 시 save로 이동
      
      bcrypt.hash(user.password, salt, function(err, hash){
        if(err) return next(err)
        user.password = hash
        next()
      })
    })
  }else{
    next()
  }
})

userSchema.methods.comparePassword = function(plainPassword){
  console.log(plainPassword)
  console.log(this.password)
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {

      if(err){
        console.log(err)
        reject(err)
      }else{
        resolve(isMatch)
      }
    })
  })
}

userSchema.methods.generateToken = async function() {
  try {
    const user = this;

    // jsonwebtoken을 이용해서 토큰을 생성
    const token = jwt.sign(user._id.toHexString(), 'secretToken'); // user._id + 'secretToken' = token

    user.token = token; // 토큰을 유저 모델에 저장

    await user.save(); // 유저 모델 저장

    return token;
  } catch (err) {
    throw err; // 에러 발생 시 전파
  }
}

userSchema.statics.findByToken = async function(token) {
  const user = this;

  try {
    // 토큰을 decoded한다
    const decoded = jwt.verify(token, 'secretToken');

    // 유저 아이디를 이용해서 유저를 찾은 다음에 클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인
    const foundUser = await user.findOne({ "_id": decoded, "token": token });

    return foundUser;
  } catch (err) {
    throw err; // 에러 발생 시 전파
  }
};

const User = mongoose.model('User', userSchema)

module.exports = { User }