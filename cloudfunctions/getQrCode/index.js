// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  /**
   * 
   */
  const wxContext = cloud.getWXContext()
   let result=await cloud.openapi.wxacode.getUnlimited({
    scene: wxContext.OPENID,
     lineColor:{
       "r":240,
       "g":20,
       "b":20
     },
    // page:'pages/playlist/playlist' //小程序没上线不设置page
  })
  const data = await cloud.uploadFile({
    cloudPath:'qrCode/' + Date.now() + "-" + Math.random()+".png",
    fileContent:result.buffer
  })
  return data
  
}