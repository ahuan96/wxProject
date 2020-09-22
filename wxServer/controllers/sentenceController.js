function stringToJson(results) {
  var dataString = JSON.stringify(results)
  var data = JSON.parse(dataString)
  return data
}

let DB = require('../utils/sqlConnect')

// 查询列表
function list(info) {
  return new Promise((resolve, reject) => {
    DB.select([], 'types').then((result) => {
      if (result.length === 0) {
        resolve({ code: 0, msg: '暂无数据', data: [] })
      } else {
        let types = stringToJson(result)
        DB.select([], 'sentence').then((result) => {
          let sentences = stringToJson(result)
          for (let type of types) {
            type.list = []
            for (let sen of sentences) {
              if (sen.type_id == type.type_id) {
                type.list.push(sen)
              }
            }
          }
          resolve({ code: 0, msg: '成功', data: types })
        })
      }
    })
  })
}

// 查询类型列表
function getType(info) {
  return new Promise((resolve, reject) => {
    DB.select([], 'types').then((result) => {
      if (result.length === 0) {
        resolve({ code: 0, msg: '暂无数据', data: [] })
      } else {
        resolve({ code: 0, msg: '成功', data: result })
      }
    })
  })
}

// 查询类型列表
function getTypeById(info) {
  return new Promise((resolve, reject) => {
    DB.query(
      'SELECT DISTINCT type_id from sentence where openid=' +
        '"' +
        info.openid +
        '"'
    ).then((result) => {
      if (result.length === 0) {
        resolve({ code: 0, msg: '暂无数据', data: [] })
      } else {
        let str = ''
        let data = stringToJson(result)
        for (let item of data) {
          str += item.type_id + ','
        }
        str = str.substr(0, str.length - 1)

        let sql = 'SELECT * from types WHERE type_id in (' + str + ')'
        DB.query(sql).then((result) => {
          if (result.length === 0) {
            resolve({ code: 0, msg: '暂无数据', data: [] })
          } else {
            resolve({ code: 0, msg: '成功', data: result })
          }
        })
      }
    })
  })
}

function getStars(info) {
  return new Promise((resolve, reject) => {
    DB.select([], 'stars', info).then((result) => {
      if (result.length === 0) {
        resolve({ code: 0, msg: '暂无数据', data: [] })
      } else {
        resolve({ code: 0, msg: '成功', data: result })
      }
    })
  })
}

function getZans(info) {
  return new Promise((resolve, reject) => {
    DB.select([], 'zans', info).then((result) => {
      if (result.length === 0) {
        resolve({ code: 0, msg: '暂无数据', data: [] })
      } else {
        resolve({ code: 0, msg: '成功', data: result })
      }
    })
  })
}

// 查询根据类型句子列表
function getListByType(info, pageObj) {
  return new Promise((resolve, reject) => {
    // 查询总数
    DB.select([], 'sentence', { type_id: info.type_id }).then((result) => {
      if (result.length === 0) {
        resolve({ code: 0, msg: '暂无数据', data: [] })
      } else {
        pageObj.count = result.length
        // 分页查询
        DB.select(
          [],
          'sentence',
          false,
          false,
          pageObj,
          `INNER JOIN users ON sentence.openid = users.openid WHERE sentence.type_id='${info.type_id}' order by cast(create_time as datetime) desc`
        ).then(async (result2) => {
          let flag = 0
          for (let item of result2) {
            await getStars({ s_id: item.s_id }).then((res) => {
              item.stars = res.data.length
              item.isStar = '0'
              if (info.openid) {
                for (let item2 of res.data) {
                  if (item2.openid == info.openid) {
                    item.isStar = '1'
                  }
                }
              }
            })

            await getZans({ s_id: item.s_id }).then((res) => {
              item.zans = res.data.length
              item.isZan = '0'
              if (info.openid) {
                for (let item2 of res.data) {
                  if (item2.openid == info.openid) {
                    item.isZan = '1'
                  }
                }
              }
            })
          }
          resolve({ code: 0, msg: '成功', data: result2, ...pageObj })
        })
      }
    })
  })
}

