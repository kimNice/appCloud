// components/progress-bar/progress-bar.js
let movableAreaWidth=0
let movableViewWidth = 0
const backgroundAudioManger = wx.getBackgroundAudioManager()
let currentDec=-1 //当前播放的秒数
let duration=0 //歌曲总时长
let isMovble = false //表示当前是否在拖拽 解决与onTimeUpdate冲突问题
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    allTime: {
      startTime: '00:00',
      endTime: '00:00'
    },
    movable_X: 0, 
    progress:0,
  },
  lifetimes:{
    ready(){
      if (this.properties.isSame && this.data.allTime.endTime== '00:00'){
        this._setTime()
      }
      this._getMovableDis()
      this._bindBGMEvent()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onchange(evens){
      let even = evens.detail
      if (even.source ==='touch'){
        //计算拖拽位置
        this.data.progress = even.x / (movableAreaWidth - movableViewWidth) * 100
        this.data.movable_X = even.x
        isMovble = true
      }
      // console.log(even)
    },
    ontouchend(even){
      let startTime = this._timeformat(Math.floor(backgroundAudioManger.currentTime))
      console.log(even)
      this.setData({
        progress: this.data.progress,
        movable_X: this.data.movable_X,
        ['allTime.startTime']: startTime.min + ":" + startTime.sec
      })
      //音乐跳转 总时间乘以播放时间除以100
      backgroundAudioManger.seek(duration * this.data.progress / 100)
      isMovble = false
    },
    _getMovableDis(){
      const query=this.createSelectorQuery()
      query.select(".movable-area").boundingClientRect()
      query.select(".movable-view").boundingClientRect()
      query.exec((rect) =>{
        
        movableAreaWidth=rect[0].width
        movableViewWidth = rect[1].width
     
      })
    },
    _bindBGMEvent(){
      //监听背景音频播放事件
      backgroundAudioManger.onPlay(()=>{
        console.log("onPlay")
        isMovble = false
        this.triggerEvent("musicPlay")
      })
      //监听背景音频停止事件
      backgroundAudioManger.onStop(()=>{
        console.log("onStop")
       
      })
      //监听背景音频暂停事件
      backgroundAudioManger.onPause(()=>{
        console.log("onPause")
        this.triggerEvent("musicPause")
      })
      //监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发
      backgroundAudioManger.onWaiting(()=>{
        console.log("onWaiting")
      })
      //监听背景音频进入可播放状态事件。 但不保证后面可以流畅播放
      backgroundAudioManger.onCanplay(()=>{
        //console.log(backgroundAudioManger.duration)
        //backgroundAudioManger.duration部分机型获取是undefined 做出兼容
        if (typeof backgroundAudioManger.duration != 'undefined'){
          this._setTime()
        }else{
          setTimeout(()=>{
            this._setTime()
          },1000)
        }
      })
      //监听背景音频播放进度更新事件，只有小程序在前台时会回调
      backgroundAudioManger.onTimeUpdate(()=>{   
        if(!isMovble){
          let currentTime = backgroundAudioManger.currentTime
          let duration = backgroundAudioManger.duration
          //获取播放时间.前面那个值进行判断（优化代码减少setData）
          let is = currentTime.toString().split(".")[0]
          if (is != currentDec) {
            let startTime = this._timeformat(currentTime)
            this.setData({
              //算出x轴的位置 总宽减去自身宽再乘以播放时间再除以总时间
              movable_X: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              //播放时间除以总时间乘以100
              progress: currentTime / duration * 100,
              ['allTime.startTime']: startTime.min + ":" + startTime.sec
            })
            currentDec = is
            this.triggerEvent("timeUpdate",{
              currentTime
            })
          }
        }
        
        
      })
      //监听背景音频自然播放结束事件
      backgroundAudioManger.onEnded(()=>{
        //向父组件触发一个下一首事件事件
        this.triggerEvent("musicEnd")
      })
      //监听背景音频播放错误事件
      backgroundAudioManger.onError((res)=>{
        wx.showToast({
          title: '错误:'+res.errCode,
        })
      })
    },
    //设置 时间
    _setTime(){
      duration = backgroundAudioManger.duration
      let endtime = this._timeformat(duration)
      this.setData({
        ['allTime.endTime']:endtime.min+":"+endtime.sec
      })
    },
    //设置 格式化时间(s)
    _timeformat(time){
      let min = Math.floor(time / 60),
          sec = Math.floor(time % 60);
      return {
        'min': this._mend0(min),
        'sec': this._mend0(sec)
      }
    },
    //补零
    _mend0(sec){
      return sec < 10 ? "0" + sec : sec
    },
  }
})
