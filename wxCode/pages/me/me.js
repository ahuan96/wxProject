// pages/me/me.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    userInfo:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  toNav:function(e){
    let index = e.currentTarget.dataset.idx
    console.log( index)
    let url = ['/pages/star/star','/pages/publish/publish','/pages/publish/publish']
    wx.navigateTo({
      url: url[index],
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
      wx.showToast({
        title: '登录后查看个人信息',
        icon:'loading'
      })
      setTimeout(() => {
        app.globalData.showLogin = true
        wx.switchTab({
          url: '/pages/index/index',
        })
      }, 1000);
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
    return {
      title: '咿咻',
      desc: '来和小伙伴一起来分享美妙的句子吧！',
      path: '/pages/index/index?id=123'
    }
  }
})