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

let MAX_LIMIT= 100


// 云函数入口函数
exports.main = async (event, context) => {
  let app=new TcbRouter({
    event
  })
  app.router("list",async (ctx,next)=>{
    //取到搜索的内容
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
  app.router("detail", async (ctx,next)=>{
    //查询博客
    let detail=await blogSelectList.where({_id:event.blogId}).get().then( res =>{
      return  res.data
    })
    let commiteDetail={
        data:[]
      }
    //获取条数对象
    let count =await blogSelectList.count()
    //获取条数
    let total=count.total
    //如果是空就不查询
    if(total>0){
      const tasks = []
      const forTime = Math.ceil(total / MAX_LIMIT)
      for(let i=0;i<forTime;i++){
        let promise = db.collection("blog-commit").skip(i * MAX_LIMIT).limit(MAX_LIMIT).where({ blogId: event.blogId}).orderBy("createTime",'desc').get()
        tasks.push(promise)
      }
      //如果有评论信息就赋值
      if (tasks.length > 0) {
        commiteDetail = (await Promise.all(tasks)).reduce((acc, cur) => {
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }
    }
    
    ctx.body = {
      commiteDetail,
      detail
    }

  })
  //根据openid查询用户发表的博客
  const wxContext = cloud.getWXContext()
  app.router("getBlogHistory", async (ctx,next) =>{
    ctx.body=await blogSelectList.where({ _openid: wxContext.OPENID}).skip(event.start).limit(event.count).orderBy("createTime","desc").get()
    .then(res=>{
      return res.data
    })
  })

  return app.serve()
}