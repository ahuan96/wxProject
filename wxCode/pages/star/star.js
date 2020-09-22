//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    showModel: false,
    topNavs: [],
    /**
     * 当前激活的当航索引
     */
    currentTab: 0,
    /**
     * 上一个激活的当航索引
     */
    prevIndex: -1,
    /**
     * scroll-view 横向滚动条位置
     */
    scrollLeft: 0,
    allList: []
  },
  onLoad: function (options) {
    var _this = this
    let res = wx.getSystemInfoSync();
    let winHeight = res.windowHeight
    _this.setData({
      // winWidth: app.globalData.winWidth,
      winHeight: winHeight
    })
    let openid = app.globalData.openid;
    let userInfo = app.globalData.userInfo;
    console.log(9,openid,userInfo)

    if(openid && userInfo){
       let data = userInfo
       data.openid = openid
       _this.getTypeById(openid)
    }else{
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
    


  },
  // 获取导航列表
  getTypeById(openid) {
    let _this = this
    app.wxAjax('/sentence/getStarType',{openid:openid})
    .then(res=>{
      let data = res.data
        data.forEach(function (item) {
          item.curPage = 1,
            item.pageSize = 5
        })
        _this.setData({
          topNavs: data,
          allList: data
        })
        if (data && data.length > 0) {
          _this.getListByType(data[0].type_id)
        }
    })
  },
  // 获取句子列表
  getListByType(type_id) {
    let _this = this
    let allList = _this.data.allList
    let curList;
   // 查找当前分类列表
    allList.forEach(function (item, index) {
      if (item.type_id == type_id) {
        curList = item
      }
    })
    wx.showLoading({
      title: '加载中',
    })
    console.log(777)
    console.log(wx.getStorageSync('openid'))
    let data = {
      type_id: type_id,
        openid:wx.getStorageSync('openid')||'',
        page: curList.curPage,
        size: curList.pageSize
    }
    app.wxAjax('/sentence/getStarList',data)
    .then(res=>{
      if (curList.type_id == type_id) {
        if (!curList.list) {
          curList.list = res.data
          curList.count = res.count
        } else {
          curList.list = curList.list.concat(res.data)
        }
      }
      _this.setData({
        allList
      })
      wx.hideLoading()
    })
  },
  // 绑定用户信息
  bindGetUserInfo(e) {
    let _this = this;
    let data = e.detail.userInfo
    wx.setStorageSync('userInfo',  e.detail.userInfo)
    data.openid = app.globalData.openid
    _this.wxRegister(data, function () {
      _this.setData({
        showModel: false
      })
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作  
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    this.data.page = 1
    this.getCouponList('正在刷新数据')
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this
    let allList = _this.data.allList
    let curList = allList[_this.data.currentTab]
    console.log(2, curList)

    curList.curPage += 1;
    this.setData({
      allList
    })
    // 判断是否有更多数据
    if (curList.count) {
      if (curList.curPage > Math.ceil(curList.count / curList.pageSize)) {
        wx.showToast({
          title: '没有更多了',
          icon: 'none'
        })
        wx.stopPullDownRefresh()
        return
      }
    }
    _this.getListByType(curList.type_id)
    wx.stopPullDownRefresh()
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
  },

  /**
   * 顶部导航改变事件，即被点击了
   * 1、如果2次点击同一个当航，则不做处理
   * 2、需要记录本次点击和上次点击的位置
   */
  topNavChange: function (e) {
    var _this = this,
      nextActiveIndex = e.currentTarget.dataset.current,
      typeId = e.currentTarget.dataset.typeid,
      currentIndex = _this.data.currentTab;
    if (currentIndex != nextActiveIndex) {
      _this.setData({
        currentTab: nextActiveIndex,
        prevIndex: currentIndex
      });
    }
   
  },
  /**
   * swiper滑动时触发
   * 1、prevIndex != currentIndex 表示的是用手滑动 swiper组件
   * 2、prevIndex = currentIndex  表示的是通过点击顶部的导航触发的
   */
  swiperChange: function (e) {
    let _this = this
    var prevIndex = this.data.currentTab,
      currentIndex = e.detail.current;
    this.setData({
      currentTab: currentIndex
    });
    if (prevIndex != currentIndex) {
      this.setData({
        prevIndex: prevIndex
      });
    }
    let typeId = _this.data.topNavs[_this.data.currentTab].type_id
    let allList = _this.data.allList
    allList.forEach(function (item) {
      if (item.type_id == typeId) {
        if (!item.list) {
          console.log(876)
          _this.getListByType(typeId)
        }
      }
    })
    this.scrollTopNav();
  },
  /**
   * 滚动顶部的导航栏
   * 1、这个地方是大致估算的
   */
  scrollTopNav: function () {
    var _this = this
    // 当激活的当航小于4个时，不滚动
    if (_this.data.currentTab <= 3 && _this.data.scrollLeft >= 0) {
      _this.setData({
        scrollLeft: 0
      });
    } else {
      //当超过4个时，需要判断是向左还是向右滚动，然后做相应的处理
      var currentTab = _this.data.currentTab > _this.data.prevIndex ? _this.data.currentTab - _this.data.prevIndex : _this.data.prevIndex - _this.data.currentTab
      var plus = (_this.data.currentTab > _this.data.prevIndex ? 70 : -70) * currentTab;
      _this.setData({
        scrollLeft: _this.data.scrollLeft + plus
      });
    }
  },
    // 收藏
  updateStar:function(e){
    console.log(888)
    console.log(e.currentTarget.dataset.item)
    let _this = this
    let type_id = e.currentTarget.dataset.typeid
    let s_id = e.currentTarget.dataset.sid
    let isStar = e.currentTarget.dataset.isstar
    let allList = this.data.allList
    let curList;
    let url = '/sentence/addStar'
    if(isStar == '1'){
      url = '/sentence/delStar'
    }
    
    // 查找当前分类列表
    allList.forEach(function (item, index) {
      if (item.type_id == type_id) {
        curList = item
      }
    })
    let data = {
      type_id: type_id,
      openid:wx.getStorageSync('openid')|| '',
      s_id:s_id
    }
    app.wxAjax(url,data)
    .then(res=>{
      for(let item of allList){
        if(item.type_id == type_id){
          for(let item2 of item.list){
            if(item2.s_id == s_id){
              if(isStar == '1'){
                item2.isStar = 0
                item2.stars--
              }else{
                item2.isStar = 1
                item2.stars++
              }
              // item2.isStar = (isStar == '1' ? '0' :'1')
            }
          }
        }
      }
      _this.setData({
        allList
      })
    })
  },
 // 点赞
 updateZan:function(e){
  let _this = this
  let type_id = e.currentTarget.dataset.typeid
  let s_id = e.currentTarget.dataset.sid
  let isZan = e.currentTarget.dataset.iszan
  let allList = this.data.allList
  let curList;
  let url = '/sentence/addZan'
  if(isZan == '1'){
    url = '/sentence/delZan'
  }
  
  // 查找当前分类列表
  allList.forEach(function (item, index) {
    if (item.type_id == type_id) {
      curList = item
    }
  })
  let data = {
    type_id: type_id,
    openid:wx.getStorageSync('openid')|| '',
    s_id:s_id
  }
  app.wxAjax(url,data)
  .then(res=>{
    for(let item of allList){
      if(item.type_id == type_id){
        for(let item2 of item.list){
          if(item2.s_id == s_id){
            if(isZan == '1'){
              item2.isZan = 0
              item2.zans--
            }else{
              item2.isZan = 1
              item2.zans++
            }
            // item2.isZan = (isZan == '1' ? '0' :'1')
          }
        }
      }
    }
    _this.setData({
      allList
    })
  })
  }

})