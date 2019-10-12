// components/blog-ctrl/blog-ctrl.js
//用户信息
let userInfo={}
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  externalClasses: ['iconfont', 'icon-pinglun','icon-fenxiang'],
  /**
   * 组件的初始数据
   */
  data: {
    loginShow:false,
    content:'',
    commentShow:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment(){
      wx.getSetting({
        success:(res)=>{
          // console.log(res)
          if(res.authSetting['scope.userInfo']){
            wx.getUserInfo({
              success:(user)=>{
                console.log(user)
                userInfo=user.userInfo
                this.setData({
                  commentShow:true
                })
              }
            })
          }else{
            this.setData({
              loginShow:true
            })
          }
        }
      })
    },
    //显示评论
    onloginsuccess(event){
      console.log(event)
      this.setData({
        commentShow: true
      })
    },
    onloginfail(){
      wx.showModal({
        title: '未授权不能评论',
        content: '',
      })
    },
  }
})