// 查询收藏的 对应分类 的句子
function getStarList(info, pageObj) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM stars INNER JOIN sentence ON stars.s_id = sentence.s_id AND stars.openid = '${info.openid}' AND stars.type_id='${info.type_id}'`
    let curPage = pageObj.page || 1
    let pageSize = pageObj.size || 10
    let str = ` limit  ${(curPage - 1) * pageSize},${pageSize}`
    // 查询总数
    DB.query(sql + str).then((result) => {
      if (result.length === 0) {
        resolve({ code: 0, msg: '暂无数据', data: [] })
      } else {
        pageObj.count = result.length
        // 分页查询
        DB.query(sql + str).then(async (result2) => {
          let flag = 0
          for (let item of result2) {
            await getStars({ s_id: item.s_id }).then((res) => {
              item.stars = res.data.length
              item.isStar = '0'
              if (info.openid) {
                for (let item2 of res.data) {
                  if (item2.openid == info.openid) {
                    item.isStar = '1'
                  }
                }
              }
            })

            await getZans({ s_id: item.s_id }).then((res) => {
              item.zans = res.data.length
              item.isZan = '0'
              if (info.openid) {
                for (let item2 of res.data) {
                  if (item2.openid == info.openid) {
                    item.isZan = '1'
                  }
                }
              }
            })
          }
          resolve({ code: 0, msg: '成功', data: result2, ...pageObj })
        })
      }
    })
  })
}

// 发布句子
function addSentence(info) {
  return new Promise((resolve, reject) => {
    DB.insert(info, 'sentence').then((result) => {
      if (result.affectedRows === 1) {
        resolve({ code: 0, msg: '成功', data: result })
      } else {
        reject({ code: -1, msg: '失败', data: result })
      }
    })
  })
}

// 获取已经收藏的类型
function getStarType(info) {
  return new Promise((resolve, reject) => {
    DB.query(
      'SELECT DISTINCT type_id from stars where openid=' +
        '"' +
        info.openid +
        '"'
    ).then((result) => {
      if (result.length === 0) {
        resolve({ code: 0, msg: '暂无数据', data: [] })
      } else {
        let str = ''
        let data = stringToJson(result)
        for (let item of data) {
          str += item.type_id + ','
        }
        str = str.substr(0, str.length - 1)

        let sql = 'SELECT * from types WHERE type_id in (' + str + ')'
        DB.query(sql).then((result) => {
          if (result.length === 0) {
            resolve({ code: 0, msg: '暂无数据', data: [] })
          } else {
            resolve({ code: 0, msg: '成功', data: result })
          }
        })
      }
    })
  })
}

// 更新句子
function updateSentence(info) {
  return new Promise((resolve, reject) => {
    DB.update(info, 'sentence').then((result) => {
      if (result.affectedRows === 1) {
        resolve({ code: 0, msg: '成功', data: result })
      } else {
        reject({ code: -1, msg: '失败', data: result })
      }
    })
  })
}

// 收藏句子
function addStar(info) {
  return new Promise((resolve, reject) => {
    DB.select([],'stars',info).then((result) => {
      if (result.length === 1) {
        resolve({ code: 0, msg: '成功', data: result })
      } else {
        DB.insert(info, 'stars').then((result) => {
          if (result.affectedRows === 1) {
            resolve({ code: 0, msg: '成功', data: result })
          } else {
            reject({ code: -1, msg: '失败', data: result })
          }
        })
      }
    })
  })
}

// 取消收藏句子
function delStar(info) {
  return new Promise((resolve, reject) => {
    DB.delete([],'stars',info).then((result) => {
      if (result.length !== 1) {
        resolve({ code: 0, msg: '成功', data: result })
      } else {
        DB.delete(info, 'stars').then((result) => {
          if (result.affectedRows === 1) {
            resolve({ code: 0, msg: '成功', data: result })
          } else {
            reject({ code: -1, msg: '失败', data: result })
          }
        })
      }
    })
  })
}

// 点赞句子
function addZan(info) {
  return new Promise((resolve, reject) => {
    DB.select([],'zans',info).then((result) => {
      if (result.length === 1) {
        resolve({ code: 0, msg: '成功', data: result })
      } else {
        DB.insert(info, 'zans').then((result) => {
          if (result.affectedRows === 1) {
            resolve({ code: 0, msg: '成功', data: result })
          } else {
            reject({ code: -1, msg: '失败', data: result })
          }
        })
      }
    })
  })
}

// 取消点赞句子
function delZan(info) {
  return new Promise((resolve, reject) => {
    DB.delete([],'zans',info).then((result) => {
      if (result.length !== 1) {
        resolve({ code: 0, msg: '成功', data: result })
      } else {
        DB.delete(info, 'zans').then((result) => {
          if (result.affectedRows === 1) {
            resolve({ code: 0, msg: '成功', data: result })
          } else {
            reject({ code: -1, msg: '失败', data: result })
          }
        })
      }
    })
  })
}

module.exports = {
  list,
  getType,
  getTypeById,
  getStars,
  getListByType,
  addSentence,
  getStarType,
  getStarList,
  updateSentence,
  addStar,
  delStar,
  addZan,
  delZan
}
