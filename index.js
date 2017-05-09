const assert = require('assert')
const Queue = require('rethinkdb-job-queue')

module.exports = function (options) {
  const db = options.db

  assert(options.queues, 'missing queues definition')

  const queues = options.queues.map(q => {
    if (q instanceof Queue) {
      return q
    }

    assert(db, `failed connecting to ${q} missing db connection`)

    return new Queue({
      db: db
    }, {
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
    queue (name) {
      const q = queues.find(({_name}) => _name === name)
      return q.summary()
    }
  }
}
