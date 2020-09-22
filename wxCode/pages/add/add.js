// pages/add/add.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    colorIdx: 1,
    gapIdx: 0,  // 是否有间隙
    typeList:[],
    typeId:'0',
    testWord:'附庸风雅',
    content:'',
    openid:'',
    userInfo:''
  },
  /**
   * 选中颜色
   */
  setColor: function (e) {
    var _this = this,
      colorIdx = e.currentTarget.dataset.idx;
    _this.setData({
      colorIdx: colorIdx
    });
  },
  /**
   * 是否间隙
   */
  setGap: function (e) {
    var gapIdx = '0'
    if (e.detail.value) {
      gapIdx = 1
    }
    console.log(e.detail)
    this.setData({
      gapIdx: gapIdx
    });
  },
  /**
   * 选择分类
   */
  setType: function (e) {
    var _this = this,
      typeId = e.currentTarget.dataset.idx;
    _this.setData({
      typeId: typeId
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getType()
  },
   // 获取导航列表
   getType() {
    let _this = this
    app.wxAjax('/sentence/getType')
    .then(res=>{
      let data = res.data
        data.forEach(function (item) {
          item.curPage = 1,
            item.pageSize = 5
        })
        _this.setData({
          typeList: data
        })
    })
  },
  // 发布
  publish:function(){
    let _this = this;
    let data = _this.data
    let info = {
      type_id:data.typeId,
      isgap:data.gapIdx,
      color_id:data.colorIdx,
      openid:data.openid,
      sentence:data.content,
      author:_this.data.userInfo.nickName
  }
  app.wxAjax('/sentence/addSentence',info)
  .then(res=>{
    wx.showToast({
      title: '发布成功',
    })
    _this.setData({
      typeId: '0',
      colorIdx: '1',
      gapIdx: '0',
      content: '',
    })
  })
  },
  // 绑定内容输入框e
  input_cont:function(e){
    let value = e.detail.value
    this.setData({
      content: value,
  })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 判断是否登录
    let openid = wx.getStorageSync('openid')
    let userInfo = wx.getStorageSync('userInfo')
    if( openid && userInfo ){
      this.setData({
        openid,
        userInfo
      })
    }else{
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})