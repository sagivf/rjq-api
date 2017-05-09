const Queue = require('rethinkdb-job-queue')
const qOptions = {
  name: 'Mathematics'
}
const cxnOptions = {
  db: 'JobQueue'
}

const q = new Queue(cxnOptions, qOptions)

const job = q.createJob({
  numerator: 123,
  denominator: 456
})

q.addJob(job).then(() => {
  process.exit()
}).catch((err) => {
  console.error(err)
  process.exit()
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
