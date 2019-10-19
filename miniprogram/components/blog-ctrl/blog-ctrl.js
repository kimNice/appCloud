// components/blog-ctrl/blog-ctrl.js
//用户信息
let userInfo={}

let db=wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId:String,
    blogList:Object
  },
  externalClasses: ['iconfont', 'icon-pinglun','icon-fenxiang'],
  /**
   * 组件的初始数据
   */
  data: {
    loginShow:false,
    content:'',
    commentShow:false,

  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    onComment(){
      this.setData({
        content:''
      })
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
      userInfo = event.detail
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
   
    onSend(event){
      let content = event.detail.value.content
      let formId = event.detail.formId
      console.log(event)
      if (content.trim() == ''){
        wx.showModal({
          title: '评论不能为空',
          content: '',
        })
        return
      }
      wx.showLoading({
        title: '评论中..',
        mask:true
      })
      db.collection("blog-commit").add({
        data:{
          blogId: this.properties.blogId,
          content: content,
          createTime:db.serverDate(),
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
        }
      }).then( res => {
        //模板推送
        wx.cloud.callFunction({
          name:'sendMessage',
          data:{
            content,
            formId,
            nickName: userInfo.nickName,
            blogId:this.properties.blogId
          }
        }).then( res =>{
          console.log(res)
        })

        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
          icon:"success"
        })
        this.setData({
          content:'',
          commentShow:false
        })
        this.triggerEvent('onCommitSuccess')
      })
      // console.log(content, userInfo, this.properties.blogId)
    },
  }
})
