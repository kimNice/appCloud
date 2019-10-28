// pages/like-music/like-music.js
const app = getApp()
//获取全局里的openid
let OPENID = app.globalData.openid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //如果是-1就去调用获取openid信息
    wx.showLoading({
      title: '加载中',

    })
    if (OPENID==-1){
      app.getOpenid()
      new Promise((resolve)=>{
        setTimeout(()=>{
          resolve(this._getLikeMusic())
        },500)
      })
    }
    wx.hideLoading()
  },
  _getLikeMusic(){
    let openid = app.globalData.openid
    wx.cloud.callFunction({
      name:'likeMusic',
      data:{
        openid,
        $url:'getAllLike'
      }
    }).then(res =>{
      //判断没有喜欢的歌曲去哪
      if(!res.result.data.length){
        wx.showModal({
          title: '暂无喜欢的歌曲',
          content: '',
          success:(mode)=>{
            //点击
            if(mode.confirm){
              this._navTo()
            }else{
              this._navTo()
            }
          }
        })
        return
      }
      this.setData({
        musiclist:res.result.data
      })
    })
    // console.log(openid)
  },
  _navTo(){
    //是tabBar页面需要使用switchTab 使用navigateTo是无法跳转的
    wx.switchTab({
      url: '/pages/playlist/playlist',
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