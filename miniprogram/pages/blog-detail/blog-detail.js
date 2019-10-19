// pages/blog-detail/blog-detail.js
import formTime from "../../utils/formTime.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogList:[],
    commitDetail:[],
    blogId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      blogId: options.id
    })
    this._getBlogDetail()
  },
  onCommitSuccess(){
    console.log('评论')
    this._getBlogDetail()
  },
  _getBlogDetail(){
    wx.showLoading({
      title: '加载中',
      mask:true
    })

    wx.cloud.callFunction({
      name:'blog',
      data:{
        blogId:this.data.blogId,
        $url:'detail'
      }
    }).then( res =>{
      console.log(res)
      let commitDetail = res.result.commiteDetail.data
      for (let i = 0; i < commitDetail.length;i++){
        commitDetail[i].createTime =formTime(new Date(commitDetail[i].createTime))
      }
      // console.log(res)
      this.setData({
        commitDetail,
        blogList:res.result.detail[0]
      })
      wx.hideLoading()
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
    console.log(this.data.blogList)
    let blog = this.data.blogList

    return {
      title: blog.content,
      path: '/pages/blog-detail/blog-detail?id=' + blog._id
    }
  }
})