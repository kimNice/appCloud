// pages/player/player.js
let musiclist=[]
//当前播放歌曲
let currentMusic=0
//获取全局唯一的背景音频管理器
const backgroundAudioManger=wx.getBackgroundAudioManager()

const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl:'',
    isPlaying:false, // 默认不播放
    isgoLyric:false,
    lyric:'',
    isSame:false,
    isLike:false, //是否添加喜欢
    showModal:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    currentMusic=options.index
    musiclist = wx.getStorageSync('musicList')
    this._getMusicInfo(options.musicId)
    
  },
  isLyric(){
    this.setData({
      isgoLyric: !this.data.isgoLyric
    })
  },
  _getIsLike(){
    wx.cloud.callFunction({
      name:'likeMusic',
      data:{
        id: musiclist[currentMusic].id,
        $url:'getLike'
      }
    }).then(res =>{
      let total = res.result.total
      if (!total){
        this.setData({
          isLike:false
        })
      }else{
        this.setData({
          isLike: true
        })
      }
    })
  },
  //添加到喜欢
  like(){
    let like = this.data.isLike
    let musicInfo = musiclist[currentMusic]
    let id = musiclist[currentMusic].id
    wx.getSetting({
      success:(res) =>{
        
        if(res.authSetting['scope.userInfo']){
          
          wx.getUserInfo({
            success:(info)=>{
              console.log(info)
              //判断是否已经是喜欢
              if (!like) {
                wx.showLoading({
                  title: '添加中',
                  mask: true
                })
                //去添加喜欢歌曲
                wx.cloud.callFunction({
                  name: 'likeMusic',
                  data: {
                    musicInfo,
                    id,
                    $url: "addLike"
                  }
                }).then(res => {
                  wx.hideLoading()
                  if (res.result) {
                    this.setData({
                      isLike: true
                    })
                  } else {
                    return
                  }
                })
              } else {
                console.log(id)
                //去删除歌曲
                wx.cloud.callFunction({
                  name: 'likeMusic',
                  data: {
                    id,
                    $url: 'removeLike'
                  }
                }).then(res => {
                  // console.log(res)
                  let remove = res.result.stats.removed
                  if (remove) {
                    this.setData({
                      isLike: false
                    })
                  }
                  return
                })
              }
            }
          })
        }else{
          this.setData({
            showModal:true
          })
        }
      }
    })
    
  },
  onloginsuccess(event){
    console.log("喜欢")
    this.like()
  },
  onloginfail(){
    wx.showModal({
      title: '未授权不能添加喜欢',
      content: '',
    })
  },
  //得到音乐信息
  _getMusicInfo(musicId){
    if (musicId == app.getPlayingMusicId()){
      this.setData({
        isSame: true
      })
    }else{
      this.setData({
        isSame: false
      })
    }
    if(!this.data.isSame){
      backgroundAudioManger.stop()
    }
    this.setData({
      picUrl: musiclist[currentMusic].al.picUrl,
      isPlaying:false
    })
    
    app.setPlayingMusicId(musicId)
    wx.setNavigationBarTitle({
      title: musiclist[currentMusic].name ,
    })
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    //调用云函数
    wx.cloud.callFunction({
      name:'music',
      data:{
        musicId,
        $url:'musicinfo'
      }
    }).then( res => { 
      let result = JSON.parse(res.result)
      // console.log(result)
      if(result.data[0].url == null){
        wx.showModal({
          title: 'VIP歌曲无权播放',
          content:"请到网易云音乐APP听",
          cancelText:'上一首',
          confirmText:'下一首',
          success:(res)=>{
            if(res.confirm){
              this.nextPlay()
            }else{
              this.upPlay()
            }
          }
        })
        
        return
      }
      if(!this.data.isSame){
        backgroundAudioManger.src = result.data[0].url
        backgroundAudioManger.title = musiclist[currentMusic].name
        backgroundAudioManger.coverImgUrl = musiclist[currentMusic].al.picUrl
        backgroundAudioManger.singer = musiclist[currentMusic].ar[0].name
        backgroundAudioManger.epname = musiclist[currentMusic].al.name

        //保存播放历史
        this.onHistory()
        //查询歌曲是否喜欢
        this._getIsLike()
      }
      this.setData({
        isPlaying: true
      })
      
    })
    
    wx.cloud.callFunction({
      name:'music',
      data:{
        musicId,
        $url:"lyric"
      }
    }).then( res => {
      wx.hideLoading()
      let lyric ='暂无歌词'
      //字符串转成对象
      let results=JSON.parse(res.result).lrc
      // console.log(res)   
      if(results){
        lyric = results.lyric
      }
      this.setData({
        lyric
      })
    })
  },
  timeUpdate(even){
    // console.log("通讯",even)
    this.selectComponent(".lyric").update(even.detail.currentTime)
  },
  //暂停播放按钮
  stopPlay(){
    if (this.data.isPlaying){
      backgroundAudioManger.pause()
    }else{
      backgroundAudioManger.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  musicPlay(){
    this.setData({
      isPlaying: true
    })
  },
  musicPause(){
    this.setData({
      isPlaying: false
    })
  },
  
  onHistory(){
    
    const openid = app.globalData.openid
    let music = musiclist[currentMusic]
    let history = wx.getStorageSync(openid)
    
    let bool = false
    for(let i=0,len=history.length;i<len;i++){
      if (history[i].id == music.id){
        bool = true
        break
      }
    }
    if(!bool){
      history.unshift(music)
     
      wx.setStorage({
        key: openid,
        data: history,
      })
    }
    // const musicStrong=wx.setStorage({
    //   key: openid,
    //   data: '',
    // })
  },
  //上一首
  upPlay(){
   
    currentMusic--
    //如果是第一首就跳转最后一首
    if (currentMusic<0){
      currentMusic = musiclist.length-1
    }
    
    this._getMusicInfo(musiclist[currentMusic].id)
  },
  //下一首
  nextPlay(){
    console.log(musiclist[currentMusic].id)
    currentMusic++
    //如果是最后一首就跳转到第一首
    if (currentMusic === musiclist.length){
      currentMusic=0
    }
    this._getMusicInfo(musiclist[currentMusic].id)
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