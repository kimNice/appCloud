// components/blog-card/blog-card.js
import formTime from '../../utils/formTime.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogList:Object
  },
  observers:{
    ['blogList.createTime'](val){
  
      if(val){
        this.setData({
          createTime:formTime(new Date(val))
        })
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    createTime:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onImg(event){
      // console.log(event)
      let dataset=event.currentTarget.dataset
      wx.previewImage({
        urls: dataset.imgs ,
        current:dataset.imgUrl
      })
    }
  }
})
