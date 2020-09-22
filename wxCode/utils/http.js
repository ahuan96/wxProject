/* 定义请求路径 */
const HOST = 'https://hh666.wang:3000'
// const HOST = 'http://localhost:3000'

/* 排除的返回code 
 * 0 返回成功
 * 10 用户未注册
 */
const EXCEPT_CODE = [0, 10]

/* 封装request请求 */
function wxAjax(url, data = {}, method = 'GET', contentType = 'json') {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: HOST + url,
      data: data,
      method: method,
      header: {
        'Content-Type': contentType.toLowerCase() == 'json' ? "application/json" : "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(url,res)
        /* 如果错误码在排除的数组里，正常处理 */
        let data = res.data
        if (EXCEPT_CODE.includes(parseInt(data.code))) {
          resolve(data)
        } else {
          console.error('错误--',data.msg)
          reject(data.msg);
        }
      },
      fail: function (err) {
        console.error('err',err)
        resolve(err)
      }
    })
  })
}

module.exports = {
  wxAjax
}