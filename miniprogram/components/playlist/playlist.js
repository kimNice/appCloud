// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      playlist:{
        type:Object
      }
  },
  //监听对象里面数据变化
  observers:{
    ['playlist.playCount'](value){  
      this.setData({
        number_num: this._tranNumber(value, 2)
      })

    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    number_num:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _tranNumber(num,pran){
        let numStr=num.toString().split(".")[0]
        if(numStr.length<6){
          return numStr;
        }else if(numStr.length>=6&&numStr.length<=8){
          //取十万以上后面两位小数点
          let broken = numStr.substring(numStr.length - 4, numStr.length - 4 + pran)

          return parseFloat(parseInt(num / 10000) + "." + broken) + "万"
        } else if (numStr.length >8){
          let broken=numStr.substring(numStr.length- 8,numStr.length- 8 + pran)
          
          return parseFloat(parseInt(num / 100000000) + "." + broken)+"亿"
        }
        
    },
    goTolist(e){
      let _id = e.currentTarget.dataset._id
      console.log(_id)
      wx.navigateTo({
        url: `/pages/musiclist/musiclist?musicid=${_id}`,
      })
    }
  }
})
