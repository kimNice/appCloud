// pages/playlist/playlist.js
const MAX_LIMIT=15 //每次数据请求的条数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrl: [{
        url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      },
      {
        url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      },
      {
        url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      }
    ],
    playlist: [] 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      this.getMusice();
  },
  getMusice(){
    wx.showLoading({
      title: '加载中',
    })
    //调用云函数得到数据库的数据
    wx.cloud.callFunction({
      name: 'music',
      data: {
        start: this.data.playlist.length, //从多少条开始请求
        count: MAX_LIMIT,
        $url:'playlist'
      }
    }).then(res => {
      
      //拿到数据拼接到数组里
      this.setData({
        playlist: this.data.playlist.concat(res.result.data)
      })
    })
    //这句针对下拉三个小点hide
    wx.stopPullDownRefresh()
    wx.hideLoading()
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      playlist:[]
    })
    this.getMusice()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getMusice()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})