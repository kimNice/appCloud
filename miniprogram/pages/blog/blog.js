// pages/blog/blog.js
//搜索的值
let keyword=''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal:false,
    blogList:[],
   
  },
  _getBlogList(start=0){
    wx.showLoading({
      title: '拼命加载中...',
    })
    // console.log(keyword)
    wx.cloud.callFunction({
      name:'blog',
      data:{
        start,
        keyword,
        count: 10,
        $url:'list',
        
      },  
    }).then(res =>{
      // console.log(res)
      this.setData({
        blogList:this.data.blogList.concat(res.result)
      })
    })
    wx.hideLoading()
    wx.stopPullDownRefresh()
  },
  
  onCard(event){
    console.log(event)
    wx.navigateTo({
      url: '/pages/blog-detail/blog-detail?id=' + event.currentTarget.dataset._id,
    })
  },
  
  issue(event){
    //判断用户是否授权
   
    wx.getSetting({
      success:(res)=>{
        console.log(res)
        if (res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            success:(info)=>{
              // console.log("用户信息",info)
              this.onloginsuccess({ detail: info.userInfo})
            }
          })
        }else{
          this.setData({
            showModal: true
          })
        }
      }
    })
   

  },
  onloginsuccess(event){
    let info = event.detail
    wx.navigateTo({
      url: `/pages/blog-edit/blog-edit?nickName=${info.nickName}&imgUrl=${info.avatarUrl}`,
    }) 
  },
  onloginfail(){
    wx.showModal({
      title: '授权用户才能使用',
      content: ''
    })
  },
  onSearch(event){
    // console.log(event)
    keyword=event.detail.keyword
    this.setData({
      blogList:[]
    })
    this._getBlogList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getBlogList()
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
    this.setData({
      blogList:[]
    })
    this._getBlogList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (even) {
    console.log("zhuanfa",even)
    let blog = even.target.dataset
    return {
      title: blog.list.content,
      path: '/pages/blog-detail/blog-detail?id=' + blog.id
    }
  }
})