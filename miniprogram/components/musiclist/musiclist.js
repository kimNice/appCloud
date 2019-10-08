// components/musiclist/musiclist.js
const app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    actived:0
  },
  pageLifetimes:{
    show(){
      
      this.setData({
        actived: parseInt(app.getPlayingMusicId())
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    actived(e){
      let cd = e.currentTarget.dataset
      this.setData({
        actived:cd.id
      })
      wx.navigateTo({
        url: `/pages/player/player?musicId=${cd.id}&index=${cd.index}`,
      })
      wx.setStorageSync('musicList', this.data.musiclist)
    }
  },
  
  
})
