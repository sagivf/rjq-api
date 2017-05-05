const Koa = require('koa')
const Router = require('koa-router')
const Queue = require('rethinkdb-job-queue')
const config = require('./config.json')

const queues = config.queues.map(qName => {
  return new Queue({
      db: config.db
  }, {
    name: qName
  })
})

const app = new Koa()
const router = new Router()

router
  .get('/', function (ctx) {
    ctx.body = 'v1.0.0'
  })
  .get('/queues', async function (ctx) {
    ctx.body = await Promise.all(queues.map(q => {
      return q.summary().then(summary => {
        summary.name = q.name;
        return summary;
      })
    }))
  })
  .get('/queues/:name', async function (ctx) {
    const q = queues.find(({name}) => name === ctx.params.name)
    ctx.body = await q.summary()
  })
app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(process.env.PORT || '4000')
