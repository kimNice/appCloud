// pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist:[],
    listInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicInfo=[]
    let arrMusicInfo= wx.getStorageSync("musicInfo")
    wx.showLoading({
      title: '加载中',
    })
    //取出缓存数组
    for(let i = 0;i<arrMusicInfo.length;i++){
      //如果点击的歌单和缓存一样就取缓存中的歌单,并且下面代码不执行
      if (options.musicid == arrMusicInfo[i].id){
        // console.log(arrMusicInfo[i])
        //渲染到界面
        this.setData({
          musiclist: arrMusicInfo[i].musiclist,
          listInfo: {
            coverImgUrl: arrMusicInfo[i].listInfo.coverImgUrl,
            name: arrMusicInfo[i].listInfo.name
          }
        })
        wx.hideLoading()
        return
      }
    }
    
    //获取歌单列表
    wx.cloud.callFunction({
      name:'music',
      data:{
        musicid: options.musicid,
        $url: 'musiclist'
      }
    }).then( res => {
      let pl=res.result.playlist
      console.log("id", pl)
      this.setData({
        musiclist:pl.tracks,
        listInfo:{
          coverImgUrl: pl.coverImgUrl,
          name: pl.name
        }
      })
      musicInfo = {
        id:options.musicid,
        musiclist: pl.tracks,
        listInfo:{
          coverImgUrl: pl.coverImgUrl,
          name: pl.name
        }
      }
      // 将点击的歌单添加到数组
      arrMusicInfo.unshift(musicInfo)
      wx.hideLoading()
      //将数组的歌单放到缓存
      wx.setStorage({
        key: 'musicInfo',
        data: arrMusicInfo,
      })
      
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