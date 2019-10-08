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
    isSame:false
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
      title: '歌曲加载中',
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
        wx.showToast({
          title: '无权限播放',
        })
      }
      if(!this.data.isSame){
        backgroundAudioManger.src = result.data[0].url
        backgroundAudioManger.title = musiclist[currentMusic].name
        backgroundAudioManger.coverImgUrl = musiclist[currentMusic].al.picUrl
        backgroundAudioManger.singer = musiclist[currentMusic].ar[0].name
        backgroundAudioManger.epname = musiclist[currentMusic].al.name
      }
     
      this.setData({
        isPlaying:true
      })
    })
    wx.hideLoading()
    wx.cloud.callFunction({
      name:'music',
      data:{
        musicId,
        $url:"lyric"
      }
    }).then( res => {
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