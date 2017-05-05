const Queue = require('rethinkdb-job-queue')
const qOptions = {
  name: 'Mathematics' // The queue and table name
}
const cxnOptions = {
  db: 'JobQueue', // The name of the database in RethinkDB
}

const q = new Queue(cxnOptions, qOptions)

const job = q.createJob({
  numerator: 123,
  denominator: 456
})

q.addJob(job).catch((err) => {
  console.error(err)
})

// q.process((job, next) => {
//   try {
//     let result = job.numerator / job.denominator
//     // Do something with your result
//     return next(null, result)
//   } catch (err) {
//     console.error(err)
//     return next(err)
//   }
// })
