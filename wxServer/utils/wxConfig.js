let request = require('request')


let appId = 'wx4a94912ab62355e1'
let AppSecret = 'fb8e383e0f958a4b18c4205b6dfa2bba'
let wxLogin = function (code) {
  let baseurl = 'https://api.weixin.qq.com/sns/jscode2session?appid='+appId+'&secret='+AppSecret+'&grant_type='+'authorization_code'+'&js_code='+code;
  let params = {}
  return new Promise((resolve,reject) => {
    console.log(44)
    request.get(baseurl, (params = params),(err,res) => {
      if(err){
        throw err
      }
      // console.log(res)
      let data = JSON.parse(res.toJSON().body)
      console.log(data)
      console.log(data.openid)
      if(data.errcode){
          reject({code:-1,msg:'获取openid失败'})
      }else{
        resolve({code:0,msg:'成功',openid:data.openid})
      }
    })
  })

}
module.exports = {
  appId ,
  AppSecret ,
  wxLogin
}
