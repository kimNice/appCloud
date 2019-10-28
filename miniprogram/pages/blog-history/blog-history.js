// pages/blog-history/blog-history.js
const COUNT=10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogHistory:[],
    isOver:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this._getBlogHistory()
  },
  _getBlogHistory(){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'blog',
      data:{
        start:this.data.blogHistory.length,
        count:COUNT,
        $url:"getBlogHistory"
      }
    }).then(res =>{
      console.log(res)
      //判断是否还有数据
      if(res.result.length == 0){
        this.setData({
          isOver:false
        })
      }else{
        this.setData({
          isOver: true
        })
      }
      this.setData({
        blogHistory: this.data.blogHistory.concat(res.result)
      })

      wx.hideLoading()
    })
  },
  onCard(event) {
    console.log(event)
    wx.navigateTo({
      url: '/pages/blog-detail/blog-detail?id=' + event.currentTarget.dataset._id,
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
   * 
   */
  onReachBottom: function () {
    this._getBlogHistory()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
   
    let blog = event.target.dataset.list
    console.log(blog)
    return {
      title: blog.content,
      path: '/pages/blog-detail/blog-detail?id=' + blog._id
    }
  }
})