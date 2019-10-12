// 云函数入口文件
const cloud = require('wx-server-sdk')
//首先要初始化完成才能引入其他一些方法
cloud.init({
  env: 'kimtest-12138-mf5ou',
  traceUser: true,
})
const TcbRouter = require("tcb-router")

const db=cloud.database()
let blogSelectList=db.collection("blog")



// 云函数入口函数
exports.main = async (event, context) => {
  let app=new TcbRouter({
    event
  })
  app.router("list",async (ctx,next)=>{
    const keyword=event.keyword
    let w={}
    if(keyword.trim() != ''){
      w={
        content:db.RegExp({
          regexp: keyword,
          options:'i'
        })
      }
    }

    let blogList=blogSelectList.where(w).skip(event.start).limit(event.count).orderBy("createTime","desc").get()
    .then(res =>{
      return res.data
    })
    ctx.body=blogList
  })
  return app.serve()
}