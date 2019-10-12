// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModal:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGetInfo(event){
      // console.log(event)
      if (event.detail.userInfo){
        this.setData({
          showModal:!this.properties.showModal
        })
        this.triggerEvent("loginsuccess", event.detail.userInfo)
      }else{
        
        this.triggerEvent("loginfail")
      }
    }
  }
})
