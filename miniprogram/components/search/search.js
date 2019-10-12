// components/search/search.js
//搜索输入的值
let keyword=''
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    onInput(event){
      
      keyword=event.detail.value
    },
    onSearch(){
      this.triggerEvent("onSearch",{
        keyword
      })
    }
  }
})
