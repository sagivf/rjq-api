const assert = require('assert')
const Queue = require('rethinkdb-job-queue')

module.exports = function (options) {
  const { db, host, port, user, password } = options

  assert(options.queues, 'missing queues definition')

  const queues = options.queues.map(q => {
    if (q instanceof Queue) {
      return q
    }

    assert(db, `failed connecting to ${q} missing db connection`)
    const connection = {
      db: db
    }
    if (host) {
      connection.host = host
    }
    if (port) {
      connection.port = port
    }
    if (user) {
      connection.user = user
    }
    if (password) {
      connection.password = password
    }
    return new Queue(connection, {
      name: q
    })
  })

  return {
    queues () {
      return Promise.all(queues.map(q => {
        return q.summary().then(summary => {
          summary.name = q.name
          return summary
        })
      }))
    },
    async queue (name) {
      const q = queues.find(({_name}) => _name === name)
      const data = await q.r.table(name)
      data.forEach(item => {
        item.status = item.state
      })

      return data
    }
  }
}
