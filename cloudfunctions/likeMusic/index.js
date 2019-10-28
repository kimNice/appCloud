// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
  {
    env: 'kimtest-12138-mf5ou',
    traceUser: true,
  }
)

const db = cloud.database()
const TcbRouter = require("tcb-router")

const likeMusic = db.collection("likeMusic")

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({event})
  //添加喜欢
  app.router("addLike", async (ctx,next)=>{
    //查询歌曲id是否存在，如果存在就不存进去了
    let count=await likeMusic.where({ id: event.id}).count()
    let add;
    // console.log("总条数",count)
    if (!count.total){
      add = await likeMusic.add({
        data: {
          ...event.musicInfo,
          islike: true,
          _openid: wxContext.OPENID,
          createTime: db.serverDate()
        }
      }).then(res => {
        console.log("成功", res)
        return res
      }).catch(res => {
        console.log("失败", res)
      })
    }
   ctx.body = add
  })
  //根据id得到条数
  app.router("getLike", async (ctx,next)=>{
   let count = await likeMusic.where({ id: event.id }).count()
    ctx.body = count
  })
  //根据id删除喜欢
  app.router("removeLike", async (ctx,next)=>{
   ctx.body = await likeMusic.where({ id: event.id }).remove()
  })
  //通过openid 查询用户喜欢的歌单
  app.router("getAllLike", async (ctx,next) =>{
    ctx.body = await likeMusic.where({_openid:event.openid}).get()
  })

  return app.serve()
}