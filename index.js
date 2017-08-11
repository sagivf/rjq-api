const Queue = require('rethinkdb-job-queue')
const rethinkdbdash = require('rethinkdbdash')

module.exports = function (options = {}) {
  let { queues, connection = {} } = options
  connection.db = connection.db || 'JobQueue'

  const r = rethinkdbdash(connection)
  let queuesPromise = queues ? Promise.resolve(queues) : r.tableList()
  queuesPromise = queuesPromise.then(queues => {
    return queues.map(q => {
      if (q instanceof Queue) {
        return q
      }

      return new Queue(r, {
        name: q
      })
    })
  })

  return {
    async queues () {
      const queues = await queuesPromise
      return Promise.all(queues.map(queue => {
        return queue.summary().then(summary => {
          summary.name = queue.name
          return summary
        })
      }))
    },
    async queue (name) {
      const queues = await queuesPromise

      const queue = queues.find(({_name}) => _name === name)
      return queue.r.table(name)
    }
  }
}
