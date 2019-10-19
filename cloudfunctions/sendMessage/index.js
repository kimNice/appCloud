// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext()
  const result=await cloud.openapi.templateMessage.send({
    touser:OPENID,
    page:`/pages/blog-detail/blog-detail?blogId=${event.blogId}`,
    data:{
      keyword1:{
        value: event.content
      },
      keyword2:{
        value:event.nickName
      }
    },
    templateId:'8U7jkzXy1orOAxi9aNczfi2gZh7oDYvd5cOYHidELCc',
    formId:event.formId
  })
  return result
}