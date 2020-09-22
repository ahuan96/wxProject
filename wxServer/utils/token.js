const jwt = require('jsonwebtoken')

const secret = 'abc'

const createToken = (username, plat, expires, strTimer) => {
  let token = jwt.sign(
    {
      User: username,
      Plat: plat,
    },
    secret,
    {
      expiresIn: expires,
    }
  )
  return token
}

// let serverToken = createToken("admin", "WEB", "7", "days");
let localToken = createToken('admin', 'WEB', '1200', 'ms')
// console.log(serverToken);
console.log(localToken)

const verifyToken = (_token) => {
  let verify = jwt.verify(_token, secret, (error, decoded) => {
    if (error) {
      console.log(error.message)
      if (error.message == 'jwt malformed') {
        return 'Token 不存在'
      } else if (error.message == 'jwt expired') {
        return 'Token 失效'
      }
    }
    return decoded
  })
  return verify
}

// console.log(verifyToken('admin'))
// console.log(88, verifyToken(localToken))
// setTimeout(function () {
//   console.log(99, verifyToken(localToken))
// }, 1000)
exports.createToken = createToken;
exports.verifyToken = verifyToken;
