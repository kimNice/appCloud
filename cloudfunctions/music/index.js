// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
  {
    env: 'kimtest-12138-mf5ou',
    traceUser: true,
  }
)
//引入tcb管理路由
const TcbRouter = require("tcb-router")
const rq = require("request-promise")
const BASE_URL="http://musicapi.xiecheng.live"


// 云函数入口函数
exports.main = async (event, context) => {
  const app=new TcbRouter({event})
  //请求歌单列表
  app.router("playlist",async (ctx,next) => {
    ctx.body= await cloud.database().collection("playlist")
    .skip(event.start).limit(event.count)
    .orderBy("createTime", "desc")
    .get()
    .then((res) => {
      return res
    }).catch((res) => {
      console.log("错误信息", res);
    })
  })
  
  app.router("musiclist",async (ctx,next) =>{
    ctx.body = await rq(BASE_URL + "/playlist/detail?id=" + parseInt(event.musicid))
    .then(res => {
      return JSON.parse(res)
      }).catch(res =>{
        console.log("错误信息", res);
      })
  })  

  app.router("musicinfo",async (ctx,next) => {
    ctx.body = await rq(BASE_URL+ '/song/url?id='+event.musicId)
    .then(res =>{
      return res
    })
  })
  
  app.router('lyric',async (ctx,next) =>{
    ctx.body = await rq(BASE_URL + `/lyric?id=${event.musicId}`).then( res =>{
      return res
    })
  })

  return app.serve()
}