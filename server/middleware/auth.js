const {User} = require('../models/user')

let auth = async (req, res, next) => {
  try {
    // 클라이언트 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth

    // 가져온 토큰을 복호화한 후 유저를 찾음
    const user = await User.findByToken(token);

    if (!user) {
      return res.json({ isAuth: false, error: true });
    }

    req.token = token;
    req.user = user;
    next(); // 미들웨어에서 나가기 위해서
  } catch (err) {
    return res.status(401).json({ error: '유효하지 않은 토큰입니다.',err: err });
  }
};
module.exports = {auth}