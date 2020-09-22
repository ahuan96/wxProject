class User {
  constructor() {
    this.db = require('../utils/sqlConnect')
    this.wxConfig = require('../utils/wxConfig')
  }

  // 注册接口
  register(info) {
    return new Promise((resolve, reject) => {
      this.db.select([], 'users', {openid:info.openid}).then((result) => {
        if (result.length === 0) {
          info.username = info.nickName
          console.log(info)
          this.db
            .insert(info, 'users')
            .then((res) => {
              resolve({ code: 0, msg: 'ok' })
            })
            .catch((err) => {
              reject({ code: -1, msg: 'error' })
            })
        } else {
          reject({ code: -1, msg: '已经存在此账号' })
        }
      })
    })
  }

  // 登录接口
  login(info) {
    let _this = this
    return new Promise((resolve, reject) => {
      console.log(2, info)
      console.log(this.wxConfig)
      // 调用微信登录
      this.wxConfig
        .wxLogin(info.code)
        .then((res) => {
            console.log(990,res.openid)
          _this.db
            .select([], 'users', { openid: res.openid })
            .then((result) => {
                console.log(888,result)
              if (result.length === 1) {
                // 登录成功,返回 个人信息 与 token
                resolve({ code: 0, msg: 'ok', data: result})
              } else {
                reject({ code: 10, msg: '账号未注册', openid: res.openid })
              }
            })
        })
        .catch((res) => {
          reject(res)
        })
      // resolve({ code: 0, msg: 'ok'})
      return
    })
  }

  // 查询用户信息
  info(info) {
    return new Promise((resolve, reject) => {
      this.db.select([], 'users', info).then((result) => {
        if (result.length === 1) {
          resolve({ code: 0, msg: 'ok', data: result })
        } else {
          reject({ code: -1, msg: '账号不存在' })
        }
      })
    })
  }
}

module.exports = new User()
