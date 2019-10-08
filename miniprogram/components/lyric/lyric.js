// components/lyric/lyric.js
let lyricHeight=0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isgoLyricShow:{
      type:Boolean,
      value:false,
    },
    lyric:String,
  },
  observers:{
    lyric(lrc){
      this._analyesisLyric(lrc)
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    lyrics:[],
    scrlloTop:0,  //滚动位置
    nowLyricIndex:0 //当前位置
  },
  lifetimes:{
    ready(){
      wx.getSystemInfo({
        success(res) {     
          lyricHeight = res.screenWidth / 750 * 64
        },
      })
      
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //歌词联动更新
    update(even){
      let lyric=this.data.lyrics
      //歌词为空就返回
      if (lyric.length ==0){
        return
      }
      //当时间大于歌词最后一句的时间时候就不高亮显示歌词直接滚动到最下面
      if (even > lyric[lyric.length-1].time){
        if(this.data.nowLyricIndex != -1){
          this.setData({
            nowLyricIndex:-1,
            scrlloTop: lyric.length * lyricHeight
          })
        }
      }
     //高亮显示歌词和滚动屏幕位置
      for (let i = 0, len = lyric.length;i<len;i++){
        //判断歌词是否小于播放时间 
        if (even <= lyric[i].time){
          this.setData({
            nowLyricIndex: i - 1,
            scrlloTop: (i - 1) * lyricHeight
          })
          break
        }
      }
    },
    _analyesisLyric(lrc){
  
      let lyric=[]
      //切割回车字符串
      let lrcs=lrc.split("\n")
      lrcs.forEach((even)=>{
        //分割出时间部分
        let time=even.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if( time != null){
          //分割出歌词部分
          let lrc = even.split(time)[1]
          let timeReg=time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          let time2 = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
          //把歌词和时间装到一个数组里
          lyric.push({
            lrc,
            time: time2,
          })
        }
      })
      //数组为空
      if (lyric == ''){
        lyric.push({
          lrc:'此歌曲暂无歌词',
          time: '0',
        })
      }
      this.setData({
        lyrics: lyric
      })
     
    },
  }
})
