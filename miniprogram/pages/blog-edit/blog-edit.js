// pages/blog-edit/blog-edit.js
//最大字数限制
let LENGTH_MAX=140
//最大图片限制
let MAX_IMG=9
//内容
let content=''
//用户信息
let info={}

let db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textNumber:0,
    f_bottom:0,
    img:[],
    addShow:true
  },
  //选择图片上传
  onSelectImg(){
    //最大限制数 - 数组长度等于还剩几张可以选0
    let count=MAX_IMG - this.data.img.length
     wx.chooseImage({
       count,
       sourceType:['album', 'camera'],
       success: (res) => {      
         this.setData({
           img: this.data.img.concat(res.tempFilePaths)   
         })
         //选择完后
         count = MAX_IMG - this.data.img.length    
         if (this.data.img.length == MAX_IMG){
           this.setData({
             addShow:false
           })
         }
       },
     })
     
  },
  //打开大图查看图片
  onOpenImg(event){
    let current=event.currentTarget.dataset.url
    wx.previewImage({
      urls:this.data.img,
      current,
    })
  },
  //删除图片
  onCloseImg(event){
    
    let index=event.currentTarget.dataset.index
    this.data.img.splice(index,1)
    this.setData({
      img:this.data.img,
      addShow:this.data.img.length<MAX_IMG?true:false
    })
  },
  //text 获取焦点
  onFocus(event){
    
    let height=event.detail.height
    this.setData({
      f_bottom: height + "px"
    })
  },
  // 失去焦点
  onBlur(){
    this.setData({
      f_bottom: 0 
    })
  },
  //
  onbindInput(event){
    // console.log(event)
    let textNum = event.detail.value.length
    if (textNum>=LENGTH_MAX){ 
      textNum=`最大字数为${LENGTH_MAX}`
    }
    this.setData({
      textNumber: textNum
    })
    content = event.detail.value
  },
  //发布
  onIssue(){
    let promiseArr=[]
    let fileID=[]
    if (content.trim() == ''){
      wx.showModal({
        title: '内容不能为空',
        content: '',
      })
      return
    }
    wx.showLoading({
      title: '发布中...',
      mask:true
    })
    for(let i=0,len=this.data.img.length;i<len;i++){
      let p=new Promise((resolve,reject)=>{
        let item = this.data.img[i]
        //正则筛选
        
        let suffix = /\.\w+$/.exec(item)[0]
        // console.log(suffix)
        wx.cloud.uploadFile({
          cloudPath: "blog/" + Date.now() + "-" + Math.random() * 1000000 + suffix,
          filePath: item,
          success: (res) => {
            // console.log(res.fileID)
            fileID = fileID.concat(res.fileID)
            resolve()
            
          },
          fail: (err) => {
           
            reject()
          }
        })
      })
      promiseArr.push(p)
    }
    Promise.all(promiseArr).then((res)=>{
      db.collection("blog").add({
        data:{
          ...info,
          content,
          img:fileID,
          createTime:db.serverDate()
        }
      }).then( res =>{
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })
        //返回上个页面
        wx.navigateBack()
        //获取到页面信息
        const pages=getCurrentPages()
        //获取上个页面的信息
        const prevPage=pages[pages.length-2]
        //调用上个页面的刷新
        prevPage.onPullDownRefresh()
        

      }).catch(err =>{
        wx.hideLoading()
        console.log(err)
        wx.showToast({
          title: '发布失败',
        })
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    info=options
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